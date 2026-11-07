# OORVEX (ഊർവെക്സ്)
## The Digital Universe of Kerala's Culture
**Tagline: Mapping Heritage. Connecting Generations.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![Django 6.0](https://img.shields.io/badge/Django-6.0-green.svg)](https://www.djangoproject.com/)
[![React 18](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![Leaflet](https://img.shields.io/badge/Leaflet-GeoJSON-brightgreen.svg)](https://leafletjs.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini%20Grounded-purple.svg)](https://ai.google.dev/)

---

### 🌟 Project Mission & Hackathon Scope

**OORVEX** is an immersive, AI-powered cultural heritage discovery and geographical mapping platform dedicated to the living cultural traditions of Kerala, India.

- **Primary Problem Statement:** **PS-05 – Discovery & Mapping: The Living Culture Map**
- **Supporting Problem Statement:** **PS-04 – Language & Accessibility: Culture in Every Voice**
- **Hackathon Theme:** *Traditional in Expression. Contemporary in Layout. Functional in Interaction.*

OORVEX bridges generational knowledge gaps by unifying geographical district exploration, verified performing and ritual art archives, master craft traditions, bilingual documentation (English and Malayalam), a strict retrieval-grounded AI assistant (CultureMatch AI), and a community heritage contribution pipeline.

---

## 🏛️ Key Feature Modules

### P0 – Essential MVP
1. **Cinematic Responsive Homepage**: Ambient lighting, Three.js 3D golden ember particle constellation, traditional Kerala aesthetics, and dynamic statistics.
2. **Interactive Kerala Map (All 14 Districts)**: Functional Leaflet and OpenStreetMap integration rendering accurate GeoJSON boundaries, district hover highlights, cultural location pins, category filtering, search, and fly-to navigation.
3. **District-Wise Cultural Explorer (All 14 Districts)**: Dedicated pages for Kasaragod, Kannur, Wayanad, Kozhikode, Malappuram, Palakkad, Thrissur, Ernakulam, Idukki, Kottayam, Alappuzha, Pathanamthitta, Kollam, and Thiruvananthapuram.
4. **Cultural Database with Sourced Records**: Performing arts (Theyyam, Kathakali, Padayani, Mudiyettu, Chavittu Nadakam, Tholpavakoothu, Oppana, Margamkali) and master crafts (Aranmula Kannadi, Beypore Uru, Balaramapuram Handloom, Chundan Vallam, Marayoor Jaggery).
5. **Search & Multi-Category Filters**: Filter by performing arts, ritual arts, classical arts, folk dances, traditional music, crafts, and heritage places.
6. **Individual Heritage Detail Pages**: High-resolution authentic photography, photographer attribution, English/Malayalam descriptions, cultural stories/legends, historical background, cultural significance, and source references.
7. **CultureMatch AI Cultural Guide**: Powered by Google Gemini via Django backend. Employs strict retrieval-grounded generation—only recommends verified database records, returns genuine listing IDs, provides verifiable archival citations, and never hallucinates dates or traditions.
8. **Bilingual Experience (English & Malayalam)**: Instant toggle switching between English and Malayalam for interface labels, cultural titles, narratives, and phonetic guides.
9. **Functional Django REST APIs**: 11 production endpoints with filtering, search, and moderation workflows.
10. **Community Contribution System**: Allows public submissions with mandatory verification status (`PENDING` → `APPROVED` / `REJECTED`).

### P1 – Enhancements
1. **Cultural Glossary**: Searchable Malayalam cultural lexicon with English transliteration, cultural contexts, and Web Speech API audio pronunciation.
2. **Accessibility Controls (WCAG 2.1 AA)**: Dynamic font size scaling (100%, 115%, 130%), high-contrast gold-and-black mode, reduced-motion toggle, and screen-voice assist.
3. **Curator Moderation Dashboard**: Real-time admin portal to inspect pending submissions, view contributor notes, and approve (instantly publishing to the live map) or reject with feedback.

### P2 – Explorer Passport
1. **Kerala Cultural Explorer Passport**: Digital passport tracking districts explored out of 14, collecting digital heritage stamps, and unlocking explorer achievement badges (Cultural Wanderer, Cultural Adept, Heritage Grandmaster).

---

## 🏗️ Technical Architecture

```
OORVEX/
├── backend/
│   ├── manage.py
│   ├── oorvex_backend/          # Django project settings & root URLs
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── culture/                 # Cultural heritage Django app
│   │   ├── models.py            # District, Category, CulturalListing, Contribution, Review, Glossary
│   │   ├── serializers.py       # DRF Serializers
│   │   ├── views.py             # 11 REST API views
│   │   ├── urls.py              # API routes
│   │   ├── ai_service.py        # Gemini retrieval-grounded AI pipeline
│   │   ├── admin.py             # Django admin registration
│   │   └── management/commands/
│   │       └── seed_cultural_data.py # Seed data for all 14 districts
│   ├── test_api_endpoints.py    # Automated test suite
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── package.json
│   ├── vite.config.js           # Vite config with manual chunk splitting
│   ├── tailwind.config.js       # Heritage color palette & typography
│   ├── index.html               # Fonts & Leaflet CSS
│   └── src/
│       ├── assets/
│       │   └── kerala_districts.json # 14 Kerala districts GeoJSON polygons
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── Hero3DCanvas.jsx # Three.js 3D golden particle nebula
│       │   ├── KeralaMap.jsx    # Interactive Leaflet map with GeoJSON
│       │   ├── CultureMatchModal.jsx # Grounded AI assistant dialog
│       │   ├── AccessibilityBar.jsx  # WCAG 2.1 AA controls
│       │   ├── PassportDrawer.jsx    # Cultural Explorer Passport
│       │   └── CulturalCard.jsx      # Heritage card component
│       ├── context/
│       │   ├── LanguageContext.jsx
│       │   ├── AccessibilityContext.jsx
│       │   └── PassportContext.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── ExploreDistricts.jsx
│       │   ├── DistrictDetail.jsx
│       │   ├── CulturalListings.jsx
│       │   ├── CulturalDetail.jsx
│       │   ├── CraftsGallery.jsx
│       │   ├── CulturalStories.jsx
│       │   ├── GlossaryPage.jsx
│       │   ├── ContributePage.jsx
│       │   ├── AdminDashboard.jsx
│       │   └── AboutPage.jsx
│       ├── services/
│       │   ├── api.js           # Axios client with fallback
│       │   └── translations.js  # Bilingual EN/ML dictionary
│       └── styles/
│           └── index.css
├── ARCHITECTURE.md
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+ (tested with Python 3.12)
- Node.js 18+ & npm

---

### Backend Setup (Django REST Framework)

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *(Optional: Add your `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/) for live Gemini retrieval-grounding. If omitted, the system seamlessly uses its deterministic grounded search pipeline!)*

3. Run migrations and seed verified cultural records:
   ```bash
   python manage.py migrate
   python manage.py seed_cultural_data
   ```

4. Run automated test suite:
   ```bash
   python test_api_endpoints.py
   ```

5. Start the backend development server:
   ```bash
   python manage.py runserver 8000
   ```
   The backend API will run at `http://127.0.0.1:8000/api/`.

---

### Frontend Setup (React + Vite + Tailwind CSS)

1. Open a second terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application will be live at `http://localhost:5173`.

4. To produce an optimized production build:
   ```bash
   npm run build
   ```

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/districts/` | List all 14 districts with listing statistics |
| `GET` | `/api/districts/<slug>/` | Detailed district dossier and approved listings |
| `GET` | `/api/categories/` | List cultural categories with counts |
| `GET` | `/api/listings/` | Filter approved listings (`?district=`, `?category=`, `?search=`, `?featured=`) |
| `GET` | `/api/listings/<id>/` | Individual listing dossier with historical context |
| `GET` | `/api/glossary/` | Searchable Malayalam cultural lexicon (`?search=`) |
| `POST` | `/api/contributions/` | Submit community heritage record for moderation |
| `POST` | `/api/ai/discover/` | CultureMatch AI retrieval-grounded query |
| `GET` | `/api/admin/contributions/` | Moderator view for contributions (`?status=pending`) |
| `POST` | `/api/admin/contributions/<id>/approve/` | Approve submission & publish directly to map |
| `POST` | `/api/admin/contributions/<id>/reject/` | Reject submission with curator comments |

---

## 🎨 Visual Identity & Design System

- **Deep Forest Green (`#102B24`)**: Reflects Kerala's lush Western Ghats and sacred groves (Kavus).
- **Dark Emerald (`#071B17`)**: Museum-grade backdrop ensuring deep contrast.
- **Antique Gold (`#D6B46A`)**: Evokes sacred bronze temple oil lamps (Nilavilakku) and Kasavu gold zari.
- **Warm Ivory (`#F4EBD9`)**: Inspired by traditional unbleached cotton handlooms and mural murals.
- **Typography**: Classical serif headings (*Cinzel*, *Playfair Display*, *Noto Serif Malayalam*) paired with clean sans body (*Plus Jakarta Sans*, *Manjari*).

---

## 🛡️ Cultural Validation & Source References

Every cultural listing in OORVEX references verified cultural archives:
- **Kerala Sangeetha Nataka Akademi**
- **Kerala Folklore Akademi**
- **Kerala Kalamandalam Deemed University for Art and Culture**
- **Archaeological Survey of India (ASI)**
- **Geographical Indications (GI) Registry of India**
- **Wikimedia Commons / Creative Commons licensing**

---

## 👥 Team
- Hackathon Project for Cultural Heritage & Discovery (PS-05, PS-04).
- Built with pride for Kerala's living traditions.

## 📄 License
This project is open-source under the [MIT License](LICENSE).
