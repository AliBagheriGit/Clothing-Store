'use client';

import React, { useState } from 'react';
import {
  Send,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Award,
  CreditCard,
} from 'lucide-react';
import { InstagramIcon } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t, isRTL, language } = useLanguage();
  const isEn = language === 'en';

  const [newsletterInput, setNewsletterInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterInput.trim()) {
      setSubscribed(true);
      setNewsletterInput('');
    }
  };

  return (
    <footer className={`bg-stone-950 text-stone-300 ${isRTL ? 'text-right' : 'text-left'} pt-16 pb-12 border-t border-stone-800`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* 1. Newsletter Box */}
        <div className="bg-gradient-to-r from-stone-900 to-stone-850 p-8 sm:p-10 rounded-3xl border border-stone-800 shadow-2xl mb-16 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className={`max-w-xl ${isRTL ? 'text-right' : 'text-left'}`}>
            <span className="text-pink-400 font-bold text-xs uppercase tracking-wider">
              {t.footer.clubTag}
            </span>
            <h3 className="text-xl sm:text-3xl font-black text-white mt-1">
              {t.footer.clubTitle}
            </h3>
            <p className="text-stone-400 text-xs sm:text-sm mt-2 leading-relaxed">
              {t.footer.clubDesc}
            </p>
          </div>

          <div className="w-full lg:w-auto">
            {subscribed ? (
              <div className="bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2">
                <span>{t.footer.subscribed}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full max-w-md">
                <input
                  type="text"
                  required
                  value={newsletterInput}
                  onChange={(e) => setNewsletterInput(e.target.value)}
                  placeholder={t.footer.placeholder}
                  className="bg-stone-950 border border-stone-700 text-white placeholder-stone-500 text-xs sm:text-sm rounded-xl px-4 py-3 flex-1 focus:outline-hidden focus:border-pink-500"
                />
                <button
                  type="submit"
                  className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-pink-600/20 shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{t.footer.subscribe}</span>
                  <Send size={15} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 2. Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-stone-800">
          {/* Col 1 & 2: About Boutique */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/icon.svg"
                alt="GLAMOUR HUB"
                className="w-9 h-9 rounded-xl shadow-md shrink-0"
              />
              <span className="text-xl font-black text-white font-sans tracking-wide">
                GLAMOUR HUB <span className="text-pink-500 text-sm">{t.header.boutiqueBadge}</span>
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              {t.footer.aboutText}
            </p>

            <div className="space-y-2 text-xs text-stone-300 pt-2">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-pink-500 shrink-0" />
                <span>{t.footer.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-pink-500 shrink-0" />
                <span dir="ltr">{t.footer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={15} className="text-pink-500 shrink-0" />
                <span>info@glamour-boutique.ir</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#insta"
                className="w-8 h-8 rounded-full bg-stone-900 hover:bg-pink-600 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
                title={t.topBar.instagram}
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href="#telegram"
                className="w-8 h-8 rounded-full bg-stone-900 hover:bg-sky-500 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
                title={t.topBar.telegram}
              >
                <Send size={15} />
              </a>
              <a
                href="#whatsapp"
                className="w-8 h-8 rounded-full bg-stone-900 hover:bg-emerald-500 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
                title={t.topBar.whatsapp}
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4 className="text-white font-extrabold text-sm mb-4">{t.footer.categoriesTitle}</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <a href="#featured-products" className="hover:text-pink-400 transition-colors">
                  {isEn ? "Linen Maxi Dresses" : "پیراهن‌های ساحلی لینن"}
                </a>
              </li>
              <li>
                <a href="#featured-products" className="hover:text-pink-400 transition-colors">
                  {isEn ? "Summer Shirts & Blouses" : "شومیز و مانتو تابستانه"}
                </a>
              </li>
              <li>
                <a href="#featured-products" className="hover:text-pink-400 transition-colors">
                  {isEn ? "Hawaiian & Cuban Shirts" : "پیراهن‌های کژوال هاوایی"}
                </a>
              </li>
              <li>
                <a href="#featured-products" className="hover:text-pink-400 transition-colors">
                  {isEn ? "Handmade Leather Slides" : "صندل‌های دست‌دوز چرم"}
                </a>
              </li>
              <li>
                <a href="#featured-products" className="hover:text-pink-400 transition-colors">
                  {isEn ? "Woven Straw Beach Totes" : "کیف‌های دست‌بافت حصیری"}
                </a>
              </li>
              <li>
                <a href="#featured-products" className="hover:text-pink-400 transition-colors">
                  {isEn ? "UV400 Polarized Sunglasses" : "عینک‌های آفتابی UV400"}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Customer Care */}
          <div>
            <h4 className="text-white font-extrabold text-sm mb-4">{t.footer.customerService}</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <a href="#faq" className="hover:text-pink-400 transition-colors">
                  {t.footer.sizeGuide}
                </a>
              </li>
              <li>
                <a href="#rules" className="hover:text-pink-400 transition-colors">
                  {t.footer.returnPolicy}
                </a>
              </li>
              <li>
                <a href="#tracking" className="hover:text-pink-400 transition-colors">
                  {t.footer.tracking}
                </a>
              </li>
              <li>
                <a href="#payment" className="hover:text-pink-400 transition-colors">
                  {t.footer.shippingTerms}
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-pink-400 transition-colors">
                  {t.footer.privacy}
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-pink-400 transition-colors">
                  {t.footer.aboutUs}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Security Badges & Licenses */}
          <div>
            <h4 className="text-white font-extrabold text-sm mb-4">
              {isEn ? 'Trust & Certification' : 'نمادهای اعتماد'}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 hover:border-pink-500/50 transition-colors">
                <ShieldCheck className="text-pink-500" size={28} />
                <span className="text-[10px] text-stone-300 font-bold">
                  {isEn ? 'eNAMAD Certified' : 'اینماد الکترونیک'}
                </span>
                <span className="text-[9px] text-emerald-400">
                  {isEn ? '5-Star Verified' : '۵ ستاره تایید شده'}
                </span>
              </div>

              <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 hover:border-pink-500/50 transition-colors">
                <Award className="text-amber-400" size={28} />
                <span className="text-[10px] text-stone-300 font-bold">
                  {isEn ? 'Verified Store' : 'نشان ساماندهی'}
                </span>
                <span className="text-[9px] text-stone-400">
                  {isEn ? 'Ministry of Industry' : 'وزارت ارشاد'}
                </span>
              </div>
            </div>

            <div className="mt-4 p-2.5 bg-stone-900/60 rounded-xl border border-stone-800 text-[11px] text-stone-400 flex items-center gap-2">
              <CreditCard size={18} className="text-pink-500 shrink-0" />
              <span>{isEn ? 'Secure 256-bit encrypted checkout' : 'پرداخت امن متصل به شاپرک'}</span>
            </div>
          </div>
        </div>

        {/* 3. Bottom Bar */}
        <div className={`pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4 ${
          isRTL ? 'text-center sm:text-right' : 'text-center sm:text-left'
        }`}>
          <div>
            <span>{t.footer.copyright}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
