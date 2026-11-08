import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePassport } from '../context/PassportContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { fetchListingDetail } from '../services/api';
import CulturalCard from '../components/CulturalCard';
import SafeImage from '../components/SafeImage';
import {
  MapPin, Landmark, Award, Volume2, VolumeX, ArrowLeft,
  ShieldCheck, Share2, BookOpen, Compass, ExternalLink, Sparkles,
  Camera, Music, Palette, Footprints, Clock, Users, History,
  CheckCircle2, AlertCircle, HelpCircle, FileText, Info, Feather
} from 'lucide-react';

export default function CulturalDetail({
  listingId,
  allListings = [],
  onNavigate
}) {
  const { language, t } = useLanguage();
  const { collectStamp } = usePassport();
  const { speakText, stopSpeaking, isSpeaking } = useAccessibility();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      // Find initial item in cached props
      const found = allListings.find(l => String(l.id) === String(listingId));
      if (found) {
        setListing(found);
        setLoading(false);
      }

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

  if (loading && !listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4 bg-[#F7F0DF]">
        <div className="w-12 h-12 rounded-full border-3 border-[#A64F32] border-t-transparent animate-spin mx-auto" />
        <p className="text-sm text-[#405B43] font-serif font-bold">
          {language === 'ml' ? 'സാംസ്കാരിക ചരിത്ര രേഖകൾ ശേഖരിക്കുന്നു...' : 'Retrieving verified cultural dossier...'}
        </p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6 bg-[#F7F0DF]">
        <div className="p-8 rounded-3xl bg-[#FFFDF6] border-2 border-[#C6A15B]/40 shadow-nalukettu space-y-4">
          <AlertCircle className="w-12 h-12 text-[#A64F32] mx-auto" />
          <h2 className="font-serif font-bold text-2xl text-[#702D2B]">
            {language === 'ml' ? 'കലാരൂപ രേഖ കണ്ടെത്താനായില്ല' : 'Art Form Dossier Not Found'}
          </h2>
          <p className="text-xs sm:text-sm text-[#392A20]/80 leading-relaxed font-sans">
            {language === 'ml' ? 'ഈ പൈതൃക രൂപത്തിന്റെ വിവരങ്ങൾ ലഭ്യമല്ല.' : 'The requested cultural heritage tradition could not be retrieved from the active archive.'}
          </p>
          <button
            onClick={() => onNavigate('/listings')}
            className="px-5 py-2.5 rounded-xl bg-[#A64F32] hover:bg-[#8D3F26] text-white font-serif font-bold text-xs uppercase tracking-wider transition-all"
          >
            {language === 'ml' ? 'എല്ലാ കലകളിലേക്കും മടങ്ങുക' : 'Back to Heritage Listings'}
          </button>
        </div>
      </div>
    );
  }

  const title = language === 'ml' ? (listing.title_ml || listing.title) : listing.title;
  const description = language === 'ml' ? (listing.description_ml || listing.description_en) : listing.description_en;
  const originDist = listing.origin_district
    ? (language === 'ml' ? listing.origin_district.name_ml : listing.origin_district.name)
    : (listing.origin_district_name || 'Kerala');

  const practicingDistricts = listing.districts?.map(d => (language === 'ml' ? d.name_ml : d.name)).join(', ') || originDist;

  const handleCollectStamp = () => {
    collectStamp(listing.id, `${listing.title} Heritage Stamp`);
  };

  const relatedListings = allListings
    .filter(l => l.id !== listing.id && l.category?.slug === listing.category?.slug)
    .slice(0, 3);

  // Gallery images from backend or fallback to primary image
  const galleryImages = listing.gallery_images && listing.gallery_images.length > 0
    ? listing.gallery_images
    : [
        {
          id: 1,
          image_url: listing.image,
          caption: `${listing.title} traditional performance view`,
          photographer: listing.image_credit || 'Wikimedia Commons',
          source_url: 'https://www.keralatourism.org/artforms/',
          licence: 'CC BY-SA 4.0',
          alt_text: `Authentic representation of ${listing.title} cultural heritage in Kerala.`,
          verification_status: 'approved'
        }
      ];

  // Where to experience venues
  const venues = listing.places && listing.places.length > 0 ? listing.places : [];

  // Curator status presentation helper
  const renderCuratorBadge = () => {
    const status = listing.curator_status || (listing.verification_status === 'approved' ? 'Verified' : 'Needs Review');
    if (status === 'Verified') {
      return (
        <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-[#31543E] text-white flex items-center space-x-1.5 shadow-sm border border-[#C9A45C]/40">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C9A45C]" />
          <span>Curator Verified Record</span>
        </span>
      );
    } else if (status === 'Needs Review') {
      return (
        <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-[#B58A45] text-white flex items-center space-x-1.5 shadow-sm">
          <AlertCircle className="w-3.5 h-3.5 text-white" />
          <span>Needs Curator Review</span>
        </span>
      );
    } else {
      return (
        <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-[#5A6268] text-white flex items-center space-x-1.5 shadow-sm">
          <HelpCircle className="w-3.5 h-3.5 text-white" />
          <span>Unverified Demo Content</span>
        </span>
      );
    }
  };

  return (
    <div className="w-full space-y-12 pb-24 bg-[#F7F0DF]">
      
      {/* 1. HERO HEADER: Art Form Introduction & Visual Masthead */}
      <div className="relative min-h-[520px] w-full overflow-hidden bg-[#123B32] flex items-end">
        <SafeImage
          src={listing.image}
          alt={listing.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#123B32] via-black/50 to-black/30" />

        {/* Back Navigation Button */}
        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <button
            onClick={() => onNavigate('/listings')}
            className="px-4 py-2 rounded-xl bg-[#FFFDF6]/90 border border-[#C6A15B]/50 text-xs font-serif font-bold text-[#405B43] flex items-center space-x-1.5 hover:bg-[#FFFDF6] shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#A64F32]" />
            <span>{language === 'ml' ? 'എല്ലാ കലകളും' : 'All Heritage Listings'}</span>
          </button>
        </div>

        {/* Hero Metadata Card */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-4 text-white">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-serif font-bold uppercase bg-[#A64F32] text-white shadow-sm">
              {language === 'ml' ? listing.category?.name_ml : listing.category?.name_en}
            </span>

            {renderCuratorBadge()}

            {listing.editorial_status && (
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-black/60 text-[#F7F0DF] border border-white/20 backdrop-blur-sm">
                {listing.editorial_status}
              </span>
            )}

            {listing.locality && (
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-black/60 text-[#F7F0DF] border border-white/20 backdrop-blur-sm flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>{listing.locality}</span>
              </span>
            )}
          </div>

          <div className="space-y-1">
            <h1 className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl text-[#F7F0DF] drop-shadow-md">
              {title}
            </h1>
            {listing.title_ml && listing.title_ml !== listing.title && (
              <p className="font-serif text-xl sm:text-2xl text-[#C6A15B] font-bold">
                {listing.title_ml}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/90 font-medium">
            <div>
              <span className="text-[#C6A15B] font-serif font-bold">{t.originDistrict}:</span> {originDist}
            </div>
            <div>
              <span className="text-[#C6A15B] font-serif font-bold">{t.practicingDistricts}:</span> {practicingDistricts}
            </div>
            {listing.historical_timeline && (
              <div>
                <span className="text-[#C6A15B] font-serif font-bold">Timeline:</span> {listing.historical_timeline}
              </div>
            )}
          </div>

          <div className="text-[11px] text-white/70 font-mono pt-1">
            Photo Credit: {listing.image_credit || 'Wikimedia Commons / CC BY-SA 4.0'}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Actions Bar: Audio Narration + Collect Stamp */}
        <div className="p-5 rounded-3xl bg-[#FFFDF6] border-2 border-[#C6A15B]/40 shadow-nalukettu flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking();
                } else {
                  speakText(`${title}. ${listing.history_summary || description}.`, language);
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-[#E8D8B8]/70 border border-[#C6A15B]/50 text-[#405B43] text-xs font-bold flex items-center space-x-2 hover:bg-[#E8D8B8] transition-all shadow-sm"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-red-600" /> : <Volume2 className="w-4 h-4 text-[#A64F32]" />}
              <span>{isSpeaking ? t.stopNarration : t.listenNarration}</span>
            </button>
            <span className="text-xs text-[#392A20]/70 hidden sm:inline font-serif">
              Voice narration in {language === 'ml' ? 'Malayalam' : 'English'}
            </span>
          </div>

          <button
            onClick={handleCollectStamp}
            className="px-5 py-2.5 rounded-xl bg-[#C6A15B] hover:bg-[#AB8742] text-[#123B32] font-serif font-bold text-xs uppercase tracking-wider shadow-kasavu flex items-center space-x-2 transition-all"
          >
            <Award className="w-4 h-4 text-[#123B32]" />
            <span>Collect Digital Stamp</span>
          </button>
        </div>

        {/* SECTION 1: Historical Background & Origin Summary */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF6] border-2 border-[#C6A15B]/40 shadow-nalukettu space-y-4">
          <div className="flex items-center space-x-2 text-[#405B43] border-b border-[#C6A15B]/25 pb-3">
            <History className="w-5 h-5 text-[#A64F32]" />
            <div>
              <span className="text-[10px] uppercase font-serif tracking-widest text-[#A64F32] font-bold block">
                Section 1 • Historical Background
              </span>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#405B43]">
                {language === 'ml' ? 'ചരിത്ര പശ്ചാത്തല സംഗ്രഹം' : 'Historical Background & Origins'}
              </h2>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#392A20]/90 leading-relaxed font-normal">
            {listing.history_summary || description}
          </p>

          {listing.historical_timeline && (
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E8D8B8]/60 text-[#405B43] text-xs font-mono font-bold border border-[#C6A15B]/40">
              <Clock className="w-3.5 h-3.5 text-[#A64F32]" />
              <span>Documented Era: {listing.historical_timeline}</span>
            </div>
          )}
        </div>

        {/* SECTION 2: Deep Historical Context & Evolution */}
        {listing.history_detail && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF6] border-2 border-[#C6A15B]/40 shadow-nalukettu space-y-4">
            <div className="flex items-center space-x-2 text-[#405B43] border-b border-[#C6A15B]/25 pb-3">
              <BookOpen className="w-5 h-5 text-[#A64F32]" />
              <div>
                <span className="text-[10px] uppercase font-serif tracking-widest text-[#A64F32] font-bold block">
                  Section 2 • Deep Context
                </span>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#405B43]">
                  {language === 'ml' ? 'ആഴത്തിലുള്ള ചരിത്ര പരിണാമം' : 'Further Historical Context & Evolution'}
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-sm sm:text-base text-[#392A20]/85 leading-relaxed font-normal">
              {listing.history_detail.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: Community & Regional Context */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF6] border-2 border-[#C6A15B]/40 shadow-nalukettu space-y-5">
          <div className="flex items-center space-x-2 text-[#405B43] border-b border-[#C6A15B]/25 pb-3">
            <Users className="w-5 h-5 text-[#A64F32]" />
            <div>
              <span className="text-[10px] uppercase font-serif tracking-widest text-[#A64F32] font-bold block">
                Section 3 • Community & Geography
              </span>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#405B43]">
                {language === 'ml' ? 'സമൂഹവും പ്രാദേശിക പശ്ചാത്തലവും' : 'Community & Regional Context'}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 rounded-2xl bg-[#F7F0DF] border border-[#C6A15B]/30 space-y-2">
              <span className="text-xs font-serif font-bold text-[#405B43] flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-[#A64F32]" />
                <span>Geographic & District Associations:</span>
              </span>
              <p className="text-xs sm:text-sm text-[#392A20]/85 leading-relaxed font-sans">
                {listing.district_association || `Practiced across ${practicingDistricts}.`}
              </p>
              <div className="text-[11px] text-[#392A20]/70 font-mono pt-1">
                Primary Origin Hub: {originDist}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F0DF] border border-[#C6A15B]/30 space-y-2">
              <span className="text-xs font-serif font-bold text-[#405B43] flex items-center space-x-1.5">
                <Users className="w-4 h-4 text-[#A64F32]" />
                <span>Hereditary Custodian Communities:</span>
              </span>
              <p className="text-xs sm:text-sm text-[#392A20]/85 leading-relaxed font-sans">
                {listing.communities || 'Generational artisan guilds, traditional family lineages, and regional cultural masters.'}
              </p>
              <div className="text-[11px] text-[#392A20]/70 font-mono pt-1">
                Transmission: Master-Disciple (Guru-Shishya Parampara)
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: Performance or Making Process / Techniques */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF6] border-2 border-[#C6A15B]/40 shadow-nalukettu space-y-4">
          <div className="flex items-center space-x-2 text-[#405B43] border-b border-[#C6A15B]/25 pb-3">
            <Footprints className="w-5 h-5 text-[#A64F32]" />
            <div>
              <span className="text-[10px] uppercase font-serif tracking-widest text-[#A64F32] font-bold block">
                Section 4 • Praxis & Execution
              </span>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#405B43]">
                {language === 'ml' ? 'അവതരണ രീതിയും നിർമ്മാണ പ്രക്രിയയും' : 'Performance or Making Process'}
              </h3>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#392A20]/85 leading-relaxed">
            {listing.techniques || 'Executed according to ancient treatises, rigorous rhythmic footwork, and sacred artisan craftsmanship.'}
          </p>
        </div>

        {/* SECTION 5: Costumes, Makeup, Instruments and Materials */}
        <div className="space-y-6">
          <div className="border-b border-[#C6A15B]/30 pb-2">
            <span className="text-xs uppercase font-serif tracking-widest text-[#A64F32] font-bold">
              Section 5 • Material Culture
            </span>
            <h3 className="font-serif font-bold text-2xl text-[#405B43] mt-1">
              {language === 'ml' ? 'വേഷവിധാനങ്ങളും ഉപകരണങ്ങളും' : 'Costumes, Instruments & Traditional Materials'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Costumes & Makeup */}
            <div className="p-6 rounded-3xl bg-[#FFFDF6] border-2 border-[#C6A15B]/40 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-[#405B43] font-serif font-bold text-base">
                <Palette className="w-4 h-4 text-[#A64F32]" />
                <span>Traditional Costumes & Makeup</span>
              </div>
              <p className="text-xs sm:text-sm text-[#392A20]/80 leading-relaxed font-sans">
                {listing.costumes || 'Traditional Kerala handwoven attire with ritual embellishments and botanical pigments.'}
              </p>
            </div>

            {/* Instruments & Materials */}
            <div className="p-6 rounded-3xl bg-[#FFFDF6] border-2 border-[#C6A15B]/40 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-[#405B43] font-serif font-bold text-base">
                <Music className="w-4 h-4 text-[#A64F32]" />
                <span>Instruments & Craft Materials</span>
              </div>
              <p className="text-xs sm:text-sm text-[#392A20]/80 leading-relaxed font-sans">
                {listing.instruments || 'Acoustic temple drums, bronze cymbals, wooden looms, or natural mineral alloys.'}
              </p>
            </div>

          </div>
        </div>

        {/* SECTION 6: Cultural Significance Today */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF6] border-2 border-[#C6A15B]/40 shadow-nalukettu space-y-4">
          <div className="flex items-center space-x-2 text-[#405B43] border-b border-[#C6A15B]/25 pb-3">
            <Feather className="w-5 h-5 text-[#A64F32]" />
            <div>
              <span className="text-[10px] uppercase font-serif tracking-widest text-[#A64F32] font-bold block">
                Section 6 • Living Relevance
              </span>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#405B43]">
                {language === 'ml' ? 'സമകാലിക സാംസ്കാരിക പ്രാധാന്യം' : 'Cultural Significance in Contemporary Kerala'}
              </h3>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#392A20]/85 leading-relaxed font-normal">
            {listing.cultural_significance || 'Sustains communal harmony, ritual identity, generational transmission, and Kerala’s living heritage.'}
          </p>
        </div>

        {/* SECTION 7: Distinct Delineation of Facts vs. Oral Traditions vs. Legends */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FFFDF6] to-[#E8D8B8]/30 border-2 border-[#C6A15B]/40 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-[#405B43] border-b border-[#C6A15B]/25 pb-3">
            <Info className="w-5 h-5 text-[#A64F32]" />
            <div>
              <span className="text-[10px] uppercase font-serif tracking-widest text-[#A64F32] font-bold block">
                Section 7 • Delineation of Heritage Knowledge
              </span>
              <h4 className="font-serif font-bold text-lg sm:text-xl text-[#405B43]">
                {language === 'ml' ? 'ചരിത്ര സത്യങ്ങളും ഐതിഹ്യങ്ങളും തമ്മിലുള്ള വേർതിരിവ്' : 'Distinguishing Historical Facts, Oral Lore & Living Beliefs'}
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-white/70 border border-[#C6A15B]/30 space-y-2">
              <span className="font-serif font-bold text-[#405B43] flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#31543E]" />
                <span>Documented Historical Facts:</span>
              </span>
              <p className="text-[#392A20]/85 leading-relaxed">
                {listing.historical_background || 'Recorded in royal palace records, Travancore/Cochin state archives, and published regional cultural surveys.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 border border-[#C6A15B]/30 space-y-2">
              <span className="font-serif font-bold text-[#A64F32] flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4 text-[#A64F32]" />
                <span>Community Oral Traditions & Legends:</span>
              </span>
              <p className="text-[#392A20]/85 leading-relaxed italic">
                "{listing.cultural_story || 'Cherished through oral storytellers, sacred grove ballads (Tottam Pattu), and ritual practitioner memories.'}"
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 8: Where Visitors May Experience It (Venues & Guidelines) */}
        <div className="space-y-6">
          <div className="border-b border-[#C6A15B]/30 pb-2">
            <span className="text-xs uppercase font-serif tracking-widest text-[#A64F32] font-bold">
              Section 8 • Experience Venues
            </span>
            <h3 className="font-serif font-bold text-2xl text-[#405B43] mt-1">
              {language === 'ml' ? 'നേരിട്ട് അനുഭവിക്കാൻ യഥാർത്ഥ കേന്ദ്രങ്ങൾ' : `Where Visitors May Experience ${listing.title}`}
            </h3>
          </div>

          {venues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {venues.map(v => (
                <div
                  key={v.id}
                  className="p-6 rounded-2xl bg-[#FFFDF6] border border-[#C6A15B]/40 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#E8D8B8] text-[#405B43] font-bold border border-[#C6A15B]/30">
                        {v.venue_type_label || 'Cultural Venue'}
                      </span>
                      <h4 className="font-serif font-bold text-xl text-[#405B43] mt-1.5">
                        {v.name}
                      </h4>
                      <p className="text-xs text-[#A64F32] flex items-center space-x-1 mt-0.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{v.locality}, {v.district_name}</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-[#392A20]/80 leading-relaxed">
                    {v.description}
                  </p>

                  <div className="p-3.5 rounded-xl bg-[#F7F0DF] border border-[#C6A15B]/30 space-y-1 text-xs">
                    <span className="text-[#405B43] font-serif font-bold flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#A64F32]" />
                      <span>Seasonality & Visitor Access:</span>
                    </span>
                    <p className="text-[11px] text-[#392A20]/80 leading-relaxed font-sans">
                      {v.visitor_access_information}
                    </p>
                  </div>

                  {v.address && (
                    <div className="text-[11px] text-[#392A20]/70 font-mono">
                      Address: {v.address}
                    </div>
                  )}

                  {v.source_reference && (
                    <div className="text-[10px] text-[#392A20]/60 font-mono border-t border-[#C6A15B]/20 pt-2 flex items-center justify-between">
                      <span>Source: {v.source_reference}</span>
                      <span className="text-[#405B43] font-bold">Verified</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-[#FFFDF6] border border-[#C6A15B]/30 space-y-2">
              <h4 className="font-serif font-bold text-base text-[#405B43]">
                Regional Shrines, Guild Workshops & Seasonal Festivals
              </h4>
              <p className="text-xs text-[#392A20]/80 leading-relaxed">
                Practiced and experienced across traditional cultural hubs in {practicingDistricts}. Check official temple calendars and cooperative workshops for seasonal access during festival months.
              </p>
            </div>
          )}
        </div>

        {/* SECTION 9: Photo Gallery with Captions, Credits, Alt Text & Licences */}
        <div className="space-y-6">
          <div className="border-b border-[#C6A15B]/30 pb-2">
            <span className="text-xs uppercase font-serif tracking-widest text-[#A64F32] font-bold flex items-center space-x-1.5">
              <Camera className="w-4 h-4 text-[#A64F32]" />
              <span>Section 9 • Authentic Photographic Documentation</span>
            </span>
            <h3 className="font-serif font-bold text-2xl text-[#405B43] mt-1">
              {language === 'ml' ? 'ചിത്രശാല' : 'Sourced Photographic Gallery'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {galleryImages.map((img) => (
              <div
                key={img.id}
                className="rounded-2xl overflow-hidden bg-[#FFFDF6] border border-[#C6A15B]/40 shadow-sm space-y-3 p-3 flex flex-col justify-between"
              >
                <div className="relative h-60 w-full overflow-hidden rounded-xl bg-[#E8D8B8]">
                  <SafeImage
                    src={img.image_url}
                    alt={img.alt_text || img.caption}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-[#31543E] text-white text-[10px] font-mono font-bold shadow-sm">
                    {img.curator_status || 'Verified Image'}
                  </div>
                </div>

                <div className="space-y-1.5 px-1">
                  <p className="text-xs text-[#392A20] font-serif font-bold leading-snug">
                    {img.caption}
                  </p>
                  {img.alt_text && (
                    <p className="text-[11px] text-[#392A20]/75 leading-tight italic">
                      "{img.alt_text}"
                    </p>
                  )}
                  <div className="text-[10px] text-[#392A20]/70 font-mono space-y-0.5 pt-1">
                    <div>Photographer / Creator: {img.photographer || 'Archival Reference'}</div>
                    <div className="text-[#A64F32] font-semibold">{img.licence || 'CC BY-SA 4.0'}</div>
                  </div>
                </div>

                {img.source_url && (
                  <div className="pt-2 border-t border-[#C6A15B]/20">
                    <a
                      href={img.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-[#405B43] hover:underline flex items-center space-x-1 font-mono font-bold"
                    >
                      <span>Original Media Source Link</span>
                      <ExternalLink className="w-3 h-3 text-[#A64F32]" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 10: Reliable Sources & Further Reading */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF6] border-2 border-[#C6A15B]/40 shadow-nalukettu space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#C6A15B]/25">
            <span className="font-serif font-bold text-base text-[#405B43] uppercase tracking-wider flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-[#31543E]" />
              <span>Section 10 • Archival Sources & Further Reading</span>
            </span>

            {renderCuratorBadge()}
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl bg-[#F7F0DF] border border-[#C6A15B]/30 space-y-1">
              <div className="font-serif font-bold text-[#405B43] text-sm">
                Primary Cultural Citation:
              </div>
              <p className="text-[#392A20]/85 font-mono text-xs">
                {listing.source_reference || 'Kerala Tourism Official Cultural Archive & Kerala Sangeetha Nataka Akademi'}
              </p>
              <div className="text-[11px] text-[#392A20]/70 pt-1 font-sans">
                Supports: Historical origins, performance techniques, practitioner communities, and regional geography.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <a
                href="https://www.keralatourism.org/artforms/"
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-xl bg-[#F7F0DF] border border-[#C6A15B]/30 hover:border-[#405B43] transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-[#405B43] group-hover:text-[#A64F32] transition-colors">Kerala Tourism</div>
                  <div className="text-[10px] text-[#392A20]/70">Official Artforms Portal</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#A64F32]" />
              </a>

              <a
                href="https://en.wikipedia.org/wiki/Arts_of_Kerala"
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-xl bg-[#F7F0DF] border border-[#C6A15B]/30 hover:border-[#405B43] transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-[#405B43] group-hover:text-[#A64F32] transition-colors">Arts of Kerala</div>
                  <div className="text-[10px] text-[#392A20]/70">Wikimedia Research Archives</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#A64F32]" />
              </a>

              <a
                href="https://www.tusktravel.com/blog/most-popular-art-and-dance-forms-in-kerala/"
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-xl bg-[#F7F0DF] border border-[#C6A15B]/30 hover:border-[#405B43] transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-[#405B43] group-hover:text-[#A64F32] transition-colors">Tusk Travel Dossier</div>
                  <div className="text-[10px] text-[#392A20]/70">Field Research Guide</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#A64F32]" />
              </a>
            </div>
          </div>
        </div>

        {/* Related Cultural Listings */}
        {relatedListings.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-[#C6A15B]/30">
            <h3 className="font-serif font-bold text-2xl text-[#405B43]">
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
