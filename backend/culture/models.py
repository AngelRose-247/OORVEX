from django.db import models


class District(models.Model):
    slug = models.SlugField(max_length=64, unique=True, primary_key=True)
    name = models.CharField(max_length=128)
    name_ml = models.CharField(max_length=128)
    tagline = models.CharField(max_length=256, blank=True)
    description_en = models.TextField()
    description_ml = models.TextField()
    headquarters = models.CharField(max_length=128)
    latitude = models.FloatField()
    longitude = models.FloatField()
    hero_image = models.URLField(max_length=512)
    image_credit = models.CharField(max_length=256, default="Wikimedia Commons / CC BY-SA")
    area_sq_km = models.IntegerField(default=0)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return f"{self.name} ({self.name_ml})"


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

    title = models.CharField(max_length=256)
    title_ml = models.CharField(max_length=256)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='listings')
    
    # Distinction between practicing districts and place of origin
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
    cultural_story = models.TextField(help_text="Deep narrative storytelling about legends, rituals, or lineage")
    historical_background = models.TextField(blank=True)
    cultural_significance = models.TextField(blank=True)
    
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
