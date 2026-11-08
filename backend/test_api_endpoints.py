import os
import sys
import django

sys.stdout.reconfigure(encoding='utf-8')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'oorvex_backend.settings')
django.setup()

from rest_framework.test import APIClient
from culture.models import District, Category, CulturalListing, Contribution, CulturalGlossary, CulturalPlace

def run_tests():
    client = APIClient()
    print("Testing OORVEX Backend REST API Endpoints...")

    # 1. Districts List
    res = client.get('/api/districts/')
    assert res.status_code == 200, f"Districts list failed: {res.status_code}"
    print(f"PASS: /api/districts/ returned {len(res.data)} districts.")
    assert len(res.data) == 14, f"Expected 14 districts, got {len(res.data)}"

    # 2. District Detail
    res = client.get('/api/districts/kannur/')
    assert res.status_code == 200, f"District detail failed: {res.status_code}"
    print(f"PASS: /api/districts/kannur/ returned district: {res.data['name']} ({res.data['name_ml']})")
    assert 'places' in res.data, "Expected places list in district detail"
    assert 'listings' in res.data, "Expected listings in district detail"
    print(f"PASS: /api/districts/kannur/ includes {len(res.data['listings'])} listings and {len(res.data['places'])} places.")

    # 3. Categories List
    res = client.get('/api/categories/')
    assert res.status_code == 200, f"Categories failed: {res.status_code}"
    print(f"PASS: /api/categories/ returned {len(res.data)} categories.")

    # 4. Cultural Listings
    res = client.get('/api/listings/')
    assert res.status_code == 200, f"Listings failed: {res.status_code}"
    print(f"PASS: /api/listings/ returned {len(res.data)} approved listings.")

    # 5. ArtForms Alias Endpoint
    res_artforms = client.get('/api/artforms/')
    assert res_artforms.status_code == 200, f"Artforms failed: {res_artforms.status_code}"
    print(f"PASS: /api/artforms/ alias returned {len(res_artforms.data)} art forms.")

    # 6. Cultural Listing Detail with Galleries and Places
    theyyam = CulturalListing.objects.filter(title__icontains='Theyyam').first()
    res = client.get(f'/api/listings/{theyyam.id}/')
    assert res.status_code == 200, f"Listing detail failed: {res.status_code}"
    assert 'gallery_images' in res.data, "Expected gallery_images in listing detail"
    assert 'places' in res.data, "Expected places in listing detail"
    assert len(res.data['costumes']) > 0, "Expected costumes documented"
    assert len(res.data['instruments']) > 0, "Expected instruments documented"
    assert len(res.data['techniques']) > 0, "Expected techniques documented"
    print(f"PASS: /api/listings/{theyyam.id}/ returned Theyyam with {len(res.data['gallery_images'])} gallery images, {len(res.data['places'])} venues, and documented performance details.")

    # 7. Cultural Places Endpoint
    res_places = client.get('/api/places/')
    assert res_places.status_code == 200, f"Places failed: {res_places.status_code}"
    print(f"PASS: /api/places/ returned {len(res_places.data)} verified cultural venues.")

    # 8. Glossary List
    res = client.get('/api/glossary/')
    assert res.status_code == 200, f"Glossary failed: {res.status_code}"
    print(f"PASS: /api/glossary/ returned {len(res.data)} glossary terms.")

    # 9. Submit Community Contribution
    contrib_payload = {
        'contributor_name': 'Automated Test User',
        'contributor_email': 'test@oorvex.org',
        'title': 'Kalaripayattu Martial Tradition Test',
        'title_ml': 'കളരിപ്പയറ്റ് പരീക്ഷണ രേഖ',
        'category': 'martial-arts',
        'district': 'kannur',
        'locality': 'CVN Kalari, Kannur',
        'description': 'Ancient martial art of Kerala embodying armed and unarmed combat forms.',
        'cultural_story': 'Sage Parashurama founded thirty-two Kalaris across the Malabar coast.',
        'image': 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80',
        'image_credit': 'Wikimedia Commons',
        'source_reference': 'Kerala Sangeetha Nataka Akademi Reference',
        'consent': True
    }
    res = client.post('/api/contributions/', contrib_payload, format='json')
    assert res.status_code == 201, f"Contribution create failed: {res.status_code} {res.data}"
    contrib_id = res.data['id']
    print(f"PASS: /api/contributions/ created contribution ID {contrib_id}.")

    # 10. CultureMatch AI Discover
    ai_payload = {
        'query': 'What ritual art forms are in Kannur?',
        'language': 'en'
    }
    res = client.post('/api/ai/discover/', ai_payload, format='json')
    assert res.status_code == 200, f"AI discover failed: {res.status_code} {res.data}"
    print(f"PASS: /api/ai/discover/ returned grounded records count: {res.data['grounded_records_count']}")

    # 11. Admin Contributions
    res = client.get('/api/admin/contributions/?status=pending')
    assert res.status_code == 200, f"Admin contributions failed: {res.status_code}"
    print(f"PASS: /api/admin/contributions/ returned {len(res.data)} pending submissions.")

    # 12. Admin Approve Contribution
    res = client.post(f'/api/admin/contributions/{contrib_id}/approve/', {'comments': 'Verified and approved.'})
    assert res.status_code == 200, f"Approve failed: {res.status_code}"
    print(f"PASS: /api/admin/contributions/{contrib_id}/approve/ succeeded.")

    # 13. Admin Image Upload & Replacement
    img_payload = {
        'image_url': '/images/arts/theyyam.jpg',
        'caption': 'Curator uploaded authentic Theyyam photo',
        'alt_text': 'Close-up of vibrant red mineral face painting in Theyyam',
        'photographer': 'Verified Kerala Cultural Archives (CC BY-SA 4.0)',
        'source_url': 'https://www.keralatourism.org/artforms/',
        'licence': 'CC BY-SA 4.0',
        'is_primary': True
    }
    res_img = client.post(f'/api/admin/artforms/{theyyam.id}/image/', img_payload, format='json')
    assert res_img.status_code == 200, f"Image upload failed: {res_img.status_code}"
    print(f"PASS: /api/admin/artforms/{theyyam.id}/image/ uploaded replacement image.")

    # 14. Admin Update Curator Status
    status_payload = {'curator_status': 'Verified'}
    res_status = client.post(f'/api/admin/artforms/{theyyam.id}/status/', status_payload, format='json')
    assert res_status.status_code == 200, f"Curator status update failed: {res_status.status_code}"
    assert res_status.data['curator_status'] == 'Verified', "Expected status Verified"
    print(f"PASS: /api/admin/artforms/{theyyam.id}/status/ updated status to Verified.")

    print("\nALL 14 REST API & CULTURAL HERITAGE ENDPOINTS TESTED & PASSED PERFECTLY!")

if __name__ == '__main__':
    run_tests()
