import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Compass, MapPin, Feather, Landmark, BookOpen, ShieldCheck,
  Heart, ExternalLink, Sparkles, Award
} from 'lucide-react';

export default function Footer({ onNavigate }) {
  const { language, t } = useLanguage();

  return (
    <footer className="w-full bg-[#092A22] text-[#F6F0E4] border-t-2 border-[#C9A45C]/40">
      {/* Decorative Traditional Kerala Timber Inlay Strip */}
      <div className="w-full h-1.5 bg-gradient-to-r from-[#9C7A34] via-[#C9A45C] to-[#9C7A34]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Cultural Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A45C] to-[#9E4035] p-[2px] shadow-sm">
                <div className="w-full h-full rounded-full bg-[#092A22] flex items-center justify-center">
                  <span className="text-xl">🪔</span>
                </div>
              </div>
              <div>
                <span className="font-serif font-black text-2xl tracking-widest text-[#F6F0E4]">
                  OORVEX
                </span>
                <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-[#103B30] border border-[#C9A45C]/40 text-[#C9A45C] font-mono">
                  കേരളം
                </span>
              </div>
            </div>

            <p className="font-serif italic text-sm text-[#C9A45C]">
              Mapping Heritage. Connecting Generations.
            </p>

            <p className="text-xs text-[#F6F0E4]/80 leading-relaxed max-w-md font-sans">
              {language === 'ml'
                ? 'കേരളത്തിലെ 14 ജില്ലകളിലെയും തനത് കലാരൂപങ്ങൾ, ആചാരാനുഷ്ഠാനങ്ങൾ, പ്രാചീന വാസ്തുവിദ്യ, ഗോത്ര പൈതൃകം എന്നിവയെ ശാസ്ത്രീയമായി രേഖപ്പെടുത്തുന്ന സ്വതന്ത്ര ഡിജിറ്റൽ സാംസ്കാരിക മ്യൂസിയം.'
                : 'An independent digital cultural museum and interactive cartographic repository dedicated to documenting, safeguarding, and celebrating Kerala’s living art forms, sacred rituals, and generational craftsmanship.'}
            </p>

            <div className="pt-2 flex items-center space-x-3 text-xs text-[#F6F0E4]/70">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9A45C]" />
                <span>Verified Heritage Archives</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Award className="w-3.5 h-3.5 text-[#C9A45C]" />
                <span>All 14 Districts Mapped</span>
              </span>
            </div>
          </div>

          {/* District Discovery Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#C9A45C] uppercase tracking-wider">
              {language === 'ml' ? 'ജില്ലകൾ' : 'Cultural Districts'}
            </h4>
            <ul className="space-y-2 text-xs text-[#F6F0E4]/80">
              <li>
                <button onClick={() => onNavigate('/districts/kannur')} className="hover:text-[#C9A45C] transition-colors">
                  Kannur (Theyyam & Looms)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/districts/thrissur')} className="hover:text-[#C9A45C] transition-colors">
                  Thrissur (Kalamandalam & Pooram)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/districts/pathanamthitta')} className="hover:text-[#C9A45C] transition-colors">
                  Pathanamthitta (Padayani & Mirrors)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/districts/kozhikode')} className="hover:text-[#C9A45C] transition-colors">
                  Kozhikode (Beypore Uru & Kalari)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/districts/palakkad')} className="hover:text-[#C9A45C] transition-colors">
                  Palakkad (Tholpavakoothu)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/districts')} className="text-[#C9A45C] font-bold hover:underline">
                  {language === 'ml' ? 'എല്ലാ 14 ജില്ലകളും →' : 'View All 14 Districts →'}
                </button>
              </li>
            </ul>
          </div>

          {/* Living Traditions Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#C9A45C] uppercase tracking-wider">
              {language === 'ml' ? 'പൈതൃക കലകൾ' : 'Living Traditions'}
            </h4>
            <ul className="space-y-2 text-xs text-[#F6F0E4]/80">
              <li>
                <button onClick={() => onNavigate('/listings')} className="hover:text-[#C9A45C] transition-colors">
                  Theyyam (Northern Sacred Groves)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/listings')} className="hover:text-[#C9A45C] transition-colors">
                  Kathakali (Classical Dance-Drama)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/listings')} className="hover:text-[#C9A45C] transition-colors">
                  Koodiyattam (UNESCO Masterpiece)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/crafts')} className="hover:text-[#C9A45C] transition-colors">
                  Aranmula Metal Alloy Mirror
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/crafts')} className="hover:text-[#C9A45C] transition-colors">
                  Beypore Uru Handcrafted Dhows
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/glossary')} className="text-[#C9A45C] font-bold hover:underline">
                  {language === 'ml' ? 'സാംസ്കാരിക നിഘണ്ടു →' : 'Cultural Glossary (A-Z) →'}
                </button>
              </li>
            </ul>
          </div>

          {/* Archival Research Sources & Public Reference */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#C9A45C] uppercase tracking-wider">
              {language === 'ml' ? 'ഗവേഷണ സ്രോതസ്സുകൾ' : 'Research Sources'}
            </h4>
            <ul className="space-y-2 text-xs text-[#F6F0E4]/80">
              <li>
                <a
                  href="https://www.keralatourism.org/artforms/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#C9A45C] flex items-center space-x-1"
                >
                  <span>Kerala Tourism Art Forms</span>
                  <ExternalLink className="w-3 h-3 text-[#C9A45C]" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.tusktravel.com/blog/most-popular-art-and-dance-forms-in-kerala/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#C9A45C] flex items-center space-x-1"
                >
                  <span>Tusk Travel Cultural Guides</span>
                  <ExternalLink className="w-3 h-3 text-[#C9A45C]" />
                </a>
              </li>
              <li>
                <a
                  href="https://en.wikipedia.org/wiki/Arts_of_Kerala"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#C9A45C] flex items-center space-x-1"
                >
                  <span>Wikipedia – Arts of Kerala</span>
                  <ExternalLink className="w-3 h-3 text-[#C9A45C]" />
                </a>
              </li>
              <li>
                <a
                  href="https://ich.unesco.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#C9A45C] flex items-center space-x-1"
                >
                  <span>UNESCO Intangible Heritage</span>
                  <ExternalLink className="w-3 h-3 text-[#C9A45C]" />
                </a>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="text-[#C9A45C] font-bold hover:underline">
                  {language === 'ml' ? 'ദൗത്യത്തെക്കുറിച്ച് വായിക്കൂ →' : 'Preservation Mission →'}
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Attribution Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F6F0E4]/60 gap-4">
          <div className="flex items-center space-x-2">
            <span>© {new Date().getFullYear()} OORVEX. Dedicated to preserving Kerala's living heritage.</span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-[#C9A45C]">
            <button onClick={() => onNavigate('/map')} className="hover:underline">
              Culture Map
            </button>
            <button onClick={() => onNavigate('/contribute')} className="hover:underline">
              Community Contributions
            </button>
            <button onClick={() => onNavigate('/admin')} className="hover:underline">
              Curator Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
