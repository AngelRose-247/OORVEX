import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { askCultureMatchAI } from '../services/api';
import {
  Sparkles, X, Search, BookOpen, Volume2, VolumeX, ShieldCheck,
  ExternalLink, ChevronRight, CornerDownLeft, Loader2
} from 'lucide-react';
import SafeImage from './SafeImage';

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
    { en: 'Where can I see Koodiyattam and Kathakali in Thrissur?', ml: 'തൃശ്ശൂരിൽ കൂടിയാട്ടവും കഥകളിയും എവിടെ കാണാം?' },
    { en: 'What makes Aranmula Kannadi metal mirror so unique?', ml: 'ആറന്മുളക്കണ്ണാടിയുടെ പ്രത്യേകത എന്താണ്?' },
    { en: 'Explain the cultural significance of Padayani in Pathanamthitta', ml: 'പടയണിയുടെ ആചാരപരമായ പ്രാധാന്യം എന്താണ്?' },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#FFFDF6] border-2 border-[#C6A15B]/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header in Forest Green */}
        <div className="px-6 py-5 border-b border-[#C6A15B]/30 flex items-center justify-between bg-[#405B43] text-[#F7F0DF]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-[#C6A15B] text-[#123B32] shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#F7F0DF]">
                {t.aiModalTitle}
              </h3>
              <p className="text-xs text-[#F7F0DF]/80">
                {t.aiModalSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={() => { stopSpeaking(); onClose(); }}
            className="p-2 rounded-xl text-[#F7F0DF]/70 hover:text-[#C6A15B] hover:bg-white/10"
            aria-label="Close CultureMatch AI"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-[#FFFDF6]">
          
          {/* Query Input */}
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.aiInputPlaceholder}
              className="w-full pl-4 pr-24 py-3.5 rounded-2xl bg-[#F7F0DF] border border-[#C6A15B]/50 text-[#392A20] text-sm placeholder-[#392A20]/50 focus:border-[#405B43] focus:outline-none shadow-sm"
              autoFocus
            />
            <button
              onClick={() => handleAsk()}
              disabled={loading || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-[#C6A15B] hover:bg-[#AB8742] text-[#123B32] font-serif font-bold text-xs flex items-center space-x-1.5 transition-all disabled:opacity-40 shadow-kasavu"
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
              <span className="text-[11px] uppercase tracking-wider font-serif font-bold text-[#405B43]">
                {language === 'ml' ? 'ഉദാഹരണ ചോദ്യങ്ങൾ:' : 'Suggested Cultural Inquiries:'}
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
                      className="px-3.5 py-2 rounded-xl bg-[#E8D8B8]/60 hover:bg-[#E8D8B8] border border-[#C6A15B]/35 text-xs text-[#392A20] font-medium transition-all text-left shadow-sm"
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
              <div className="w-12 h-12 rounded-full border-3 border-[#A64F32] border-t-transparent animate-spin" />
              <p className="text-sm font-serif font-bold text-[#405B43]">
                {t.aiThinking}
              </p>
              <p className="text-xs text-[#392A20]/60">
                Grounding against verified Kerala archives & cultural listings...
              </p>
            </div>
          )}

          {/* Response Display */}
          {result && !loading && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Voice Assist Toolbar */}
              <div className="flex items-center justify-between pb-3 border-b border-[#C6A15B]/30 text-xs text-[#392A20]/80">
                <span className="flex items-center space-x-1.5 text-[#405B43] font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#405B43]" />
                  <span>
                    {result.is_ai_generated ? 'Grounded AI Intelligence' : 'Verified Repository Match'}
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
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#F7F0DF] border border-[#C6A15B]/40 hover:border-[#405B43] text-[#405B43] font-bold transition-all shadow-sm"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-red-600" />
                      <span>{t.stopNarration}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#A64F32]" />
                      <span>{t.listenNarration}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Grounded Explanation Box */}
              <div className="bg-[#F7F0DF] p-5 rounded-2xl border border-[#C6A15B]/30 shadow-sm text-sm text-[#392A20] leading-relaxed font-sans">
                <ReactMarkdown
                  components={{
                    h1: ({children}) => <h1 className="font-serif font-bold text-lg text-[#31543E] mt-4 mb-2 first:mt-0">{children}</h1>,
                    h2: ({children}) => <h2 className="font-serif font-bold text-base text-[#31543E] mt-4 mb-2 first:mt-0">{children}</h2>,
                    h3: ({children}) => <h3 className="font-serif font-semibold text-sm text-[#405B43] mt-3 mb-1.5 first:mt-0">{children}</h3>,
                    p:  ({children}) => <p className="mb-3 last:mb-0">{children}</p>,
                    strong: ({children}) => <strong className="font-bold text-[#2B1E16]">{children}</strong>,
                    em: ({children}) => <em className="italic text-[#392A20]">{children}</em>,
                    ul: ({children}) => <ul className="list-disc list-outside pl-5 mb-3 space-y-1">{children}</ul>,
                    ol: ({children}) => <ol className="list-decimal list-outside pl-5 mb-3 space-y-1">{children}</ol>,
                    li: ({children}) => <li className="text-[#392A20]">{children}</li>,
                    hr: () => <hr className="border-[#C6A15B]/40 my-3" />,
                    blockquote: ({children}) => <blockquote className="border-l-2 border-[#C6A15B] pl-4 italic text-[#392A20]/80 my-3">{children}</blockquote>,
                    code: ({inline, children}) => inline
                      ? <code className="bg-[#E8D8B8] text-[#A64F32] px-1 py-0.5 rounded text-xs">{children}</code>
                      : <pre className="bg-[#E8D8B8] p-3 rounded-xl text-xs overflow-x-auto my-2"><code>{children}</code></pre>,
                  }}
                >
                  {result.explanation}
                </ReactMarkdown>
              </div>

              {/* Recommended Cultural Records Cards */}
              {result.recommended_records && result.recommended_records.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-[#405B43] flex items-center space-x-1.5">
                    <BookOpen className="w-4 h-4 text-[#A64F32]" />
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
                        className="p-3 rounded-2xl bg-[#F7F0DF] border border-[#C6A15B]/35 hover:border-[#405B43] cursor-pointer transition-all flex items-start space-x-3 group shadow-sm"
                      >
                        {rec.image && (
                          <SafeImage
                            src={rec.image}
                            alt={rec.title}
                            className="w-14 h-14 rounded-xl object-cover border border-[#C6A15B]/30 flex-shrink-0"
                            loading="lazy"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] text-[#A64F32] font-serif font-bold uppercase">
                            Record #{rec.id} • {rec.category}
                          </span>
                          <h5 className="font-serif text-xs font-bold text-[#392A20] group-hover:text-[#405B43] truncate">
                            {language === 'ml' ? rec.title_ml : rec.title}
                          </h5>
                          <p className="text-[10px] text-[#392A20]/70 truncate mt-0.5">
                            {rec.locality || rec.districts?.join(', ')}
                          </p>
                          <p className="text-[9px] text-[#A64F32] truncate mt-1">
                            Ref: {rec.source_reference}
                          </p>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-[#A64F32] group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Reassurance */}
        <div className="px-6 py-3 border-t border-[#C6A15B]/30 bg-[#F7F0DF] flex items-center justify-between text-[11px] text-[#392A20]/75">
          <span className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#405B43]" />
            <span>{t.aiDisclaimer}</span>
          </span>
          <button
            onClick={() => { stopSpeaking(); setResult(null); setQuery(''); }}
            className="text-[#405B43] font-serif font-bold hover:underline"
          >
            {language === 'ml' ? 'പുതിയ ചോദ്യം' : 'New Cultural Question'}
          </button>
        </div>
      </div>
    </div>
  );
}
