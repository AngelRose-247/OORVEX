import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldCheck, Landmark, Sparkles, HeartHandshake, MapPin, Feather,
  Compass, Award, Globe, Code
} from 'lucide-react';

export default function AboutPage({ onNavigate }) {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 bg-[#F7F0DF]">
      
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs uppercase font-serif tracking-widest text-[#A64F32] font-bold">
          Digital Cultural Heritage Platform
        </span>
        <h1 className="font-serif font-black text-5xl sm:text-6xl text-[#405B43]">
          About OORVEX
        </h1>
        <p className="font-serif italic text-2xl text-[#C6A15B]">
          Mapping Heritage. Connecting Generations.
        </p>
        <p className="text-sm text-[#392A20]/80 leading-relaxed font-normal font-sans">
          {t.heroSubtitle}
        </p>
      </div>

      {/* Mission & Core Pillars */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#FFFDF6] border-2 border-[#C6A15B]/40 shadow-nalukettu space-y-6">
        <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#405B43] border-b border-[#C6A15B]/25 pb-3">
          Cultural Preservation Mission
        </h2>

        <p className="text-sm text-[#392A20]/85 leading-relaxed font-sans">
          OORVEX is an independent digital sanctuary and interactive cultural atlas dedicated to the documentation, safeguarding, and celebration of the living traditions, sacred rituals, and artisan lineages of Kerala, India.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-[#F7F0DF] border border-[#C6A15B]/35 space-y-3">
            <div className="flex items-center space-x-2 text-[#405B43]">
              <Compass className="w-5 h-5 text-[#A64F32]" />
              <h3 className="font-bold text-base font-serif">The Living Culture Map</h3>
            </div>
            <p className="text-xs text-[#392A20]/80 leading-relaxed font-sans">
              Interactive geographic and cultural discovery covering all 14 districts of Kerala, authentic GeoJSON boundary layers, verified cultural locations, and clear delineation between places of origin and practicing districts.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F7F0DF] border border-[#C6A15B]/35 space-y-3">
            <div className="flex items-center space-x-2 text-[#405B43]">
              <Globe className="w-5 h-5 text-[#A64F32]" />
              <h3 className="font-bold text-base font-serif">Linguistic & Sensory Accessibility</h3>
            </div>
            <p className="text-xs text-[#392A20]/80 leading-relaxed font-sans">
              Complete bilingual Malayalam and English content parity, an interactive cultural glossary with phonetics, and comprehensive accessibility controls including voice narration, high contrast, and reduced motion.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#E8D8B8]/60 border border-[#C6A15B]/30 text-xs text-[#392A20] font-serif">
          <strong>Design Philosophy:</strong> Traditional in Expression. Contemporary in Layout. Functional in Interaction.
        </div>
      </div>

      {/* Cultural Data Integrity Pledge */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#FFFDF6] border-2 border-[#C6A15B]/40 shadow-nalukettu space-y-6">
        <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#405B43] border-b border-[#C6A15B]/25 pb-3">
          Strict Cultural Data Integrity Principles
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#392A20]/80 font-sans">
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-sm text-[#405B43] flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-[#405B43]" />
              <span>Zero Hallucinations</span>
            </h4>
            <p className="leading-relaxed text-[#392A20]/75">
              CultureMatch AI strictly retrieves verified database records first and responds only with sourced facts, listing IDs, and verified citations.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-serif font-bold text-sm text-[#405B43] flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-[#A64F32]" />
              <span>Authentic Photography</span>
            </h4>
            <p className="leading-relaxed text-[#392A20]/75">
              All photographs carry authentic attribution from Wikimedia Commons, ASI, or licensed repositories. No AI-generated artwork is presented as documentary photography.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-serif font-bold text-sm text-[#405B43] flex items-center space-x-1.5">
              <HeartHandshake className="w-4 h-4 text-[#A64F32]" />
              <span>Curated Moderation</span>
            </h4>
            <p className="leading-relaxed text-[#392A20]/75">
              Community submissions follow an explicit PENDING → REVIEW → APPROVE workflow to safeguard sacred traditions and prevent misinformation.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('/map')}
          className="px-8 py-3.5 rounded-2xl bg-[#C6A15B] hover:bg-[#AB8742] text-[#123B32] font-serif font-bold text-xs uppercase tracking-wider shadow-kasavu transition-all"
        >
          Explore the Living Culture Map
        </button>
      </div>

    </div>
  );
}
