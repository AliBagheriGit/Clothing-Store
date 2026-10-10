'use client';

import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { ProductCategory } from '../types';

interface PromoBannersProps {
  onSelectCategory: (category: ProductCategory) => void;
}

export const PromoBanners: React.FC<PromoBannersProps> = ({ onSelectCategory }) => {
  return (
    <section id="lookbook" className="py-14 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Banner 1 */}
        <div className="relative h-[380px] sm:h-[440px] rounded-3xl overflow-hidden shadow-lg group">
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-108"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

          <div className="absolute inset-0 p-8 flex flex-col justify-end text-right z-10">
            <span className="inline-flex items-center gap-1.5 text-pink-400 font-bold text-xs sm:text-sm mb-2">
              <Sparkles size={16} />
              <span>کالکشن ویژه ژورنالی ۱۴۰۴</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2">
              پیراهن‌های ساحلی و لینن بانوان
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm max-w-sm mb-6 leading-relaxed">
              طراحی رها و آزاد برای روزهای آفتابی، بافته شده از الیاف خالص بدون ایجاد گرما و تعریق.
            </p>
            <div>
              <button
                onClick={() => {
                  onSelectCategory('women');
                  document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white hover:bg-pink-600 text-stone-900 hover:text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-md group/b"
              >
                <span>مشاهده کالکشن بانوان</span>
                <ArrowLeft
                  size={15}
                  className="group-hover/b:-translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Banner 2 */}
        <div className="relative h-[380px] sm:h-[440px] rounded-3xl overflow-hidden shadow-lg group">
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-108"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

          <div className="absolute inset-0 p-8 flex flex-col justify-end text-right z-10">
            <span className="inline-flex items-center gap-1.5 text-pink-400 font-bold text-xs sm:text-sm mb-2">
              <Sparkles size={16} />
              <span>ترند کژوال و سفرهای تابستانه</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2">
              پیراهن‌های هاوایی و کوبایی آقایان
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm max-w-sm mb-6 leading-relaxed">
              استایل جذاب رترو همراه با شلوارک‌های کتان و صندل‌های دست‌دوز چرم طبیعی.
            </p>
            <div>
              <button
                onClick={() => {
                  onSelectCategory('men');
                  document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white hover:bg-pink-600 text-stone-900 hover:text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-md group/b"
              >
                <span>مشاهده کالکشن آقایان</span>
                <ArrowLeft
                  size={15}
                  className="group-hover/b:-translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
