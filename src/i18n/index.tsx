import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Translations } from './types';
import { enTranslations } from './translations/en';
import { mizoTranslations } from './translations/mizo';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: Translations;
}

const STORAGE_KEY = 'zirna_lang_pref';
const FALLBACK_KEY = 'fraction_game_lang';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(FALLBACK_KEY);
      if (saved === 'MIZO' || saved === 'mizo') return 'MIZO';
      return 'EN';
    } catch {
      return 'EN';
    }
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      localStorage.setItem(FALLBACK_KEY, newLang.toLowerCase());
    } catch {
      // Ignore local storage write errors
    }
  };

  const toggleLang = () => {
    setLang(lang === 'EN' ? 'MIZO' : 'EN');
  };

  const t = lang === 'MIZO' ? mizoTranslations : enTranslations;

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside of LanguageProvider
    return {
      lang: 'EN',
      setLang: () => {},
      toggleLang: () => {},
      t: enTranslations,
    };
  }
  return context;
};

export * from './types';
