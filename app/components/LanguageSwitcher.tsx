'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LanguageSwitcherProps {
  variant?: 'topbar' | 'header' | 'mobile';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'header',
  className = '',
}) => {
  const { language, setLanguage, toggleLanguage } = useLanguage();

  if (variant === 'topbar') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <button
          type="button"
          onClick={() => setLanguage('fa')}
          className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
            language === 'fa'
              ? 'bg-pink-600 text-white shadow-xs'
              : 'text-stone-400 hover:text-white hover:bg-stone-800'
          }`}
          title="تغییر به زبان فارسی"
        >
          <span>🇮🇷</span>
          <span>فارسی</span>
        </button>
        <span className="text-stone-700 text-[10px]">|</span>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
            language === 'en'
              ? 'bg-pink-600 text-white shadow-xs'
              : 'text-stone-400 hover:text-white hover:bg-stone-800'
          }`}
          title="Switch to English"
        >
          <span>🇬🇧</span>
          <span>English</span>
        </button>
      </div>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className={`flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200/80 ${className}`}>
        <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
          <Globe size={15} className="text-pink-600" />
          <span>{language === 'fa' ? 'زبان / Language' : 'Language / زبان'}</span>
        </span>
        <div className="flex items-center gap-1 bg-stone-200/70 p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => setLanguage('fa')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              language === 'fa'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            فارسی
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              language === 'en'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            English
          </button>
        </div>
      </div>
    );
  }

  // Default 'header' pill button
  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`px-2.5 py-1.5 rounded-full border border-stone-200/90 hover:border-pink-300 bg-stone-50/80 hover:bg-pink-50/50 text-stone-700 hover:text-pink-600 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer group shadow-2xs ${className}`}
      title={language === 'fa' ? 'Switch to English' : 'تغییر به زبان فارسی'}
      aria-label="Toggle language"
    >
      <Globe size={15} className="text-stone-500 group-hover:text-pink-600 transition-colors" />
      <span className="uppercase tracking-wider font-extrabold text-[11px]">
        {language === 'fa' ? 'EN' : 'FA'}
      </span>
      <span className="text-[10px] text-stone-400 group-hover:text-pink-400 hidden xl:inline">
        {language === 'fa' ? 'English' : 'فارسی'}
      </span>
    </button>
  );
};

