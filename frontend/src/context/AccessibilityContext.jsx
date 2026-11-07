import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('oorvex_font_size') || 'normal');
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('oorvex_contrast') === 'true');
  const [reducedMotion, setReducedMotion] = useState(() => localStorage.getItem('oorvex_motion') === 'true');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    localStorage.setItem('oorvex_font_size', fontSize);
    const root = document.documentElement;
    if (fontSize === 'large') {
      root.style.fontSize = '18px';
    } else if (fontSize === 'xlarge') {
      root.style.fontSize = '20px';
    } else {
      root.style.fontSize = '16px';
    }
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('oorvex_contrast', highContrast);
    if (highContrast) {
      document.body.classList.add('accessibility-contrast-high');
    } else {
      document.body.classList.remove('accessibility-contrast-high');
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('oorvex_motion', reducedMotion);
    if (reducedMotion) {
      document.body.classList.add('accessibility-reduced-motion');
    } else {
      document.body.classList.remove('accessibility-reduced-motion');
    }
  }, [reducedMotion]);

  const speakText = (text, lang = 'en') => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'ml' ? 'ml-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        reducedMotion,
        setReducedMotion,
        speakText,
        stopSpeaking,
        isSpeaking
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
