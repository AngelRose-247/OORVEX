import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePassport } from '../context/PassportContext';
import {
  Compass, Award, CheckCircle2, X, MapPin, Sparkles, BookOpen, ExternalLink
} from 'lucide-react';

export default function PassportDrawer({ onNavigate }) {
  const { language, t } = useLanguage();
  const {
    visitedDistricts,
    collectedStamps,
    progressPercent,
    totalDistricts,
    isOpen,
    setIsOpen
  } = usePassport();

  if (!isOpen) return null;

  const districtNames = [
    { slug: 'kasaragod', name: 'Kasaragod', ml: 'കാസർഗോഡ്' },
    { slug: 'kannur', name: 'Kannur', ml: 'കണ്ണൂർ' },
    { slug: 'wayanad', name: 'Wayanad', ml: 'വയനാട്' },
    { slug: 'kozhikode', name: 'Kozhikode', ml: 'കോഴിക്കോട്' },
    { slug: 'malappuram', name: 'Malappuram', ml: 'മലപ്പുറം' },
    { slug: 'palakkad', name: 'Palakkad', ml: 'പാലക്കാട്' },
    { slug: 'thrissur', name: 'Thrissur', ml: 'തൃശ്ശൂർ' },
    { slug: 'ernakulam', name: 'Ernakulam', ml: 'എറണാകുളം' },
    { slug: 'idukki', name: 'Idukki', ml: 'ഇടുക്കി' },
    { slug: 'kottayam', name: 'Kottayam', ml: 'കോട്ടയം' },
    { slug: 'alappuzha', name: 'Alappuzha', ml: 'ആലപ്പുഴ' },
    { slug: 'pathanamthitta', name: 'Pathanamthitta', ml: 'പത്തനംതിട്ട' },
    { slug: 'kollam', name: 'Kollam', ml: 'കൊല്ലം' },
    { slug: 'thiruvananthapuram', name: 'Thiruvananthapuram', ml: 'തിരുവനന്തപുരം' },
  ];

  const getRankBadge = () => {
    if (progressPercent >= 80) return { title: 'Heritage Grandmaster', icon: '🏆', color: 'text-heritage-gold' };
    if (progressPercent >= 40) return { title: 'Cultural Adept', icon: '🎖️', color: 'text-yellow-400' };
    return { title: 'Cultural Wanderer', icon: '🧭', color: 'text-heritage-ivory' };
  };

  const rank = getRankBadge();

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md h-full bg-[#081814] border-l border-heritage-gold/30 p-6 overflow-y-auto shadow-2xl flex flex-col justify-between space-y-6">
        
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-heritage-gold/25">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-heritage-gold to-heritage-goldDark p-0.5">
                <div className="w-full h-full rounded-full bg-heritage-dark flex items-center justify-center text-lg">
                  📜
                </div>
              </div>
              <div>
                <h3 className="font-serif font-black text-xl text-gold-gradient">
                  {t.passportTitle}
                </h3>
                <p className="text-xs text-heritage-ivory/60 font-mono">
                  {t.passportSubtitle}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-heritage-ivory/60 hover:text-heritage-gold hover:bg-heritage-forest"
              aria-label="Close Passport"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-heritage-forest/80 to-heritage-dark border border-heritage-gold/30 shadow-gold-subtle space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{rank.icon}</span>
                <span className="text-xs font-bold text-heritage-gold uppercase tracking-wider">
                  {rank.title}
                </span>
              </div>
              <span className="font-mono text-sm font-bold text-heritage-gold">
                {visitedDistricts.length} / {totalDistricts}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 rounded-full bg-heritage-dark border border-heritage-gold/30 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-heritage-goldDark via-heritage-gold to-heritage-goldLight transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-[11px] text-heritage-ivory/70 flex items-center justify-between">
              <span>{progressPercent}% of Kerala explored</span>
              <span>{collectedStamps.length} stamps collected</span>
            </p>
          </div>

          {/* Collected Digital Cultural Stamps */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-heritage-gold flex items-center space-x-2">
              <Award className="w-4 h-4 text-heritage-gold" />
              <span>{t.stampsCollected}</span>
            </h4>

            {collectedStamps.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-heritage-gold/30 text-center text-xs text-heritage-ivory/50">
                Explore individual art forms, crafts, and stories to collect digital heritage stamps!
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {collectedStamps.map((stamp, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-heritage-forest/60 border border-heritage-gold/40 flex items-center space-x-2 shadow-gold-subtle"
                  >
                    <div className="w-7 h-7 rounded-full bg-heritage-gold/20 border border-heritage-gold flex items-center justify-center text-xs">
                      🪔
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-heritage-ivory truncate">{stamp.title}</p>
                      <p className="text-[9px] text-heritage-gold/70 font-mono">{stamp.collectedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Districts Explored Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-heritage-gold flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-heritage-gold" />
              <span>{t.districtsExplored}</span>
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {districtNames.map((d) => {
                const isVisited = visitedDistricts.includes(d.slug);
                return (
                  <button
                    key={d.slug}
                    onClick={() => {
                      setIsOpen(false);
                      onNavigate(`/districts/${d.slug}`);
                    }}
                    className={`p-2 rounded-xl text-left border flex items-center justify-between transition-all ${
                      isVisited
                        ? 'bg-heritage-gold/15 border-heritage-gold/60 text-heritage-gold font-semibold'
                        : 'bg-heritage-forest/40 border-heritage-gold/20 text-heritage-ivory/60 hover:border-heritage-gold/40'
                    }`}
                  >
                    <span className="truncate">
                      {language === 'ml' ? d.ml : d.name}
                    </span>
                    {isVisited ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-heritage-gold flex-shrink-0 ml-1" />
                    ) : (
                      <span className="text-[10px] text-heritage-ivory/30">visit</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-heritage-gold/20">
          <button
            onClick={() => {
              setIsOpen(false);
              onNavigate('/map');
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-heritage-gold to-heritage-goldDark text-heritage-dark font-bold text-xs uppercase tracking-wider shadow-gold-subtle hover:brightness-110 flex items-center justify-center space-x-2"
          >
            <span>{t.interactiveMap}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
