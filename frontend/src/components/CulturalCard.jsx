import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Sparkles, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';
import SafeImage from './SafeImage';

export default function CulturalCard({ listing, onNavigate, onClick, onDistrictClick }) {
  const { language, t } = useLanguage();

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (onNavigate) {
      onNavigate(`/cultural-listings/${listing.id}`);
    }
  };

  const title = language === 'ml' ? (listing.title_ml || listing.title) : listing.title;
  const description = language === 'ml' ? (listing.description_ml || listing.description_en) : listing.description_en;
  const distNames = listing.districts?.map(d => (language === 'ml' ? d.name_ml : d.name)).join(', ') || 'Kerala';

  return (
    <div
      onClick={handleCardClick}
      className="group relative rounded-2xl overflow-hidden bg-[#FFFCF5] border border-[#C9A45C]/35 hover:border-[#31543E] shadow-nalukettu hover:shadow-nalukettu-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Authentic Art Form Image */}
        <div className="relative h-56 w-full overflow-hidden bg-[#E8D8B8]">
          <SafeImage
            src={listing.image || '/images/arts/theyyam.jpg'}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          
          {/* Category Tag */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase bg-[#FFFCF5]/95 text-[#31543E] border border-[#C9A45C]/50 shadow-sm backdrop-blur-sm">
              {language === 'ml' ? (listing.category?.name_ml || 'കല') : (listing.category?.name_en || 'Heritage')}
            </span>
          </div>

          {/* Curator Verification Status Badge */}
          {listing.curator_status === 'Verified' || listing.verification_status === 'approved' ? (
            <div className="absolute top-3 right-3 flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#31543E] text-white text-[10px] font-medium shadow-sm">
              <ShieldCheck className="w-3 h-3 text-[#C9A45C]" />
              <span>Verified Record</span>
            </div>
          ) : listing.curator_status === 'Needs Review' ? (
            <div className="absolute top-3 right-3 flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#B58A45] text-white text-[10px] font-medium shadow-sm">
              <ShieldCheck className="w-3 h-3 text-white" />
              <span>Needs Review</span>
            </div>
          ) : null}

          {/* Sourced Photographer & Licence Attribution */}
          <div className="absolute bottom-1 right-2 bg-black/60 px-2 py-0.5 rounded text-[8px] text-white/80 font-mono">
            {listing.image_credit || 'Wikimedia Commons / CC BY-SA'}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-5 space-y-2.5">
          {/* Cultural highlight in Mural Red */}
          <div className="flex items-center space-x-1.5 text-xs text-[#9E4035] font-semibold">
            <MapPin className="w-3.5 h-3.5 text-[#9E4035] flex-shrink-0" />
            <span className="truncate">{listing.locality || distNames}</span>
          </div>

          {/* Art-form Title in Forest Green */}
          <h3 className="font-serif font-bold text-lg text-[#31543E] group-hover:text-[#9E4035] transition-colors line-clamp-1">
            {title}
          </h3>

          <p className="text-xs text-[#2B1E16]/80 line-clamp-2 leading-relaxed font-sans">
            {description}
          </p>
        </div>
      </div>

      {/* Card Action Footer with Kasavu Gold 'View History' Button */}
      <div className="px-5 pb-5 pt-3 border-t border-[#C9A45C]/20 flex items-center justify-between text-xs bg-[#F6F0E4]/60">
        <span className="text-[11px] text-[#2B1E16]/70 font-serif">
          {distNames}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          className="px-3.5 py-1.5 rounded-xl bg-[#C9A45C] hover:bg-[#B28E46] text-[#103B30] font-sans font-bold text-xs flex items-center space-x-1.5 shadow-kasavu transition-all"
        >
          <span>{language === 'ml' ? 'ചരിത്രം കാണാം' : 'View History'}</span>
          <ArrowRight className="w-3 h-3 text-[#103B30]" />
        </button>
      </div>
    </div>
  );
}
