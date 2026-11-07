# OORVEX Architecture & Technical Design Document

This document outlines the technical design, data architecture, security measures, and AI grounding workflows of **OORVEX: The Digital Universe of Kerala's Culture**.

---

## 1. System Architecture Overview

```mermaid
flowchart TD
    subgraph Client ["Frontend (React 18 + Vite)"]
        UI["Cinematic UI & Pages"]
        ThreeCanvas["Three.js 3D Golden Particle Nebula"]
        LeafletMap["Leaflet + OpenStreetMap + GeoJSON (14 Districts)"]
        AIModal["CultureMatch AI Interface"]
        AccessCtrl["WCAG 2.1 AA Accessibility & Speech Synthesis"]
        Passport["Cultural Explorer Passport Context"]
    end

    subgraph Server ["Backend (Django 6.0 + DRF)"]
        Router["Django URL Dispatcher"]
        APIViews["REST API Controllers"]
        AIService["CultureMatch Grounded Engine"]
        ModerationEngine["Contribution & Review Moderation"]
    end

    subgraph DataStore ["Database & AI Integration"]
        SQLite[("SQLite3 Database<br/>Districts, Listings, Categories, Glossary")]
        GeminiAPI["Google Gemini API (1.5 Flash)"]
        LocalCache["Grounded Search Fallback Engine"]
    end

    Client -->|HTTP/REST /api/*| Router
    Router --> APIViews
    APIViews -->|Query / ORM| SQLite
    APIViews --> AIService
    APIViews --> ModerationEngine
    AIService -->|Step 1: Retrieve Verified Records| SQLite
    AIService -->|Step 2: Grounded Prompt with Context| GeminiAPI
    AIService -.->|Offline / Failure Fallback| LocalCache
    ModerationEngine -->|On Approve: Auto-Create Listing| SQLite
```

---

## 2. CultureMatch AI Retrieval-Grounded Pipeline

To prevent cultural hallucination, CultureMatch AI uses a strict retrieval-first generation architecture:

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Frontend as Frontend UI (React)
    participant Backend as Django ai_service
    participant DB as SQLite Cultural Database
    participant Gemini as Google Gemini 1.5 Flash

    User->>Frontend: Asks: "What traditional art forms can I explore in Kannur?"
    Frontend->>Backend: POST /api/ai/discover/ { query, language: 'en' }
    Backend->>DB: Intent Search in CulturalListing (verification_status='approved')
    DB-->>Backend: Returns 6 verified records (Theyyam, Kalaripayattu, etc.)
    
    alt Gemini API Key Available
        Backend->>Gemini: Prompt with strict context payload + grounding constraints
        Gemini-->>Backend: Returns grounded natural explanation with citations
    else API Key Missing / Network Error
        Backend->>Backend: Execute deterministic grounded synthesis
    end

    Backend-->>Frontend: JSON payload { explanation, recommended_records, is_ai_generated }
    Frontend-->>User: Displays structured answer, verified citations, and links to real listing IDs
```

### Strict Grounding Rules:
1. Only records with `verification_status = 'approved'` are retrieved.
2. The AI prompt explicitly forbids answering outside the supplied database context.
3. Every recommendation returns the actual primary key `id` so the frontend can route directly to the detail view (`/cultural-listings/${id}`).
4. If no verified records exist for a query, the model explicitly responds that no verified archive record exists, preventing hallucinated origins or communities.

---

## 3. Database Entity Relationship (ER) Model

```mermaid
erDiagram
    DISTRICT ||--o{ CULTURAL_LISTING : "practiced in"
    DISTRICT ||--o{ CULTURAL_LISTING : "place of origin"
    CATEGORY ||--o{ CULTURAL_LISTING : classifies
    DISTRICT ||--o{ CONTRIBUTION : associates
    CATEGORY ||--o{ CONTRIBUTION : categorizes
    CONTRIBUTION ||--o{ REVIEW : receives
    CATEGORY ||--o{ CULTURAL_GLOSSARY : relates
    DISTRICT ||--o{ CULTURAL_GLOSSARY : associates

    DISTRICT {
        string slug PK
        string name
        string name_ml
        string tagline
        text description_en
        text description_ml
        string headquarters
        float latitude
        float longitude
        string hero_image
        string image_credit
        int area_sq_km
        int order
    }

    CATEGORY {
        string slug PK
        string name_en
        string name_ml
        text description_en
        text description_ml
        string icon
        int order
    }

    CULTURAL_LISTING {
        int id PK
        string title
        string title_ml
        string category_id FK
        string origin_district_id FK
        string locality
        float latitude
        float longitude
        text description_en
        text description_ml
        text cultural_story
        text historical_background
        text cultural_significance
        string image
        string image_credit
        string source_reference
        string verification_status
        boolean is_featured
        text audio_narration
    }

    CONTRIBUTION {
        int id PK
        string contributor_name
        string contributor_email
        string title
        string title_ml
        string category_id FK
        string district_id FK
        string locality
        text description
        text description_ml
        text cultural_story
        string image
        string image_credit
        string source_reference
        boolean consent
        string status
        datetime submitted_at
    }

    REVIEW {
        int id PK
        int contribution_id FK
        string reviewer
        string decision
        text comments
        datetime reviewed_at
    }

    CULTURAL_GLOSSARY {
        int id PK
        string term_ml
        string transliteration
        string meaning_en
        text cultural_context
        string related_category_id FK
        string associated_district_id FK
        string audio_phonetic
    }
```

---

## 4. Community Contribution & Moderation Workflow

```mermaid
stateDiagram-v2
    [*] --> Submitted: Community User Submits Record
    Submitted --> Pending: Saved with status='pending'
    
    state Pending {
        [*] --> CuratorReview
        CuratorReview --> VerificationCheck: Cross-reference archival sources
        VerificationCheck --> ImageLicenseCheck: Check image attribution & copyright
    }

    Pending --> Approved: Curator Approves with notes
    Pending --> Rejected: Curator Rejects with reason

    Approved --> CulturalListing: Auto-published to verified database
    CulturalListing --> LiveMap: Displayed as verified marker on Kerala Map
    CulturalListing --> AIKnowledge: Indexed for CultureMatch AI recommendations

    Rejected --> Archive: Stored with curator comments for audit
```

---

## 5. Accessibility & Performance Architecture

- **WCAG 2.1 AA Compliance**:
  * Semantic HTML tags (`<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`, `<article>`)
  * Dynamic font size scaling (`100%`, `115%`, `130%`)
  * High-contrast mode enforcing pure black background with gold borders and white text
  * Reduced-motion toggle (`prefers-reduced-motion`) that disables Three.js particle rendering and CSS transitions
  * Text-to-speech audio reader utilizing Web Speech API (`SpeechSynthesisUtterance`)
- **Bundle Optimization**:
  * Code-split vendor chunks (`vendor-three`, `vendor-leaflet`, `vendor-react`)
  * Total main JS bundle gzipped size is under 70 kB
  * Lazy loading for all cultural imagery with aspect ratio preservation to avoid layout shift (CLS < 0.05).
