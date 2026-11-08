import logging

from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import (
    District, Category, CulturalListing, DistrictArtForm,
    CulturalPlace, ArtFormImage, Contribution, Review, CulturalGlossary
)
from .serializers import (
    DistrictSerializer, DistrictDetailSerializer,
    CategorySerializer,
    CulturalListingSerializer, CulturalListingSimpleSerializer,
    CulturalPlaceSerializer, ArtFormImageSerializer, DistrictArtFormSerializer,
    ContributionSerializer, ReviewSerializer,
    CulturalGlossarySerializer
)
from .ai_service import query_culturematch_ai

logger = logging.getLogger(__name__)


@api_view(['GET'])
def district_list(request):
    """
    List all 14 Kerala districts with cultural statistics.
    """
    try:
        districts = District.objects.all().order_by('order', 'name')
        serializer = DistrictSerializer(districts, many=True)
        return Response(serializer.data)
    except Exception:
        logger.exception(
            "district_list: unhandled exception while fetching /api/districts/. "
            "Likely cause: missing DB tables (run migrate + seed_cultural_data), "
            "wrong SQLite path, or serializer error."
        )
        return Response(
            {'error': 'Could not retrieve districts. See server logs for details.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def district_detail(request, slug):
    """
    Get detailed information and approved cultural listings for a single district.
    """
    try:
        district = District.objects.prefetch_related('cultural_places', 'listings').get(slug=slug)
    except District.DoesNotExist:
        return Response({'error': 'District not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception:
        logger.exception("district_detail: unhandled exception for slug=%s", slug)
        return Response(
            {'error': 'Could not retrieve district. See server logs for details.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    try:
        serializer = DistrictDetailSerializer(district)
        return Response(serializer.data)
    except Exception:
        logger.exception("district_detail: serializer error for slug=%s", slug)
        return Response(
            {'error': 'Could not serialize district data. See server logs for details.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


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
    Filter and search cultural listings.
    Supports query params: district, category, search, featured, curator_status, verified_only.
    """
    try:
        qs = CulturalListing.objects.all().select_related(
            'category', 'origin_district'
        ).prefetch_related(
            'districts', 'gallery_images', 'places', 'district_associations'
        )

        # Optional curator status filter (e.g. ?curator_status=Verified)
        curator_status = request.query_params.get('curator_status')
        if curator_status:
            qs = qs.filter(curator_status=curator_status)
        elif request.query_params.get('verified_only') in ['true', '1', 'True']:
            qs = qs.filter(curator_status='Verified')

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
                Q(historical_background__icontains=query) |
                Q(history_summary__icontains=query) |
                Q(districts__name__icontains=query)
            ).distinct()

        serializer = CulturalListingSerializer(qs, many=True)
        return Response(serializer.data)
    except Exception:
        logger.exception("listing_list: unhandled exception. params=%s", dict(request.query_params))
        return Response(
            {'error': 'Could not retrieve listings. See server logs for details.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def listing_detail(request, pk):
    """
    Retrieve single cultural listing details with galleries, places and district links.
    """
    try:
        listing = CulturalListing.objects.select_related(
            'category', 'origin_district'
        ).prefetch_related(
            'districts', 'gallery_images', 'places', 'district_associations'
        ).get(pk=pk)
    except CulturalListing.DoesNotExist:
        return Response({'error': 'Cultural listing not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = CulturalListingSerializer(listing)
    return Response(serializer.data)


@api_view(['GET'])
def cultural_place_list(request):
    """
    List verified cultural places, performance venues, and traditional practice locations.
    """
    qs = CulturalPlace.objects.select_related('district', 'art_form').all()
    district_param = request.query_params.get('district')
    if district_param:
        qs = qs.filter(district__slug=district_param)
    artform_param = request.query_params.get('art_form')
    if artform_param:
        qs = qs.filter(art_form_id=artform_param)
    venue_type = request.query_params.get('venue_type')
    if venue_type:
        qs = qs.filter(venue_type=venue_type)
    serializer = CulturalPlaceSerializer(qs, many=True)
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


@api_view(['POST'])
def admin_update_artform_image(request, pk):
    """
    Administrator image upload and replacement endpoint.
    Accepts: image_url or image_file, caption, alt_text, photographer, source_url, licence, is_primary.
    """
    try:
        listing = CulturalListing.objects.get(pk=pk)
    except CulturalListing.DoesNotExist:
        return Response({'error': 'Cultural listing not found'}, status=status.HTTP_404_NOT_FOUND)

    image_url = request.data.get('image_url') or request.data.get('image_file')
    caption = request.data.get('caption', listing.title)
    alt_text = request.data.get('alt_text', f"Authentic depiction of {listing.title}")
    photographer = request.data.get('photographer', 'Wikimedia Commons / Archival Sourced')
    source_url = request.data.get('source_url', 'https://www.keralatourism.org/artforms/')
    licence = request.data.get('licence', 'CC BY-SA 4.0')
    is_primary = request.data.get('is_primary', True)

    if not image_url:
        return Response({'error': 'Image URL or file path is required'}, status=status.HTTP_400_BAD_REQUEST)

    if is_primary:
        listing.image = image_url
        listing.image_credit = f"{photographer} ({licence})"
        listing.save()

    # Also add or update in ArtFormImage gallery
    gallery_img = ArtFormImage.objects.create(
        art_form=listing,
        district=listing.origin_district or listing.districts.first(),
        image_url=image_url,
        caption=caption,
        alt_text=alt_text,
        photographer=photographer,
        source_url=source_url,
        licence=licence,
        verification_status='approved',
        curator_status=listing.curator_status
    )

    return Response({
        'message': f"Image updated successfully for {listing.title}.",
        'listing_id': listing.id,
        'image_url': listing.image,
        'gallery_image_id': gallery_img.id
    })


@api_view(['POST'])
def admin_update_curator_status(request, pk):
    """
    Update curator status: 'Verified', 'Needs Review', 'Unverified Demo Content'.
    """
    try:
        listing = CulturalListing.objects.get(pk=pk)
    except CulturalListing.DoesNotExist:
        return Response({'error': 'Cultural listing not found'}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get('curator_status')
    if new_status not in ['Verified', 'Needs Review', 'Unverified Demo Content']:
        return Response({
            'error': "Invalid status. Must be one of: 'Verified', 'Needs Review', 'Unverified Demo Content'"
        }, status=status.HTTP_400_BAD_REQUEST)

    listing.curator_status = new_status
    if new_status == 'Verified':
        listing.verification_status = 'approved'
    elif new_status == 'Needs Review':
        listing.verification_status = 'pending'
    else:
        listing.verification_status = 'rejected'
    listing.save()

    return Response({
        'message': f"Curator status updated to '{new_status}' for {listing.title}.",
        'listing_id': listing.id,
        'curator_status': listing.curator_status,
        'verification_status': listing.verification_status
    })
