'use client';

import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowLeft, Tag, CheckCircle2, AlertCircle } from 'lucide-react';
import { CartItem } from '../types';
import { formatPrice, toPersianDigits } from '../utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 1000000; // 1,000,000 Tomans
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingCost = items.length === 0 ? 0 : isFreeShipping ? 0 : 55000;
  const discountAmount = Math.round((subtotal * appliedDiscountPercent) / 100);
  const finalTotal = subtotal - discountAmount + shippingCost;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();
    if (cleanCode === 'SUMMER50') {
      setAppliedDiscountPercent(50);
      setCouponMessage({ type: 'success', text: 'کد تخفیف ۵۰٪ تابستانه با موفقیت اعمال شد!' });
    } else if (cleanCode === 'GLAMOUR' || cleanCode === 'BOUTIQUE') {
      setAppliedDiscountPercent(20);
      setCouponMessage({ type: 'success', text: 'کد تخفیف ۲۰٪ ویژه بوتیک اعمال شد.' });
    } else {
      setCouponMessage({ type: 'error', text: 'کد تخفیف وارد شده معتبر یا فعال نیست.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      {/* Overlay backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container (RTL Right side slide-in) */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 text-right animate-slideLeft">
        {/* 1. Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h2 className="font-extrabold text-stone-900 text-base">سبد خرید شما</h2>
              <span className="text-xs text-stone-500">
                {toPersianDigits(items.length)} قلم کالا
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

        {/* Free Shipping Progress bar */}
        <div className="bg-pink-50/60 px-5 py-3 border-b border-pink-100 text-xs">
          <div className="flex justify-between items-center mb-1.5 font-medium">
            <span className="text-stone-700">
              {isFreeShipping ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 size={14} /> تبریک! ارسال سفارش شما کاملاً رایگان شد.
                </span>
              ) : (
                <span>
                  تنها <strong>{formatPrice(remainingForFreeShipping)}</strong> تا ارسال رایگان
                </span>
              )}
            </span>
            <span className="text-pink-600 font-bold">{toPersianDigits(freeShippingProgress)}٪</span>
          </div>
          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-pink-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* 2. Items List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-stone-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center">
                <ShoppingBag size={32} />
              </div>
              <h3 className="font-bold text-stone-800 text-base">سبد خرید شما خالی است</h3>
              <p className="text-stone-500 text-xs max-w-xs">
                جدیدترین محصولات تابستانه و لباس‌های خنک لینن را بررسی کرده و به سبد خود اضافه کنید.
              </p>
              <button
                onClick={onClose}
                className="mt-2 bg-pink-600 text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-pink-700 transition-colors"
              >
                مشاهده محصولات فروشگاه
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="py-4 flex gap-3 group">
                {/* Thumbnail */}
                <div
                  className="w-20 h-24 rounded-xl bg-stone-100 bg-cover bg-center shrink-0 border border-stone-200"
                  style={{ backgroundImage: `url(${item.product.image})` }}
                />

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-stone-900 text-xs sm:text-sm line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        title="حذف از سبد"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* Variant details */}
                    <div className="flex items-center gap-3 text-[11px] text-stone-500 mt-1">
                      <span className="flex items-center gap-1">
                        رنگ:
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-stone-300 inline-block"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        <span>{item.selectedColor.name}</span>
                      </span>
                      <span>•</span>
                      <span>سایز: {item.selectedSize}</span>
                    </div>
                  </div>

                  {/* Price & Quantity Controls */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-200 font-bold"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-stone-800">
                        {toPersianDigits(item.quantity)}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-200 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-bold text-sm text-pink-600">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 3. Footer / Checkout section */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-4">
            {/* Coupon input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="کد تخفیف (مثال: SUMMER50)"
                  className="w-full bg-white border border-stone-200 rounded-xl pr-9 pl-3 py-2 text-xs focus:outline-hidden focus:border-pink-500 uppercase"
                />
              </div>
              <button
                type="submit"
                className="bg-stone-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
              >
                اعمال کد
              </button>
            </form>

            {/* Coupon message */}
            {couponMessage && (
              <div
                className={`text-xs flex items-center gap-1.5 p-2 rounded-lg ${
                  couponMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {couponMessage.type === 'success' ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <AlertCircle size={14} />
                )}
                <span>{couponMessage.text}</span>
              </div>
            )}

            {/* Price breakdown */}
            <div className="space-y-2 text-xs text-stone-600 border-t border-stone-200/80 pt-3">
              <div className="flex justify-between">
                <span>جمع مبالغ اقلام:</span>
                <span className="font-bold text-stone-800">{formatPrice(subtotal)}</span>
              </div>
              {appliedDiscountPercent > 0 && (
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>تخفیف شگفت‌انگیز ({toPersianDigits(appliedDiscountPercent)}٪):</span>
                  <span>{formatPrice(discountAmount)}-</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>هزینه بسته‌بندی و ارسال (تیپاکس):</span>
                <span>
                  {isFreeShipping ? (
                    <span className="text-emerald-600 font-bold">رایگان</span>
                  ) : (
                    formatPrice(shippingCost)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                <span>مبلغ نهایی قابل پرداخت:</span>
                <span className="text-pink-600 text-base">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={onCheckout}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>ادامه فرآیند خرید و پرداخت</span>
              <ArrowLeft size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
