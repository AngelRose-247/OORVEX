import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import CulturalCard from '../components/CulturalCard';
import { Hammer, Sparkles, Award, Search } from 'lucide-react';

export default function CraftsGallery({ listings = [], onNavigate }) {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState('');

  const crafts = listings.filter(l =>
    l.category?.slug === 'traditional-crafts' ||
    l.category?.name_en?.toLowerCase().includes('craft')
  );

  const filtered = crafts.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    (c.title_ml && c.title_ml.includes(search)) ||
    (c.locality && c.locality.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-heritage-gold/20">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-heritage-gold font-bold flex items-center space-x-1.5">
            <Hammer className="w-4 h-4 text-heritage-gold" />
            <span>Master Artisanship & GI Legacies</span>
          </span>
          <h1 className="font-serif font-black text-4xl sm:text-5xl text-gold-gradient mt-1">
            {language === 'ml' ? 'പരമ്പരാഗത കരകൗശലങ്ങൾ' : 'Traditional Crafts of Kerala'}
          </h1>
          <p className="text-sm text-heritage-ivory/70 max-w-2xl mt-2">
            {language === 'ml'
              ? 'ആറന്മുള ലോഹക്കണ്ണാടി, ബേപ്പൂർ ഉരു, ബാലരാമപുരം കസവുനെയ്ത്ത്, ചുണ്ടൻ വള്ള നിർമ്മാണം തുടങ്ങിയ അനന്യ കരകൗശല പാരമ്പര്യങ്ങൾ.'
              : 'Discover centuries-old secret metallurgy, ocean-faring wooden dhow architecture, and golden pit-loom textiles awarded Geographical Indication protections.'}
          </p>
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-heritage-gold absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'ml' ? 'കരകൗശലങ്ങൾ തിരയുക...' : 'Search crafts & artisan products...'}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-heritage-forest/60 border border-heritage-gold/30 text-heritage-ivory text-xs placeholder-heritage-ivory/40 focus:border-heritage-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Highlights Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl glass-panel border border-heritage-gold/30 space-y-2">
          <div className="flex items-center space-x-2 text-heritage-gold">
            <Award className="w-5 h-5" />
            <h3 className="font-serif font-bold text-base">Geographical Indication (GI)</h3>
          </div>
          <p className="text-xs text-heritage-ivory/70">
            Protected designations preserving authentic lineage, natural materials, and hereditary artisan guilds.
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-heritage-gold/30 space-y-2">
          <div className="flex items-center space-x-2 text-heritage-gold">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-serif font-bold text-base">Unbroken Oral Geometry</h3>
          </div>
          <p className="text-xs text-heritage-ivory/70">
            Crafted without blueprints, adhering to ancient Tachu Shastra carpentry and metallurgy secrets.
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-heritage-gold/30 space-y-2">
          <div className="flex items-center space-x-2 text-heritage-gold">
            <Hammer className="w-5 h-5" />
            <h3 className="font-serif font-bold text-base">Living Sustainable Materials</h3>
          </div>
          <p className="text-xs text-heritage-ivory/70">
            Nilambur teak, coconut coir fiber, bell-metal bronze, organic cotton, and herbal river dyes.
          </p>
        </div>
      </div>

      {/* Crafts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(craft => (
          <CulturalCard
            key={craft.id}
            listing={craft}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-sm text-heritage-ivory/60">
          No crafts found matching your search.
        </div>
      )}

    </div>
  );
}
