import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { fetchGlossary } from '../services/api';
import {
  BookOpen, Search, Volume2, VolumeX, Sparkles, MapPin, Feather
} from 'lucide-react';

export default function GlossaryPage({ onNavigate }) {
  const { language, t } = useLanguage();
  const { speakText, stopSpeaking, isSpeaking } = useAccessibility();

  const [terms, setTerms] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fallbackTerms = [
    { id: 1, term_ml: 'തെയ്യം', transliteration: 'Theyyam', meaning_en: 'Living god or embodiment of divinity in North Malabar ritual dance-worship.', cultural_context: 'Derived from Sanskrit "Daivam" (deity). The ritual manifestation where human transfigures into cosmic force in sacred kavus.', audio_phonetic: 'They-yam', district_name: 'Kannur' },
    { id: 2, term_ml: 'പടയണി', transliteration: 'Padayani', meaning_en: 'Military array / row of divine effigy masks danced to pacify ferocious Kali.', cultural_context: 'Performed across Central Travancore Bhadrakali temples using natural leaf masks (Kolams) and Thappu percussion.', audio_phonetic: 'Pa-da-ya-ni', district_name: 'Pathanamthitta' },
    { id: 3, term_ml: 'ആറന്മുളക്കണ്ണാടി', transliteration: 'Aranmula Kannadi', meaning_en: 'Handmade front-surface reflective bronze alloy mirror from Aranmula.', cultural_context: 'One of the eight auspicious ritual items (Ashtamangalyam) in Kerala, crafted through secret metallurgy formulas.', audio_phonetic: 'Aaran-mula Kan-naadi', district_name: 'Pathanamthitta' },
    { id: 4, term_ml: 'ഉരു', transliteration: 'Uru', meaning_en: 'Giant handcrafted wooden dhow sailing ship constructed in Beypore.', cultural_context: 'Mastercrafted by Khalasis without written blueprints, used for millennium-old spice routes to the Persian Gulf.', audio_phonetic: 'Oo-roo', district_name: 'Kozhikode' },
    { id: 5, term_ml: 'മുദ്ര', transliteration: 'Mudra', meaning_en: 'Codified hand gestures and symbols used in Kathakali and Koodiyattam classical arts.', cultural_context: 'Governed by the Hastalakshana Deepika text, capable of conveying hundreds of distinct poetic meanings without speech.', audio_phonetic: 'Mood-rah', district_name: 'Thrissur' },
    { id: 6, term_ml: 'കളമെഴുത്ത്', transliteration: 'Kalamezhuthu', meaning_en: 'Sacred pictorial floor mural drawn using organic colored powders.', cultural_context: 'Created inside temple courtyards using five natural powders: rice flour, charcoal, turmeric, leaves, and lime-turmeric blend.', audio_phonetic: 'Ka-la-me-zhuthu', district_name: 'Ernakulam' },
    { id: 7, term_ml: 'മെയ്യുറപ്പ്', transliteration: 'Meiyurappu', meaning_en: 'Suppleness and disciplined body stamina fundamental to Kalaripayattu and Kathakali.', cultural_context: 'The foundational physical mastery of traditional Kerala martial arts and theater through Ayurvedic oil massages and posture drills.', audio_phonetic: 'Mei-yoo-rap-pu', district_name: 'Kannur' },
    { id: 8, term_ml: 'സോപാന സംഗീതം', transliteration: 'Sopana Sangeetham', meaning_en: 'Devotional classical singing style rendered by the flight of temple steps.', cultural_context: 'Rendered by temple musicians (Marars) beating the Edakka drum at the sacred flight of steps (Sopanam) of sanctum sanctorums.', audio_phonetic: 'So-paana San-geetham', district_name: 'Kottayam' },
    { id: 9, term_ml: 'ചുണ്ടൻ വള്ളം', transliteration: 'Chundan Vallam', meaning_en: 'High-prowed war canoe and snake boat raced with 100 oars in Kerala backwaters.', cultural_context: 'Hallowed naval heritage of Kuttanad, propelled synchronously by singing crewmen during the Nehru Trophy Boat Race.', audio_phonetic: 'Chun-dan Val-lam', district_name: 'Alappuzha' },
    { id: 10, term_ml: 'നെട്ടൂർ പെട്ടി', transliteration: 'Nettur Petti', meaning_en: 'Traditional handcrafted wooden jewel casket with pyramid lid and brass fittings.', cultural_context: 'An architectural jewel box designed using teak or rosewood, prized historically by Travancore and Malabar aristocracy.', audio_phonetic: 'Net-toor Pet-ti', district_name: 'Ernakulam' }
  ];

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      const data = await fetchGlossary(search);
      if (isMounted) {
        setTerms(data && data.length > 0 ? data : fallbackTerms);
        setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [search]);

  const filtered = terms.filter(t =>
    t.term_ml.includes(search) ||
    t.transliteration.toLowerCase().includes(search.toLowerCase()) ||
    t.meaning_en.toLowerCase().includes(search.toLowerCase()) ||
    t.cultural_context.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-[#F7F0DF]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#C6A15B]/30">
        <div>
          <span className="text-xs uppercase font-serif tracking-widest text-[#A64F32] font-bold flex items-center space-x-1.5">
            <BookOpen className="w-4 h-4 text-[#A64F32]" />
            <span>Malayalam Linguistic & Cultural Lexicon</span>
          </span>
          <h1 className="font-serif font-black text-4xl sm:text-5xl text-[#405B43] mt-1">
            {t.glossaryTitle}
          </h1>
          <p className="text-sm text-[#392A20]/80 max-w-2xl mt-2 leading-relaxed font-sans">
            {t.glossarySubtitle}
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-[#A64F32] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchGlossary}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#FFFDF6] border border-[#C6A15B]/50 text-[#392A20] text-xs placeholder-[#392A20]/50 focus:border-[#405B43] focus:outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Glossary Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl p-6 bg-[#FFFDF6] border-2 border-[#C6A15B]/35 hover:border-[#405B43] shadow-nalukettu hover:shadow-nalukettu-lg transition-all duration-300 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-malayalam-text font-bold text-3xl text-[#405B43]">
                    {item.term_ml}
                  </h3>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-sm font-serif font-bold text-[#392A20]">
                      {item.transliteration}
                    </span>
                    {item.audio_phonetic && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#E8D8B8] border border-[#C6A15B]/40 text-[#405B43] font-semibold">
                        /{item.audio_phonetic}/
                      </span>
                    )}
                  </div>
                </div>

                {/* Pronunciation Voice Button */}
                <button
                  onClick={() => {
                    if (isSpeaking) {
                      stopSpeaking();
                    } else {
                      speakText(`${item.transliteration}. In Malayalam: ${item.term_ml}. Meaning: ${item.meaning_en}`, 'ml');
                    }
                  }}
                  className="p-2.5 rounded-xl bg-[#E8D8B8]/70 border border-[#C6A15B]/50 hover:bg-[#E8D8B8] text-[#405B43] shadow-sm transition-all"
                  title="Pronounce term"
                  aria-label={`Pronounce ${item.transliteration}`}
                >
                  <Volume2 className="w-4 h-4 text-[#A64F32]" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F7F0DF] border border-[#C6A15B]/30 text-xs text-[#392A20] font-medium leading-relaxed font-sans">
                <strong className="text-[#405B43] font-serif font-bold">Meaning:</strong> {item.meaning_en}
              </div>

              <p className="text-xs text-[#392A20]/80 leading-relaxed font-sans">
                {item.cultural_context}
              </p>
            </div>

            {item.district_name && (
              <div className="pt-3 border-t border-[#C6A15B]/20 flex items-center justify-between text-[11px] text-[#392A20]/70 font-mono">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-[#A64F32]" />
                  <span>Associated District: {item.district_name}</span>
                </span>
                <span className="text-[#A64F32] font-serif font-semibold">Heritage Lexicon</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-sm text-[#392A20]/60 bg-[#FFFDF6] rounded-3xl border border-dashed border-[#C6A15B]/40">
          No cultural terms match your search.
        </div>
      )}

    </div>
  );
}
