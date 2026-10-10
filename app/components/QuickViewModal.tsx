'use client';

import React, { useState } from 'react';
import { X, Star, Check, ShoppingBag, ShieldCheck, RefreshCw, Truck, Trash2 } from 'lucide-react';
import { Product, ProductColor } from '../types';
import { formatPrice, toPersianDigits } from '../utils';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, color: ProductColor, size: string, quantity: number) => void;
  isAdmin?: boolean;
  onDeleteProduct?: (productId: string) => void;
  onUpdateStockCount?: (productId: string, delta: number) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  isAdmin,
  onDeleteProduct,
  onUpdateStockCount,
}) => {
  if (!isOpen || !product) return null;

  const stock = product.stockCount !== undefined ? product.stockCount : (product.inStock ? 10 : 0);
  const isOutOfStock = stock <= 0 || !product.inStock;

  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string>(product.image);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    onAddToCart(product, selectedColor, selectedSize, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Modal Container */}
      <div
        className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 bg-white/90 hover:bg-white text-stone-700 hover:text-black p-2 rounded-full shadow-md transition-colors"
          aria-label="بستن"
        >
          <X size={20} />
        </button>

        {/* 1. Left Side / Image Gallery */}
        <div className="w-full md:w-1/2 bg-stone-100 p-6 flex flex-col items-center justify-center">
          <div className="relative aspect-3/4 w-full max-w-sm rounded-xl overflow-hidden shadow-md">
            <div
              className="w-full h-full bg-cover bg-center transition-all duration-300"
              style={{ backgroundImage: `url(${activeImage})` }}
            />
            {product.discountPercent && (
              <span className="absolute top-3 right-3 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                {toPersianDigits(product.discountPercent)}٪ تخفیف
              </span>
            )}
          </div>

          {/* Gallery Thumbnails if available */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="flex gap-2 mt-4">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-14 h-18 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === img ? 'border-pink-600 scale-105' : 'border-transparent opacity-70'
                  }`}
                >
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. Right Side / Product Details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto space-y-5">
          {/* Header */}
          <div>
            <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full">
              {product.tag || 'کالکشن تابستانه'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-2 leading-tight">
              {product.name}
            </h2>
            {product.englishName && (
              <p className="text-xs text-stone-400 font-sans tracking-wide mt-0.5">
                {product.englishName}
              </p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-stone-300'}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-stone-700">
                {toPersianDigits(product.rating)}
              </span>
              <span className="text-xs text-stone-400">
                ({toPersianDigits(product.reviewsCount)} نظر ثبت شده)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-stone-50 p-3.5 rounded-xl flex items-center justify-between border border-stone-200/70">
            <div>
              <span className="text-xs text-stone-500 block">قیمت ویژه:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-pink-600">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2.5 py-1 rounded-full">
              موجود در انبار بوتیک
            </span>
          </div>

          {/* Description & Material */}
          <div>
            <p className="text-stone-600 text-sm leading-relaxed">{product.description}</p>
            <div className="mt-2 text-xs text-stone-500 bg-stone-100/80 p-2 rounded-lg">
              <strong className="text-stone-800">جنس و الیاف: </strong>
              {product.material}
            </div>
          </div>

          {/* Color Selector */}
          <div>
            <label className="text-xs font-bold text-stone-800 block mb-2">
              انتخاب رنگ: <span className="text-pink-600 font-medium">{selectedColor.name}</span>
            </label>
            <div className="flex items-center gap-3">
              {product.colors.map((c, i) => {
                const isSelected = selectedColor.name === c.name;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(c)}
                    className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-pink-600 bg-pink-50 text-pink-700 ring-1 ring-pink-500'
                        : 'border-stone-200 hover:border-stone-400 text-stone-700'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-stone-300"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                    {isSelected && <Check size={14} className="text-pink-600 mr-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <label className="text-xs font-bold text-stone-800 block mb-2">انتخاب سایز:</label>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s, i) => {
                const isSelected = selectedSize === s;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(s)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                        : 'border-stone-200 text-stone-700 hover:border-stone-400 bg-white'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & CTA */}
          <div className="pt-2 flex items-center gap-3">
            {/* Quantity control */}
            <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-11 flex items-center justify-center text-stone-600 hover:bg-stone-200 font-bold text-lg"
              >
                -
              </button>
              <span className="w-10 text-center font-bold text-sm text-stone-800">
                {toPersianDigits(quantity)}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-11 flex items-center justify-center text-stone-600 hover:bg-stone-200 font-bold text-lg"
              >
                +
              </button>
            </div>

            {/* Add to Cart CTA */}
            {isOutOfStock ? (
              <button
                disabled
                className="flex-1 bg-stone-200 text-stone-500 font-bold py-3 px-6 rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>متاسفانه این کالا در انبار ناموجود است</span>
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <ShoppingBag size={18} />
                <span>افزودن به سبد خرید</span>
              </button>
            )}
          </div>

          {/* Admin Management Section: Stock Adjuster & Delete */}
          {isAdmin && (
            <div className="p-3.5 bg-stone-950 text-white rounded-2xl border border-stone-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-200">
                  مدیریت موجودی کالا (ویژه مدیر):
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  stock > 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}>
                  {stock > 0 ? 'موجود در انبار' : 'ناموجود'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center bg-stone-900 border border-stone-700 rounded-xl overflow-hidden p-0.5">
                  <button
                    type="button"
                    onClick={() => onUpdateStockCount?.(product.id, -1)}
                    className="w-8 h-8 flex items-center justify-center text-stone-300 hover:text-white hover:bg-stone-800 font-black text-sm cursor-pointer"
                    title="کاهش موجودی (-۱)"
                  >
                    -
                  </button>
                  <span className="w-16 text-center text-xs font-black text-amber-400">
                    {toPersianDigits(stock)} عدد
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateStockCount?.(product.id, 1)}
                    className="w-8 h-8 flex items-center justify-center text-stone-300 hover:text-white hover:bg-stone-800 font-black text-sm cursor-pointer"
                    title="افزایش موجودی (+۱)"
                  >
                    +
                  </button>
                </div>

                {onDeleteProduct && (
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteProduct(product.id);
                      onClose();
                    }}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-3.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    title="حذف این محصول از سایت"
                  >
                    <Trash2 size={14} />
                    <span>حذف از سایت</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Value props in modal */}
          <div className="pt-4 border-t border-stone-100 grid grid-cols-3 gap-2 text-center text-[11px] text-stone-500">
            <div className="flex flex-col items-center gap-1">
              <Truck size={16} className="text-pink-600" />
              <span>ارسال سریع سراسری</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RefreshCw size={16} className="text-pink-600" />
              <span>۷ روز ضمانت تعویض</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck size={16} className="text-pink-600" />
              <span>۱۰۰٪ الیاف طبیعی</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
