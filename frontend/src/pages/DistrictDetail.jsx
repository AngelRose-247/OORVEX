import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePassport } from '../context/PassportContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { fetchDistrictDetail } from '../services/api';
import CulturalCard from '../components/CulturalCard';
import SafeImage from '../components/SafeImage';
import {
  MapPin, Landmark, Award, Volume2, VolumeX, ArrowLeft,
  Sparkles, CheckCircle2, Share2, Compass, Calendar, Clock,
  ExternalLink, Building2, ShieldCheck, Feather, BookOpen, Scroll, AlertCircle
} from 'lucide-react';

export default function DistrictDetail({
  districtSlug,
  districts = [],
  listings = [],
  onNavigate
}) {
  const { language, t } = useLanguage();
  const { recordDistrictVisit, collectStamp } = usePassport();
  const { speakText, stopSpeaking, isSpeaking } = useAccessibility();

  const [districtData, setDistrictData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fallback to static district if API request pending
  const baseDistrict = districts.find(d => d.slug === districtSlug) || districts[0];

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      if (baseDistrict) {
        recordDistrictVisit(baseDistrict.slug);
      }
      try {
        const full = await fetchDistrictDetail(districtSlug);
        if (full && isMounted) {
          setDistrictData(full);
        } else if (isMounted) {
          setDistrictData(baseDistrict);
        }
      } catch (e) {
        if (isMounted) setDistrictData(baseDistrict);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [districtSlug]);

  const district = districtData || baseDistrict;

  if (loading && !district) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4 bg-[#F7F0DF]">
        <div className="w-12 h-12 rounded-full border-3 border-[#A64F32] border-t-transparent animate-spin mx-auto" />
        <p className="text-sm text-[#405B43] font-serif font-bold">
          {language === 'ml' ? 'ജില്ലാ സാംസ്കാരിക വിവരങ്ങൾ ശേഖരിക്കുന്നു...' : 'Loading district cultural dossier for Kerala heritage map...'}
        </p>
      </div>
    );
  }

  if (!district) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6 bg-[#F7F0DF]">
        <div className="p-8 rounded-3xl bg-[#FFFDF6] border-2 border-[#C6A15B]/40 shadow-nalukettu space-y-4">
          <AlertCircle className="w-12 h-12 text-[#A64F32] mx-auto" />
          <h2 className="font-serif font-bold text-2xl text-[#702D2B]">
            {language === 'ml' ? 'ജില്ല കണ്ടെത്താനായില്ല' : 'District Dossier Not Found'}
          </h2>
          <p className="text-xs sm:text-sm text-[#392A20]/80 leading-relaxed font-sans">
            {language === 'ml' ? 'ഈ ജില്ലയിലെ വിവരങ്ങൾ ലഭ്യമല്ല.' : 'Could not locate the requested district in the cultural database.'}
          </p>
          <button
            onClick={() => onNavigate('/districts')}
            className="px-5 py-2.5 rounded-xl bg-[#A64F32] hover:bg-[#8D3F26] text-white font-serif font-bold text-xs uppercase tracking-wider transition-all"
          >
            {language === 'ml' ? 'എല്ലാ ജില്ലകളിലേക്കും മടങ്ങുക' : 'Back to All 14 Districts'}
          </button>
        </div>
      </div>
    );
  }

  // Prioritize listings provided in district detail API, fall back to filtered global listings
  const districtListings = (district.listings && district.listings.length > 0)
    ? district.listings
    : listings.filter(l =>
        l.districts && l.districts.some(d => d.slug === district.slug)
      );

  const performingAndRitualArts = districtListings.filter(l =>
    ['ritual-arts', 'classical-arts', 'performing-arts', 'folk-dances', 'martial-arts'].includes(l.category?.slug)
  );
  const craftsListings = districtListings.filter(l =>
    l.category?.slug === 'traditional-crafts'
  );

  // Associated cultural places from backend detail or filtered from listings
  const districtPlaces = district.places || [];

  const title = language === 'ml' ? district.name_ml : district.name;
  const description = language === 'ml' ? district.description_ml : district.description_en;

  const handleCollectStamp = () => {
    collectStamp(district.slug, `${district.name} Heritage Stamp`);
  };

  return (
    <div className="w-full space-y-12 pb-24 bg-[#F7F0DF]">
      
      {/* 1. Authentic District Hero Banner */}
      <div className="relative h-[480px] w-full overflow-hidden bg-[#123B32]">
        <SafeImage
          src={district.hero_image}
          alt={district.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#123B32] via-black/45 to-black/25" />

        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <button
            onClick={() => onNavigate('/districts')}
            className="px-4 py-2 rounded-xl bg-[#FFFDF6]/90 border border-[#C6A15B]/50 text-xs font-serif font-bold text-[#405B43] flex items-center space-x-1.5 hover:bg-[#FFFDF6] shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-[#A64F32]" />
            <span>{language === 'ml' ? 'എല്ലാ ജില്ലകളും' : 'All Districts'}</span>
          </button>
        </div>

        <div className="absolute bottom-10 left-4 sm:left-8 right-4 sm:right-8 max-w-5xl space-y-3 text-white">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-serif font-bold uppercase bg-[#A64F32] text-white shadow-sm">
              District #{district.order}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-black/60 text-[#F7F0DF] border border-white/20 backdrop-blur-sm">
              HQ: {district.headquarters}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-black/60 text-[#F7F0DF] border border-white/20 backdrop-blur-sm">
              Area: {district.area_sq_km} sq.km
            </span>
          </div>

          <h1 className="font-serif font-black text-4xl sm:text-6xl text-[#F7F0DF] drop-shadow-md">
            {title}
          </h1>

          <p className="font-serif italic text-lg sm:text-2xl text-[#C6A15B]">
            {district.tagline}
          </p>

          <div className="text-[10px] text-white/70 font-mono">
            Photo Credit: {district.image_credit || 'Wikimedia Commons / CC BY-SA'}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* 2. District Cultural Introduction & Audio Dossier */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF6] border-2 border-[#C6A15B]/40 shadow-nalukettu space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#C6A15B]/25">
            <div>
              <span className="text-xs uppercase font-serif tracking-widest text-[#A64F32] font-bold">
                Cultural Heritage Overview
              </span>
              <h2 className="font-serif font-bold text-2xl text-[#405B43] mt-0.5">
                {language === 'ml' ? 'സാംസ്കാരിക പശ്ചാത്തലം' : `Heritage Character of ${district.name}`}
              </h2>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  if (isSpeaking) {
                    stopSpeaking();
                  } else {
                    speakText(description, language);
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-[#E8D8B8]/60 border border-[#C6A15B]/50 text-[#405B43] text-xs font-bold flex items-center space-x-1.5 hover:bg-[#E8D8B8] shadow-sm transition-all"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 text-red-600" /> : <Volume2 className="w-4 h-4 text-[#A64F32]" />}
                <span>{isSpeaking ? t.stopNarration : t.listenNarration}</span>
              </button>

              <button
                onClick={handleCollectStamp}
                className="px-4 py-2 rounded-xl bg-[#C6A15B] hover:bg-[#AB8742] text-[#123B32] font-serif font-bold text-xs uppercase tracking-wider shadow-kasavu flex items-center space-x-1.5 transition-all"
              >
                <Award className="w-4 h-4 text-[#123B32]" />
                <span>Collect Stamp</span>
              </button>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#392A20]/85 leading-relaxed font-normal">
            {description}
          </p>

          {/* District Editorial & Verification Note */}
          {district.history_editorial_note && (
            <div className="p-5 rounded-2xl bg-[#E8D8B8]/35 border-l-4 border-[#A64F32] border border-[#C6A15B]/40 shadow-sm flex items-start space-x-4 mt-4">
              <div className="p-2.5 rounded-xl bg-[#A64F32]/10 text-[#A64F32] flex-shrink-0 mt-0.5">
                <BookOpen className="w-5 h-5 text-[#A64F32]" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs uppercase font-serif tracking-widest text-[#A64F32] font-bold">
                    Editorial & Historical Dossier Note
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#31543E] text-white font-mono font-bold">
                    Archival Standard
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#392A20]/90 leading-relaxed font-serif italic">
                  {district.history_editorial_note}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 3. STEP 2 – Documented Art Forms in this District */}
        <div className="space-y-6">
          <div className="border-b border-[#C6A15B]/30 pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs uppercase font-serif tracking-widest text-[#A64F32] font-bold flex items-center space-x-1.5">
                <Feather className="w-4 h-4 text-[#A64F32]" />
                <span>Step 2 • District Cultural Traditions</span>
              </span>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#405B43] mt-1">
                {language === 'ml' ? `${title}യിലെ തനത് കലാരൂപങ്ങൾ` : `Documented Art Forms of ${district.name}`}
              </h3>
            </div>
            <span className="text-xs text-[#392A20]/70 font-mono">
              {performingAndRitualArts.length} Documented Masterpieces
            </span>
          </div>

          {performingAndRitualArts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {performingAndRitualArts.map(art => (
                <CulturalCard
                  key={art.id}
                  listing={art}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#FFFDF6] border border-[#C6A15B]/30 text-center">
              <p className="text-sm text-[#392A20]/70 font-serif">
                {language === 'ml'
                  ? 'ഈ ജില്ലയിലെ കൂടുതൽ കലാരൂപങ്ങൾ ഗവേഷണ സമിതി പരിശോധിച്ചുവരുന്നു.'
                  : `Additional localized art form records for ${district.name} are currently under curator review.`}
              </p>
            </div>
          )}
        </div>

        {/* 4. Traditional Crafts & Artisanship in this District */}
        {craftsListings.length > 0 && (
          <div className="space-y-6">
            <div className="border-b border-[#C6A15B]/30 pb-3">
              <span className="text-xs uppercase font-serif tracking-widest text-[#A64F32] font-bold">
                Generational Heritage
              </span>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#405B43] mt-1">
                {language === 'ml' ? 'പരമ്പരാഗത കരകൗശലങ്ങൾ' : `Traditional Crafts of ${district.name}`}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {craftsListings.map(craft => (
                <CulturalCard
                  key={craft.id}
                  listing={craft}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        )}

        {/* 5. Actual Places & Shrines Associated with These Traditions */}
        <div className="space-y-6">
          <div className="border-b border-[#C6A15B]/30 pb-3">
            <span className="text-xs uppercase font-serif tracking-widest text-[#A64F32] font-bold flex items-center space-x-1.5">
              <Building2 className="w-4 h-4 text-[#A64F32]" />
              <span>Verified Sacred Venues & Academies</span>
            </span>
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#405B43] mt-1">
              {language === 'ml' ? 'പൈതൃക കേന്ദ്രങ്ങളും ക്ഷേത്രങ്ങളും' : `Where to Experience Traditions in ${district.name}`}
            </h3>
          </div>

          {districtPlaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {districtPlaces.map(place => (
                <div
                  key={place.id}
                  className="p-6 rounded-2xl bg-[#FFFDF6] border border-[#C6A15B]/40 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#E8D8B8] text-[#405B43] font-bold border border-[#C6A15B]/30">
                        {place.venue_type_label || 'Cultural Venue'}
                      </span>
                      <h4 className="font-serif font-bold text-xl text-[#405B43] mt-1.5">
                        {place.name}
                      </h4>
                      <p className="text-xs text-[#A64F32] flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{place.locality}</span>
                      </p>
                    </div>

                    {place.art_form_title && (
                      <span className="text-[10px] px-2 py-1 rounded bg-[#F7F0DF] text-[#A64F32] font-serif font-bold border border-[#C6A15B]/30 text-right max-w-[130px] truncate">
                        {place.art_form_title}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#392A20]/80 leading-relaxed font-sans">
                    {place.description}
                  </p>

                  <div className="p-3.5 rounded-xl bg-[#F7F0DF] border border-[#C6A15B]/30 space-y-1.5 text-xs">
                    <div className="flex items-center space-x-1.5 text-[#405B43] font-serif font-bold">
                      <Clock className="w-3.5 h-3.5 text-[#A64F32]" />
                      <span>Visitor Access & Seasonality:</span>
                    </div>
                    <p className="text-[11px] text-[#392A20]/80 leading-relaxed">
                      {place.visitor_access_information}
                    </p>
                  </div>

                  {place.address && (
                    <div className="text-[11px] text-[#392A20]/70 font-mono">
                      Address: {place.address}
                    </div>
                  )}

                  {place.source_reference && (
                    <div className="text-[10px] text-[#392A20]/60 font-mono border-t border-[#C6A15B]/20 pt-2 flex items-center justify-between">
                      <span>Source: {place.source_reference}</span>
                      <span className="text-[#405B43] font-bold">Verified</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-[#FFFDF6] border border-[#C6A15B]/30 text-xs text-[#392A20]/75">
              Explore the interactive map for verified performance locations across {district.name}.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
