import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

export default function CulturalCard({ listing, onNavigate }) {
  const { language, t } = useLanguage();

  const title = language === 'ml' ? (listing.title_ml || listing.title) : listing.title;
  const description = language === 'ml' ? (listing.description_ml || listing.description_en) : listing.description_en;
  const distNames = listing.districts?.map(d => (language === 'ml' ? d.name_ml : d.name)).join(', ') || 'Kerala';

  return (
    <div
      onClick={() => onNavigate(`/cultural-listings/${listing.id}`)}
      className="group relative rounded-2xl overflow-hidden glass-panel border border-heritage-gold/25 hover:border-heritage-gold shadow-lg hover:shadow-gold-glow transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Image & Image Credit Overlay */}
        <div className="relative h-56 w-full overflow-hidden bg-heritage-dark">
          <img
            src={listing.image || 'https://images.unsplash.com/photo-1600100397608-f010f443b749?auto=format&fit=crop&w=800&q=80'}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-heritage-dark via-transparent to-black/30" />
          
          {/* Category Tag */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase bg-heritage-dark/80 text-heritage-gold border border-heritage-gold/40 backdrop-blur-md">
              {language === 'ml' ? (listing.category?.name_ml || 'കല') : (listing.category?.name_en || 'Heritage')}
            </span>
          </div>

          {/* Verification Badge */}
          {listing.verification_status === 'approved' && (
            <div className="absolute top-3 right-3 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-medium backdrop-blur-md">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Verified</span>
            </div>
          )}

          {/* Photographer Attribution Notice */}
          <div className="absolute bottom-1 right-2 bg-black/70 px-1.5 py-0.5 rounded text-[8px] text-heritage-ivory/60 font-mono">
            {listing.image_credit || 'Wikimedia Commons'}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-5 space-y-2.5">
          <div className="flex items-center space-x-1.5 text-xs text-heritage-gold/90 font-medium">
            <MapPin className="w-3.5 h-3.5 text-heritage-gold flex-shrink-0" />
            <span className="truncate">{listing.locality || distNames}</span>
          </div>

          <h3 className="font-serif font-bold text-lg text-heritage-ivory group-hover:text-gold-gradient transition-colors line-clamp-1">
            {title}
          </h3>

          <p className="text-xs text-heritage-ivory/70 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 pb-5 pt-2 border-t border-heritage-gold/15 flex items-center justify-between text-xs">
        <span className="text-[11px] text-heritage-ivory/50 font-mono">
          Districts: {distNames}
        </span>
        <span className="text-heritage-gold font-semibold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
          <span>{language === 'ml' ? 'കൂടുതൽ അറിയാം' : 'Explore'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}
