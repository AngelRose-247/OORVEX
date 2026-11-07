# OORVEX Platform Presentation Deck Outline (8 Slides)

This presentation script and slide deck outline presents OORVEX: The Digital Universe of Kerala's Culture.

---

### Slide 1: Title & Vision
- **Header**: OORVEX (ഊർവെക്സ്)
- **Subheader**: The Digital Universe of Kerala's Culture
- **Tagline**: Mapping Heritage. Connecting Generations.
- **Mission**: Digital Cultural Heritage Discovery, Cartography, and Preservation
- **Design Philosophy**: Traditional in Expression. Contemporary in Layout. Functional in Interaction.
- **Visuals**: Antique ivory and laterite terracotta aesthetic, traditional brass lamp emblem, warm sunlight ambiance.

---

### Slide 2: The Core Challenge
- **The Cultural Disconnect**: Kerala possesses one of the world's richest repertoires of living performing traditions, ritual arts (Theyyam, Padayani, Mudiyettu), and master artisan guilds (Aranmula Kannadi, Beypore Uru).
- **The Pain Points**:
  1. *Fragmented Geographic Knowledge*: Visitors and newer generations lack unified interactive maps showing which rituals and crafts thrive in which districts.
  2. *AI Hallucinations*: Generic AI chatbots fabricate dates, folklores, and artist origins.
  3. *Linguistic & Sensory Barriers*: Heritage data is rarely fully bilingual (Malayalam & English) or accessible to differently-abled users.

---

### Slide 3: The OORVEX Solution
- **The Living Culture Map**: An interactive geographic map covering all 14 districts with authentic GeoJSON boundaries, district dossiers, and cultural markers.
- **CultureMatch AI Engine**: Retrieval-grounded generation querying verified archives first—strictly grounded with real listing IDs and source references.
- **Bilingual & Accessible**: Full English & Malayalam parity, cultural glossary with speech pronunciation, high contrast, font size scaling, and reduced motion.
- **Community Heritage Archiving**: Moderated submission workflow (Pending → Review → Publish) allowing local custodians to document endangered traditions.

---

### Slide 4: Interactive Geographic Discovery
- **Full Coverage of all 14 Districts**: From the coastal fortress of Bekal in Kasaragod to the seat of Travancore in Thiruvananthapuram.
- **Clear Distinction**: Rigorously separates *place of origin* from *practicing districts* (e.g. Theyyam practiced across Kannur & Kasaragod; Kathakali originating in Kottarakkara and preserved at Kalamandalam).
- **Multi-Category Filters**: Performing Arts, Ritual Arts, Classical Arts, Folk Dances, Traditional Music, Crafts, Heritage Places.

---

### Slide 5: CultureMatch AI – Grounded Cultural Intelligence
- **Retrieval-First Pipeline**:
  1. User asks natural question in English or Malayalam.
  2. Django backend extracts intent and queries approved database records.
  3. Grounded context is formatted into a strict system prompt.
  4. Google Gemini generates an authentic, culturally sensitive synthesis.
  5. Response displays verifiable archive references and direct links to map records.
- **Reliable Fallback**: Operates seamlessly with deterministic local grounded search if offline or without API keys.

---

### Slide 6: Language, Accessibility & Gamification
- **Bilingual Engine**: Interface labels, narratives, and cultural terminology translated with fidelity.
- **Cultural Glossary**: Malayalam cultural terminology (e.g., Meiyurappu, Sopana Sangeetham, Chundan Vallam, Nettur Petti) with phonetic transliteration and audio speech.
- **WCAG 2.1 AA Accessibility**: High contrast mode, font scaling (A, A+, A++), reduced motion mode.
- **Explorer Passport**: Interactive passport tracking visited districts out of 14, awarding digital stamps and badges (Cultural Wanderer to Heritage Grandmaster).

---

### Slide 7: Technical Architecture & Performance
- **Frontend**: React 18, Vite 6, Tailwind CSS, Three.js 3D, Leaflet + GeoJSON, Lucide icons.
- **Backend**: Python 3.12, Django 6.0, Django REST Framework, SQLite.
- **Visual Palette**: Antique Ivory (`#F7F0DF`), Palm-leaf Beige (`#E8D8B8`), Laterite Terracotta (`#A64F32`), Heritage Maroon (`#702D2B`), Temple Green (`#405B43`), Muted Gold (`#B58A45`).
- **Data Integrity**: Sourced from Kerala Sangeetha Nataka Akademi, Kerala Folklore Akademi, ASI, and GI Registry.

---

### Slide 8: Future Roadmap & Impact
- **Phase 1**: Regional deployment with Kerala Tourism and educational institutions.
- **Phase 2**: High-definition photogrammetry and 3D archival models of traditional ritual headgears (Mudi) and crafts.
- **Phase 3**: Crowdsourced oral history audio archives recorded directly from elder masters.
- **Closing**: *"Preserving the past. Inspiring the future."*
