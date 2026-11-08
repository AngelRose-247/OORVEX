import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePassport } from '../context/PassportContext';
import { Landmark, Search, MapPin, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import SafeImage from '../components/SafeImage';

export default function ExploreDistricts({ districts = [], onNavigate }) {
  const { language, t } = useLanguage();
  const { visitedDistricts, recordDistrictVisit } = usePassport();
  const [search, setSearch] = useState('');

  const filtered = districts.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    (d.name_ml && d.name_ml.includes(search)) ||
    (d.headquarters && d.headquarters.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-[#F7F0DF]">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#C6A15B]/30">
        <div>
          <span className="text-xs uppercase font-serif tracking-widest text-[#A64F32] font-bold flex items-center space-x-1.5">
            <Landmark className="w-4 h-4 text-[#A64F32]" />
            <span>Geographical Cultural Exploration</span>
          </span>
          <h1 className="font-serif font-black text-4xl sm:text-5xl text-[#405B43] mt-1">
            {language === 'ml' ? 'കേരളത്തിലെ 14 ജില്ലകൾ' : 'The 14 Districts of Kerala'}
          </h1>
          <p className="text-sm text-[#392A20]/80 max-w-2xl mt-2 leading-relaxed font-sans">
            {language === 'ml'
              ? 'കാസർഗോഡ് മുതൽ തിരുവനന്തപുരം വരെ നീളുന്ന 14 ജില്ലകളിലെ സാംസ്കാരിക തനിമയും ചരിത്രപ്പെരുമയും.'
              : 'Select any district to discover its authentic ritual arts, documented folklore, and verified cultural places.'}
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-[#A64F32] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'ml' ? 'ജില്ല തിരയുക...' : 'Search districts...'}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#FFFDF6] border border-[#C6A15B]/50 text-[#392A20] text-xs placeholder-[#392A20]/50 focus:border-[#405B43] focus:outline-none shadow-sm"
          />
        </div>
      </div>

      {/* District Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((d) => {
          const isVisited = visitedDistricts.includes(d.slug);
          return (
            <div
              key={d.slug}
              onClick={() => {
                recordDistrictVisit(d.slug);
                onNavigate(`/districts/${d.slug}`);
              }}
              className="group rounded-2xl overflow-hidden bg-[#FFFDF6] border border-[#C6A15B]/40 hover:border-[#405B43] shadow-nalukettu hover:shadow-nalukettu-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Hero Image */}
                <div className="relative h-52 w-full overflow-hidden bg-[#E8D8B8]">
                  <SafeImage
                    src={d.hero_image}
                    alt={d.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />

                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase bg-[#FFFDF6]/95 text-[#405B43] border border-[#C6A15B]/50 shadow-sm backdrop-blur-sm">
                      #{d.order} • {d.headquarters}
                    </span>
                  </div>

                  {isVisited && (
                    <div className="absolute top-3 right-3 flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#405B43] text-white text-[10px] font-bold shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C6A15B]" />
                      <span>Explored</span>
                    </div>
                  )}

                  <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-0.5 rounded text-[8px] text-white/80 font-mono">
                    {d.image_credit}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-2.5">
                  <h3 className="font-serif font-bold text-2xl text-[#405B43] group-hover:text-[#A64F32] transition-colors">
                    {language === 'ml' ? d.name_ml : d.name}
                  </h3>

                  <p className="text-xs font-serif italic text-[#A64F32] line-clamp-1">
                    {d.tagline}
                  </p>

                  <p className="text-xs text-[#392A20]/80 line-clamp-3 leading-relaxed font-sans">
                    {language === 'ml' ? d.description_ml : d.description_en}
                  </p>
                </div>
              </div>

              {/* District Stats Bar */}
              <div className="px-5 pb-5 pt-3 border-t border-[#C6A15B]/20 flex items-center justify-between text-xs bg-[#F7F0DF]/60">
                <span className="text-[11px] text-[#392A20]/70 font-mono">
                  {d.listings_count || 3} Heritage Records
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    recordDistrictVisit(d.slug);
                    onNavigate(`/districts/${d.slug}`);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#C6A15B] hover:bg-[#AB8742] text-[#123B32] font-serif font-bold text-xs flex items-center space-x-1 shadow-kasavu transition-all"
                >
                  <span>{language === 'ml' ? 'തുറക്കുക' : 'Open Dossier'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
