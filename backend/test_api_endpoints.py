import os
import sys
import django

sys.stdout.reconfigure(encoding='utf-8')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'oorvex_backend.settings')
django.setup()

from rest_framework.test import APIClient
from culture.models import District, Category, CulturalListing, Contribution, CulturalGlossary

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

    # 3. Categories List
    res = client.get('/api/categories/')
    assert res.status_code == 200, f"Categories failed: {res.status_code}"
    print(f"PASS: /api/categories/ returned {len(res.data)} categories.")

    # 4. Cultural Listings
    res = client.get('/api/listings/')
    assert res.status_code == 200, f"Listings failed: {res.status_code}"
    print(f"PASS: /api/listings/ returned {len(res.data)} approved listings.")

    # 5. Cultural Listing Detail
    first_listing = CulturalListing.objects.first()
    res = client.get(f'/api/listings/{first_listing.id}/')
    assert res.status_code == 200, f"Listing detail failed: {res.status_code}"
    print(f"PASS: /api/listings/{first_listing.id}/ returned: {res.data['title']}")

    # 6. Glossary List
    res = client.get('/api/glossary/')
    assert res.status_code == 200, f"Glossary failed: {res.status_code}"
    print(f"PASS: /api/glossary/ returned {len(res.data)} glossary terms.")

    # 7. Submit Community Contribution
    contrib_payload = {
        'contributor_name': 'Automated Test User',
        'contributor_email': 'test@oorvex.org',
        'title': 'Kalaripayattu Martial Tradition',
        'title_ml': 'കളരിപ്പയറ്റ്',
        'category': 'performing-arts',
        'district': 'kannur',
        'locality': 'CVN Kalari, Kannur',
        'description': 'Ancient martial art of Kerala embodying armed and unarmed combat forms.',
        'cultural_story': 'Sage Parashurama founded thirty-two Kalaris across the Malabar coast.',
        'image': 'https://images.unsplash.com/photo-1599824425751-2405c935d21c?auto=format&fit=crop&w=800&q=80',
        'image_credit': 'Wikimedia Commons',
        'source_reference': 'Kerala Sangeetha Nataka Akademi Reference',
        'consent': True
    }
    res = client.post('/api/contributions/', contrib_payload, format='json')
    assert res.status_code == 201, f"Contribution create failed: {res.status_code} {res.data}"
    contrib_id = res.data['id']
    print(f"PASS: /api/contributions/ created contribution ID {contrib_id}.")

    # 8. CultureMatch AI Discover
    ai_payload = {
        'query': 'What ritual art forms are in Kannur?',
        'language': 'en'
    }
    res = client.post('/api/ai/discover/', ai_payload, format='json')
    assert res.status_code == 200, f"AI discover failed: {res.status_code} {res.data}"
    print(f"PASS: /api/ai/discover/ returned grounded records count: {res.data['grounded_records_count']}")

    # 9. Admin Contributions
    res = client.get('/api/admin/contributions/?status=pending')
    assert res.status_code == 200, f"Admin contributions failed: {res.status_code}"
    print(f"PASS: /api/admin/contributions/ returned {len(res.data)} pending submissions.")

    # 10. Admin Approve Contribution
    res = client.post(f'/api/admin/contributions/{contrib_id}/approve/', {'comments': 'Verified and approved.'})
    assert res.status_code == 200, f"Approve failed: {res.status_code}"
    print(f"PASS: /api/admin/contributions/{contrib_id}/approve/ succeeded.")

    # 11. Verify Approved Contribution shows in public listings
    listing_check = CulturalListing.objects.filter(title='Kalaripayattu Martial Tradition')
    assert listing_check.exists(), "Approved listing not created in CulturalListing table"
    print(f"PASS: Approved listing published to live archive with ID {listing_check.first().id}.")

    print("\nALL 11 REST API ENDPOINTS TESTED & PASSED PERFECTLY!")

if __name__ == '__main__':
    run_tests()
