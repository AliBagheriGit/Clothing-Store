'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { translations, Translations } from '../i18n/translations';
import { formatPrice as formatPriceUtil, formatDigits as formatDigitsUtil } from '../utils';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  isRTL: boolean;
  dir: 'rtl' | 'ltr';
  formatPrice: (amount: number) => string;
  formatDigits: (n: number | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('fa');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('glamour_boutique_lang') as Language | null;
      if (savedLang === 'fa' || savedLang === 'en') {
        setLanguageState(savedLang);
        applyDocumentAttributes(savedLang);
      } else {
        applyDocumentAttributes('fa');
      }
    } catch {
      applyDocumentAttributes('fa');
    }
    setMounted(true);
  }, []);

  const applyDocumentAttributes = (lang: Language) => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
      if (lang === 'en') {
        document.body.classList.add('ltr');
        document.body.classList.remove('rtl');
      } else {
        document.body.classList.add('rtl');
        document.body.classList.remove('ltr');
      }
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    applyDocumentAttributes(lang);
    try {
      localStorage.setItem('glamour_boutique_lang', lang);
    } catch {}
  };

  const toggleLanguage = () => {
    const nextLang = language === 'fa' ? 'en' : 'fa';
    setLanguage(nextLang);
  };

  const isRTL = language === 'fa';
  const dir: 'rtl' | 'ltr' = isRTL ? 'rtl' : 'ltr';
  const t = translations[language];

  const formatPrice = (amount: number) => formatPriceUtil(amount, language);
  const formatDigits = (n: number | string) => formatDigitsUtil(n, language);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isRTL,
        dir,
        formatPrice,
        formatDigits,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

