'use client';

import React from 'react';
import { PlusCircle, Layers, LogOut, ShieldCheck } from 'lucide-react';
import { toPersianDigits } from '../utils';

interface AdminBarProps {
  productsCount: number;
  onOpenAddProduct: () => void;
  onOpenManageProducts: () => void;
  onLogout: () => void;
}

export const AdminBar: React.FC<AdminBarProps> = ({
  productsCount,
  onOpenAddProduct,
  onOpenManageProducts,
  onLogout,
}) => {
  return (
    <div className="bg-stone-950 text-stone-200 text-xs py-1.5 px-4 border-b border-stone-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left Side: WordPress-style Dashboard Links */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          {/* WordPress / Admin Badge */}
          <div className="flex items-center gap-1.5 font-bold text-white bg-stone-800/90 px-2.5 py-1 rounded">
            <span className="w-4 h-4 rounded-full bg-pink-600 text-white flex items-center justify-center text-[10px] font-black">
              W
            </span>
            <span>پیشخوان مدیریت بوتیک</span>
          </div>

          {/* + Add New Product button */}
          <button
            onClick={onOpenAddProduct}
            className="flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded font-bold transition-colors cursor-pointer shadow-xs"
          >
            <PlusCircle size={14} />
            <span>افزودن محصول جدید</span>
          </button>

          {/* Manage & Remove Products */}
          <button
            onClick={onOpenManageProducts}
            className="flex items-center gap-1 bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1 rounded font-medium transition-colors cursor-pointer"
          >
            <Layers size={14} className="text-pink-400" />
            <span>مدیریت و حذف اجناس ({toPersianDigits(productsCount)})</span>
          </button>
        </div>

        {/* Right Side: Admin User Greeting & Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-stone-400">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>سلام، مدیر ارشد سایت</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1 text-rose-400 hover:text-rose-300 hover:bg-stone-900 px-2.5 py-1 rounded transition-colors cursor-pointer"
            title="خروج از حساب مدیریت"
          >
            <LogOut size={13} />
            <span>خروج مدیر</span>
          </button>
        </div>
      </div>
    </div>
  );
};
