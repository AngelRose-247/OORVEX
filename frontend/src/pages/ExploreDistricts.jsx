import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePassport } from '../context/PassportContext';
import { Landmark, Search, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-heritage-gold/20">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-heritage-gold font-bold">
            Geographical Exploration
          </span>
          <h1 className="font-serif font-black text-4xl sm:text-5xl text-gold-gradient mt-1">
            {language === 'ml' ? 'കേരളത്തിലെ 14 ജില്ലകൾ' : 'The 14 Districts of Kerala'}
          </h1>
          <p className="text-sm text-heritage-ivory/70 max-w-2xl mt-2">
            {language === 'ml'
              ? 'കാസർഗോഡ് മുതൽ തിരുവനന്തപുരം വരെ നീളുന്ന 14 ജില്ലകളിലെ സാംസ്കാരിക തനിമയും ചരിത്രപ്പെരുമയും.'
              : 'From the northern ramparts of Bekal in Kasaragod to the southern seat of Travancore in Thiruvananthapuram.'}
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-heritage-gold absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'ml' ? 'ജില്ല തിരയുക...' : 'Search districts...'}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-heritage-forest/60 border border-heritage-gold/30 text-heritage-ivory text-xs placeholder-heritage-ivory/40 focus:border-heritage-gold focus:outline-none"
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
              className="group rounded-2xl overflow-hidden glass-panel border border-heritage-gold/25 hover:border-heritage-gold shadow-lg hover:shadow-gold-subtle transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Hero Image */}
                <div className="relative h-52 w-full overflow-hidden bg-heritage-dark">
                  <img
                    src={d.hero_image}
                    alt={d.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-heritage-dark via-transparent to-black/40" />

                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase bg-heritage-dark/80 text-heritage-gold border border-heritage-gold/40">
                      #{d.order} • {d.headquarters}
                    </span>
                  </div>

                  {isVisited && (
                    <div className="absolute top-3 right-3 flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-heritage-gold text-heritage-dark text-[10px] font-bold shadow-gold-subtle">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Explored</span>
                    </div>
                  )}

                  <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded text-[8px] text-white/60">
                    {d.image_credit}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-2.5">
                  <h3 className="font-serif font-bold text-2xl text-heritage-ivory group-hover:text-gold-gradient transition-colors">
                    {language === 'ml' ? d.name_ml : d.name}
                  </h3>

                  <p className="text-xs font-medium text-heritage-gold/90 line-clamp-1 italic">
                    {d.tagline}
                  </p>

                  <p className="text-xs text-heritage-ivory/70 line-clamp-3 leading-relaxed">
                    {language === 'ml' ? d.description_ml : d.description_en}
                  </p>
                </div>
              </div>

              {/* District Stats Bar */}
              <div className="px-5 pb-5 pt-3 border-t border-heritage-gold/15 flex items-center justify-between text-xs">
                <span className="text-[11px] text-heritage-ivory/60 font-mono">
                  {d.listings_count || 3} Heritage Records
                </span>
                <span className="text-heritage-gold font-semibold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>{language === 'ml' ? 'തുറക്കുക' : 'Open Dossier'}</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
