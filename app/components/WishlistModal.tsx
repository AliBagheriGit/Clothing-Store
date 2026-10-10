'use client';

import React from 'react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { formatPrice, toPersianDigits } from '../utils';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (id: string) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn text-right">
      <div
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center">
              <Heart size={18} className="fill-rose-500" />
            </div>
            <div>
              <h2 className="font-extrabold text-stone-900 text-base">لیست علاقه‌مندی‌ها</h2>
              <span className="text-xs text-stone-500">
                {toPersianDigits(wishlist.length)} محصول نشان‌شده
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {wishlist.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-300 flex items-center justify-center">
                <Heart size={32} />
              </div>
              <h3 className="font-bold text-stone-800 text-base">هنوز محصولی را نشان نکرده‌اید</h3>
              <p className="text-stone-500 text-xs max-w-xs">
                با زدن آیکون قلب روی هر محصول، آن را برای خریدهای بعدی در این لیست ذخیره کنید.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wishlist.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200/70 relative group"
                >
                  {/* Thumbnail */}
                  <div
                    className="w-20 h-24 rounded-lg bg-stone-200 bg-cover bg-center shrink-0"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900 line-clamp-1">
                        {product.name}
                      </h4>
                      <span className="text-xs text-pink-600 font-extrabold mt-1 block">
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => {
                          onAddToCart(product);
                          onRemoveFromWishlist(product.id);
                        }}
                        className="flex-1 bg-stone-900 hover:bg-pink-600 text-white text-xs font-bold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors"
                      >
                        <ShoppingBag size={13} />
                        <span>انتقال به سبد</span>
                      </button>
                      <button
                        onClick={() => onRemoveFromWishlist(product.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-200 transition-colors"
                        title="حذف"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
