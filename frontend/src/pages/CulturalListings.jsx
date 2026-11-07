import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import CulturalCard from '../components/CulturalCard';
import { Search, Filter, Feather, Sparkles, X } from 'lucide-react';

export default function CulturalListings({
  listings = [],
  categories = [],
  districts = [],
  onNavigate
}) {
  const { language, t } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [search, setSearch] = useState('');

  const filtered = listings.filter((item) => {
    const matchesCat = !selectedCategory || (item.category && item.category.slug === selectedCategory);
    const matchesDist = !selectedDistrict || (item.districts && item.districts.some(d => d.slug === selectedDistrict));
    const matchesSearch = !search || (
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.title_ml && item.title_ml.includes(search)) ||
      (item.description_en && item.description_en.toLowerCase().includes(search.toLowerCase())) ||
      (item.locality && item.locality.toLowerCase().includes(search.toLowerCase()))
    );
    return matchesCat && matchesDist && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-[#F7F0DF]">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#C6A15B]/30">
        <div>
          <span className="text-xs uppercase font-serif tracking-widest text-[#A64F32] font-bold flex items-center space-x-1.5">
            <Feather className="w-4 h-4 text-[#A64F32]" />
            <span>Living Performing Heritage</span>
          </span>
          <h1 className="font-serif font-black text-4xl sm:text-5xl text-[#405B43] mt-1">
            {language === 'ml' ? 'സാംസ്കാരിക കലാരൂപങ്ങൾ' : 'Traditional Arts of Kerala'}
          </h1>
          <p className="text-sm text-[#392A20]/80 max-w-2xl mt-2 leading-relaxed font-sans">
            {language === 'ml'
              ? 'നൂറ്റാണ്ടുകളുടെ പാരമ്പര്യമുള്ള അനുഷ്ഠാന കലകൾ, ക്ലാസിക്കൽ നൃത്യങ്ങൾ, നാടൻ കലകൾ എന്നിവയുടെ സമഗ്ര ശേഖരം.'
              : 'Immerse yourself in authentic performing traditions, sacred ritual dramas, and ancient folk meters preserved across generations.'}
          </p>
        </div>

        <div className="text-xs text-[#392A20]/70 font-mono font-medium">
          Showing <span className="text-[#405B43] font-bold font-serif text-sm">{filtered.length}</span> verified records
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#FFFDF6] p-5 rounded-3xl border border-[#C6A15B]/40 shadow-nalukettu space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#A64F32] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F7F0DF] border border-[#C6A15B]/40 text-[#392A20] text-xs placeholder-[#392A20]/50 focus:border-[#405B43] focus:outline-none shadow-sm"
            />
          </div>

          {/* District Dropdown */}
          <div>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-[#F7F0DF] border border-[#C6A15B]/40 text-[#392A20] text-xs font-medium focus:border-[#405B43] focus:outline-none shadow-sm"
            >
              <option value="">{t.allDistricts}</option>
              {districts.map(d => (
                <option key={d.slug} value={d.slug}>
                  {language === 'ml' ? d.name_ml : d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-[#F7F0DF] border border-[#C6A15B]/40 text-[#392A20] text-xs font-medium focus:border-[#405B43] focus:outline-none shadow-sm"
            >
              <option value="">{t.allCategories}</option>
              {categories.map(c => (
                <option key={c.slug} value={c.slug}>
                  {language === 'ml' ? c.name_ml : c.name_en}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters pill */}
        {(selectedCategory || selectedDistrict || search) && (
          <div className="flex justify-end pt-1">
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedDistrict('');
                setSearch('');
              }}
              className="text-xs text-[#A64F32] font-serif font-bold hover:underline flex items-center space-x-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>{t.clearFilters}</span>
            </button>
          </div>
        )}
      </div>

      {/* Cultural Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(listing => (
          <CulturalCard
            key={listing.id}
            listing={listing}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center space-y-3 bg-[#FFFDF6] rounded-3xl border border-dashed border-[#C6A15B]/40">
          <p className="text-base text-[#392A20]/70 font-serif">
            No cultural listings match your search criteria.
          </p>
          <button
            onClick={() => { setSelectedCategory(''); setSelectedDistrict(''); setSearch(''); }}
            className="px-5 py-2.5 rounded-xl bg-[#C6A15B] text-[#123B32] font-serif font-bold text-xs uppercase shadow-kasavu"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
}
