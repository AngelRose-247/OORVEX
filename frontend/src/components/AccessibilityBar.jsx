import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';
import {
  Sliders, Eye, Type, Activity, Volume2, VolumeX, X, Check
} from 'lucide-react';

export default function AccessibilityBar({ isOpen, onClose }) {
  const { language, t } = useLanguage();
  const {
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion,
    speakText,
    stopSpeaking,
    isSpeaking
  } = useAccessibility();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#FFFBF2] border-2 border-heritage-gold/50 rounded-3xl shadow-2xl p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-heritage-gold/30">
          <div className="flex items-center space-x-2.5">
            <Sliders className="w-5 h-5 text-heritage-terracotta" />
            <h3 className="font-serif font-bold text-lg text-heritage-maroon">
              {t.accessTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-heritage-timber/60 hover:text-heritage-maroon hover:bg-heritage-palm"
            aria-label="Close Accessibility Controls"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Font Size Adjustments */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-heritage-maroon flex items-center space-x-2 font-serif">
            <Type className="w-4 h-4 text-heritage-terracotta" />
            <span>{t.fontSize}</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'normal', label: '100% (A)' },
              { id: 'large', label: '115% (A+)' },
              { id: 'xlarge', label: '130% (A++)' },
            ].map((size) => (
              <button
                key={size.id}
                onClick={() => setFontSize(size.id)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  fontSize === size.id
                    ? 'bg-heritage-maroon text-heritage-ivory border-heritage-maroon font-bold shadow-sm'
                    : 'bg-heritage-ivory text-heritage-timber border-heritage-gold/40 hover:bg-heritage-palm'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* High Contrast Mode Toggle */}
        <div className="flex items-center justify-between py-2 border-t border-heritage-gold/25">
          <div className="space-y-0.5">
            <label className="text-sm font-semibold text-heritage-timber flex items-center space-x-2">
              <Eye className="w-4 h-4 text-heritage-terracotta" />
              <span>{t.contrast}</span>
            </label>
            <p className="text-[11px] text-heritage-timber/65">
              Enhanced black-on-white clarity for high readability
            </p>
          </div>
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
              highContrast ? 'bg-heritage-maroon justify-end' : 'bg-heritage-palm justify-start border border-heritage-gold/50'
            }`}
          >
            <div className={`w-4 h-4 rounded-full ${highContrast ? 'bg-heritage-ivory' : 'bg-heritage-terracotta'}`} />
          </button>
        </div>

        {/* Reduced Motion Toggle */}
        <div className="flex items-center justify-between py-2 border-t border-heritage-gold/25">
          <div className="space-y-0.5">
            <label className="text-sm font-semibold text-heritage-timber flex items-center space-x-2">
              <Activity className="w-4 h-4 text-heritage-terracotta" />
              <span>{t.reducedMotion}</span>
            </label>
            <p className="text-[11px] text-heritage-timber/65">
              Disables 3D particles and animations for visual comfort
            </p>
          </div>
          <button
            onClick={() => setReducedMotion(!reducedMotion)}
            className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
              reducedMotion ? 'bg-heritage-maroon justify-end' : 'bg-heritage-palm justify-start border border-heritage-gold/50'
            }`}
          >
            <div className={`w-4 h-4 rounded-full ${reducedMotion ? 'bg-heritage-ivory' : 'bg-heritage-terracotta'}`} />
          </button>
        </div>

        {/* Screen Voice Assist */}
        <div className="flex items-center justify-between py-2 border-t border-heritage-gold/25">
          <div className="space-y-0.5">
            <label className="text-sm font-semibold text-heritage-timber flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-heritage-terracotta" />
              <span>{t.speechSynthesis}</span>
            </label>
            <p className="text-[11px] text-heritage-timber/65">
              Auditory narration of cultural pages and descriptions
            </p>
          </div>
          <button
            onClick={() => {
              if (isSpeaking) {
                stopSpeaking();
              } else {
                speakText(
                  language === 'ml'
                    ? "ഊർവെക്സ്: കേരള സംസ്കാരത്തിന്റെ ഡിജിറ്റൽ പ്രപഞ്ചം. 14 ജില്ലകളിലെ സാംസ്കാരിക വിവരങ്ങൾ ഇവിടെ ലഭ്യമാണ്."
                    : "Welcome to OORVEX, the Digital Universe of Kerala's Culture. Explore all 14 districts and living heritage traditions.",
                  language
                );
              }
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border ${
              isSpeaking
                ? 'bg-red-100 text-red-700 border-red-300'
                : 'bg-heritage-palm border-heritage-gold/50 text-heritage-maroon hover:border-heritage-maroon'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isSpeaking ? 'Stop Voice' : 'Test Voice'}</span>
          </button>
        </div>

        {/* Replay 3D Opening Animation Trigger */}
        <div className="flex items-center justify-between py-2 border-t border-heritage-gold/25">
          <div className="space-y-0.5">
            <span className="text-sm font-semibold text-heritage-timber flex items-center space-x-2">
              <span>🎬</span>
              <span>3D Nalukettu Doorway</span>
            </span>
            <p className="text-[11px] text-heritage-timber/65">
              Replay the ancient Kerala carved wooden doors opening
            </p>
          </div>
          <button
            onClick={() => {
              try {
                sessionStorage.removeItem('oorvex_door_intro_seen');
              } catch (e) {}
              window.location.hash = '/';
              window.location.reload();
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#C9A45C] hover:bg-[#B28E46] text-[#103B30] border border-[#C9A45C] shadow-sm transition-all"
          >
            Replay Intro
          </button>
        </div>

        {/* Footer */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-heritage-maroon hover:bg-heritage-maroonDark text-heritage-ivory font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
          >
            {language === 'ml' ? 'പൂർത്തിയായി' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
}
