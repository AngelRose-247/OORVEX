import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { askCultureMatchAI } from '../services/api';
import {
  Sparkles, X, Search, BookOpen, Volume2, VolumeX, ShieldCheck,
  ExternalLink, ChevronRight, CornerDownLeft, Loader2
} from 'lucide-react';

export default function CultureMatchModal({ isOpen, onClose, onNavigate }) {
  const { language, t } = useLanguage();
  const { speakText, stopSpeaking, isSpeaking } = useAccessibility();

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const sampleQuestions = [
    { en: 'What traditional art forms can I explore in Kannur?', ml: 'കണ്ണൂരിലെ പ്രധാന അനുഷ്ഠാന കലകൾ ഏതൊക്കെയാണ്?' },
    { en: 'Tell me about Theyyam and its cultural story', ml: 'തെയ്യത്തിന്റെ ഐതിഹ്യവും സവിശേഷതകളും വിവരിക്കുക' },
    { en: 'Find traditional crafts and GI products in Kerala', ml: 'കേരളത്തിലെ പാരമ്പര്യ കരകൗശല വിദ്യകൾ ഏതൊക്കെയാണ്?' },
    { en: 'Which traditional arts are associated with Thrissur?', ml: 'തൃശ്ശൂർ ജില്ലയുമായി ബന്ധപ്പെട്ട പ്രധാന കലകൾ എന്തൊക്കെ?' },
    { en: 'Explain the cultural significance of Padayani', ml: 'പടയണിയുടെ ആചാരപരമായ പ്രാധാന്യം എന്താണ്?' },
  ];

  const handleAsk = async (textToAsk) => {
    const q = textToAsk || query;
    if (!q.trim()) return;

    setLoading(true);
    setResult(null);
    stopSpeaking();

    const response = await askCultureMatchAI({
      query: q,
      language: language
    });

    setResult(response);
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAsk();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl glass-panel-dark border border-heritage-gold/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-heritage-gold/25 flex items-center justify-between bg-heritage-forest/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-heritage-gold/20 border border-heritage-gold/40 text-heritage-gold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-gold-gradient">
                {t.aiModalTitle}
              </h3>
              <p className="text-xs text-heritage-ivory/70">
                {t.aiModalSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={() => { stopSpeaking(); onClose(); }}
            className="p-2 rounded-lg text-heritage-ivory/60 hover:text-heritage-gold hover:bg-heritage-forest"
            aria-label="Close CultureMatch AI"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Query Input */}
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.aiInputPlaceholder}
              className="w-full pl-4 pr-24 py-3.5 rounded-xl bg-heritage-forest/60 border border-heritage-gold/40 text-heritage-ivory text-sm placeholder-heritage-ivory/40 focus:border-heritage-gold focus:outline-none focus:ring-1 focus:ring-heritage-gold shadow-inner"
              autoFocus
            />
            <button
              onClick={() => handleAsk()}
              disabled={loading || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-heritage-gold hover:bg-heritage-goldLight text-heritage-dark font-bold text-xs flex items-center space-x-1.5 transition-all disabled:opacity-40"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <span>{t.aiSend}</span>
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Sample Questions Pills */}
          {!result && !loading && (
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider font-mono text-heritage-gold/80">
                {language === 'ml' ? 'ഉദാഹരണ ചോദ്യങ്ങൾ:' : 'Suggested Queries:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {sampleQuestions.map((q, idx) => {
                  const label = language === 'ml' ? q.ml : q.en;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(label);
                        handleAsk(label);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-heritage-forest/40 hover:bg-heritage-forest/80 border border-heritage-gold/25 hover:border-heritage-gold text-xs text-heritage-ivory/80 transition-all text-left"
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
              <div className="w-12 h-12 rounded-full border-2 border-heritage-gold border-t-transparent animate-spin" />
              <p className="text-sm font-medium text-heritage-gold">
                {t.aiThinking}
              </p>
              <p className="text-xs text-heritage-ivory/50">
                Grounding against verified Kerala archives & cultural listings...
              </p>
            </div>
          )}

          {/* Response Display */}
          {result && !loading && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Voice Assist Toolbar */}
              <div className="flex items-center justify-between pb-3 border-b border-heritage-gold/20 text-xs text-heritage-ivory/70">
                <span className="flex items-center space-x-1 text-heritage-gold font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {result.is_ai_generated ? 'Gemini 1.5 Grounded Response' : 'Verified Repository Match'}
                  </span>
                </span>
                
                <button
                  onClick={() => {
                    if (isSpeaking) {
                      stopSpeaking();
                    } else {
                      speakText(result.explanation, language);
                    }
                  }}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-heritage-forest border border-heritage-gold/30 hover:border-heritage-gold text-heritage-gold transition-all"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-red-400" />
                      <span>{t.stopNarration}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{t.listenNarration}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Grounded Explanation Box */}
              <div className="prose prose-invert max-w-none text-sm text-heritage-ivory leading-relaxed whitespace-pre-line bg-heritage-forest/30 p-4 rounded-xl border border-heritage-gold/20">
                {result.explanation}
              </div>

              {/* Recommended Cultural Records Cards */}
              {result.recommended_records && result.recommended_records.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-heritage-gold flex items-center space-x-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{t.aiCitations}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.recommended_records.map((rec) => (
                      <div
                        key={rec.id}
                        onClick={() => {
                          onClose();
                          onNavigate(`/cultural-listings/${rec.id}`);
                        }}
                        className="p-3 rounded-xl bg-heritage-forest/50 border border-heritage-gold/25 hover:border-heritage-gold cursor-pointer transition-all flex items-start space-x-3 group"
                      >
                        {rec.image && (
                          <img
                            src={rec.image}
                            alt={rec.title}
                            className="w-14 h-14 rounded-lg object-cover border border-heritage-gold/20 flex-shrink-0"
                            loading="lazy"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] text-heritage-gold font-mono uppercase">
                            Record #{rec.id} • {rec.category}
                          </span>
                          <h5 className="font-serif text-xs font-bold text-heritage-ivory group-hover:text-heritage-gold truncate">
                            {language === 'ml' ? rec.title_ml : rec.title}
                          </h5>
                          <p className="text-[10px] text-heritage-ivory/60 truncate mt-0.5">
                            {rec.locality || rec.districts?.join(', ')}
                          </p>
                          <p className="text-[9px] text-heritage-gold/70 truncate mt-1">
                            Ref: {rec.source_reference}
                          </p>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-heritage-gold/60 group-hover:text-heritage-gold flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Reassurance */}
        <div className="px-6 py-3 border-t border-heritage-gold/20 bg-[#040F0D] flex items-center justify-between text-[11px] text-heritage-ivory/60">
          <span className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-heritage-gold" />
            <span>{t.aiDisclaimer}</span>
          </span>
          <button
            onClick={() => { stopSpeaking(); setResult(null); setQuery(''); }}
            className="text-heritage-gold hover:underline"
          >
            {language === 'ml' ? 'പുതിയ ചോദ്യം' : 'New Question'}
          </button>
        </div>
      </div>
    </div>
  );
}
