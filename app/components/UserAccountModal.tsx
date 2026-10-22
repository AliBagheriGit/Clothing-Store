'use client';

import React, { useState } from 'react';
import {
  X,
  User as UserIcon,
  LogOut,
  Package,
  CheckCircle2,
  Lock,
  Phone,
  Crown,
  PlusCircle,
  Layers,
} from 'lucide-react';
import type { User } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
  onOpenAddProduct: () => void;
  onOpenManageProducts: () => void;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  onOpenAddProduct,
  onOpenManageProducts,
}) => {
  const { t, formatPrice, formatDigits, isRTL, language } = useLanguage();
  const isEn = language === 'en';

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login Form
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register Form
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');

  if (!isOpen) return null;

  // Handle standard login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = loginIdentifier.trim().toLowerCase();

    // Check if logging in as Admin
    const isMockAdmin =
      id === 'admin' ||
      id === 'admin@glamour.ir' ||
      id === '09120000000' ||
      id === 'manager' ||
      id === 'مدیر';

    if (isMockAdmin) {
      if (loginPassword === 'admin123' || loginPassword === 'admin' || loginPassword === '123456') {
        const adminUser: User = {
          id: 'usr-admin',
          name: isEn ? 'Glamour Senior Admin' : 'مدیریت ارشد بوتیک گلامور',
          phone: '09120000000',
          role: 'admin',
          joinedDate: '2024/04/15',
          orders: [
            {
              id: 'ORD-991',
              date: '2026/07/08',
              itemsCount: 2,
              totalAmount: 2320000,
              status: 'تحویل شده',
              englishStatus: 'Delivered',
              trackingCode: 'GLM-891024',
            },
          ],
        };
        onLogin(adminUser);
        setLoginError('');
        return;
      } else {
        setLoginError(isEn ? 'Incorrect admin password! (Default: admin123)' : 'رمز عبور مدیر اشتباه است! (رمز پیش‌فرض: admin123)');
        return;
      }
    }

    // Standard Customer Login
    if (loginIdentifier && loginPassword) {
      const customerUser: User = {
        id: `usr-${Date.now()}`,
        name: loginIdentifier.includes('@')
          ? loginIdentifier.split('@')[0]
          : (isEn ? 'Valued Customer' : 'کاربر گرامی'),
        phone: loginIdentifier,
        role: 'customer',
        joinedDate: isEn ? 'Today' : 'امروز',
        orders: [
          {
            id: 'ORD-102',
            date: isEn ? 'Yesterday' : 'دیروز',
            itemsCount: 1,
            totalAmount: 1380000,
            status: 'در حال بسته‌بندی',
            englishStatus: 'Packing',
            trackingCode: 'GLM-549102',
          },
        ],
      };
      onLogin(customerUser);
      setLoginError('');
    } else {
      setLoginError(isEn ? 'Please enter mobile/username and password.' : 'لطفاً شماره موبایل و رمز عبور را وارد فرمایید.');
    }
  };

  // Handle Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim() || !regPassword) {
      setRegError(isEn ? 'Please fill all required fields.' : 'لطفاً تمامی فیلدهای الزامی را پر نمایید.');
      return;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: regName.trim(),
      phone: regPhone.trim(),
      role: 'customer',
      joinedDate: isEn ? 'Today' : 'امروز',
      orders: [],
    };

    onLogin(newUser);
    setRegError('');
    setRegName('');
    setRegPhone('');
    setRegPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div
        className={`relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-stone-200 ${
          isRTL ? 'text-right' : 'text-left'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center">
              <UserIcon size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">
                {currentUser
                  ? (isEn ? 'User Profile & Dashboard' : 'پروفایل و داشبورد کاربری')
                  : t.account.title}
              </h3>
              <span className="text-xs text-stone-400">
                {currentUser
                  ? `${isEn ? 'Active account:' : 'حساب فعال:'} ${currentUser.name}`
                  : (isEn ? 'Access your orders, saved items and management' : 'دسترسی اختصاصی به سفارش‌ها، علاقه‌مندی‌ها و پنل')}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          {currentUser ? (
            /* --- LOGGED-IN VIEW --- */
            <div className="space-y-6">
              {/* User Identity Card */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-stone-900 text-white flex items-center justify-center font-bold text-xl shadow-md">
                    {currentUser.role === 'admin' ? (
                      <Crown className="text-amber-400 w-8 h-8" />
                    ) : (
                      currentUser.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-black text-stone-900 text-base">{currentUser.name}</h4>
                      {/* Role Tag */}
                      {currentUser.role === 'admin' ? (
                        <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Crown size={12} className="text-amber-600" />
                          <span>{t.account.adminBadge}</span>
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 size={12} className="text-emerald-600" />
                          <span>{t.account.customerBadge}</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-stone-500 block mt-1">
                      {isEn ? 'Mobile: ' : 'تلفن همراه: '}
                      {formatDigits(currentUser.phone)}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {isEn ? 'Member since: ' : 'عضویت از: '}
                      {formatDigits(currentUser.joinedDate)}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>{t.account.logout}</span>
                </button>
              </div>

              {/* EXCLUSIVE ADMIN SECTION */}
              {currentUser.role === 'admin' && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-stone-950 to-stone-900 text-white border-2 border-pink-500/50 shadow-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-pink-600 flex items-center justify-center text-white font-bold text-xs">
                        W
                      </div>
                      <h4 className="font-extrabold text-sm sm:text-base text-white">
                        {t.account.adminPanelHeading}
                      </h4>
                    </div>
                    <span className="text-[10px] bg-pink-600/30 text-pink-300 border border-pink-500/40 px-2 py-0.5 rounded-full font-medium">
                      {isEn ? 'Admin Only' : 'دسترسی انحصاری مدیر'}
                    </span>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed">
                    {isEn
                      ? 'You are logged in as Senior Administrator. You can add new boutique products with photos and inventory, or manage existing catalog items.'
                      : 'شما با نقش مدیر ارشد وارد شده‌اید. می‌توانید اجناس جدید را با عکس و مشخصات به سایت اضافه کرده یا کالاهای ناموجود را حذف نمایید.'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenAddProduct();
                      }}
                      className="bg-pink-600 hover:bg-pink-700 text-white font-bold p-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-pink-600/30 cursor-pointer"
                    >
                      <PlusCircle size={16} />
                      <span>{t.account.addProductBtn}</span>
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onOpenManageProducts();
                      }}
                      className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold p-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all border border-stone-700 cursor-pointer"
                    >
                      <Layers size={16} className="text-pink-400" />
                      <span>{t.account.manageProductsBtn}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* CUSTOMER ORDER HISTORY */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <Package size={17} className="text-pink-600" />
                    <span>{t.account.orderHistory}</span>
                  </h4>
                  <span className="text-xs text-stone-400">
                    {formatDigits(currentUser.orders.length)} {isEn ? 'orders' : 'سفارش'}
                  </span>
                </div>

                {currentUser.orders.length === 0 ? (
                  <div className="p-6 text-center text-stone-400 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
                    {t.account.noOrders}
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {currentUser.orders.map((ord) => {
                      const orderStatusText = isEn && ord.englishStatus ? ord.englishStatus : ord.status;
                      return (
                        <div
                          key={ord.id}
                          className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <strong className="text-stone-900">{ord.id}</strong>
                              <span className="text-stone-400">•</span>
                              <span className="text-stone-500">
                                {isEn ? 'Date: ' : 'تاریخ: '}
                                {formatDigits(ord.date)}
                              </span>
                            </div>
                            <span className="text-[11px] text-stone-400 block mt-1">
                              {t.account.orderTracking}{' '}
                              <span className="font-mono text-pink-600 font-bold">{ord.trackingCode}</span>
                            </span>
                          </div>

                          <div className={isRTL ? 'text-left' : 'text-right'}>
                            <span className="font-extrabold text-stone-900 block text-xs sm:text-sm">
                              {formatPrice(ord.totalAmount)}
                            </span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full inline-block mt-1">
                              {orderStatusText}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* --- LOGGED-OUT VIEW --- */
            <div className="space-y-5">
              {/* Tab Selector */}
              <div className="flex bg-stone-100 p-1 rounded-2xl">
                <button
                  onClick={() => {
                    setActiveTab('login');
                    setLoginError('');
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {t.account.loginTab}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('register');
                    setRegError('');
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === 'register'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {t.account.registerTab}
                </button>
              </div>

              {/* TAB 1: LOGIN FORM */}
              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      {t.account.phoneOrUser}:
                    </label>
                    <div className="relative">
                      <Phone size={16} className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-stone-400`} />
                      <input
                        type="text"
                        required
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder={isEn ? '09123456789 or admin' : '۰۹۱۲۳۴۵۶۷۸۹ یا admin'}
                        className={`w-full bg-stone-50 border border-stone-200 rounded-xl ${
                          isRTL ? 'pr-10 pl-3.5' : 'pl-10 pr-3.5'
                        } py-2.5 text-xs sm:text-sm focus:outline-hidden focus:border-pink-500 focus:bg-white`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      {t.account.password}:
                    </label>
                    <div className="relative">
                      <Lock size={16} className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-stone-400`} />
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder={isEn ? 'Your password...' : 'رمز عبور شما...'}
                        className={`w-full bg-stone-50 border border-stone-200 rounded-xl ${
                          isRTL ? 'pr-10 pl-3.5' : 'pl-10 pr-3.5'
                        } py-2.5 text-xs sm:text-sm focus:outline-hidden focus:border-pink-500 focus:bg-white font-mono`}
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {loginError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                      {loginError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-stone-900 hover:bg-black text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shadow-md"
                  >
                    {t.account.loginBtn}
                  </button>

                  {/* Admin Credentials Quick Autofill Box */}
                  <div className="p-3.5 bg-amber-50/95 border border-amber-200 rounded-2xl text-xs text-amber-950 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900">
                        <Lock size={14} className="text-amber-600" />
                        <span>{isEn ? 'Demo Admin Credentials:' : 'مشخصات فرضی مدیر سایت:'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginIdentifier('admin');
                          setLoginPassword('admin123');
                          setLoginError('');
                        }}
                        className="text-[11px] bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        title="Click to autofill"
                      >
                        {isEn ? 'Autofill Admin' : 'جایگذاری مشخصات مدیر'}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-white/90 p-2 rounded-xl border border-amber-200/70" dir="ltr">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-stone-600 font-sans">{isEn ? 'User:' : 'کاربر:'}</span>
                        <strong className="text-pink-700 font-bold">admin</strong>
                      </div>
                      <div className="flex items-center justify-between px-1">
                        <span className="text-stone-600 font-sans">{isEn ? 'Pass:' : 'رمز:'}</span>
                        <strong className="text-pink-700 font-bold">admin123</strong>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* TAB 2: REGISTER FORM */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      {t.account.fullName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder={isEn ? 'e.g. Narges Rezaei' : 'مثال: نرگس رضایی'}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:border-pink-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      {t.account.phone} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder={isEn ? '+98 912 345 6789' : '۰۹۱۲۳۴۵۶۷۸۹'}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:border-pink-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      {t.account.password} *
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder={isEn ? 'Minimum 6 characters...' : 'حداقل ۶ کاراکتر...'}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:border-pink-500 focus:bg-white font-mono"
                      dir="ltr"
                    />
                  </div>

                  {regError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                      {regError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shadow-md shadow-pink-600/20"
                  >
                    {t.account.registerBtn}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
