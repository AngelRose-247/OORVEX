import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { BookOpen, Volume2, VolumeX, Sparkles, MapPin, ExternalLink } from 'lucide-react';
import SafeImage from '../components/SafeImage';

export default function CulturalStories({ listings = [], onNavigate }) {
  const { language, t } = useLanguage();
  const { speakText, stopSpeaking, isSpeaking } = useAccessibility();

  const stories = listings.filter(l => l.cultural_story && l.cultural_story.length > 50);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-[#F7F0DF]">
      
      {/* Header */}
      <div className="pb-6 border-b border-[#C6A15B]/30 max-w-3xl space-y-3">
        <span className="text-xs uppercase font-serif tracking-widest text-[#A64F32] font-bold flex items-center space-x-1.5">
          <BookOpen className="w-4 h-4 text-[#A64F32]" />
          <span>Oral Folklore & Living Mythologies</span>
        </span>
        <h1 className="font-serif font-black text-4xl sm:text-5xl text-[#405B43]">
          {language === 'ml' ? 'കേരളത്തിന്റെ സാംസ്കാരിക കഥകൾ' : 'Cultural Stories & Living Legends'}
        </h1>
        <p className="text-sm text-[#392A20]/80 leading-relaxed font-sans">
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
              className={`rounded-3xl bg-[#FFFDF6] border-2 border-[#C6A15B]/40 p-6 sm:p-10 shadow-nalukettu flex flex-col ${
                isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-8 items-center`}
            >
              {/* Image Frame */}
              <div className="w-full lg:w-1/2 h-72 sm:h-96 rounded-2xl overflow-hidden relative shadow-md flex-shrink-0 bg-[#E8D8B8]">
                <SafeImage
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="font-mono bg-black/60 px-2.5 py-1 rounded-full text-[#C6A15B] border border-white/20 backdrop-blur-sm">
                    {item.locality || item.districts?.[0]?.name}
                  </span>
                  <span className="text-[10px] text-white/80 font-mono">
                    {item.image_credit}
                  </span>
                </div>
              </div>

              {/* Story Narrative */}
              <div className="w-full lg:w-1/2 space-y-4">
                <div className="flex items-center space-x-2 text-xs text-[#405B43] font-serif font-bold uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-[#A64F32]" />
                  <span>{item.category?.name_en} Chronicle</span>
                </div>

                <h3 className="font-serif font-black text-2xl sm:text-3xl text-[#405B43]">
                  {language === 'ml' ? item.title_ml : item.title}
                </h3>

                <blockquote className="border-l-3 border-[#A64F32] pl-4 text-sm sm:text-base text-[#392A20]/85 italic leading-relaxed">
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
                    className="px-4 py-2 rounded-xl bg-[#E8D8B8]/60 border border-[#C6A15B]/50 text-[#405B43] text-xs font-bold flex items-center space-x-2 hover:bg-[#E8D8B8] transition-all shadow-sm"
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-red-600" /> : <Volume2 className="w-3.5 h-3.5 text-[#A64F32]" />}
                    <span>{isSpeaking ? t.stopNarration : t.listenNarration}</span>
                  </button>

                  <button
                    onClick={() => onNavigate(`/cultural-listings/${item.id}`)}
                    className="px-4 py-2 rounded-xl bg-[#C6A15B] hover:bg-[#AB8742] text-[#123B32] text-xs font-serif font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-kasavu transition-all"
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
