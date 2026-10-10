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


export const Footer: React.FC = () => {
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
    <footer className="bg-stone-950 text-stone-300 text-right pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* 1. Newsletter Box */}
        <div className="bg-gradient-to-r from-stone-900 to-stone-850 p-8 sm:p-10 rounded-3xl border border-stone-800 shadow-2xl mb-16 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-right">
            <span className="text-pink-400 font-bold text-xs uppercase tracking-wider">
              کلوب مشتریان وفادار
            </span>
            <h3 className="text-xl sm:text-3xl font-black text-white mt-1">
              عضویت در خبرنامه و دریافت ۵۰٪ تخفیف
            </h3>
            <p className="text-stone-400 text-xs sm:text-sm mt-2 leading-relaxed">
              با ثبت ایمیل یا شماره موبایل خود، اولین نفری باشید که از آغاز حراجی‌های فصلی و کالکشن‌های جدید باخبر می‌شوید.
            </p>
          </div>

          <div className="w-full lg:w-auto">
            {subscribed ? (
              <div className="bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2">
                <span>✓ شماره شما با موفقیت در کلوب تخفیف ثبت شد! کد هدیه: WELCOME-VIP</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full max-w-md">
                <input
                  type="text"
                  required
                  value={newsletterInput}
                  onChange={(e) => setNewsletterInput(e.target.value)}
                  placeholder="ایمیل یا شماره موبایل شما..."
                  className="bg-stone-950 border border-stone-700 text-white placeholder-stone-500 text-xs sm:text-sm rounded-xl px-4 py-3 flex-1 focus:outline-hidden focus:border-pink-500"
                />
                <button
                  type="submit"
                  className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-pink-600/20 shrink-0 flex items-center gap-1.5"
                >
                  <span>عضویت</span>
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
                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/icon.svg`}
                alt="بوتیک گلامور"
                className="w-9 h-9 rounded-xl shadow-md shrink-0"
              />
              <span className="text-xl font-black text-white font-sans tracking-wide">
                GLAMOUR HUB <span className="text-pink-500 text-sm">بوتیک</span>
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              بوتیک اختصاصی گلامور، پیشرو در ارائه شیک‌ترین کالکشن‌های مد فصلی، لباس‌های ساحلی و استایل‌های خنک تابستانه با مرغوب‌ترین الیاف طبیعی و طراحی روز دنیا.
            </p>

            <div className="space-y-2 text-xs text-stone-300 pt-2">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-pink-500 shrink-0" />
                <span>تهران، خیابان فرشته، مرکز خرید نگین، طبقه ۲، واحد ۲۰۴</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-pink-500 shrink-0" />
                <span dir="ltr">۰۲۱ - ۲۲۴۵ ۸۹۹۰</span>
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
                title="اینستاگرام"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href="#telegram"
                className="w-8 h-8 rounded-full bg-stone-900 hover:bg-sky-500 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
                title="تلگرام"
              >
                <Send size={15} />
              </a>
              <a
                href="#whatsapp"
                className="w-8 h-8 rounded-full bg-stone-900 hover:bg-emerald-500 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
                title="واتساپ"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4 className="text-white font-extrabold text-sm mb-4">دسته‌بندی‌ها</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <a href="#featured-products" className="hover:text-pink-400 transition-colors">
                  پیراهن‌های ساحلی لینن
                </a>
              </li>
              <li>
                <a href="#featured-products" className="hover:text-pink-400 transition-colors">
                  شومیز و مانتو تابستانه
                </a>
              </li>
              <li>
                <a href="#featured-products" className="hover:text-pink-400 transition-colors">
                  پیراهن‌های کژوال هاوایی
                </a>
              </li>
              <li>
                <a href="#featured-products" className="hover:text-pink-400 transition-colors">
                  صندل‌های دست‌دوز چرم
                </a>
              </li>
              <li>
                <a href="#featured-products" className="hover:text-pink-400 transition-colors">
                  کیف‌های دست‌بافت حصیری
                </a>
              </li>
              <li>
                <a href="#featured-products" className="hover:text-pink-400 transition-colors">
                  عینک‌های آفتابی UV400
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Customer Care */}
          <div>
            <h4 className="text-white font-extrabold text-sm mb-4">خدمات مشتریان</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <a href="#faq" className="hover:text-pink-400 transition-colors">
                  راهنمای جامع سایزبندی
                </a>
              </li>
              <li>
                <a href="#rules" className="hover:text-pink-400 transition-colors">
                  شرایط و رویه بازگشت کالا
                </a>
              </li>
              <li>
                <a href="#tracking" className="hover:text-pink-400 transition-colors">
                  پیگیری مرسوله پستی
                </a>
              </li>
              <li>
                <a href="#payment" className="hover:text-pink-400 transition-colors">
                  روش‌های پرداخت آنلاین
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-pink-400 transition-colors">
                  حریم خصوصی کاربران
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-pink-400 transition-colors">
                  درباره مزون و بوتیک
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Iranian Trust Badges & Licenses */}
          <div>
            <h4 className="text-white font-extrabold text-sm mb-4">نمادهای اعتماد</h4>
            <div className="grid grid-cols-2 gap-3">
              {/* Enamad simulated badge */}
              <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 hover:border-pink-500/50 transition-colors">
                <ShieldCheck className="text-pink-500" size={28} />
                <span className="text-[10px] text-stone-300 font-bold">اینماد الکترونیک</span>
                <span className="text-[9px] text-emerald-400">۵ ستاره تایید شده</span>
              </div>

              {/* Samandehi badge */}
              <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 hover:border-pink-500/50 transition-colors">
                <Award className="text-amber-400" size={28} />
                <span className="text-[10px] text-stone-300 font-bold">نشان ساماندهی</span>
                <span className="text-[9px] text-stone-400">وزارت ارشاد</span>
              </div>
            </div>

            <div className="mt-4 p-2.5 bg-stone-900/60 rounded-xl border border-stone-800 text-[11px] text-stone-400 flex items-center gap-2">
              <CreditCard size={18} className="text-pink-500 shrink-0" />
              <span>پرداخت امن متصل به شاپرک</span>
            </div>
          </div>
        </div>

        {/* 3. Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4 text-center sm:text-right">
          <div>
            <span>کلیه حقوق مادی و معنوی برای </span>
            <strong className="text-stone-300">بوتیک آنلاین گلامور (Glamour Hub)</strong>
            <span> محفوظ است © ۱۴۰۴</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
