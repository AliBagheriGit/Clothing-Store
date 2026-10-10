'use client';

import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../mockData';
import { toPersianDigits } from '../utils';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-stone-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-right">
        {/* Header */}
        <div className="text-center sm:text-right mb-12">
          <span className="text-pink-600 font-bold text-xs sm:text-sm tracking-wider uppercase">
            تجربه خریداران بوتیک
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 mt-1">
            نظرات همراهان شیک‌پوش ما
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm max-w-lg mt-2">
            بیش از ۱۰,۰۰۰ سفارش موفق در سراسر ایران؛ رضایت شما سرمایه اصلی بوتیک گلامور است.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 sm:p-7 rounded-2xl shadow-xs hover:shadow-md border border-stone-100 flex flex-col justify-between relative transition-shadow"
            >
              <Quote className="absolute top-5 left-5 text-pink-100 w-10 h-10 -rotate-12 pointer-events-none" />

              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-stone-700 text-sm leading-relaxed mb-6">
                  «{item.comment}»
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
                    <h4 className="font-bold text-stone-900 text-sm">{item.name}</h4>
                    {item.verified && (
                      <span className="text-emerald-600 flex items-center text-[11px] gap-0.5">
                        <CheckCircle size={12} />
                        <span>خریدار</span>
                      </span>
                    )}
                  </div>
                  <span className="text-stone-400 text-xs">{item.city}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
