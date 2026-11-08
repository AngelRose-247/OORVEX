from django.db import models


class District(models.Model):
    slug = models.SlugField(max_length=64, unique=True, primary_key=True)
    name = models.CharField(max_length=128)
    name_ml = models.CharField(max_length=128)
    tagline = models.CharField(max_length=256, blank=True)
    description_en = models.TextField()
    description_ml = models.TextField()
    history_editorial_note = models.TextField(blank=True, help_text="Editorial source and verification note for this district")
    headquarters = models.CharField(max_length=128)
    latitude = models.FloatField()
    longitude = models.FloatField()
    hero_image = models.URLField(max_length=512)
    image_credit = models.CharField(max_length=256, default="Wikimedia Commons / CC BY-SA")
    image_file = models.ImageField(upload_to='districts/', null=True, blank=True, help_text="Custom uploaded district cover image")
    image_caption = models.CharField(max_length=256, blank=True, help_text="Caption describing the district cover image")
    image_photographer = models.CharField(max_length=256, blank=True, help_text="Photographer or creator of the image")
    image_source_url = models.URLField(max_length=512, blank=True, help_text="Original source repository or archive citation")
    image_licence = models.CharField(max_length=128, default="Wikimedia Commons / CC BY-SA 4.0", blank=True)
    image_alt_text = models.CharField(max_length=256, blank=True, help_text="Descriptive alternative text for accessibility")
    image_approval_status = models.CharField(max_length=64, default="Verified", blank=True, help_text="Curator verification status")
    area_sq_km = models.IntegerField(default=0)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return f"{self.name} ({self.name_ml})"

    @property
    def cover_image(self):
        if self.image_file:
            return self.image_file.url
        return self.hero_image


class Category(models.Model):
    slug = models.SlugField(max_length=64, unique=True, primary_key=True)
    name_en = models.CharField(max_length=128)
    name_ml = models.CharField(max_length=128)
    description_en = models.TextField(blank=True)
    description_ml = models.TextField(blank=True)
    icon = models.CharField(max_length=64, default="Sparkles")
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['order', 'name_en']

    def __str__(self):
        return self.name_en


