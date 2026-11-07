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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md glass-panel-dark border border-heritage-gold/50 rounded-2xl shadow-2xl p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-heritage-gold/25">
          <div className="flex items-center space-x-2.5">
            <Sliders className="w-5 h-5 text-heritage-gold" />
            <h3 className="font-serif font-bold text-lg text-heritage-gold">
              {t.accessTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-heritage-ivory/60 hover:text-heritage-gold hover:bg-heritage-forest"
            aria-label="Close Accessibility Controls"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Font Size Adjustments */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-heritage-gold flex items-center space-x-2">
            <Type className="w-4 h-4" />
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
                    ? 'bg-heritage-gold text-heritage-dark border-heritage-gold shadow-gold-subtle font-bold'
                    : 'bg-heritage-forest/60 text-heritage-ivory/80 border-heritage-gold/30 hover:border-heritage-gold'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* High Contrast Mode Toggle */}
        <div className="flex items-center justify-between py-2 border-t border-heritage-gold/15">
          <div className="space-y-0.5">
            <label className="text-sm font-semibold text-heritage-ivory flex items-center space-x-2">
              <Eye className="w-4 h-4 text-heritage-gold" />
              <span>{t.contrast}</span>
            </label>
            <p className="text-[11px] text-heritage-ivory/60">
              High contrast black and gold for enhanced visual clarity
            </p>
          </div>
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
              highContrast ? 'bg-heritage-gold justify-end' : 'bg-heritage-forest justify-start border border-heritage-gold/40'
            }`}
          >
            <div className={`w-4 h-4 rounded-full ${highContrast ? 'bg-heritage-dark' : 'bg-heritage-gold'}`} />
          </button>
        </div>

        {/* Reduced Motion Toggle */}
        <div className="flex items-center justify-between py-2 border-t border-heritage-gold/15">
          <div className="space-y-0.5">
            <label className="text-sm font-semibold text-heritage-ivory flex items-center space-x-2">
              <Activity className="w-4 h-4 text-heritage-gold" />
              <span>{t.reducedMotion}</span>
            </label>
            <p className="text-[11px] text-heritage-ivory/60">
              Disables 3D particles and transitions for comfort
            </p>
          </div>
          <button
            onClick={() => setReducedMotion(!reducedMotion)}
            className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
              reducedMotion ? 'bg-heritage-gold justify-end' : 'bg-heritage-forest justify-start border border-heritage-gold/40'
            }`}
          >
            <div className={`w-4 h-4 rounded-full ${reducedMotion ? 'bg-heritage-dark' : 'bg-heritage-gold'}`} />
          </button>
        </div>

        {/* Screen Voice Assist */}
        <div className="flex items-center justify-between py-2 border-t border-heritage-gold/15">
          <div className="space-y-0.5">
            <label className="text-sm font-semibold text-heritage-ivory flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-heritage-gold" />
              <span>{t.speechSynthesis}</span>
            </label>
            <p className="text-[11px] text-heritage-ivory/60">
              Audio narration of cultural pages and descriptions
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
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border ${
              isSpeaking
                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                : 'bg-heritage-forest border-heritage-gold/30 text-heritage-gold hover:border-heritage-gold'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isSpeaking ? 'Stop Test' : 'Test Voice'}</span>
          </button>
        </div>

        {/* Footer */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-heritage-gold text-heritage-dark font-bold text-xs uppercase tracking-wider shadow-gold-subtle hover:brightness-110"
          >
            {language === 'ml' ? 'പൂർത്തിയായി' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
}
