import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldCheck, Landmark, Sparkles, HeartHandshake, MapPin, Feather,
  Compass, Award, Globe, Code
} from 'lucide-react';

export default function AboutPage({ onNavigate }) {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs uppercase font-mono tracking-widest text-heritage-gold font-bold">
          The Living Culture Map of Kerala
        </span>
        <h1 className="font-serif font-black text-5xl sm:text-6xl text-gold-gradient">
          About OORVEX
        </h1>
        <p className="font-serif italic text-2xl text-heritage-ivoryLight">
          Mapping Heritage. Connecting Generations.
        </p>
        <p className="text-sm text-heritage-ivory/80 leading-relaxed font-light">
          {t.heroSubtitle}
        </p>
      </div>

      {/* Problem Statement Card */}
      <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-heritage-gold/30 space-y-6">
        <h2 className="font-serif font-bold text-2xl sm:text-3xl text-heritage-gold border-b border-heritage-gold/20 pb-3">
          Hackathon Problem Statements & Mission
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-heritage-forest/50 border border-heritage-gold/25 space-y-3">
            <div className="flex items-center space-x-2 text-heritage-gold">
              <Compass className="w-5 h-5" />
              <h3 className="font-bold text-base font-serif">PS-05 – Discovery & Mapping</h3>
            </div>
            <p className="text-xs text-heritage-ivory/80 leading-relaxed">
              <strong>The Living Culture Map:</strong> Interactive geographic and cultural discovery covering all 14 districts of Kerala, GeoJSON boundary layers, distinct practicing vs origin locales, and verified archival records.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-heritage-forest/50 border border-heritage-gold/25 space-y-3">
            <div className="flex items-center space-x-2 text-heritage-gold">
              <Globe className="w-5 h-5" />
              <h3 className="font-bold text-base font-serif">PS-04 – Language & Accessibility</h3>
            </div>
            <p className="text-xs text-heritage-ivory/80 leading-relaxed">
              <strong>Culture in Every Voice:</strong> Full bilingual English and Malayalam interface, cultural glossary with phonetics, WCAG 2.1 AA accessibility controls (high contrast, font scaling, reduced motion), and speech synthesis audio narration.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-heritage-dark/80 border border-heritage-gold/20 text-xs text-heritage-ivory/70 font-mono">
          <strong>Hackathon Theme:</strong> Traditional in Expression. Contemporary in Layout. Functional in Interaction.
        </div>
      </div>

      {/* Cultural Data Integrity Pledge */}
      <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-heritage-gold/30 space-y-6">
        <h2 className="font-serif font-bold text-2xl sm:text-3xl text-heritage-gold border-b border-heritage-gold/20 pb-3">
          Strict Cultural Data Integrity Principles
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-heritage-ivory/80">
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-sm text-heritage-gold flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero Hallucinations</span>
            </h4>
            <p className="leading-relaxed text-heritage-ivory/70">
              CultureMatch AI strictly retrieves verified database records first and responds only with sourced facts, listing IDs, and verified citations.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-serif font-bold text-sm text-heritage-gold flex items-center space-x-1.5">
              <Award className="w-4 h-4" />
              <span>Authentic Photography</span>
            </h4>
            <p className="leading-relaxed text-heritage-ivory/70">
              All images carry authentic attribution from Wikimedia Commons, ASI, or licensed repositories. No AI-generated art is masqueraded as documentary record.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-serif font-bold text-sm text-heritage-gold flex items-center space-x-1.5">
              <HeartHandshake className="w-4 h-4" />
              <span>Community Moderation</span>
            </h4>
            <p className="leading-relaxed text-heritage-ivory/70">
              Community submissions follow an explicit PENDING → REVIEW → APPROVE workflow to safeguard sacred traditions and prevent misinformation.
            </p>
          </div>
        </div>
      </div>

      {/* Technical Architecture */}
      <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-heritage-gold/30 space-y-6">
        <h2 className="font-serif font-bold text-2xl sm:text-3xl text-heritage-gold border-b border-heritage-gold/20 pb-3">
          System Architecture
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-heritage-forest/60 border border-heritage-gold/20 space-y-1">
            <span className="text-heritage-gold font-bold">Frontend UI</span>
            <p className="text-heritage-ivory/70">React 18, Vite, Tailwind CSS, Three.js 3D, Leaflet GeoJSON</p>
          </div>
          <div className="p-4 rounded-xl bg-heritage-forest/60 border border-heritage-gold/20 space-y-1">
            <span className="text-heritage-gold font-bold">Backend API</span>
            <p className="text-heritage-ivory/70">Python 3.12, Django 6, Django REST Framework, SQLite</p>
          </div>
          <div className="p-4 rounded-xl bg-heritage-forest/60 border border-heritage-gold/20 space-y-1">
            <span className="text-heritage-gold font-bold">AI Intelligence</span>
            <p className="text-heritage-ivory/70">Google Gemini API, Retrieval-Grounded Generation, Search Fallback</p>
          </div>
          <div className="p-4 rounded-xl bg-heritage-forest/60 border border-heritage-gold/20 space-y-1">
            <span className="text-heritage-gold font-bold">Accessibility</span>
            <p className="text-heritage-ivory/70">WCAG 2.1 AA, Web Speech API, High Contrast, Reduced Motion</p>
          </div>
        </div>
      </div>

    </div>
  );
}
