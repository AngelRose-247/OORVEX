from rest_framework import serializers
from .models import District, Category, CulturalListing, Contribution, Review, CulturalGlossary


class CategorySerializer(serializers.ModelSerializer):
    listings_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['slug', 'name_en', 'name_ml', 'description_en', 'description_ml', 'icon', 'order', 'listings_count']

    def get_listings_count(self, obj):
        return obj.listings.filter(verification_status='approved').count()


class DistrictSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ['slug', 'name', 'name_ml', 'headquarters', 'latitude', 'longitude', 'hero_image']


class CulturalListingSimpleSerializer(serializers.ModelSerializer):
    category_name_en = serializers.CharField(source='category.name_en', read_only=True)
    category_name_ml = serializers.CharField(source='category.name_ml', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)

    class Meta:
        model = CulturalListing
        fields = [
            'id', 'title', 'title_ml', 'category_slug', 'category_name_en', 'category_name_ml',
            'locality', 'latitude', 'longitude', 'image', 'image_credit',
            'verification_status', 'is_featured'
        ]


class CulturalListingSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )
    districts = DistrictSimpleSerializer(many=True, read_only=True)
    district_slugs = serializers.PrimaryKeyRelatedField(
        many=True, queryset=District.objects.all(), source='districts', write_only=True, required=False
    )
    origin_district = DistrictSimpleSerializer(read_only=True)
    origin_district_slug = serializers.PrimaryKeyRelatedField(
        queryset=District.objects.all(), source='origin_district', write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = CulturalListing
        fields = [
            'id', 'title', 'title_ml', 'category', 'category_id',
            'districts', 'district_slugs', 'origin_district', 'origin_district_slug',
            'locality', 'latitude', 'longitude',
            'description_en', 'description_ml', 'cultural_story',
            'historical_background', 'cultural_significance',
            'image', 'image_credit', 'source_reference',
            'verification_status', 'is_featured',
            'audio_narration', 'audio_url', 'created_at', 'updated_at'
        ]


class DistrictSerializer(serializers.ModelSerializer):
    listings_count = serializers.SerializerMethodField()
    arts_count = serializers.SerializerMethodField()
    crafts_count = serializers.SerializerMethodField()

    class Meta:
        model = District
        fields = [
            'slug', 'name', 'name_ml', 'tagline',
            'description_en', 'description_ml', 'headquarters',
            'latitude', 'longitude', 'hero_image', 'image_credit',
            'area_sq_km', 'order', 'listings_count', 'arts_count', 'crafts_count'
        ]

    def get_listings_count(self, obj):
        return obj.listings.filter(verification_status='approved').count()

    def get_arts_count(self, obj):
        return obj.listings.filter(
            verification_status='approved',
            category__slug__in=['performing-arts', 'ritual-arts', 'classical-arts', 'folk-dances', 'traditional-music']
        ).count()

    def get_crafts_count(self, obj):
        return obj.listings.filter(
            verification_status='approved',
            category__slug='traditional-crafts'
        ).count()


class DistrictDetailSerializer(DistrictSerializer):
    listings = serializers.SerializerMethodField()

    class Meta(DistrictSerializer.Meta):
        fields = DistrictSerializer.Meta.fields + ['listings']

    def get_listings(self, obj):
        approved = obj.listings.filter(verification_status='approved')
        return CulturalListingSimpleSerializer(approved, many=True).data


class ContributionSerializer(serializers.ModelSerializer):
    district_name = serializers.CharField(source='district.name', read_only=True)
    category_name = serializers.CharField(source='category.name_en', read_only=True)

    class Meta:
        model = Contribution
        fields = [
            'id', 'contributor_name', 'contributor_email',
            'title', 'title_ml', 'category', 'category_name',
            'district', 'district_name', 'locality',
            'description', 'description_ml', 'cultural_story',
            'image', 'image_credit', 'source_reference',
            'consent', 'status', 'submitted_at'
        ]


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'contribution', 'reviewer', 'decision', 'comments', 'reviewed_at']


class CulturalGlossarySerializer(serializers.ModelSerializer):
    district_name = serializers.CharField(source='associated_district.name', read_only=True, default='')

    class Meta:
        model = CulturalGlossary
        fields = [
            'id', 'term_ml', 'transliteration', 'meaning_en',
            'cultural_context', 'related_category', 'associated_district',
            'district_name', 'audio_phonetic'
        ]
