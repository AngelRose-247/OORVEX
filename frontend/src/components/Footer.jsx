import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Landmark, Heart, Shield, BookOpen, Compass, ExternalLink } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const { language, t } = useLanguage();

  const districts = [
    { name: 'Kasaragod', slug: 'kasaragod' },
    { name: 'Kannur', slug: 'kannur' },
    { name: 'Wayanad', slug: 'wayanad' },
    { name: 'Kozhikode', slug: 'kozhikode' },
    { name: 'Malappuram', slug: 'malappuram' },
    { name: 'Palakkad', slug: 'palakkad' },
    { name: 'Thrissur', slug: 'thrissur' },
    { name: 'Ernakulam', slug: 'ernakulam' },
    { name: 'Idukki', slug: 'idukki' },
    { name: 'Kottayam', slug: 'kottayam' },
    { name: 'Alappuzha', slug: 'alappuzha' },
    { name: 'Pathanamthitta', slug: 'pathanamthitta' },
    { name: 'Kollam', slug: 'kollam' },
    { name: 'Thiruvananthapuram', slug: 'thiruvananthapuram' }
  ];

  return (
    <footer className="w-full bg-[#040F0D] border-t border-heritage-gold/25 pt-16 pb-12 text-heritage-ivory/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-heritage-gold/15">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🪔</span>
              <div>
                <span className="font-serif font-black text-2xl tracking-widest text-gold-gradient">
                  OORVEX
                </span>
                <p className="text-xs text-heritage-gold/80 font-mono">
                  {language === 'ml' ? 'കേരള സംസ്കാരത്തിന്റെ ഡിജിറ്റൽ പ്രപഞ്ചം' : "The Digital Universe of Kerala's Culture"}
                </p>
              </div>
            </div>
            
            <p className="text-sm leading-relaxed text-heritage-ivory/70 max-w-sm">
              {t.footerTagline}
            </p>

            <div className="p-3.5 rounded-xl bg-heritage-forest/40 border border-heritage-gold/20 text-xs space-y-1">
              <div className="text-heritage-gold font-semibold flex items-center space-x-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>Hackathon Problem Statements</span>
              </div>
              <p className="text-heritage-ivory/70">
                <strong>PS-05:</strong> Discovery & Mapping: The Living Culture Map
              </p>
              <p className="text-heritage-ivory/70">
                <strong>PS-04:</strong> Language & Accessibility: Culture in Every Voice
              </p>
            </div>
          </div>

          {/* District Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-sm uppercase tracking-wider text-heritage-gold font-bold">
              {language === 'ml' ? '14 ജില്ലകൾ' : 'All 14 Districts'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {districts.map((d) => (
                <button
                  key={d.slug}
                  onClick={() => onNavigate(`/districts/${d.slug}`)}
                  className="text-left text-heritage-ivory/70 hover:text-heritage-gold transition-colors py-1 truncate"
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm uppercase tracking-wider text-heritage-gold font-bold">
              {language === 'ml' ? 'പ്രധാന ലിങ്കുകൾ' : 'Discovery'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/map')} className="hover:text-heritage-gold transition-colors">
                  {t.interactiveMap}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/listings')} className="hover:text-heritage-gold transition-colors">
                  {t.navArts}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/crafts')} className="hover:text-heritage-gold transition-colors">
                  {t.navCrafts}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/stories')} className="hover:text-heritage-gold transition-colors">
                  {t.navStories}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/glossary')} className="hover:text-heritage-gold transition-colors">
                  {t.navGlossary}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contribute')} className="hover:text-heritage-gold transition-colors">
                  {t.navContribute}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/admin')} className="hover:text-heritage-gold transition-colors">
                  {t.navAdmin}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Integrity */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-heritage-ivory/50 gap-4">
          <p>© 2026 OORVEX. {t.rights}</p>
          <div className="flex items-center space-x-4">
            <span>OpenStreetMap Attribution</span>
            <span>•</span>
            <span>Kerala Sangeetha Nataka Akademi Archives</span>
            <span>•</span>
            <span>ASI Cultural Commons</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
