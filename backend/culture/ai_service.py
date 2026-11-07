import json
import logging
import re
from typing import Dict, Any, List
import requests
from django.conf import settings
from django.db.models import Q
from .models import CulturalListing, District, Category

logger = logging.getLogger(__name__)


def retrieve_relevant_records(query: str, district_slug: str = None, category_slug: str = None, limit: int = 8) -> List[CulturalListing]:
    """
    Step 1 & 2: Intent-aware search against approved cultural database records.
    """
    qs = CulturalListing.objects.filter(verification_status='approved').prefetch_related('districts', 'category')

    if district_slug:
        qs = qs.filter(districts__slug=district_slug)

    if category_slug:
        qs = qs.filter(category__slug=category_slug)

    query_clean = query.strip().lower()
    words = [w for w in re.split(r'[\s,?.!]+', query_clean) if len(w) > 2]

    # Check if any district name is in the query text
    district_matches = District.objects.filter(
        Q(name__icontains=query_clean) | Q(name_ml__icontains=query_clean)
    )
    if not district_slug and district_matches.exists():
        matched_dist = district_matches.first()
        qs_district = qs.filter(districts=matched_dist)
        if qs_district.exists():
            qs = qs_district

    # Build Q filters for matching words
    if words:
        q_filter = Q()
        for word in words:
            q_filter |= (
                Q(title__icontains=word) |
                Q(title_ml__icontains=word) |
                Q(locality__icontains=word) |
                Q(category__name_en__icontains=word) |
                Q(category__slug__icontains=word) |
                Q(description_en__icontains=word) |
                Q(cultural_story__icontains=word) |
                Q(districts__name__icontains=word)
            )
        matching_qs = qs.filter(q_filter).distinct()
        if matching_qs.exists():
            return list(matching_qs[:limit])

    # Fallback to general approved listings if no specific term matched
    return list(qs.order_by('-is_featured', 'title')[:limit])


def query_culturematch_ai(query: str, district_slug: str = None, category_slug: str = None, language: str = 'en') -> Dict[str, Any]:
    """
    CultureMatch retrieval-grounded generation pipeline.
    Uses Gemini API if configured, with graceful fallback.
    """
    records = retrieve_relevant_records(query, district_slug, category_slug, limit=6)

    # Prepare grounded records payload
    grounded_data = []
    for r in records:
        dist_names = [d.name for d in r.districts.all()]
        grounded_data.append({
            "id": r.id,
            "title": r.title,
            "title_ml": r.title_ml,
            "category": r.category.name_en,
            "districts": dist_names,
            "origin_district": r.origin_district.name if r.origin_district else (dist_names[0] if dist_names else "Kerala"),
            "locality": r.locality,
            "description_en": r.description_en,
            "cultural_story": r.cultural_story,
            "source_reference": r.source_reference,
            "image": r.image,
            "image_credit": r.image_credit,
            "latitude": r.latitude,
            "longitude": r.longitude
        })

    api_key = getattr(settings, 'GEMINI_API_KEY', '') or ''
    ai_response_text = ""
    is_grounded_by_ai = False

    if api_key and len(grounded_data) > 0:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
            
            prompt_context = f"""
You are CultureMatch AI, the official verified cultural guide of OORVEX (Digital Universe of Kerala's Culture).
USER QUESTION: "{query}"
PREFERRED LANGUAGE: "{language}" (Respond in {'Malayalam' if language == 'ml' else 'English'}).

STRICT RULES:
1. ONLY provide facts grounded directly in the VERIFIED CULTURAL DATABASE below.
2. NEVER hallucinate dates, art forms, or locations.
3. Every recommendation MUST reference the real listing ID and source.
4. Format your answer with elegant Markdown: highlight cultural essence, practicing districts vs origin, and cultural stories.
5. If the user asks for something not in the database, honestly state that no verified record currently exists.

VERIFIED CULTURAL DATABASE:
{json.dumps(grounded_data, ensure_ascii=False, indent=2)}
"""
            payload = {
                "contents": [{"parts": [{"text": prompt_context}]}],
                "generationConfig": {
                    "temperature": 0.2,
                    "maxOutputTokens": 800
                }
            }
            res = requests.post(url, json=payload, timeout=8)
            if res.status_code == 200:
                data = res.json()
                ai_response_text = data['candidates'][0]['content']['parts'][0]['text']
                is_grounded_by_ai = True
        except Exception as e:
            logger.warning(f"Gemini API request failed, falling back to deterministic synthesis: {e}")

    # Fallback deterministic grounded synthesizer if API key is absent or failed
    if not ai_response_text:
        if not grounded_data:
            if language == 'ml':
                ai_response_text = (
                    "ക്ഷമിക്കുക, നിങ്ങളുടെ തിരച്ചിലിന് അനുയോജ്യമായ സാക്ഷ്യപ്പെടുത്തിയ സാംസ്കാരിക വിവരങ്ങൾ "
                    "നിലവിൽ ശേഖരത്തിൽ ലഭ്യമല്ല. ദയവായി മറ്റൊരു ജില്ലയോ കലാരൂപമോ തിരയുക അല്ലെങ്കിൽ "
                    "കമ്മ്യൂണിറ്റി സംഭാവന വഴി പുതിയ വിവരങ്ങൾ പങ്കിടുക."
                )
            else:
                ai_response_text = (
                    "We could not find any verified cultural listings matching your specific query. "
                    "OORVEX strictly grounds all recommendations on verified heritage archives. "
                    "Try exploring by district (e.g., 'Kannur', 'Thrissur') or submit a new community listing."
                )
        else:
            if language == 'ml':
                lines = [f"**സാക്ഷ്യപ്പെടുത്തിയ സാംസ്കാരിക വിവരങ്ങൾ (OORVEX CultureMatch):**\n"]
                for item in grounded_data:
                    lines.append(
                        f"### {item['title_ml']} ({item['title']})\n"
                        f"- **വിഭാഗം:** {item['category']} | **പ്രദേശം/ജില്ല:** {', '.join(item['districts'])}\n"
                        f"- **വിവരണം:** {item['description_en']}\n"
                        f"- **ഐതിഹ്യം/പാരമ്പര്യം:** {item['cultural_story'][:220]}...\n"
                        f"- **സാക്ഷ്യപ്പെടുത്തിയ ഉറവിടം:** {item['source_reference']}\n"
                        f"- [റെക്കോർഡ് കാണുക](/cultural-listings/{item['id']})\n"
                    )
                ai_response_text = "\n".join(lines)
            else:
                lines = [f"**CultureMatch Verified Heritage Discovery for '{query}':**\n"]
                for item in grounded_data:
                    lines.append(
                        f"### {item['title']} ({item['title_ml']})\n"
                        f"- **Category:** {item['category']} | **Districts:** {', '.join(item['districts'])}\n"
                        f"- **Locality:** {item['locality'] or 'Kerala Heritage Belt'}\n"
                        f"- **Cultural Significance:** {item['description_en']}\n"
                        f"- **Heritage Story:** {item['cultural_story'][:220]}...\n"
                        f"- **Verified Archive Reference:** {item['source_reference']}\n"
                    )
                ai_response_text = "\n".join(lines)

    return {
        "query": query,
        "is_ai_generated": is_grounded_by_ai,
        "grounded_records_count": len(grounded_data),
        "explanation": ai_response_text,
        "recommended_records": grounded_data
    }
