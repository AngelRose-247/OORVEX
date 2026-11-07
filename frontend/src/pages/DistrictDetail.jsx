import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePassport } from '../context/PassportContext';
import { useAccessibility } from '../context/AccessibilityContext';
import CulturalCard from '../components/CulturalCard';
import {
  MapPin, Landmark, Award, Volume2, VolumeX, ArrowLeft,
  Sparkles, CheckCircle2, Share2, Compass
} from 'lucide-react';

export default function DistrictDetail({
  districtSlug,
  districts = [],
  listings = [],
  onNavigate
}) {
  const { language, t } = useLanguage();
  const { recordDistrictVisit, collectStamp } = usePassport();
  const { speakText, stopSpeaking, isSpeaking } = useAccessibility();

  const district = districts.find(d => d.slug === districtSlug) || districts[0];

  useEffect(() => {
    if (district) {
      recordDistrictVisit(district.slug);
    }
  }, [district]);

  if (!district) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p>Loading district cultural dossier...</p>
      </div>
    );
  }

  // Filter cultural listings belonging to this district
  const districtListings = listings.filter(l =>
    l.districts && l.districts.some(d => d.slug === district.slug)
  );

  const performingArts = districtListings.filter(l =>
    ['performing-arts', 'classical-arts', 'folk-dances'].includes(l.category?.slug)
  );
  const ritualArts = districtListings.filter(l => l.category?.slug === 'ritual-arts');
  const crafts = districtListings.filter(l => l.category?.slug === 'traditional-crafts');
  const heritagePlaces = districtListings.filter(l => l.category?.slug === 'heritage-places');

  const title = language === 'ml' ? district.name_ml : district.name;
  const description = language === 'ml' ? district.description_ml : district.description_en;

  const handleCollectStamp = () => {
    collectStamp(district.slug, `${district.name} Explorer Stamp`);
  };

  return (
    <div className="w-full space-y-12 pb-20">
      
      {/* Hero Header */}
      <div className="relative h-[480px] w-full overflow-hidden bg-heritage-dark">
        <img
          src={district.hero_image}
          alt={district.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-heritage-dark via-heritage-dark/60 to-black/30" />

        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <button
            onClick={() => onNavigate('/districts')}
            className="px-3.5 py-2 rounded-xl glass-panel text-xs text-heritage-gold font-semibold flex items-center space-x-1.5 hover:border-heritage-gold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'ml' ? 'എല്ലാ ജില്ലകളും' : 'All Districts'}</span>
          </button>
        </div>

        <div className="absolute bottom-10 left-4 sm:left-8 right-4 sm:right-8 max-w-5xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-heritage-gold text-heritage-dark">
              District #{district.order}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-heritage-forest/80 text-heritage-ivory border border-heritage-gold/30">
              HQ: {district.headquarters}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-heritage-forest/80 text-heritage-ivory border border-heritage-gold/30">
              Area: {district.area_sq_km} sq.km
            </span>
          </div>

          <h1 className="font-serif font-black text-4xl sm:text-6xl text-gold-gradient">
            {title}
          </h1>

          <p className="font-serif italic text-lg sm:text-xl text-heritage-ivoryLight">
            {district.tagline}
          </p>

          <div className="text-[10px] text-heritage-ivory/50 font-mono">
            {district.image_credit}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* District Overview Card & Actions */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-heritage-gold/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-heritage-gold/20">
            <h2 className="font-serif font-bold text-2xl text-heritage-gold">
              {language === 'ml' ? 'സാംസ്കാരിക പശ്ചാത്തലം' : 'Cultural Overview & Heritage Character'}
            </h2>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  if (isSpeaking) {
                    stopSpeaking();
                  } else {
                    speakText(description, language);
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-heritage-forest border border-heritage-gold/30 text-heritage-gold text-xs font-semibold flex items-center space-x-1.5 hover:border-heritage-gold"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                <span>{isSpeaking ? t.stopNarration : t.listenNarration}</span>
              </button>

              <button
                onClick={handleCollectStamp}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-heritage-gold to-heritage-goldDark text-heritage-dark font-bold text-xs uppercase tracking-wider shadow-gold-subtle flex items-center space-x-1.5 hover:brightness-110"
              >
                <Award className="w-4 h-4" />
                <span>Collect Stamp</span>
              </button>
            </div>
          </div>

          <p className="text-sm sm:text-base text-heritage-ivory/80 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Ritual Arts Section */}
        {ritualArts.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🔥</span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-heritage-ivory">
                {language === 'ml' ? 'അനുഷ്ഠാന കലകൾ' : 'Ritual Traditions & Sacred Rites'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ritualArts.map(item => (
                <CulturalCard key={item.id} listing={item} onNavigate={onNavigate} />
              ))}
            </div>
          </section>
        )}

        {/* Performing & Classical Arts Section */}
        {performingArts.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎭</span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-heritage-ivory">
                {language === 'ml' ? 'അരങ്ങു കലകളും നൃത്തങ്ങളും' : 'Performing & Classical Arts'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {performingArts.map(item => (
                <CulturalCard key={item.id} listing={item} onNavigate={onNavigate} />
              ))}
            </div>
          </section>
        )}

        {/* Traditional Crafts Section */}
        {crafts.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🏺</span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-heritage-ivory">
                {language === 'ml' ? 'പരമ്പരാഗത കരകൗശലങ്ങൾ' : 'Traditional Crafts & Artisanship'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {crafts.map(item => (
                <CulturalCard key={item.id} listing={item} onNavigate={onNavigate} />
              ))}
            </div>
          </section>
        )}

        {/* Heritage Places & Monuments Section */}
        {heritagePlaces.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🏛️</span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-heritage-ivory">
                {language === 'ml' ? 'പൈതൃക കേന്ദ്രങ്ങൾ' : 'Heritage Places & Architecture'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {heritagePlaces.map(item => (
                <CulturalCard key={item.id} listing={item} onNavigate={onNavigate} />
              ))}
            </div>
          </section>
        )}

        {/* Fallback if few listings in current demo seed */}
        {districtListings.length === 0 && (
          <div className="p-8 rounded-2xl border border-dashed border-heritage-gold/30 text-center space-y-4">
            <p className="text-sm text-heritage-ivory/60">
              More verified records are continuously being verified for {district.name}.
            </p>
            <button
              onClick={() => onNavigate('/contribute')}
              className="px-5 py-2.5 rounded-xl bg-heritage-gold text-heritage-dark font-bold text-xs uppercase"
            >
              Submit a Cultural Record for {district.name}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
