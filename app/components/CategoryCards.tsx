'use client';

import React from 'react';
import { CATEGORIES } from '../mockData';
import { ProductCategory } from '../types';
import { toPersianDigits } from '../utils';

interface CategoryCardsProps {
  onSelectCategory: (cat: ProductCategory) => void;
  selectedCategory: ProductCategory;
}

export const CategoryCards: React.FC<CategoryCardsProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  return (
    <section id="categories" className="py-14 sm:py-20 bg-stone-50/70 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Title matching 'Best For You' */}
        <div className="text-center sm:text-right mb-10">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <span className="text-pink-600 font-bold text-xs sm:text-sm tracking-wider uppercase">
                انتخاب‌های برتر فصل
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 mt-1">
                بهترین‌ها برای شما <span className="text-stone-400 font-sans font-light text-xl sm:text-2xl">/ Best For You</span>
              </h2>
            </div>
            <p className="text-stone-500 text-xs sm:text-sm max-w-md">
              دسته‌بندی‌های محبوب بوتیک؛ از خنک‌ترین پیراهن‌های لینن تا شیک‌ترین صندل‌ها و اکسسوری‌های ساحلی
            </p>
          </div>
        </div>

        {/* 5 Column Grid matching the original theme layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.linkCategory;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.linkCategory);
                  const el = document.getElementById('featured-products');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group relative h-72 sm:h-84 md:h-96 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-stone-200 ${
                  isSelected ? 'ring-4 ring-pink-500 ring-offset-2' : ''
                }`}
              >
                {/* Background image */}
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{ backgroundImage: `url(${cat.image})` }}
                />

                {/* Dark gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Item count tag on top */}
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-full font-medium">
                  {toPersianDigits(cat.itemCount)} مدل
                </div>

                {/* White Tag Box at Bottom - Exact match with Summer Fashion Store theme screenshot */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xs py-3 px-4 text-center rounded-lg shadow-md group-hover:bg-pink-600 group-hover:text-white transition-all duration-300">
                  <span className="block font-bold text-sm sm:text-base text-stone-900 group-hover:text-white transition-colors">
                    {cat.title}
                  </span>
                  <span className="block text-[11px] uppercase tracking-wider text-stone-500 group-hover:text-pink-100 font-sans font-medium transition-colors mt-0.5">
                    {cat.englishTitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