class CulturalListing(models.Model):
    STATUS_CHOICES = [
        ('approved', 'Approved / Verified'),
        ('pending', 'Pending Verification'),
        ('rejected', 'Rejected'),
    ]

    CURATOR_STATUS_CHOICES = [
        ('Verified', 'Verified'),
        ('Needs Review', 'Needs Review'),
        ('Unverified Demo Content', 'Unverified Demo Content'),
    ]

    title = models.CharField(max_length=256)
    title_ml = models.CharField(max_length=256)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='listings')
    
    # Many-to-many relationship across Kerala districts
    districts = models.ManyToManyField(District, related_name='listings')
    origin_district = models.ForeignKey(
        District, 
        null=True, 
        blank=True, 
        on_delete=models.SET_NULL, 
        related_name='origin_listings'
    )
    locality = models.CharField(max_length=256, blank=True, help_text="Exact locality or venue when verified")
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    description_en = models.TextField()
    description_ml = models.TextField()
    cultural_story = models.TextField(help_text="Deep narrative storytelling distinguishing legends from documented history")
    historical_background = models.TextField(blank=True)
    cultural_significance = models.TextField(blank=True)

    # Expanded 1.1 History fields from dataset
    history_summary = models.TextField(blank=True, help_text="Concise historical summary")
    history_detail = models.TextField(blank=True, help_text="In-depth historical context, origin debate, and district connection")
    history_sections = models.JSONField(default=list, blank=True, help_text="Suggested editorial sections for structured display")
    district_association = models.TextField(blank=True, help_text="Practicing districts and regional association note")
    editorial_status = models.CharField(max_length=128, default="Starter history – source review required", blank=True)
    curator_status = models.CharField(max_length=64, choices=CURATOR_STATUS_CHOICES, default='Verified')
    image_query = models.CharField(max_length=256, blank=True, help_text="Authentic image query string")
    image_upload_fields = models.JSONField(default=list, blank=True)

    # Detailed performance & artistic documentation
    costumes = models.TextField(blank=True, help_text="Detailed description of traditional attire, headgear, makeup, face painting")
    instruments = models.TextField(blank=True, help_text="Traditional musical and percussion instruments used in performance")
    techniques = models.TextField(blank=True, help_text="Choreographic movements, mudras, vocalizations, and rhythmic styles")
    historical_timeline = models.CharField(max_length=256, blank=True, help_text="Documented era or century when tradition emerged")
    communities = models.CharField(max_length=256, blank=True, help_text="Hereditary practitioner communities and lineages")
    
    image = models.URLField(max_length=512)
    image_credit = models.CharField(max_length=256, default="Wikimedia Commons / CC BY-SA 4.0")
    source_reference = models.CharField(max_length=512, help_text="Credible cultural repository citation")
    verification_status = models.CharField(max_length=32, choices=STATUS_CHOICES, default='approved')
    is_featured = models.BooleanField(default=False)
    audio_narration = models.TextField(blank=True, help_text="Phonetic transcript or spoken narration text")
    audio_url = models.URLField(max_length=512, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_featured', 'title']

    def __str__(self):
        return f"{self.title} ({self.title_ml})"


class DistrictArtForm(models.Model):
    """
    Explicit district-to-art-form linkage capturing local traditions and venues.
    """
    district = models.ForeignKey(District, on_delete=models.CASCADE, related_name='district_artforms')
    art_form = models.ForeignKey(CulturalListing, on_delete=models.CASCADE, related_name='district_associations')
    locality = models.CharField(max_length=256, blank=True)
    association_type = models.CharField(max_length=128, default='Regional Tradition', help_text="e.g. Origin & Heritage Shrine, Living Practice Venue, Festival Center")
    source_reference = models.CharField(max_length=512, blank=True)
    verification_status = models.CharField(max_length=32, choices=CulturalListing.STATUS_CHOICES, default='approved')

    class Meta:
        unique_together = ('district', 'art_form')
        ordering = ['district', 'art_form']

    def __str__(self):
        return f"{self.art_form.title} in {self.district.name} ({self.association_type})"


class CulturalPlace(models.Model):
    """
    Verified locations where visitors can experience or learn about Kerala's traditions.
    """
    VENUE_TYPE_CHOICES = [
        ('permanent_institution', 'Permanent Institution / Academy'),
        ('practice_location', 'Traditional Practice Location / Kalari / Workshop'),
        ('festival_venue', 'Seasonal Festival Venue / Temple Shrine'),
        ('performance_venue', 'Occasional Performance Venue / Theatre'),
    ]

    name = models.CharField(max_length=256)
    district = models.ForeignKey(District, on_delete=models.CASCADE, related_name='cultural_places')
    locality = models.CharField(max_length=256)
    description = models.TextField()
    art_form = models.ForeignKey(CulturalListing, null=True, blank=True, on_delete=models.SET_NULL, related_name='places')
    venue_type = models.CharField(max_length=64, choices=VENUE_TYPE_CHOICES, default='practice_location')
    address = models.CharField(max_length=512, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    visitor_access_information = models.TextField(help_text="Visitor guidelines, seasonality, timings, and sacred space etiquette")
    source_reference = models.CharField(max_length=512, blank=True)
    curator_status = models.CharField(max_length=64, choices=CulturalListing.CURATOR_STATUS_CHOICES, default='Verified')

    class Meta:
        ordering = ['district', 'name']

    def __str__(self):
        return f"{self.name} - {self.district.name} ({self.get_venue_type_display()})"


class ArtFormImage(models.Model):
    """
    Verified visual gallery mapping photographs directly to their authentic art form and district.
    """
    art_form = models.ForeignKey(CulturalListing, on_delete=models.CASCADE, related_name='gallery_images')
    district = models.ForeignKey(District, null=True, blank=True, on_delete=models.SET_NULL, related_name='artform_images')
    image_url = models.URLField(max_length=512)
    caption = models.CharField(max_length=256)
    alt_text = models.CharField(max_length=256)
    photographer = models.CharField(max_length=256, blank=True)
    source_url = models.URLField(max_length=512, blank=True)
    licence = models.CharField(max_length=128, default="Wikimedia Commons / CC BY-SA 4.0")
    verification_status = models.CharField(max_length=32, choices=CulturalListing.STATUS_CHOICES, default='approved')
    curator_status = models.CharField(max_length=64, choices=CulturalListing.CURATOR_STATUS_CHOICES, default='Verified')

    class Meta:
        ordering = ['art_form', 'id']

    def __str__(self):
        return f"{self.caption} ({self.art_form.title})"


class Contribution(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Moderation'),
        ('approved', 'Approved and Published'),
        ('rejected', 'Rejected'),
    ]

    contributor_name = models.CharField(max_length=128)
    contributor_email = models.EmailField(blank=True)
    title = models.CharField(max_length=256)
    title_ml = models.CharField(max_length=256, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='contributions')
    district = models.ForeignKey(District, on_delete=models.CASCADE, related_name='contributions')
    locality = models.CharField(max_length=256, blank=True)
    description = models.TextField()
    description_ml = models.TextField(blank=True)
    cultural_story = models.TextField(blank=True)
    image = models.URLField(max_length=512)
    image_credit = models.CharField(max_length=256)
    source_reference = models.CharField(max_length=512)
    consent = models.BooleanField(default=False, help_text="Contributor confirms authenticity and right to publish")
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default='pending')
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.title} by {self.contributor_name} [{self.status}]"


class Review(models.Model):
    DECISION_CHOICES = [
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    contribution = models.ForeignKey(Contribution, on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.CharField(max_length=128, default="Curator")
    decision = models.CharField(max_length=32, choices=DECISION_CHOICES)
    comments = models.TextField(blank=True)
    reviewed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review for {self.contribution.title}: {self.decision}"


class CulturalGlossary(models.Model):
    term_ml = models.CharField(max_length=128, help_text="Original Malayalam term")
    transliteration = models.CharField(max_length=128, help_text="English phonetic transliteration")
    meaning_en = models.CharField(max_length=256)
    cultural_context = models.TextField()
    related_category = models.ForeignKey(Category, null=True, blank=True, on_delete=models.SET_NULL)
    associated_district = models.ForeignKey(District, null=True, blank=True, on_delete=models.SET_NULL)
    audio_phonetic = models.CharField(max_length=256, blank=True)

    class Meta:
        verbose_name_plural = "Cultural Glossary"
        ordering = ['transliteration']

    def __str__(self):
        return f"{self.term_ml} ({self.transliteration}) - {self.meaning_en}"
