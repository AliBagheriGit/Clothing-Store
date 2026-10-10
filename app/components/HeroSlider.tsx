'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, ArrowLeft } from 'lucide-react';
import { HERO_SLIDES } from '../mockData';

export const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
  };

  // Auto-play slider every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="relative w-full h-[520px] sm:h-[620px] lg:h-[700px] overflow-hidden bg-stone-900 select-none group">
      {/* Background Images with Cross-fade */}
      {HERO_SLIDES.map((item, idx) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          } transition-transform duration-1000`}
        >
          {/* Background image */}
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${item.image})` }}
          />
          {/* Theme overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>
      ))}

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto h-full px-6 sm:px-12 flex flex-col justify-center items-start text-right z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-pink-600/90 text-white text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-full mb-4 shadow-lg backdrop-blur-xs animate-fadeIn">
          <span>✨</span>
          <span>{slide.badge}</span>
        </div>

        {/* English Subtitle */}
        <span className="text-pink-300 font-medium text-sm sm:text-base tracking-wider uppercase mb-2 font-sans">
          {slide.subtitle}
        </span>

        {/* Big Bold Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight sm:leading-snug max-w-2xl mb-4 drop-shadow-md">
          {slide.title}
        </h1>

        {/* Description */}
        <p className="text-stone-200 text-sm sm:text-lg max-w-xl mb-8 leading-relaxed font-light drop-shadow-sm">
          {slide.description}
        </p>

        {/* CTA Button */}
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={slide.link}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('featured-products');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white hover:bg-pink-600 text-stone-900 hover:text-white px-8 py-3.5 rounded-full text-base font-bold transition-all shadow-xl hover:shadow-pink-600/30 flex items-center gap-2 group/btn transform hover:-translate-y-0.5"
          >
            <span>{slide.buttonText}</span>
            <ArrowLeft
              size={18}
              className="transform group-hover/btn:-translate-x-1 transition-transform"
            />
          </a>

          <a
            href="#categories"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('categories');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-black/40 hover:bg-black/60 text-white border border-white/30 backdrop-blur-xs px-6 py-3.5 rounded-full text-base font-semibold transition-all"
          >
            دیدن دسته‌بندی‌ها
          </a>
        </div>
      </div>

      {/* Navigation Arrows (matching the left pink and right dark square button in the original theme screenshot) */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-pink-600 hover:bg-pink-700 text-white w-12 sm:w-14 h-14 sm:h-16 flex items-center justify-center transition-colors shadow-lg z-20"
        aria-label="اسلاید قبلی"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-white w-12 sm:w-14 h-14 sm:h-16 flex items-center justify-center transition-colors shadow-lg z-20"
        aria-label="اسلاید بعدی"
      >
        <ChevronRight size={28} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentSlide ? 'w-8 bg-pink-500' : 'w-2 bg-white/60 hover:bg-white'
            }`}
            aria-label={`رفتن به اسلاید ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
