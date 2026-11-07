import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePassport } from '../context/PassportContext';
import {
  Compass, Sparkles, Languages, Sliders, Menu, X, Landmark,
  BookOpen, Feather, ShieldCheck, MapPin, ChevronDown, Award
} from 'lucide-react';

export default function Navbar({ onOpenAI, onOpenAccessibility, currentPath, onNavigate }) {
  const { language, toggleLanguage, t } = useLanguage();
  const { progressPercent, setIsOpen: setPassportOpen } = usePassport();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef(null);

  // Close "More" dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary 6 navigation items
  const primaryNavItems = [
    { id: 'home', label: language === 'ml' ? 'ഹോം' : 'Home', path: '/' },
    { id: 'map', label: language === 'ml' ? 'സാംസ്കാരിക ഭൂപടം' : 'Culture Map', path: '/map', icon: MapPin },
    { id: 'districts', label: language === 'ml' ? '14 ജില്ലകൾ' : '14 Districts', path: '/districts', icon: Landmark },
    { id: 'arts', label: language === 'ml' ? 'അരങ്ങു കലകൾ' : 'Performing Arts', path: '/listings', icon: Feather },
    { id: 'crafts', label: language === 'ml' ? 'തനത് കരകൗശലങ്ങൾ' : 'Traditional Crafts', path: '/crafts' },
    { id: 'stories', label: language === 'ml' ? 'പൈതൃക കഥകൾ' : 'Cultural Stories', path: '/stories', icon: BookOpen },
  ];

  // Secondary items (accessible in "More" on medium screens, and directly on wide screens)
  const secondaryNavItems = [
    { id: 'glossary', label: language === 'ml' ? 'മലയാള പദാവലി' : 'Malayalam Glossary', path: '/glossary' },
    { id: 'contribute', label: language === 'ml' ? 'പങ്കുവെക്കാം' : 'Contribute', path: '/contribute' },
    { id: 'admin', label: language === 'ml' ? 'ക്യൂറേറ്റർ അഡ്മിൻ' : 'Curator Admin', path: '/admin', icon: ShieldCheck },
  ];

  const allNavItems = [...primaryNavItems, ...secondaryNavItems];

  const handleNavClick = (path) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
  };

  const isSecondaryActive = secondaryNavItems.some(item => currentPath === item.path);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#31543E] border-b border-[#C9A45C]/35 shadow-nalukettu text-[#F6F0E4]">
      {/* Decorative Traditional Kerala Kasavu Gold Inlay Top Stripe */}
      <div className="w-full h-1 bg-gradient-to-r from-[#9C7A34] via-[#C9A45C] to-[#9C7A34]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* =========================================================================
              Brand Identity: Premium Digital Cultural Museum Crest
              ========================================================================= */}
          <div
            onClick={() => handleNavClick('/')}
            className="flex items-center space-x-3 cursor-pointer group flex-shrink-0"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#C9A45C] via-[#9E4035] to-[#103B30] p-[2px] shadow-sm group-hover:scale-105 transition-all">
              <div className="w-full h-full rounded-full bg-[#103B30] flex items-center justify-center">
                <span className="text-xl">🪔</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-black text-2xl tracking-widest text-[#F6F0E4] group-hover:text-[#C9A45C] transition-colors">
                  OORVEX
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#103B30] border border-[#C9A45C]/40 text-[#C9A45C] font-mono font-semibold">
                  കേരളം
                </span>
              </div>
              <p className="text-[10px] tracking-wider text-[#F6F0E4]/80 font-sans font-medium">
                {language === 'ml' ? 'സാംസ്കാരിക മ്യൂസിയം & ഭൂപടം' : 'Digital Museum & Heritage Map'}
              </p>
            </div>
          </div>

          {/* =========================================================================
              Desktop Navigation Links (Spaced, Clean, No Overcrowding)
              ========================================================================= */}
          
          {/* Extra Wide Screens (>= 1380px): Show All 9 Links Directly */}
          <nav className="hidden 2xl:flex items-center space-x-1.5 flex-shrink-0">
            {allNavItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.path)}
                  className={`px-2.5 py-1.5 text-xs font-sans font-medium rounded-lg whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#C9A45C] text-[#103B30] font-bold shadow-sm'
                      : 'text-[#F6F0E4] hover:text-[#C9A45C] hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Large Screens (1024px to 1379px): Show Primary 6 + Sleek "More" Dropdown */}
          <nav className="hidden lg:flex 2xl:hidden items-center space-x-1 flex-shrink-0">
            {primaryNavItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.path)}
                  className={`px-2.5 py-1.5 text-xs font-sans font-medium rounded-lg whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#C9A45C] text-[#103B30] font-bold shadow-sm'
                      : 'text-[#F6F0E4] hover:text-[#C9A45C] hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* "More" Heritage Archives Dropdown */}
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`px-2.5 py-1.5 text-xs font-sans font-medium rounded-lg whitespace-nowrap transition-all flex items-center space-x-1 ${
                  isSecondaryActive
                    ? 'bg-[#C9A45C] text-[#103B30] font-bold shadow-sm'
                    : 'text-[#F6F0E4] hover:text-[#C9A45C] hover:bg-white/10'
                }`}
              >
                <span>{language === 'ml' ? 'കൂടുതൽ' : 'More'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#103B30] border border-[#C9A45C]/40 shadow-nalukettu-lg py-2 z-50">
                  {secondaryNavItems.map((item) => {
                    const isActive = currentPath === item.path;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.path)}
                        className={`w-full text-left px-4 py-2.5 text-xs font-sans transition-colors flex items-center space-x-2 ${
                          isActive
                            ? 'bg-[#C9A45C] text-[#103B30] font-bold'
                            : 'text-[#F6F0E4] hover:bg-white/10 hover:text-[#C9A45C]'
                        }`}
                      >
                        {item.icon && <item.icon className="w-3.5 h-3.5 text-[#C9A45C]" />}
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* =========================================================================
              Action Tools & Badges
              ========================================================================= */}
          <div className="flex items-center space-x-2 sm:space-x-2.5 flex-shrink-0">
            
            {/* CultureMatch AI Quick Trigger */}
            <button
              onClick={onOpenAI}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-[#C9A45C] hover:bg-[#B28E46] text-[#103B30] font-sans font-bold text-xs shadow-kasavu transition-all group"
              title="Launch CultureMatch AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#103B30] group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">CultureMatch</span>
            </button>

            {/* Cultural Passport Pill */}
            <button
              onClick={() => setPassportOpen(true)}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-full bg-white/10 border border-[#C9A45C]/40 text-[#F6F0E4] text-xs font-sans font-medium hover:border-[#C9A45C] hover:bg-white/15 transition-all"
              title="Open Cultural Passport"
            >
              <Compass className="w-3.5 h-3.5 text-[#C9A45C]" />
              <span className="font-mono">{progressPercent}%</span>
            </button>

            {/* Bilingual Switcher (English / മലയാളം) */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-full bg-white/10 border border-[#C9A45C]/40 text-[#F6F0E4] hover:border-[#C9A45C] text-xs font-sans font-semibold transition-all"
              title="Switch Language (മലയാളം / English)"
            >
              <Languages className="w-3.5 h-3.5 text-[#C9A45C]" />
              <span>{language === 'en' ? 'മലയാളം' : 'English'}</span>
            </button>

            {/* Accessibility Settings Toggle */}
            <button
              onClick={onOpenAccessibility}
              className="p-2 rounded-full bg-white/10 border border-[#C9A45C]/40 text-[#F6F0E4] hover:text-[#C9A45C] hover:bg-white/15 transition-all"
              title="Accessibility Controls"
              aria-label="Open Accessibility Controls"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/10 border border-[#C9A45C]/40 text-[#F6F0E4] hover:text-[#C9A45C] lg:hidden transition-all"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* =========================================================================
          Responsive Mobile Drawer Navigation
          ========================================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#103B30] border-t border-[#C9A45C]/35 px-4 pt-4 pb-6 space-y-3 shadow-nalukettu-lg animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {allNavItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-sans font-medium transition-all ${
                    isActive
                      ? 'bg-[#C9A45C] text-[#103B30] font-bold shadow-sm'
                      : 'text-[#F6F0E4] hover:bg-white/10 hover:text-[#C9A45C]'
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4 text-[#C9A45C]" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Bottom Actions */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => {
                setPassportOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 text-xs text-[#C9A45C] font-sans font-bold"
            >
              <Compass className="w-4 h-4" />
              <span>Cultural Passport ({progressPercent}%)</span>
            </button>

            <button
              onClick={() => {
                onOpenAI();
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#C9A45C] text-[#103B30] text-xs font-bold font-sans"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>CultureMatch</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
