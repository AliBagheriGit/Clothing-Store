'use client';

import React from 'react';
import { Heart, Eye, ShoppingBag, Star, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { formatPrice, toPersianDigits } from '../utils';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isAdmin?: boolean;
  onDeleteProduct?: (productId: string) => void;
  onUpdateStockCount?: (productId: string, delta: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  isAdmin,
  onDeleteProduct,
  onUpdateStockCount,
}) => {
  const stock = product.stockCount !== undefined ? product.stockCount : (product.inStock ? 10 : 0);
  const isOutOfStock = stock <= 0 || !product.inStock;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* Admin Action Bar on Card (Visible exclusively for Admin) */}
      {isAdmin && (
        <div className="bg-stone-950 text-white px-3 py-2 flex items-center justify-between gap-2 text-xs border-b border-stone-800 z-20 flex-wrap">
          {/* Stock counter controls */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-stone-400 font-medium">موجودی:</span>
            <div className="flex items-center bg-stone-900 border border-stone-700 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateStockCount?.(product.id, -1);
                }}
                className="w-6 h-6 flex items-center justify-center text-stone-300 hover:text-white hover:bg-stone-800 transition-colors font-bold cursor-pointer text-sm"
                title="کاهش موجودی انبار (-۱)"
              >
                -
              </button>
              <span className={`px-2 text-[11px] font-bold ${
                stock > 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {toPersianDigits(stock)}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateStockCount?.(product.id, 1);
                }}
                className="w-6 h-6 flex items-center justify-center text-stone-300 hover:text-white hover:bg-stone-800 transition-colors font-bold cursor-pointer text-sm"
                title="افزایش موجودی انبار (+۱)"
              >
                +
              </button>
            </div>
            {/* Status indicator */}
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
              stock > 0
                ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-800'
                : 'bg-rose-950/90 text-rose-300 border border-rose-800'
            }`}>
              {stock > 0 ? 'موجود' : 'ناموجود'}
            </span>
          </div>

          {/* Delete from site button */}
          {onDeleteProduct && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteProduct(product.id);
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs mr-auto"
              title="حذف فوری این کالا از سایت"
            >
              <Trash2 size={12} />
              <span>حذف از سایت</span>
            </button>
          )}
        </div>
      )}
      {/* 1. Image & Badges Container */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-stone-100">
        {/* Product Image */}
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-108"
          style={{ backgroundImage: `url(${product.image})` }}
        />

        {/* Badges on Top Right */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          {product.discountPercent && (
            <span className="bg-rose-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
              {toPersianDigits(product.discountPercent)}٪- تخفیف
            </span>
          )}
          {product.isNew && (
            <span className="bg-stone-900 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md">
              جدید
            </span>
          )}
          {product.tag && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
              {product.tag}
            </span>
          )}
          {stock <= 3 && stock > 0 && (
            <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
              تنها {toPersianDigits(stock)} عدد باقی‌مانده
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-stone-900 text-rose-400 text-[10px] font-black px-2 py-0.5 rounded-full shadow-md border border-rose-900">
              ناموجود در انبار
            </span>
          )}
        </div>

        {/* Wishlist Button (Always visible on mobile, slick hover on desktop) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center transition-all z-10 shadow-md ${
            isWishlisted
              ? 'bg-rose-50 text-rose-500 ring-2 ring-rose-300'
              : 'bg-white/85 backdrop-blur-xs text-stone-600 hover:text-rose-500 hover:bg-white'
          }`}
          title={isWishlisted ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
        >
          <Heart size={18} className={isWishlisted ? 'fill-rose-500 text-rose-500' : ''} />
        </button>

        {/* Hover Action Bar at Bottom of Image */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 transition-all duration-300 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 z-10">
          {/* Quick View Button */}
          <button
            onClick={() => onQuickView(product)}
            className="flex-1 bg-white/95 hover:bg-white text-stone-800 text-xs font-bold py-2.5 px-3 rounded-xl shadow-lg backdrop-blur-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye size={16} className="text-pink-600" />
            <span>مشاهده سریع</span>
          </button>

          {/* Quick Add to Cart Button */}
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`p-2.5 rounded-xl shadow-lg transition-colors cursor-pointer ${
              isOutOfStock
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : 'bg-pink-600 hover:bg-pink-700 text-white'
            }`}
            title={isOutOfStock ? 'کالا در انبار ناموجود است' : 'افزودن سریع به سبد خرید'}
          >
            <ShoppingBag size={18} />
          </button>

          {/* Quick Delete for Admin */}
          {isAdmin && onDeleteProduct && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteProduct(product.id);
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white p-2.5 rounded-xl shadow-lg transition-colors cursor-pointer"
              title="حذف از سایت (ویژه مدیر)"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Product Information Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3 text-right">
        <div>
          {/* Rating & Reviews */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span className="font-bold text-stone-700">{toPersianDigits(product.rating)}</span>
              <span className="text-stone-400">({toPersianDigits(product.reviewsCount)})</span>
            </div>
            <span className="text-[11px] text-pink-600 font-medium">
              {product.material.split(' ')[0]}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-bold text-stone-900 text-sm sm:text-base leading-snug line-clamp-1 hover:text-pink-600 transition-colors cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Color Dots */}
          <div className="flex items-center gap-1.5 mt-2">
            {product.colors.map((c, i) => (
              <span
                key={i}
                className="w-3.5 h-3.5 rounded-full border border-stone-300 shadow-2xs"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            <span className="text-[10px] text-stone-400 mr-1">
              {toPersianDigits(product.colors.length)} رنگ
            </span>
          </div>
        </div>

        {/* Price & Add to cart button */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-stone-900 font-extrabold text-sm sm:text-base text-pink-600">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Mobile visible Add to Cart button */}
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`sm:hidden p-2 rounded-lg text-xs font-bold ${
              isOutOfStock
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-stone-900 text-white cursor-pointer'
            }`}
          >
            {isOutOfStock ? 'ناموجود' : <ShoppingBag size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
};
