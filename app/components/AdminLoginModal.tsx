'use client';

import React, { useState } from 'react';
import { X, Lock, KeyRound, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin credentials
    if (password === 'admin123' || password === 'admin') {
      setError(false);
      setPassword('');
      onLoginSuccess();
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn text-right">
      <div
        className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Icon & Title */}
        <div className="text-center space-y-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-stone-900 text-pink-500 mx-auto flex items-center justify-center shadow-lg">
            <Lock size={26} />
          </div>
          <h3 className="text-xl font-black text-stone-900">
            ورود به پیشخوان مدیریت بوتیک
          </h3>
          <p className="text-stone-500 text-xs leading-relaxed max-w-xs mx-auto">
            دسترسی به بخش افزودن، ویرایش و حذف اجناس سایت ویژه مدیر و اپراتور فروشگاه
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1.5">
              رمز عبور مدیر سایت:
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="رمز عبور مدیریت..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pr-10 pl-3.5 py-3 text-sm focus:outline-hidden focus:border-pink-500 focus:bg-white transition-all text-left font-mono"
                dir="ltr"
              />
            </div>
            <span className="text-[11px] text-stone-400 mt-1.5 block">
              رمز عبور پیش‌فرض: <code className="bg-stone-100 px-1 py-0.5 rounded text-pink-600 font-mono font-bold">admin123</code>
            </span>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center gap-2">
              <ShieldAlert size={16} className="shrink-0" />
              <span>رمز عبور اشتباه است! لطفاً مجدداً امتحان نمایید.</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-stone-900 hover:bg-black text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <Lock size={16} />
            <span>احراز هویت و ورود مدیر</span>
          </button>
        </form>
      </div>
    </div>
  );
};
