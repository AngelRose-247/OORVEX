import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePassport } from '../context/PassportContext';
import {
  Compass, Sparkles, Languages, Sliders, Menu, X, Landmark,
  BookOpen, Feather, ShieldCheck, MapPin
} from 'lucide-react';

export default function Navbar({ onOpenAI, onOpenAccessibility, currentPath, onNavigate }) {
  const { language, toggleLanguage, t } = useLanguage();
  const { progressPercent, setIsOpen: setPassportOpen } = usePassport();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t.navHome, path: '/' },
    { id: 'map', label: t.navMap, path: '/map', icon: MapPin },
    { id: 'districts', label: t.navDistricts, path: '/districts', icon: Landmark },
    { id: 'arts', label: t.navArts, path: '/listings', icon: Feather },
    { id: 'crafts', label: t.navCrafts, path: '/crafts' },
    { id: 'stories', label: t.navStories, path: '/stories', icon: BookOpen },
    { id: 'glossary', label: t.navGlossary, path: '/glossary' },
    { id: 'contribute', label: t.navContribute, path: '/contribute' },
    { id: 'admin', label: t.navAdmin, path: '/admin', icon: ShieldCheck },
  ];

  const handleNavClick = (path) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel-dark border-b border-heritage-gold/20 shadow-emerald-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Identity */}
          <div
            onClick={() => handleNavClick('/')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-heritage-gold via-heritage-goldDark to-heritage-forest p-[2px] shadow-gold-subtle group-hover:shadow-gold-glow transition-all">
              <div className="w-full h-full rounded-full bg-heritage-dark flex items-center justify-center">
                <span className="text-xl">🪔</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-black text-2xl tracking-widest text-gold-gradient">
                  OORVEX
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-heritage-gold/20 text-heritage-gold font-mono border border-heritage-gold/30">
                  കേരളം
                </span>
              </div>
              <p className="text-[10px] tracking-wider text-heritage-ivory/70 uppercase font-medium">
                {language === 'ml' ? 'സാംസ്കാരിക പ്രപഞ്ചം' : "Kerala's Cultural Universe"}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.path)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-heritage-gold/20 text-heritage-gold border border-heritage-gold/40 shadow-gold-subtle'
                      : 'text-heritage-ivory/80 hover:text-heritage-gold hover:bg-heritage-forest/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Tools & Badges */}
          <div className="hidden sm:flex items-center space-x-3">
            
            {/* CultureMatch AI Quick Trigger */}
            <button
              onClick={onOpenAI}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-heritage-goldDark/40 to-heritage-gold/20 border border-heritage-gold/60 text-heritage-ivoryLight hover:border-heritage-gold hover:shadow-gold-glow transition-all text-xs font-semibold group"
              title="Launch CultureMatch AI"
            >
              <Sparkles className="w-4 h-4 text-heritage-gold group-hover:rotate-12 transition-transform" />
              <span>CultureMatch</span>
            </button>

            {/* Cultural Passport Pill */}
            <button
              onClick={() => setPassportOpen(true)}
              className="flex items-center space-x-2 px-3 py-2 rounded-full bg-heritage-forest/80 border border-heritage-gold/30 text-heritage-ivory text-xs font-medium hover:border-heritage-gold transition-all"
              title="Open Cultural Passport"
            >
              <Compass className="w-4 h-4 text-heritage-gold" />
              <span>{progressPercent}%</span>
            </button>

            {/* Bilingual Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-heritage-forest/60 border border-heritage-gold/30 hover:border-heritage-gold text-xs font-semibold text-heritage-gold transition-all"
              title="Toggle English / Malayalam"
            >
              <Languages className="w-4 h-4 text-heritage-gold" />
              <span>{language === 'en' ? 'മലയാളം' : 'English'}</span>
            </button>

            {/* Accessibility Controls Button */}
            <button
              onClick={onOpenAccessibility}
              className="p-2 rounded-lg bg-heritage-forest/60 border border-heritage-gold/30 hover:border-heritage-gold text-heritage-gold transition-all"
              title={t.accessTitle}
              aria-label={t.accessTitle}
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex xl:hidden items-center space-x-2">
            <button
              onClick={onOpenAI}
              className="p-2 rounded-full bg-heritage-gold/20 text-heritage-gold border border-heritage-gold/40"
              title="CultureMatch AI"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded bg-heritage-forest text-xs font-bold text-heritage-gold border border-heritage-gold/30"
            >
              {language === 'en' ? 'ML' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-heritage-ivory hover:text-heritage-gold bg-heritage-forest/60 border border-heritage-gold/30"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden glass-panel-dark border-t border-heritage-gold/20 px-4 pt-4 pb-6 space-y-2">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-heritage-gold/20">
            <button
              onClick={() => { setPassportOpen(true); setMobileMenuOpen(false); }}
              className="flex items-center justify-center space-x-2 py-2 px-3 rounded-lg bg-heritage-forest border border-heritage-gold/30 text-xs text-heritage-ivory"
            >
              <Compass className="w-4 h-4 text-heritage-gold" />
              <span>{t.passportBtn} ({progressPercent}%)</span>
            </button>
            <button
              onClick={() => { onOpenAccessibility(); setMobileMenuOpen(false); }}
              className="flex items-center justify-center space-x-2 py-2 px-3 rounded-lg bg-heritage-forest border border-heritage-gold/30 text-xs text-heritage-ivory"
            >
              <Sliders className="w-4 h-4 text-heritage-gold" />
              <span>{t.accessTitle}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-all ${
                  currentPath === item.path
                    ? 'bg-heritage-gold/20 text-heritage-gold border border-heritage-gold/40'
                    : 'text-heritage-ivory/80 hover:bg-heritage-forest/60'
                }`}
              >
                {item.icon && <item.icon className="w-4 h-4 text-heritage-gold" />}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
