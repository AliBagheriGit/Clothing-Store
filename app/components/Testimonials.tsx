'use client';

import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../mockData';
import { useLanguage } from '../context/LanguageContext';

export const Testimonials: React.FC = () => {
  const { t, isRTL, language } = useLanguage();
  const isEn = language === 'en';

  return (
    <section className="py-16 sm:py-20 bg-stone-50/50">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        {/* Header */}
        <div className={`mb-12 ${isRTL ? 'text-center sm:text-right' : 'text-center sm:text-left'}`}>
          <span className="text-pink-600 font-bold text-xs sm:text-sm tracking-wider uppercase">
            {t.testimonials.tag}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 mt-1">
            {t.testimonials.title}
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm max-w-lg mt-2">
            {t.testimonials.subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item) => {
            const comment = isEn && item.englishComment ? item.englishComment : item.comment;
            const authorName = isEn && item.englishName ? item.englishName : item.name;
            const authorCity = isEn && item.englishCity ? item.englishCity : item.city;

            return (
              <div
                key={item.id}
                className="bg-white p-6 sm:p-7 rounded-2xl shadow-xs hover:shadow-md border border-stone-100 flex flex-col justify-between relative transition-shadow"
              >
                <Quote className={`absolute top-5 ${isRTL ? 'left-5' : 'right-5'} text-pink-100 w-10 h-10 ${
                  isRTL ? '-rotate-12' : 'rotate-12'
                } pointer-events-none`} />

                <div>
                  {/* Rating stars */}
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-amber-400" />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-stone-700 text-sm leading-relaxed mb-6">
                    &ldquo;{comment}&rdquo;
                  </p>
                </div>

                {/* Author info */}
                <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                  <div
                    className="w-11 h-11 rounded-full bg-cover bg-center border border-pink-200 shrink-0"
                    style={{ backgroundImage: `url(${item.avatar})` }}
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-stone-900 text-sm">{authorName}</h4>
                      {item.verified && (
                        <span className="text-emerald-600 flex items-center text-[11px] gap-0.5">
                          <CheckCircle size={12} />
                          <span>{t.testimonials.verifiedBuyer}</span>
                        </span>
                      )}
                    </div>
                    <span className="text-stone-400 text-xs">{authorCity}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
