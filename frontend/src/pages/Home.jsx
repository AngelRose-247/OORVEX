import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePassport } from '../context/PassportContext';
import Hero3DCanvas from '../components/Hero3DCanvas';
import KeralaMap from '../components/KeralaMap';
import CulturalCard from '../components/CulturalCard';
import {
  Compass, Sparkles, MapPin, Landmark, BookOpen, Feather,
  ArrowRight, ShieldCheck, ChevronRight, Award, HeartHandshake, Eye
} from 'lucide-react';

export default function Home({
  districts = [],
  listings = [],
  categories = [],
  onNavigate,
  onOpenAI
}) {
  const { language, t } = useLanguage();
  const { progressPercent } = usePassport();

  const featuredListings = listings.filter(l => l.is_featured).slice(0, 6);
  const craftsListings = listings.filter(l => l.category?.slug === 'traditional-crafts').slice(0, 4);

  return (
    <div className="relative w-full overflow-hidden space-y-24 pb-20">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-radial from-heritage-moss/40 via-heritage-dark to-[#040F0D]">
        {/* 3D Three.js Golden Embers Background */}
        <Hero3DCanvas />

        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-heritage-gold/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-heritage-forest/30 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 py-16">
          
          {/* Subtle Heritage Crest Pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-heritage-forest/70 border border-heritage-gold/40 text-heritage-gold shadow-gold-subtle backdrop-blur-md animate-fadeIn">
            <span className="text-sm">🪔</span>
            <span className="text-xs uppercase tracking-widest font-mono font-semibold">
              {language === 'ml' ? 'കേരള സംസ്കാരത്തിന്റെ ഡിജിറ്റൽ ഭൂപടം' : "The Living Culture Map of Kerala"}
            </span>
          </div>

          {/* Main Headings */}
          <div className="space-y-4">
            <h1 className="font-serif font-black text-5xl sm:text-7xl lg:text-8xl tracking-wider text-gold-gradient drop-shadow-2xl">
              OORVEX
            </h1>
            <p className="font-serif italic text-2xl sm:text-3xl text-heritage-ivoryLight font-medium">
              {t.tagline}
            </p>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-heritage-ivory/80 leading-relaxed font-light">
              {t.heroSubtitle}
            </p>
          </div>

          {/* Primary & Secondary Call To Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('/map')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-heritage-goldDark via-heritage-gold to-heritage-goldLight text-heritage-dark font-extrabold text-sm tracking-wider uppercase shadow-gold-glow hover:brightness-110 hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <Compass className="w-4 h-4 text-heritage-dark" />
              <span>{t.exploreKerala}</span>
            </button>

            <button
              onClick={onOpenAI}
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel border border-heritage-gold/60 text-heritage-ivoryLight font-bold text-sm tracking-wider uppercase hover:border-heritage-gold hover:bg-heritage-forest/80 transition-all flex items-center justify-center space-x-2 shadow-emerald-deep"
            >
              <Sparkles className="w-4 h-4 text-heritage-gold" />
              <span>{t.openCultureMatch}</span>
            </button>
          </div>

          {/* Explorer Quick Stats Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="p-3.5 rounded-xl glass-panel border border-heritage-gold/20">
              <span className="font-serif font-bold text-2xl text-heritage-gold">14</span>
              <p className="text-[11px] text-heritage-ivory/70 uppercase font-mono mt-0.5">
                {language === 'ml' ? 'ജില്ലകൾ' : 'Districts'}
              </p>
            </div>
            <div className="p-3.5 rounded-xl glass-panel border border-heritage-gold/20">
              <span className="font-serif font-bold text-2xl text-heritage-gold">400+</span>
              <p className="text-[11px] text-heritage-ivory/70 uppercase font-mono mt-0.5">
                {language === 'ml' ? 'അനുഷ്ഠാന രൂപങ്ങൾ' : 'Ritual Forms'}
              </p>
            </div>
            <div className="p-3.5 rounded-xl glass-panel border border-heritage-gold/20">
              <span className="font-serif font-bold text-2xl text-heritage-gold">100%</span>
              <p className="text-[11px] text-heritage-ivory/70 uppercase font-mono mt-0.5">
                {language === 'ml' ? 'സാക്ഷ്യപ്പെടുത്തിയത്' : 'Verified Archives'}
              </p>
            </div>
            <div className="p-3.5 rounded-xl glass-panel border border-heritage-gold/20">
              <span className="font-serif font-bold text-2xl text-heritage-gold">EN / ML</span>
              <p className="text-[11px] text-heritage-ivory/70 uppercase font-mono mt-0.5">
                {language === 'ml' ? 'ദ്വിഭാഷാ സംവിധാനം' : 'Bilingual Engine'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE KERALA MAP SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-heritage-gold font-bold">
              PS-05 Discovery & Mapping
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-heritage-ivory mt-1">
              {t.interactiveMap}
            </h2>
            <p className="text-sm text-heritage-ivory/70 max-w-xl mt-1">
              {language === 'ml'
                ? 'കേരളത്തിലെ 14 ജില്ലകളിലെയും തനത് കലാരൂപങ്ങളും കരകൗശല വിദ്യകളും പൈതൃക കേന്ദ്രങ്ങളും ഭൂപടത്തിലൂടെ നേരിട്ട് കണ്ടെത്തുക.'
                : "Explore authentic geographic boundaries, cultural clusters, and verified ritual locations across God's Own Country."}
            </p>
          </div>

          <button
            onClick={() => onNavigate('/map')}
            className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-heritage-forest/80 border border-heritage-gold/40 text-heritage-gold hover:border-heritage-gold text-xs font-semibold flex items-center space-x-2 transition-all"
          >
            <span>{language === 'ml' ? 'പൂർണ്ണ ഭൂപടം തുറക്കുക' : 'Full Screen Map'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Embedded Live Map Component */}
        <KeralaMap
          districts={districts}
          listings={listings}
          categories={categories}
          onNavigate={onNavigate}
        />
      </section>

      {/* 3. EXPLORE ALL 14 DISTRICTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-heritage-gold font-bold">
              Regional Heritage
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-heritage-ivory mt-1">
              {language === 'ml' ? '14 ജില്ലകളിലൂടെ ഒരു സാംസ്കാരിക യാത്ര' : 'The 14 Districts of Kerala'}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/districts')}
            className="text-xs text-heritage-gold hover:underline flex items-center space-x-1"
          >
            <span>{language === 'ml' ? 'എല്ലാ ജില്ലകളും' : 'View All Districts'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {districts.slice(0, 8).map((d) => (
            <div
              key={d.slug}
              onClick={() => onNavigate(`/districts/${d.slug}`)}
              className="group relative rounded-2xl overflow-hidden glass-panel border border-heritage-gold/25 hover:border-heritage-gold shadow-md hover:shadow-gold-subtle transition-all duration-300 cursor-pointer h-72 flex flex-col justify-end p-5"
            >
              <img
                src={d.hero_image}
                alt={d.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040F0D] via-heritage-dark/60 to-transparent" />

              <div className="relative z-10 space-y-1">
                <span className="text-[10px] text-heritage-gold font-mono uppercase">
                  District #{d.order} • {d.listings_count || 3} Records
                </span>
                <h3 className="font-serif font-bold text-xl text-heritage-ivory group-hover:text-gold-gradient transition-colors">
                  {language === 'ml' ? d.name_ml : d.name}
                </h3>
                <p className="text-xs text-heritage-ivory/70 line-clamp-2">
                  {d.tagline}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DISCOVER TRADITIONAL ARTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-heritage-gold font-bold">
              Living Masterpieces
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-heritage-ivory mt-1">
              {language === 'ml' ? 'അരങ്ങു കലകളും അനുഷ്ഠാന രൂപങ്ങളും' : 'Performing & Ritual Arts'}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/listings')}
            className="text-xs text-heritage-gold hover:underline flex items-center space-x-1"
          >
            <span>{language === 'ml' ? 'എല്ലാ കലാരൂപങ്ങളും' : 'Explore All Arts'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredListings.map((item) => (
            <CulturalCard
              key={item.id}
              listing={item}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </section>

      {/* 5. CULTUREMATCH AI INTERACTIVE PROMO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-heritage-gold/40 p-8 md:p-12 shadow-2xl bg-gradient-to-br from-heritage-forest/60 via-heritage-dark to-[#040F0D]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-heritage-gold/20 text-heritage-gold border border-heritage-gold/30 text-xs font-mono font-bold">
                <Sparkles className="w-4 h-4" />
                <span>CultureMatch AI Assistant</span>
              </div>

              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-heritage-ivory leading-tight">
                {language === 'ml'
                  ? 'ചരിത്രസത്യങ്ങളിൽ ഉറച്ചുനിൽക്കുന്ന സാംസ്കാരിക എ.ഐ. സഹായി'
                  : 'Retrieval-Grounded AI That Never Hallucinates Heritage'}
              </h2>

              <p className="text-sm text-heritage-ivory/80 leading-relaxed">
                {language === 'ml'
                  ? 'സാക്ഷ്യപ്പെടുത്തിയ ആർക്കൈവുകൾ മാത്രം ഉദ്ധരിച്ച് നിങ്ങളുടെ സംശയങ്ങൾക്ക് കൃത്യമായ വിവരങ്ങൾ നൽകുന്നു. ഓരോ ഉത്തരത്തിനും ഒപ്പം യഥാർത്ഥ ഉറവിടങ്ങളും ഭൂപട സ്ഥാനങ്ങളും ലഭ്യമാക്കുന്നു.'
                  : 'Unlike general chatbots that fabricate folklore or dates, CultureMatch searches verified Kerala cultural databases first, providing authentic explanations with genuine archival citations.'}
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={onOpenAI}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-heritage-gold to-heritage-goldDark text-heritage-dark font-extrabold text-xs uppercase tracking-wider shadow-gold-subtle hover:brightness-110 flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t.openCultureMatch}</span>
                </button>
                <button
                  onClick={() => onNavigate('/glossary')}
                  className="px-6 py-3.5 rounded-xl bg-heritage-forest/80 border border-heritage-gold/40 text-heritage-ivory hover:border-heritage-gold text-xs font-semibold"
                >
                  {t.navGlossary}
                </button>
              </div>
            </div>

            {/* Prompt preview simulator card */}
            <div className="p-6 rounded-2xl glass-panel-dark border border-heritage-gold/30 space-y-4 shadow-xl">
              <div className="flex items-center space-x-2 text-xs text-heritage-gold font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>CultureMatch Engine Grounded Pipeline</span>
              </div>
              <div className="p-3.5 rounded-xl bg-heritage-forest/40 border border-heritage-gold/20 text-xs text-heritage-ivory/80">
                "What makes Aranmula Kannadi metal mirror so unique compared to ordinary glass?"
              </div>
              <div className="p-3.5 rounded-xl bg-heritage-dark/80 border border-heritage-gold/30 text-xs text-heritage-ivory/90 space-y-2">
                <p>
                  <strong>CultureMatch:</strong> Aranmula Kannadi (Record #4) is a front-surface metal alloy mirror produced in Pathanamthitta. Unlike glass mirrors that reflect from the rear coating, reflection occurs directly on its burnished copper-tin alloy surface with zero parallax distortion.
                </p>
                <div className="text-[10px] text-heritage-gold font-mono border-t border-heritage-gold/20 pt-1.5 flex items-center justify-between">
                  <span>Source: GI Registry India #KFA-AM-04</span>
                  <span className="text-emerald-400">100% Grounded</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRADITIONAL CRAFTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-heritage-gold font-bold">
              Artisan Legacies
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-heritage-ivory mt-1">
              {language === 'ml' ? 'പരമ്പരാഗത കരകൗശല വിദ്യകൾ' : 'Traditional Crafts & Artisanship'}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/crafts')}
            className="text-xs text-heritage-gold hover:underline flex items-center space-x-1"
          >
            <span>{language === 'ml' ? 'എല്ലാ കരകൗശലങ്ങളും' : 'View All Crafts'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {craftsListings.map((item) => (
            <CulturalCard
              key={item.id}
              listing={item}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </section>

      {/* 7. COMMUNITY CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-heritage-gold/30 p-8 sm:p-12 text-center space-y-6 bg-gradient-radial from-heritage-forest/50 via-heritage-dark to-heritage-dark shadow-emerald-deep">
          <div className="inline-flex p-3 rounded-full bg-heritage-gold/20 text-heritage-gold border border-heritage-gold/40">
            <HeartHandshake className="w-8 h-8" />
          </div>

          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-heritage-ivory">
            {language === 'ml' ? 'നിങ്ങളുടെ നാട്ടിലെ പൈതൃകം പങ്കുവെക്കൂ' : 'Help Document Kerala’s Living Traditions'}
          </h2>

          <p className="max-w-2xl mx-auto text-sm text-heritage-ivory/70 leading-relaxed">
            {language === 'ml'
              ? 'ഓരോ ഗ്രാമത്തിലും അന്യംനിന്നുപോകുന്ന നാടോടി കലകളും നിർമ്മാണ വിദ്യകളും ഉണ്ട്. അവയെ വരുംതലമുറകൾക്കായി അടയാളപ്പെടുത്താൻ ഞങ്ങളോടൊപ്പം ചേരൂ.'
              : 'Do you know a local temple ritual, an endangered tribal weaving art, or an oral folktale from your village? Submit it for curator review and help build the permanent cultural map.'}
          </p>

          <button
            onClick={() => onNavigate('/contribute')}
            className="px-8 py-3.5 rounded-xl bg-heritage-gold hover:bg-heritage-goldLight text-heritage-dark font-extrabold text-xs uppercase tracking-wider shadow-gold-subtle transition-all"
          >
            {t.navContribute}
          </button>
        </div>
      </section>

    </div>
  );
}
