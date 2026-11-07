import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { BookOpen, Volume2, VolumeX, Sparkles, MapPin, ExternalLink } from 'lucide-react';

export default function CulturalStories({ listings = [], onNavigate }) {
  const { language, t } = useLanguage();
  const { speakText, stopSpeaking, isSpeaking } = useAccessibility();

  const stories = listings.filter(l => l.cultural_story && l.cultural_story.length > 50);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="pb-6 border-b border-heritage-gold/20 max-w-3xl space-y-3">
        <span className="text-xs uppercase font-mono tracking-widest text-heritage-gold font-bold flex items-center space-x-1.5">
          <BookOpen className="w-4 h-4 text-heritage-gold" />
          <span>Oral Folklore & Living Mythologies</span>
        </span>
        <h1 className="font-serif font-black text-4xl sm:text-5xl text-gold-gradient">
          {language === 'ml' ? 'കേരളത്തിന്റെ സാംസ്കാരിക കഥകൾ' : 'Cultural Stories & Living Legends'}
        </h1>
        <p className="text-sm text-heritage-ivory/70 leading-relaxed">
          {language === 'ml'
            ? 'തലമുറകളായി വായ്മൊഴിയായും പാട്ടുകളായും പകർന്നുപോന്ന വീരഗാഥകളും ആത്മീയ ഐതിഹ്യങ്ങളും.'
            : 'Every ritual dance and master craft carries oral chronicles of fallen warriors, divine interventions, and village triumphs.'}
        </p>
      </div>

      {/* Stories Timeline/Cards */}
      <div className="space-y-10">
        {stories.map((item, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={item.id}
              className={`rounded-3xl glass-panel border border-heritage-gold/30 p-6 sm:p-10 shadow-xl flex flex-col ${
                isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-8 items-center`}
            >
              {/* Image Frame */}
              <div className="w-full lg:w-1/2 h-72 sm:h-96 rounded-2xl overflow-hidden relative shadow-emerald-deep flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="font-mono bg-heritage-dark/80 px-2.5 py-1 rounded-full text-heritage-gold border border-heritage-gold/40">
                    {item.locality || item.districts?.[0]?.name}
                  </span>
                  <span className="text-[10px] text-white/70">
                    {item.image_credit}
                  </span>
                </div>
              </div>

              {/* Story Narrative */}
              <div className="w-full lg:w-1/2 space-y-4">
                <div className="flex items-center space-x-2 text-xs text-heritage-gold font-mono uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{item.category?.name_en} Chronicle</span>
                </div>

                <h3 className="font-serif font-black text-2xl sm:text-3xl text-heritage-ivory">
                  {language === 'ml' ? item.title_ml : item.title}
                </h3>

                <blockquote className="border-l-2 border-heritage-gold pl-4 text-sm sm:text-base text-heritage-ivory/90 italic leading-relaxed">
                  "{item.cultural_story}"
                </blockquote>

                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      if (isSpeaking) {
                        stopSpeaking();
                      } else {
                        speakText(item.cultural_story, language);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-heritage-forest border border-heritage-gold/30 text-heritage-gold text-xs font-semibold flex items-center space-x-2 hover:border-heritage-gold"
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isSpeaking ? t.stopNarration : t.listenNarration}</span>
                  </button>

                  <button
                    onClick={() => onNavigate(`/cultural-listings/${item.id}`)}
                    className="px-4 py-2 rounded-xl bg-heritage-gold text-heritage-dark text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 hover:brightness-110"
                  >
                    <span>{language === 'ml' ? 'പൂർണ്ണ വിവരണം' : 'Full Cultural Record'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
