'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { formatPrice, toPersianDigits } from '../utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.englishName && p.englishName.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q)
    );
  }, [query, products]);

  if (!isOpen) return null;

  const popularTags = ['لینن', 'ساحلی', 'صندل چرم', 'عینک آفتابی', 'کیف حصیری', 'پیراهن کوبایی'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/60 backdrop-blur-xs animate-fadeIn text-right">
      <div
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center gap-3">
          <Search size={22} className="text-pink-600 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="نام لباس، استایل، جنس پارچه یا دسته‌بندی را جستجو کنید..."
            autoFocus
            className="w-full text-sm sm:text-base text-stone-900 placeholder-stone-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-stone-700 p-1"
            >
              <X size={18} />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-bold text-stone-600 hover:text-black px-2 py-1 bg-stone-100 rounded-lg shrink-0"
          >
            بستن (ESC)
          </button>
        </div>

        {/* Popular Tags */}
        <div className="px-5 py-3 bg-stone-50 border-b border-stone-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-stone-400 font-medium shrink-0">پیشنهادات محبوب:</span>
          {popularTags.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(tag)}
              className="bg-white hover:bg-pink-50 hover:text-pink-600 border border-stone-200 px-2.5 py-1 rounded-full text-stone-600 shrink-0 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-4 divide-y divide-stone-100">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-stone-400 text-xs">
              عبارت مورد نظر خود را تایپ کنید تا محصولات در لحظه فیلتر شوند.
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-8 text-center text-stone-500 text-xs">
              محصولی با عبارت «<strong>{query}</strong>» در بوتیک یافت نشد.
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectProduct(p);
                  onClose();
                }}
                className="py-3 flex items-center justify-between gap-3 hover:bg-stone-50 px-2 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-14 h-16 rounded-lg bg-stone-100 bg-cover bg-center shrink-0 border border-stone-200"
                    style={{ backgroundImage: `url(${p.image})` }}
                  />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900">{p.name}</h4>
                    <span className="text-[11px] text-stone-400 block mt-0.5">{p.material}</span>
                  </div>
                </div>

                <div className="text-left shrink-0">
                  <span className="font-extrabold text-xs sm:text-sm text-pink-600">
                    {formatPrice(p.price)}
                  </span>
                  <div className="text-[10px] text-stone-400 flex items-center justify-end gap-1 mt-1">
                    <ShoppingBag size={12} />
                    <span>مشاهده و خرید</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
