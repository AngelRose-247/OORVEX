from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import District, Category, CulturalListing, Contribution, Review, CulturalGlossary
from .serializers import (
    DistrictSerializer, DistrictDetailSerializer,
    CategorySerializer,
    CulturalListingSerializer, CulturalListingSimpleSerializer,
    ContributionSerializer, ReviewSerializer,
    CulturalGlossarySerializer
)
from .ai_service import query_culturematch_ai


@api_view(['GET'])
def district_list(request):
    """
    List all 14 Kerala districts with cultural statistics.
    """
    districts = District.objects.all().order_by('order', 'name')
    serializer = DistrictSerializer(districts, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def district_detail(request, slug):
    """
    Get detailed information and approved cultural listings for a single district.
    """
    try:
        district = District.objects.get(slug=slug)
    except District.DoesNotExist:
        return Response({'error': 'District not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = DistrictDetailSerializer(district)
    return Response(serializer.data)


@api_view(['GET'])
def category_list(request):
    """
    List all cultural art and craft categories.
    """
    categories = Category.objects.all().order_by('order', 'name_en')
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def listing_list(request):
    """
    Filter and search verified cultural listings.
    Supports query params: district, category, search, featured.
    """
    # Strict rule: Only approved listings are shown publicly
    qs = CulturalListing.objects.filter(verification_status='approved').prefetch_related('districts', 'category')

    district_param = request.query_params.get('district')
    if district_param:
        qs = qs.filter(districts__slug=district_param)

    category_param = request.query_params.get('category')
    if category_param:
        qs = qs.filter(category__slug=category_param)

    featured_param = request.query_params.get('featured')
    if featured_param in ['true', '1', 'True']:
        qs = qs.filter(is_featured=True)

    search_query = request.query_params.get('search')
    if search_query:
        query = search_query.strip()
        qs = qs.filter(
            Q(title__icontains=query) |
            Q(title_ml__icontains=query) |
            Q(description_en__icontains=query) |
            Q(locality__icontains=query) |
            Q(cultural_story__icontains=query) |
            Q(districts__name__icontains=query)
        ).distinct()

    serializer = CulturalListingSerializer(qs, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def listing_detail(request, pk):
    """
    Retrieve single cultural listing details.
    """
    try:
        listing = CulturalListing.objects.prefetch_related('districts', 'category').get(pk=pk)
    except CulturalListing.DoesNotExist:
        return Response({'error': 'Cultural listing not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = CulturalListingSerializer(listing)
    return Response(serializer.data)


@api_view(['GET'])
def glossary_list(request):
    """
    Searchable cultural glossary of Malayalam heritage terminology.
    """
    qs = CulturalGlossary.objects.select_related('related_category', 'associated_district').all()
    search = request.query_params.get('search')
    if search:
        search = search.strip()
        qs = qs.filter(
            Q(term_ml__icontains=search) |
            Q(transliteration__icontains=search) |
            Q(meaning_en__icontains=search) |
            Q(cultural_context__icontains=search)
        )
    serializer = CulturalGlossarySerializer(qs, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def contribution_create(request):
    """
    Submit a community cultural record for moderation.
    """
    data = request.data.copy()
    data['status'] = 'pending'

    serializer = ContributionSerializer(data=data)
    if serializer.is_valid():
        instance = serializer.save()
        return Response({
            'message': 'Heritage submission received. It will appear publicly upon cultural committee review.',
            'id': instance.id,
            'status': instance.status
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def ai_discover(request):
    """
    CultureMatch AI Assistant: Grounded retrieval-based cultural recommendation.
    """
    query = request.data.get('query', '').strip()
    if not query:
        return Response({'error': 'A query is required'}, status=status.HTTP_400_BAD_REQUEST)

    district_slug = request.data.get('district')
    category_slug = request.data.get('category')
    language = request.data.get('language', 'en')

    result = query_culturematch_ai(
        query=query,
        district_slug=district_slug,
        category_slug=category_slug,
        language=language
    )
    return Response(result)


# Admin Moderation Endpoints
@api_view(['GET'])
def admin_contributions(request):
    """
    Admin dashboard view for all contributions (Pending, Approved, Rejected).
    """
    status_filter = request.query_params.get('status')
    qs = Contribution.objects.select_related('district', 'category').all()
    if status_filter:
        qs = qs.filter(status=status_filter)
    serializer = ContributionSerializer(qs, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def admin_approve_contribution(request, pk):
    """
    Approve a pending contribution and publish it to the cultural archive.
    """
    try:
        contrib = Contribution.objects.get(pk=pk)
    except Contribution.DoesNotExist:
        return Response({'error': 'Contribution not found'}, status=status.HTTP_404_NOT_FOUND)

    reviewer_name = request.data.get('reviewer', 'Cultural Committee')
    comments = request.data.get('comments', 'Verified and approved for publication.')

    contrib.status = 'approved'
    contrib.save()

    # Record review log
    Review.objects.create(
        contribution=contrib,
        reviewer=reviewer_name,
        decision='approved',
        comments=comments
    )

    # Automatically generate or update verified CulturalListing
    listing, created = CulturalListing.objects.get_or_create(
        title=contrib.title,
        defaults={
            'title_ml': contrib.title_ml or contrib.title,
            'category': contrib.category or Category.objects.first(),
            'description_en': contrib.description,
            'description_ml': contrib.description_ml or contrib.description,
            'cultural_story': contrib.cultural_story or contrib.description,
            'locality': contrib.locality,
            'latitude': contrib.district.latitude,
            'longitude': contrib.district.longitude,
            'image': contrib.image,
            'image_credit': contrib.image_credit or contrib.contributor_name,
            'source_reference': contrib.source_reference or f"Contributed by {contrib.contributor_name}",
            'verification_status': 'approved',
            'origin_district': contrib.district,
        }
    )
    listing.districts.add(contrib.district)

    return Response({
        'message': f"Contribution '{contrib.title}' approved and published to verified records.",
        'listing_id': listing.id
    })


@api_view(['POST'])
def admin_reject_contribution(request, pk):
    """
    Reject a pending contribution with curator feedback.
    """
    try:
        contrib = Contribution.objects.get(pk=pk)
    except Contribution.DoesNotExist:
        return Response({'error': 'Contribution not found'}, status=status.HTTP_404_NOT_FOUND)

    reviewer_name = request.data.get('reviewer', 'Cultural Committee')
    comments = request.data.get('comments', 'Did not meet heritage authenticity guidelines.')

    contrib.status = 'rejected'
    contrib.save()

    Review.objects.create(
        contribution=contrib,
        reviewer=reviewer_name,
        decision='rejected',
        comments=comments
    )

    return Response({
        'message': f"Contribution '{contrib.title}' rejected.",
        'comments': comments
    })
