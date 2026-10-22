'use client';

import React from 'react';
import { Truck, RefreshCw, ShieldCheck, Headphones } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const TrustBadges: React.FC = () => {
  const { t, isRTL } = useLanguage();

  const icons = [Truck, RefreshCw, ShieldCheck, Headphones];

  return (
    <section className="py-12 bg-white border-y border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.trust.map((badge, idx) => {
            const Icon = icons[idx];
            return (
              <div
                key={idx}
                className={`flex items-start gap-4 p-5 rounded-2xl bg-stone-50/80 hover:bg-pink-50/40 border border-stone-100 transition-colors ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0 shadow-xs">
                  <Icon size={24} />
                </div>
                <div>
                  <h4 className="font-extrabold text-stone-900 text-sm sm:text-base mb-1">
                    {badge.title}
                  </h4>
                  <p className="text-stone-500 text-xs leading-relaxed">{badge.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
