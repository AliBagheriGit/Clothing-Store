'use client';

import React from 'react';
import { Truck, RefreshCw, ShieldCheck, Headphones } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: Truck,
      title: 'ارسال اکسپرس به سراسر کشور',
      description: 'ارسال سریع با پست پیشتاز و تیپاکس به تمام شهرهای ایران با بیمه مرسوله',
    },
    {
      icon: RefreshCw,
      title: '۷ روز ضمانت بازگشت و تعویض',
      description: 'بدون قید و شرط امکان تعویض سایز یا عودت کالا در صورت عدم رضایت',
    },
    {
      icon: ShieldCheck,
      title: 'تضمین اصالت و الیاف ۱۰۰٪ طبیعی',
      description: 'پارچه‌های لینن ارگانیک و دوخت مزونی با کنترل کیفی دقیق پیش از ارسال',
    },
    {
      icon: Headphones,
      title: 'مشاوره استایل و پشتیبانی ۲۴/۷',
      description: 'راهنمایی تلفنی و آنلاین انتخاب سایز و ست کردن لباس توسط مشاوران مد',
    },
  ];

  return (
    <section className="py-12 bg-white border-y border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 rounded-2xl bg-stone-50/80 hover:bg-pink-50/40 border border-stone-100 transition-colors text-right"
              >
                <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0 shadow-xs">
                  <Icon size={24} />
                </div>
                <div>
                  <h4 className="font-extrabold text-stone-900 text-sm sm:text-base mb-1">
                    {badge.title}
                  </h4>
                  <p className="text-stone-500 text-xs leading-relaxed">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
