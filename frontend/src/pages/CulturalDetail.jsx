import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePassport } from '../context/PassportContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { fetchListingDetail } from '../services/api';
import CulturalCard from '../components/CulturalCard';
import {
  MapPin, Landmark, Award, Volume2, VolumeX, ArrowLeft,
  ShieldCheck, Share2, BookOpen, Compass, ExternalLink, Sparkles
} from 'lucide-react';

export default function CulturalDetail({
  listingId,
  allListings = [],
  onNavigate
}) {
  const { language, t } = useLanguage();
  const { collectStamp, recordDistrictVisit } = usePassport();
  const { speakText, stopSpeaking, isSpeaking } = useAccessibility();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      // Find from memory first for instant render
      const found = allListings.find(l => String(l.id) === String(listingId));
      if (found) {
        setListing(found);
        setLoading(false);
      }

      // Fetch latest from API
      try {
        const data = await fetchListingDetail(listingId);
        if (data && isMounted) {
          setListing(data);
          setLoading(false);
        }
      } catch (e) {
        setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [listingId, allListings]);

  if (loading || !listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-heritage-gold border-t-transparent animate-spin mx-auto" />
        <p className="text-sm text-heritage-gold font-mono">Retrieving verified cultural dossier...</p>
      </div>
    );
  }

  const title = language === 'ml' ? (listing.title_ml || listing.title) : listing.title;
  const description = language === 'ml' ? (listing.description_ml || listing.description_en) : listing.description_en;
  const originDist = listing.origin_district
    ? (language === 'ml' ? listing.origin_district.name_ml : listing.origin_district.name)
    : 'Kerala';

  const practicingDistricts = listing.districts?.map(d => (language === 'ml' ? d.name_ml : d.name)).join(', ') || originDist;

  const handleCollectStamp = () => {
    collectStamp(listing.id, `${listing.title} Heritage Stamp`);
  };

  // Find related listings in same category
  const relatedListings = allListings
    .filter(l => l.id !== listing.id && l.category?.slug === listing.category?.slug)
    .slice(0, 3);

  return (
    <div className="w-full space-y-12 pb-24">
      
      {/* Hero Header with Authentic Imagery */}
      <div className="relative min-h-[500px] w-full overflow-hidden bg-heritage-dark flex items-end">
        <img
          src={listing.image}
          alt={listing.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040F0D] via-heritage-dark/70 to-black/30" />

        {/* Back Navigation Button */}
        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <button
            onClick={() => onNavigate('/listings')}
            className="px-3.5 py-2 rounded-xl glass-panel text-xs text-heritage-gold font-semibold flex items-center space-x-1.5 hover:border-heritage-gold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'ml' ? 'എല്ലാ കലകളും' : 'All Heritage Listings'}</span>
          </button>
        </div>

        {/* Hero Metadata Card */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-heritage-gold text-heritage-dark shadow-gold-subtle">
              {language === 'ml' ? listing.category?.name_ml : listing.category?.name_en}
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-mono bg-heritage-forest/90 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Record #{listing.id}</span>
            </span>

            {listing.locality && (
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-heritage-forest/80 text-heritage-ivory border border-heritage-gold/30 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-heritage-gold" />
                <span>{listing.locality}</span>
              </span>
            )}
          </div>

          <h1 className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl text-gold-gradient">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-heritage-ivory/80 font-medium">
            <div>
              <span className="text-heritage-gold font-bold">{t.originDistrict}:</span> {originDist}
            </div>
            <div>
              <span className="text-heritage-gold font-bold">{t.practicingDistricts}:</span> {practicingDistricts}
            </div>
          </div>

          {/* Photo Credit Bar */}
          <div className="text-[11px] text-heritage-ivory/60 font-mono pt-1">
            Photo Credit: {listing.image_credit || 'Wikimedia Commons / CC BY-SA 4.0'}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Actions Bar: Audio narration + Collect Stamp */}
        <div className="p-4 rounded-2xl glass-panel border border-heritage-gold/30 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking();
                } else {
                  speakText(`${title}. ${description}. Cultural story: ${listing.cultural_story}`, language);
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-heritage-forest border border-heritage-gold/40 text-heritage-gold text-xs font-bold flex items-center space-x-2 hover:border-heritage-gold"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              <span>{isSpeaking ? t.stopNarration : t.listenNarration}</span>
            </button>
            <span className="text-xs text-heritage-ivory/60 hidden sm:inline">
              Voice pronunciation & narrative synthesis
            </span>
          </div>

          <button
            onClick={handleCollectStamp}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-heritage-gold to-heritage-goldDark text-heritage-dark font-extrabold text-xs uppercase tracking-wider shadow-gold-subtle flex items-center space-x-2 hover:brightness-110"
          >
            <Award className="w-4 h-4" />
            <span>Collect Digital Stamp</span>
          </button>
        </div>

        {/* Narrative & Description */}
        <div className="space-y-6">
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-heritage-gold border-b border-heritage-gold/20 pb-2">
            {language === 'ml' ? 'വിവരണം' : 'Overview & Essence'}
          </h2>
          <p className="text-sm sm:text-base text-heritage-ivory/90 leading-relaxed font-light">
            {description}
          </p>
        </div>

        {/* Cultural Story & Oral Legends */}
        {listing.cultural_story && (
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-heritage-gold/30 space-y-4 bg-gradient-to-br from-heritage-forest/40 to-heritage-dark">
            <div className="flex items-center space-x-2 text-heritage-gold">
              <BookOpen className="w-5 h-5" />
              <h3 className="font-serif font-bold text-xl sm:text-2xl">
                {t.culturalStory}
              </h3>
            </div>
            <p className="text-sm sm:text-base text-heritage-ivory/80 leading-relaxed italic">
              "{listing.cultural_story}"
            </p>
          </div>
        )}

        {/* Historical Background & Evolution */}
        {listing.historical_background && (
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-heritage-gold">
              {t.historicalBackground}
            </h3>
            <p className="text-sm sm:text-base text-heritage-ivory/80 leading-relaxed">
              {listing.historical_background}
            </p>
          </div>
        )}

        {/* Ritual and Cultural Significance */}
        {listing.cultural_significance && (
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-heritage-gold">
              {t.culturalSignificance}
            </h3>
            <p className="text-sm sm:text-base text-heritage-ivory/80 leading-relaxed">
              {listing.cultural_significance}
            </p>
          </div>
        )}

        {/* Sourced Reference Box */}
        <div className="p-4 rounded-xl bg-heritage-forest/50 border border-heritage-gold/25 space-y-2 text-xs">
          <span className="font-bold text-heritage-gold uppercase tracking-wider font-mono flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t.verifiedSource}</span>
          </span>
          <p className="text-heritage-ivory/80 font-mono">
            {listing.source_reference}
          </p>
        </div>

        {/* Related Cultural Listings */}
        {relatedListings.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-heritage-gold/20">
            <h3 className="font-serif font-bold text-2xl text-heritage-ivory">
              {t.relatedListings}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedListings.map(item => (
                <CulturalCard
                  key={item.id}
                  listing={item}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
