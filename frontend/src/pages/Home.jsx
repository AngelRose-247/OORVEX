import React, { useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePassport } from '../context/PassportContext';
import { useAccessibility } from '../context/AccessibilityContext';
import HeroMandala3D from '../components/HeroMandala3D';
import CinematicDoorIntro from '../components/CinematicDoorIntro';
import KeralaMap from '../components/KeralaMap';
import CulturalCard from '../components/CulturalCard';
import {
  Compass, Sparkles, MapPin, Landmark, BookOpen, Feather,
  ArrowRight, ShieldCheck, ChevronRight, Award, HeartHandshake, Eye,
  Building2, Music, Palette, Footprints, Clock, ExternalLink, Play
} from 'lucide-react';

export default function Home({
  districts = [],
  listings = [],
  categories = [],
  onNavigate,
  onOpenAI
}) {
  const { language, t } = useLanguage();
  const { progressPercent } = usePassport();
  const { reducedMotion } = useAccessibility();
  const welcomeSectionRef = useRef(null);

  // Cinematic 3D Wooden Door Opening state
  const [showDoorIntro, setShowDoorIntro] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return !sessionStorage.getItem('oorvex_door_intro_seen');
    } catch (e) {
      return false;
    }
  });

  const handleDoorIntroComplete = () => {
    setShowDoorIntro(false);
  };

  const handleReplayIntro = () => {
    setShowDoorIntro(true);
  };

  const handleEnterHeritage = () => {
    if (welcomeSectionRef.current) {
      welcomeSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate('/districts');
    }
  };

  // Group listings
  const performingAndRitualArts = listings.filter(l =>
    ['ritual-arts', 'classical-arts', 'performing-arts', 'martial-arts', 'folk-dances'].includes(l.category?.slug)
  ).slice(0, 6);

  const craftsListings = listings.filter(l =>
    l.category?.slug === 'traditional-crafts'
  ).slice(0, 4);

  // Curated list of verified cultural places to showcase on home
  const highlightPlaces = [
    {
      name: 'Kerala Kalamandalam',
      district: 'Thrissur',
      locality: 'Cheruthuruthy',
      type: 'Permanent Classical Academy',
      tradition: 'Kathakali & Koodiyattam',
      desc: 'Founded in 1930 by poet Vallathol, the world-renowned institution for traditional performing arts in the pristine Guru-Kula system.',
      timing: 'Campus visits: Mon-Fri 9:30 AM - 1:00 PM',
      link: '/districts/thrissur'
    },
    {
      name: 'Parassini Madappura Sree Muthappan Temple',
      district: 'Kannur',
      locality: 'Parassinikkadavu',
      type: 'Living Sacred Shrine',
      tradition: 'Daily Theyyam / Muthappan Vellattu',
      desc: 'Ancient riverbank sanctuary on the Valapattanam river where Theyyam rituals occur daily without caste or creed restrictions.',
      timing: 'Open daily; morning & evening enactments',
      link: '/districts/kannur'
    },
    {
      name: 'Kadammanitta Devi Temple Padayani Kalari',
      district: 'Pathanamthitta',
      locality: 'Kadammanitta',
      type: 'Ritual Center & Museum',
      tradition: 'Padayani Mask Dances',
      desc: 'The epicenter of Central Travancore Padayani, featuring an authentic mask museum and thunderous nocturnal Thappu drum festivals.',
      timing: 'Nocturnal festival annually in April',
      link: '/districts/pathanamthitta'
    },
    {
      name: 'Beypore Wooden Dhow Shipyard',
      district: 'Kozhikode',
      locality: 'Beypore Port',
      type: 'Living Artisanal Shipyard',
      tradition: 'Beypore Uru Handcrafting',
      desc: 'Master Khalasi shipwrights handcrafting majestic multi-deck teak dhows using centuries of oral mathematical memory.',
      timing: 'Open daily 9:00 AM - 6:00 PM',
      link: '/districts/kozhikode'
    }
  ];

  return (
    <div className="relative w-full overflow-hidden space-y-24 pb-20 bg-[#F6F0E4]">
      
      {/* =========================================================================
          CINEMATIC 3D DOORWAY OPENING EXPERIENCE (First Visit / On Replay)
          ========================================================================= */}
      {showDoorIntro && !reducedMotion && (
        <CinematicDoorIntro onComplete={handleDoorIntroComplete} />
      )}

      {/* =========================================================================
          HOMEPAGE HERO: Animated Kerala 3D Floral Mandala Centerpiece
          ========================================================================= */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#103B30]">
        
        {/* Three.js Procedural 3D Kerala Floral Mandala (Zero square particles) */}
        <HeroMandala3D />

        {/* Ambient Warm Golden Sunlight Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#C9A45C]/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Hero Content Overlay (Positioned with perfect contrast and z-index) */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-7 py-20 pointer-events-auto">
          
          {/* Traditional Brass Lamp Motif Crest */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#103B30]/85 border border-[#C9A45C]/50 text-[#F6F0E4] shadow-md backdrop-blur-md">
            <span className="text-base">🪔</span>
            <span className="text-xs uppercase tracking-widest font-sans font-semibold text-[#C9A45C]">
              {language === 'ml' ? 'കേരള സംസ്കാരത്തിന്റെ ഡിജിറ്റൽ മ്യൂസിയം' : "The Living Culture Map of Kerala"}
            </span>
          </div>

          {/* Majestic Hero Headings */}
          <div className="space-y-4">
            <h1 className="font-serif font-black text-6xl sm:text-8xl lg:text-9xl tracking-widest text-[#F6F0E4] drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
              <span className="bg-gradient-to-b from-[#FFFCF5] via-[#F4D06F] to-[#C9A45C] bg-clip-text text-transparent">
                OORVEX
              </span>
            </h1>
            
            <p className="font-serif italic text-2xl sm:text-4xl text-[#C9A45C] font-semibold drop-shadow-sm">
              Mapping Heritage. Connecting Generations.
            </p>

            <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#F6F0E4]/90 leading-relaxed font-sans">
              {language === 'ml'
                ? 'ഉത്തര മലബാറിലെ തെയ്യക്കാവുകൾ മുതൽ തിരുവിതാംകൂറിലെ ആറന്മുളക്കണ്ണാടി വരെ; കേരളത്തിന്റെ 14 ജില്ലകളിലെയും തനത് പൈതൃകങ്ങളിലൂടെ ഒരു സിനിമാറ്റിക് സാംസ്കാരിക തീർത്ഥയാത്ര.'
                : 'Step through the sacred wooden threshold of God’s Own Country into a living universe of ritual theatre, classical dance, generational craftsmanship, and oral memory.'}
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            {/* Primary: Explore Kerala */}
            <button
              onClick={() => onNavigate('/districts')}
              className="w-full sm:w-auto px-9 py-4 rounded-full bg-[#C9A45C] hover:bg-[#B28E46] text-[#103B30] font-sans font-bold text-xs tracking-widest uppercase shadow-kasavu hover:scale-105 transition-all flex items-center justify-center space-x-2.5"
            >
              <span>{language === 'ml' ? 'കേരളത്തെ അറിയാം' : 'EXPLORE KERALA'}</span>
              <ArrowRight className="w-4 h-4 text-[#103B30]" />
            </button>

            {/* Secondary: Discover Our Culture */}
            <button
              onClick={() => onNavigate('/listings')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 border-2 border-[#C9A45C]/60 text-[#F6F0E4] font-sans font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center space-x-2.5 shadow-sm hover:scale-105"
            >
              <Feather className="w-4 h-4 text-[#C9A45C]" />
              <span>{language === 'ml' ? 'സംസ്കാരത്തെ കണ്ടെത്താം' : 'DISCOVER OUR CULTURE'}</span>
            </button>

            {/* Replay 3D Intro Option */}
            <button
              onClick={handleReplayIntro}
              className="w-full sm:w-auto px-5 py-4 rounded-full bg-black/20 hover:bg-black/35 border border-[#C9A45C]/40 text-[#C9A45C] hover:text-[#F6F0E4] font-sans font-medium text-xs tracking-wide transition-all flex items-center justify-center space-x-2"
              title="Replay the 3D wooden doors opening experience"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{language === 'ml' ? '3D ആമുഖം കാണുക' : 'Replay Intro 🎬'}</span>
            </button>
          </div>

          {/* Authentic Database-Grounded Statistics Strip (No fake 100% claims) */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="p-3.5 rounded-2xl bg-[#103B30]/85 border border-[#C9A45C]/40 shadow-sm backdrop-blur-sm">
              <span className="font-serif font-bold text-2xl text-[#C9A45C]">14</span>
              <p className="text-[11px] text-[#F6F0E4]/80 uppercase font-sans mt-0.5 font-bold">
                {language === 'ml' ? 'ജില്ലകൾ' : 'Districts Mapped'}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#103B30]/85 border border-[#C9A45C]/40 shadow-sm backdrop-blur-sm">
              <span className="font-serif font-bold text-2xl text-[#C9A45C]">30+</span>
              <p className="text-[11px] text-[#F6F0E4]/80 uppercase font-sans mt-0.5 font-bold">
                {language === 'ml' ? 'തനത് പൈതൃകങ്ങൾ' : 'Living Traditions'}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#103B30]/85 border border-[#C9A45C]/40 shadow-sm backdrop-blur-sm">
              <span className="font-serif font-bold text-2xl text-[#C9A45C]">15+</span>
              <p className="text-[11px] text-[#F6F0E4]/80 uppercase font-sans mt-0.5 font-bold">
                {language === 'ml' ? 'സാംസ്കാരിക കേന്ദ്രങ്ങൾ' : 'Heritage Venues'}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#103B30]/85 border border-[#C9A45C]/40 shadow-sm backdrop-blur-sm">
              <span className="font-serif font-bold text-2xl text-[#C9A45C]">EN / ML</span>
              <p className="text-[11px] text-[#F6F0E4]/80 uppercase font-sans mt-0.5 font-bold">
                {language === 'ml' ? 'ദ്വിഭാഷാ ശേഖരം' : 'Bilingual Repository'}
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Scroll Indicator Pill */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden md:block">
          <button
            onClick={handleEnterHeritage}
            className="flex flex-col items-center space-y-1 text-xs text-[#C9A45C]/75 hover:text-[#C9A45C] transition-colors"
          >
            <span className="text-[10px] tracking-widest uppercase font-sans">Scroll to Discover</span>
            <ChevronRight className="w-4 h-4 rotate-90 animate-bounce" />
          </button>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1 – Welcome to Kerala's Heritage
          ========================================================================= */}
      <section ref={welcomeSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#E8D8B8] text-[#31543E] border border-[#C9A45C]/40 text-xs font-sans font-bold">
              <span>Section 1 • Welcome to God’s Own Country</span>
            </div>

            <h2 className="font-serif font-bold text-3xl sm:text-5xl text-[#31543E] leading-tight">
              {language === 'ml'
                ? 'ആയിരം കൊല്ലത്തെ വാമൊഴിയും അനുഷ്ഠാന പൈതൃകവും'
                : 'A Millennial Symphony of Sacred Rituals & Classical Splendour'}
            </h2>

            <p className="text-sm sm:text-base text-[#2B1E16]/85 leading-relaxed font-normal">
              {language === 'ml'
                ? 'അറബിക്കടലിന്റെ തിരമാലകൾക്കും പശ്ചിമഘട്ട മലനിരകൾക്കുമിടയിൽ പടർന്നുപന്തലിച്ച അനുപമമായ ഒരു സാംസ്കാരിക സംസ്കൃതിയാണ് കേരളം. കാവുകളിലെ തീച്ചാമുണ്ഡി തെയ്യങ്ങൾ മുതൽ കൂത്തമ്പലങ്ങളിലെ സംസ്കൃത നാട്യവും വള്ളക്കടവുകളിലെ ഉരു നിർമ്മാണവും വരെ ഇവിടെ തലമുറകളിലൂടെ കൈമാറ്റം ചെയ്യപ്പെടുന്നു.'
                : 'Cradled between the Arabian Sea and the rainforest-clad Western Ghats, Kerala preserves one of the world’s most unbroken arrays of living intangible cultural heritage. From ecstatic Theyyam trances in sacred groves to UNESCO-recognized Sanskrit Koodiyattam and the metallurgy secrets of front-surface bronze mirrors, every tradition reflects deep harmony with nature and community solidarity.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#FFFCF5] border border-[#C9A45C]/35 shadow-sm space-y-1">
                <span className="font-serif font-bold text-sm text-[#31543E] block">Official Sources</span>
                <span className="text-[11px] text-[#2B1E16]/75">Kerala Tourism & Folklore Academy</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FFFCF5] border border-[#C9A45C]/35 shadow-sm space-y-1">
                <span className="font-serif font-bold text-sm text-[#31543E] block">UNESCO Status</span>
                <span className="text-[11px] text-[#2B1E16]/75">Koodiyattam & Mudiyettu</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FFFCF5] border border-[#C9A45C]/35 shadow-sm space-y-1">
                <span className="font-serif font-bold text-sm text-[#31543E] block">GI Heritage</span>
                <span className="text-[11px] text-[#2B1E16]/75">Aranmula Mirror & Balaramapuram</span>
              </div>
            </div>
          </div>

          {/* Authentic Kerala Heritage Visual Showcase */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-[#C9A45C]/40 shadow-nalukettu-lg">
            <img
              src="https://images.unsplash.com/photo-1600100397608-f010f443b749?auto=format&fit=crop&w=1200&q=80"
              alt="Authentic Kerala Theyyam Tradition"
              className="w-full h-[450px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
              <span className="text-xs uppercase font-mono tracking-widest text-[#C9A45C] font-bold">
                Living Heritage of North Malabar
              </span>
              <h3 className="font-serif font-bold text-xl text-white">
                Muchilot Bhagavathi Theyyam Ritual
              </h3>
              <p className="text-xs text-white/80 line-clamp-2">
                Documented in Sangam literature and celebrated across the sacred groves of Kannur and Kasaragod.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2 – Explore the 14 Districts (Interactive Kerala Map)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#C9A45C]/30 pb-4">
          <div>
            <span className="text-xs uppercase font-sans tracking-widest text-[#9E4035] font-bold flex items-center space-x-1.5">
              <Compass className="w-4 h-4 text-[#9E4035]" />
              <span>Section 2 • Geographic Heritage Cartography</span>
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#31543E] mt-1">
              {language === 'ml' ? '14 ജില്ലകളിലൂടെ ഭൂപട യാത്ര' : 'Explore the 14 Districts of Kerala'}
            </h2>
            <p className="text-sm text-[#2B1E16]/80 max-w-xl mt-1 leading-relaxed">
              {language === 'ml'
                ? 'ഭൂപടത്തിൽ ഓരോ ജില്ലയും തിരഞ്ഞെടുത്ത് അവയുടെ തനത് കലാരൂപങ്ങളും അനുഷ്ഠാന കേന്ദ്രങ്ങളും കണ്ടെത്തുക.'
                : 'Select any district on the interactive map to inspect documented cultural traditions, authentic photographs, and verified practice locations.'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('/map')}
            className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-[#FFFCF5] border-2 border-[#C9A45C]/50 text-[#31543E] hover:border-[#31543E] text-xs font-sans font-bold flex items-center space-x-2 transition-all shadow-sm"
          >
            <span>{language === 'ml' ? 'പൂർണ്ണ ഭൂപടം തുറക്കുക' : 'Full Screen Map View'}</span>
            <ArrowRight className="w-4 h-4 text-[#9E4035]" />
          </button>
        </div>

        {/* Interactive Leaflet Map Component */}
        <KeralaMap
          districts={districts}
          listings={listings}
          categories={categories}
          onNavigate={onNavigate}
        />
      </section>

      {/* =========================================================================
          SECTION 3 – Discover the Art Forms
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between border-b border-[#C9A45C]/30 pb-4">
          <div>
            <span className="text-xs uppercase font-sans tracking-widest text-[#9E4035] font-bold">
              Section 3 • Masterpieces of God's Own Country
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#31543E] mt-1">
              {language === 'ml' ? 'തനത് കലാരൂപങ്ങൾ കണ്ടെത്താം' : 'Discover the Art Forms'}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/listings')}
            className="text-xs text-[#9E4035] hover:underline font-sans font-bold flex items-center space-x-1"
          >
            <span>{language === 'ml' ? 'എല്ലാ കലാരൂപങ്ങളും' : 'Explore All Arts'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Image-rich Art-Form Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {performingAndRitualArts.map((art) => (
            <CulturalCard
              key={art.id}
              listing={art}
              onClick={() => onNavigate(`/cultural-listings/${art.id}`)}
              onDistrictClick={(distName) => {
                const distObj = districts.find(d => d.name.toLowerCase() === distName.toLowerCase());
                if (distObj) onNavigate(`/districts/${distObj.slug}`);
              }}
            />
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 – Living Traditions & Cultural Craftsmanship
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between border-b border-[#C9A45C]/30 pb-4">
          <div>
            <span className="text-xs uppercase font-sans tracking-widest text-[#9E4035] font-bold">
              Section 4 • Master Craftsmanship & Heritage Guilds
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#31543E] mt-1">
              {language === 'ml' ? 'പാരമ്പര്യ കരകൗശലങ്ങൾ' : 'Living Traditions & Master Crafts'}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/crafts')}
            className="text-xs text-[#9E4035] hover:underline font-sans font-bold flex items-center space-x-1"
          >
            <span>{language === 'ml' ? 'എല്ലാ കരകൗശലങ്ങളും' : 'Explore Crafts Gallery'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {craftsListings.map((craft) => (
            <div
              key={craft.id}
              onClick={() => onNavigate(`/cultural-listings/${craft.id}`)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-[#FFFCF5] border border-[#C9A45C]/35 shadow-sm hover:shadow-nalukettu hover:border-[#31543E] transition-all flex flex-col"
            >
              <div className="relative h-44 overflow-hidden bg-stone-200">
                <img
                  src={craft.primary_image}
                  alt={craft.title_en}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-[#103B30]/85 text-[#F6F0E4] text-[10px] font-sans font-semibold border border-[#C9A45C]/40">
                  {craft.district?.name}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#31543E] group-hover:text-[#9E4035] transition-colors">
                    {craft.title_en}
                  </h3>
                  <p className="text-xs text-[#9E4035] font-malayalam mt-0.5">
                    {craft.title_ml}
                  </p>
                  <p className="text-xs text-[#2B1E16]/75 line-clamp-2 mt-2 leading-relaxed">
                    {craft.description_en}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#C9A45C]/25 flex items-center justify-between text-xs text-[#C9A45C] font-sans font-bold">
                  <span>View Artisan History</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 5 – Explore Cultural Places (Real Centers & Academies)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-[#C9A45C]/30 pb-4">
          <span className="text-xs uppercase font-sans tracking-widest text-[#9E4035] font-bold">
            Section 5 • Sacred Spaces & Living Centers
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#31543E] mt-1">
            {language === 'ml' ? 'സാംസ്കാരിക തീർത്ഥാടന കേന്ദ്രങ്ങൾ' : 'Explore Cultural Places'}
          </h2>
          <p className="text-sm text-[#2B1E16]/80 max-w-xl mt-1 leading-relaxed">
            Real institutional academies, sacred groves, and master artisan yards where these timeless arts continue to thrive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {highlightPlaces.map((place, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate(place.link)}
              className="cursor-pointer p-6 rounded-2xl bg-[#FFFCF5] border border-[#C9A45C]/35 shadow-sm hover:shadow-nalukettu hover:border-[#31543E] transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#E8D8B8] text-[#31543E] font-bold">
                    {place.type}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-[#31543E] mt-1.5">
                    {place.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-[#9E4035] mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{place.locality}, {place.district}</span>
                    <span>•</span>
                    <span className="font-semibold">{place.tradition}</span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#31543E]/10 flex items-center justify-center flex-shrink-0 text-[#31543E]">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>

              <p className="text-xs text-[#2B1E16]/80 leading-relaxed font-sans">
                {place.desc}
              </p>

              <div className="pt-2 border-t border-[#C9A45C]/20 flex items-center justify-between text-xs text-[#2B1E16]/70">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-[#C9A45C]" />
                  <span>{place.timing}</span>
                </span>
                <span className="text-[#9E4035] font-sans font-bold flex items-center space-x-1 group">
                  <span>Explore District</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 6 – Community Heritage Contribution Banner
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#103B30] via-[#31543E] to-[#103B30] text-[#F6F0E4] border-2 border-[#C9A45C]/40 shadow-nalukettu-lg relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#C9A45C]/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-[#C9A45C]/40 text-xs text-[#C9A45C] font-sans font-bold">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Preserve Local Heritage</span>
            </div>

            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#F6F0E4]">
              {language === 'ml'
                ? 'നിങ്ങളുടെ നാടിന്റെ പൈതൃകം രേഖപ്പെടുത്താം'
                : 'Document Your Local Heritage'}
            </h2>

            <p className="text-xs sm:text-sm text-[#F6F0E4]/85 leading-relaxed font-sans">
              {language === 'ml'
                ? 'നിങ്ങളുടെ ഗ്രാമത്തിലെ പരമ്പരാഗത ആചാരങ്ങൾ, വാമൊഴി കഥകൾ, പരമ്പരാഗത കരകൗശലങ്ങൾ എന്നിവ വരുംതലമുറകൾക്കായി ഡിജിറ്റലായി സംരക്ഷിക്കാൻ ഊർവെക്സ് ആർക്കൈവിലേക്ക് സമർപ്പിക്കുക.'
                : 'Help preserve endangered village traditions, oral folklore, and master artisan legacies for future generations. All submissions are verified by cultural researchers before publication.'}
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('/contribute')}
                className="px-6 py-3 rounded-full bg-[#C9A45C] hover:bg-[#B28E46] text-[#103B30] font-sans font-bold text-xs tracking-wider uppercase shadow-kasavu transition-all"
              >
                {language === 'ml' ? 'വിവരങ്ങൾ പങ്കുവെക്കാം' : 'Submit Cultural Record'}
              </button>

              <button
                onClick={() => onNavigate('/about')}
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-[#C9A45C]/40 text-[#F6F0E4] font-sans font-semibold text-xs tracking-wide transition-all"
              >
                {language === 'ml' ? 'ദൗത്യത്തെക്കുറിച്ച്' : 'Learn About The Project'}
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
