# Generated manually for District extra image fields

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('culture', '0003_artformimage_curator_status_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='district',
            name='image_file',
            field=models.ImageField(blank=True, help_text='Custom uploaded district cover image', null=True, upload_to='districts/'),
        ),
        migrations.AddField(
            model_name='district',
            name='image_caption',
            field=models.CharField(blank=True, help_text='Caption describing the district cover image', max_length=256),
        ),
        migrations.AddField(
            model_name='district',
            name='image_photographer',
            field=models.CharField(blank=True, help_text='Photographer or creator of the image', max_length=256),
        ),
        migrations.AddField(
            model_name='district',
            name='image_source_url',
            field=models.URLField(blank=True, help_text='Original source repository or archive citation', max_length=512),
        ),
        migrations.AddField(
            model_name='district',
            name='image_licence',
            field=models.CharField(blank=True, default='Wikimedia Commons / CC BY-SA 4.0', max_length=128),
        ),
        migrations.AddField(
            model_name='district',
            name='image_alt_text',
            field=models.CharField(blank=True, help_text='Descriptive alternative text for accessibility', max_length=256),
        ),
        migrations.AddField(
            model_name='district',
            name='image_approval_status',
            field=models.CharField(blank=True, default='Verified', help_text='Curator verification status', max_length=64),
        ),
    ]
