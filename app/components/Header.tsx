'use client';

import React, { useState } from 'react';
import {
  Search,
  User as UserIcon,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Phone,
  Mail,
  Send,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { InstagramIcon } from './Icons';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';
import type { User, ProductCategory } from '../types';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  currentUser: User | null;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onSelectCategory: (category: ProductCategory) => void;
  onOpenAccountModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  currentUser,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onSelectCategory,
  onOpenAccountModal,
}) => {
  const { t, formatDigits, isRTL, language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-xs sticky top-0 z-40">
      {/* 1. Top Bar */}
      <div className="bg-stone-900 text-stone-300 text-xs py-2 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Socials & Quick Links */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <a
                href="#instagram"
                className="hover:text-pink-400 transition-colors flex items-center gap-1"
                title={t.topBar.instagram}
              >
                <InstagramIcon size={14} />
                <span className="hidden sm:inline">{t.topBar.instagram}</span>
              </a>
              <a
                href="#telegram"
                className="hover:text-sky-400 transition-colors flex items-center gap-1"
                title={t.topBar.telegram}
              >
                <Send size={14} />
                <span className="hidden sm:inline">{t.topBar.telegram}</span>
              </a>
              <a
                href="#whatsapp"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                title={t.topBar.whatsapp}
              >
                <MessageCircle size={14} />
                <span className="hidden sm:inline">{t.topBar.whatsapp}</span>
              </a>
            </div>
            <span className="text-stone-600 hidden md:inline">|</span>
            <div className="hidden md:flex items-center gap-3 text-stone-400">
              <a href="#about" className="hover:text-white transition-colors">
                {t.topBar.about}
              </a>
              <a href="#contact" className="hover:text-white transition-colors">
                {t.topBar.contact}
              </a>
              <a href="#faq" className="hover:text-white transition-colors">
                {t.topBar.sizeGuide}
              </a>
            </div>
          </div>

          {/* Contact & Language Selector */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <span className="flex items-center gap-1 text-stone-300">
                <Mail size={13} className="text-pink-400" />
                <span>{t.topBar.supportEmail}</span>
              </span>
              <span className="text-stone-600">|</span>
              <span className="flex items-center gap-1 text-stone-300" dir="ltr">
                <Phone size={13} className="text-pink-400" />
                <span>{t.topBar.phone}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1.5 bg-stone-800 px-2.5 py-0.5 rounded text-[11px] text-pink-300 font-medium">
                <span>{t.topBar.currency}</span>
              </div>
              {/* Topbar Language Switcher */}
              <LanguageSwitcher variant="topbar" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-stone-700 hover:text-black focus:outline-hidden cursor-pointer"
          aria-label={t.header.mobileMenu}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand / Logo */}
        <a href="#" className="flex items-center gap-2 sm:gap-3 group">
          <img
            src="/icon.svg"
            alt="Glamour Hub"
            className="w-10 h-10 rounded-2xl shadow-md shadow-pink-500/25 group-hover:scale-105 transition-transform shrink-0"
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-stone-900 font-sans flex items-center gap-1.5">
              GLAMOUR HUB
              <span className="text-pink-500 text-xs px-1.5 py-0.5 bg-pink-50 rounded-full border border-pink-200">
                {t.header.boutiqueBadge}
              </span>
            </span>
            <span className="text-[11px] text-stone-500 font-medium tracking-wide">
              {t.header.brandSub}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-semibold text-stone-700">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('all');
            }}
            className="text-pink-600 hover:text-pink-700 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-pink-500"
          >
            {t.header.home}
          </a>
          <a
            href="#featured-products"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('all');
              const el = document.getElementById('featured-products');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-pink-600 transition-colors"
          >
            {t.header.shop}
          </a>
          <a
            href="#featured-products"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('women');
              const el = document.getElementById('featured-products');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-pink-600 transition-colors"
          >
            {t.header.women}
          </a>
          <a
            href="#featured-products"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('men');
              const el = document.getElementById('featured-products');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-pink-600 transition-colors"
          >
            {t.header.men}
          </a>
          <a
            href="#featured-products"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('accessories');
              const el = document.getElementById('featured-products');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-pink-600 transition-colors"
          >
            {t.header.accessories}
          </a>
          <a
            href="#lookbook"
            className="hover:text-pink-600 transition-colors flex items-center gap-1 text-stone-600"
          >
            <Sparkles size={14} className="text-amber-500" />
            <span>{t.header.lookbook}</span>
          </a>
          <a
            href="#featured-products"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('all');
              const el = document.getElementById('featured-products');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-3 py-1 rounded-full text-xs font-bold transition-colors flex items-center gap-1 border border-rose-200"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            {t.header.specialSale}
          </a>
        </nav>

        {/* Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3 text-stone-700">
          {/* Header Language Switcher Button */}
          <LanguageSwitcher variant="header" />

          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors relative cursor-pointer"
            title={t.header.searchTitle}
          >
            <Search size={20} />
          </button>

          {/* User Account / Profile Button */}
          <button
            onClick={onOpenAccountModal}
            className={`p-1.5 sm:px-3 sm:py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer text-xs font-bold ${
              currentUser
                ? currentUser.role === 'admin'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
                : 'hover:bg-stone-100 text-stone-700'
            }`}
            title={currentUser ? `${t.header.account}: ${currentUser.name}` : t.header.account}
          >
            <UserIcon size={18} className={currentUser ? 'text-pink-600' : ''} />
            <span className="hidden sm:inline">
              {currentUser ? currentUser.name : t.header.account}
            </span>
            {currentUser && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold hidden md:inline ${
                  currentUser.role === 'admin' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
                }`}
              >
                {currentUser.role === 'admin' ? t.header.adminRole : t.header.userRole}
              </span>
            )}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="p-2 hover:bg-pink-50 hover:text-pink-600 rounded-full transition-colors relative cursor-pointer"
            title={t.header.wishlistTitle}
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className={`absolute -top-1 ${isRTL ? '-right-1' : '-left-1'} bg-pink-500 text-white text-[11px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white`}>
                {formatDigits(wishlistCount)}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 bg-stone-900 hover:bg-pink-600 text-white px-3 sm:px-4 py-2 rounded-full transition-all shadow-sm group cursor-pointer"
            title={t.header.cartTitle}
          >
            <div className="relative">
              <ShoppingBag size={19} className="group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className={`absolute -top-2 ${isRTL ? '-right-2' : '-left-2'} bg-rose-500 text-white text-[11px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-stone-900`}>
                  {formatDigits(cartCount)}
                </span>
              )}
            </div>
            <span className="text-xs font-bold hidden sm:inline">{t.header.cartTitle}</span>
          </button>
        </div>
      </div>

      {/* 3. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-3 animate-fadeIn">
          {/* Mobile Language Switcher */}
          <LanguageSwitcher variant="mobile" />

          <div className="flex flex-col space-y-2 text-sm font-semibold text-stone-800">
            <button
              onClick={() => {
                onSelectCategory('all');
                setMobileMenuOpen(false);
              }}
              className={`${isRTL ? 'text-right' : 'text-left'} py-2 px-3 rounded hover:bg-stone-50 text-pink-600`}
            >
              {t.header.home}
            </button>
            <button
              onClick={() => {
                onSelectCategory('women');
                setMobileMenuOpen(false);
                document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`${isRTL ? 'text-right' : 'text-left'} py-2 px-3 rounded hover:bg-stone-50`}
            >
              {t.header.women}
            </button>
            <button
              onClick={() => {
                onSelectCategory('men');
                setMobileMenuOpen(false);
                document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`${isRTL ? 'text-right' : 'text-left'} py-2 px-3 rounded hover:bg-stone-50`}
            >
              {t.header.men}
            </button>
            <button
              onClick={() => {
                onSelectCategory('shoes');
                setMobileMenuOpen(false);
                document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`${isRTL ? 'text-right' : 'text-left'} py-2 px-3 rounded hover:bg-stone-50`}
            >
              {t.products.shoesTab}
            </button>
            <button
              onClick={() => {
                onSelectCategory('bags');
                setMobileMenuOpen(false);
                document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`${isRTL ? 'text-right' : 'text-left'} py-2 px-3 rounded hover:bg-stone-50`}
            >
              {t.products.bagsTab}
            </button>
            <button
              onClick={() => {
                onSelectCategory('accessories');
                setMobileMenuOpen(false);
                document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`${isRTL ? 'text-right' : 'text-left'} py-2 px-3 rounded hover:bg-stone-50`}
            >
              {t.header.accessories}
            </button>
          </div>
        </div>
      )}

      {/* 4. Announcement Bar */}
      <div className="bg-pink-600 text-white text-xs sm:text-sm py-2 px-4 text-center font-medium shadow-inner flex items-center justify-center gap-2">
        <span className="hidden sm:inline">🌸</span>
        <span>
          {t.announcement.text}{' '}
          <span className="bg-white text-pink-600 px-2 py-0.5 rounded font-mono font-bold tracking-wider mx-1">
            {t.announcement.code}
          </span>
        </span>
        <span className="hidden sm:inline">🌸</span>
      </div>
    </header>
  );
};
