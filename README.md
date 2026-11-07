# OORVEX (ഊർവെക്സ്)
## The Digital Universe of Kerala's Culture
**Tagline: Mapping Heritage. Connecting Generations.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![Django 6.0](https://img.shields.io/badge/Django-6.0-green.svg)](https://www.djangoproject.com/)
[![React 18](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-3D%20Nalukettu-orange.svg)](https://threejs.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-GeoJSON-brightgreen.svg)](https://leafletjs.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini%20Grounded-purple.svg)](https://ai.google.dev/)

---

### 🌟 Project Mission & Cultural Scope

**OORVEX** is an immersive, AI-powered cultural heritage discovery and geographical mapping platform dedicated to the living cultural traditions of Kerala, India.

It functions as an interactive digital cultural museum where visitors can select any district on an interactive map, discover documented traditional art forms, explore their history through authentic photographs, understand their cultural importance, and discover real places connected to those traditions.

- **Primary Research References**:
  1. **Official Kerala Tourism**: `https://www.keralatourism.org/artforms/`
  2. **Tusk Travel Cultural Guides**: `https://www.tusktravel.com/blog/most-popular-art-and-dance-forms-in-kerala/`
  3. **Wikipedia & Wikimedia Commons – Arts of Kerala**: `https://en.wikipedia.org/wiki/Arts_of_Kerala`

---

## 🎨 Ancient Kerala Visual Identity & Color Theme

OORVEX implements an elegant, light Ancient Kerala visual identity with high contrast and respectful heritage motifs:

| Role | Color | Hex Code | Visual Application |
| :--- | :--- | :--- | :--- |
| **Navbar** | Forest Green | `#405B43` | Top navigation bar and brand identity |
| **Hero Section** | Deep Green | `#123B32` | 3D Nalukettu opening entrance backdrop |
| **Page Canvas** | Warm Antique Ivory | `#F7F0DF` | Primary page background across all routes |
| **Buttons & CTAs** | Kasavu Gold | `#C6A15B` | Action buttons, badges, highlights, and passport triggers |
| **Art-Form Titles** | Forest Green | `#405B43` | Heading titles on cards and editorial dossiers |
| **Cultural Highlights** | Mural Red / Terracotta | `#A64F32` | Locality markers, tags, and category highlights |
| **Cards & Panels** | Card Ivory / White | `#FFFDF6` | Card panels, modal surfaces, and dossier dialogs |
| **Footer** | Dark Green | `#0B2923` | Multi-column archival footer with gold inlay accents |

---

## 🚪 Cinematic 3D Homepage & Scroll-Based Storytelling

1. **3D Nalukettu Opening Scene**:
   - Built with Three.js rendering a traditional carved wooden entrance.
   - Slowly opening wooden double doors with brass studs and knocker rings.
   - Golden sunlight rays streaming into the entrance from a deep green backdrop (`#123B32`).
   - Floating golden dust particles and atmospheric mist with mouse parallax.
   - Smooth entrance prompt: **ENTER THE HERITAGE**.
2. **Section 1 – Welcome to Kerala's Heritage**:
   - Cinematic landscape introduction to Kerala's rainforests, rivers, and cultural continuity.
3. **Section 2 – Explore the 14 Districts**:
   - Interactive Leaflet cartography rendering all 14 district GeoJSON boundaries.
   - Click-to-inspect district drawer with authentic cover photos, statistics, and quick cultural listings.
4. **Section 3 – Discover the Art Forms**:
   - Image-rich art form cards with authentic photography, EN/ML names, category pills, and Kasavu gold "View History" actions.
5. **Section 4 – Living Traditions**:
   - Cultural highlights of temple percussion (Chenda, Maddalam, Sopanam), natural pigments (*Mukhathezhuthu*), bronze metallurgy (Aranmula Kannadi), and dhow shipbuilding (Beypore Uru).
6. **Section 5 – Explore Cultural Places**:
   - Verified physical destinations (academies, sacred groves, practice Kalaris, annual festival venues) with addresses, seasonality schedules, and visitor etiquette.
7. **Section 6 – Community & Archival Footer**:
   - Dark green `#0B2923` footer with research citations, district quick-links, and curator portal.

---

## 🗺️ Complete User Experience: District to Art Form

### STEP 1 – Select a District
- Interactive map covering all 14 districts: Kasaragod, Kannur, Wayanad, Kozhikode, Malappuram, Palakkad, Thrissur, Ernakulam, Idukki, Kottayam, Alappuzha, Pathanamthitta, Kollam, and Thiruvananthapuram.
- Selecting a district opens its dedicated dossier:
  - English and Malayalam name
  - Authentic district cover photograph with credits
  - Cultural heritage introduction
  - Documented art forms in that district
  - Relevant crafts and traditional practices
  - Actual places associated with these traditions

### STEP 2 – Display District's Art Forms
- Displays art forms as image cards with authentic photos (Theyyam depicts Theyyam, Padayani depicts Padayani, etc.).
- Includes English name, Malayalam name, category, short description, locality association, and "View History" button.
- Strictly maps art forms to their genuine districts based on historical evidence.

### STEP 3 – Dedicated Art-Form Detail Page
Clicking any art-form card opens a dedicated dossier with 7 structured sections:
- **A. Art form introduction**: English & Malayalam names, category, short introduction, authentic photograph with photographer and license.
- **B. History and origin**: Historical background, documented era/timeline, practitioner communities, and cultural influences.
- **C. Cultural significance**: Religious, social, or cultural importance; distinguishes documented history from oral legends and folklore.
- **D. Performance and artistic details**: Costumes (Vesham), makeup, musical instruments (Chenda, Maddalam, Elathalam, etc.), and techniques (Mudras, stances).
- **E. Where to experience it**: Real locations with place name, district, venue type (permanent institution, practice location, seasonal festival venue), address, coordinates, and visitor access guidelines.
- **F. Photo gallery**: Multiple authentic photographs with captions, photographer, original source URL, and license.
- **G. Sources section**: Citations to Kerala Tourism, Sangeetha Nataka Akademi, and Wikipedia/Wikimedia with verification badges (`Verified`).

---

## 🏛️ Documented Traditions & Art Forms

1. **Theyyam** (Kannur, Kasaragod) — Sacred grove ecstatic ritual dance
2. **Thira / Thirayattam** (Kozhikode, Malappuram, Kannur) — Ancestral nocturnal spirit enactments
3. **Poorakkali** (Kannur, Kasaragod) — 18-rhythm martial circle dance and Marathukali debate
4. **Padayani** (Pathanamthitta, Kottayam, Kollam) — Areca spathe masked effigy rites at Kadammanitta
5. **Kathakali** (Kollam, Thrissur, Ernakulam, Thiruvananthapuram) — Classical mudra dance-drama
6. **Mohiniyattam** (Thrissur, Palakkad, Thiruvananthapuram) — Classical Lasya solo dance of the enchantress
7. **Ottanthullal** (Palakkad, Thrissur, Alappuzha) — Kunchan Nambiar's solo poetic satire
8. **Koodiyattam** (Thrissur, Ernakulam, Thiruvananthapuram) — UNESCO Sanskrit temple theatre
9. **Mudiyettu** (Ernakulam, Thrissur) — UNESCO Kali-Darika ritual drama and Kalamezhuthu murals
10. **Tholpavakoothu** (Palakkad, Malappuram, Thrissur) — Nila basin deerskin shadow puppetry
11. **Oppana** (Malappuram, Kozhikode, Kannur) — Mappila bridal circle dance and hand-clapping songs
12. **Margamkali** (Kottayam, Ernakulam, Thrissur) — St. Thomas Christian circular dance around brass lamp
13. **Kalaripayattu** (Kozhikode, Kannur, Wayanad, Thiruvananthapuram) — Ancient battlefield martial art
14. **Pulikali** (Thrissur) — Swaraj Round Onam painted tiger carnival
15. **Arjuna Nritham** (Kottayam, Alappuzha) — Peacock-feather skirt ritual temple dance
16. **Thiruvathirakali** (Thiruvananthapuram, Thrissur, Kottayam, Ernakulam) — Women's graceful circle dance
17. **Aranmula Kannadi** (Pathanamthitta) — Sacred front-surface bronze alloy mirror
18. **Beypore Uru** (Kozhikode) — Handcrafted wooden dhow shipbuilding by Khalasis
19. **Balaramapuram Kasavu** (Thiruvananthapuram) — Pure gold-bordered pit-loom handloom

---

## 🗄️ Backend Data Architecture

```python
# Key Models in culture/models.py:
- District(slug, name, name_ml, tagline, description_en, description_ml, headquarters, latitude, longitude, hero_image, image_credit, area_sq_km, order)
- CulturalListing(title, title_ml, category, districts, origin_district, locality, description_en, description_ml, cultural_story, historical_background, cultural_significance, costumes, instruments, techniques, historical_timeline, communities, image, image_credit, source_reference, verification_status)
- DistrictArtForm(district, art_form, locality, association_type, source_reference, verification_status)
- CulturalPlace(name, district, locality, description, art_form, venue_type, address, latitude, longitude, visitor_access_information, source_reference)
- ArtFormImage(art_form, district, image_url, caption, alt_text, photographer, source_url, licence, verification_status)
- Contribution(contributor_name, contributor_email, title, category, district, description, image, source_reference, status)
- Review(contribution, reviewer, decision, comments, reviewed_at)
- CulturalGlossary(term_ml, transliteration, meaning_en, cultural_context, audio_phonetic)
```

---

## 🚀 Running the Project

### 1. Backend (Django REST Framework)
```powershell
cd backend
# Run migrations
python manage.py migrate

# Seed verified cultural dataset
python manage.py seed_cultural_data

# Run automated tests
python test_api_endpoints.py

# Start Django development server
python manage.py runserver 8000
```

### 2. Frontend (Vite + React)
```powershell
cd frontend
# Build for production
npm run build

# Start frontend dev server
npm run dev
```

Open `http://localhost:5173` in your browser.
