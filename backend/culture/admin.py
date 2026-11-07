from django.contrib import admin
from .models import District, Category, CulturalListing, Contribution, Review, CulturalGlossary


@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    list_display = ('name', 'name_ml', 'headquarters', 'latitude', 'longitude', 'order')
    search_fields = ('name', 'name_ml', 'headquarters')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name_en', 'name_ml', 'icon', 'order')
    prepopulated_fields = {'slug': ('name_en',)}


@admin.register(CulturalListing)
class CulturalListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'title_ml', 'category', 'verification_status', 'is_featured', 'locality')
    list_filter = ('category', 'verification_status', 'is_featured', 'districts')
    search_fields = ('title', 'title_ml', 'description_en', 'locality')
    filter_horizontal = ('districts',)


@admin.register(Contribution)
class ContributionAdmin(admin.ModelAdmin):
    list_display = ('title', 'contributor_name', 'district', 'category', 'status', 'submitted_at')
    list_filter = ('status', 'district', 'category')
    search_fields = ('title', 'contributor_name', 'description')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('contribution', 'reviewer', 'decision', 'reviewed_at')
    list_filter = ('decision',)


@admin.register(CulturalGlossary)
class CulturalGlossaryAdmin(admin.ModelAdmin):
    list_display = ('term_ml', 'transliteration', 'meaning_en', 'related_category')
    search_fields = ('term_ml', 'transliteration', 'meaning_en')
