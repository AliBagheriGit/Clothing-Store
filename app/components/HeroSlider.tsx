'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, ArrowLeft, ArrowRight } from 'lucide-react';
import { HERO_SLIDES } from '../mockData';
import { useLanguage } from '../context/LanguageContext';

export const HeroSlider: React.FC = () => {
  const { language, isRTL, t } = useLanguage();
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
  const isEn = language === 'en';

  const badge = (isEn && slide.englishBadge) ? slide.englishBadge : slide.badge;
  const title = (isEn && slide.englishTitle) ? slide.englishTitle : slide.title;
  const description = (isEn && slide.englishDescription) ? slide.englishDescription : slide.description;
  const buttonText = (isEn && slide.englishButtonText) ? slide.englishButtonText : slide.buttonText;

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
          <div className={`absolute inset-0 ${
            isRTL
              ? 'bg-gradient-to-r from-black/80 via-black/40 to-transparent'
              : 'bg-gradient-to-l from-black/80 via-black/40 to-transparent'
          }`} />
        </div>
      ))}

      {/* Content Container */}
      <div className={`relative max-w-7xl mx-auto h-full px-6 sm:px-12 flex flex-col justify-center items-start ${
        isRTL ? 'text-right' : 'text-left'
      } z-10`}>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-pink-600/90 text-white text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-full mb-4 shadow-lg backdrop-blur-xs animate-fadeIn">
          <span>✨</span>
          <span>{badge}</span>
        </div>

        {/* Subtitle */}
        <span className="text-pink-300 font-medium text-sm sm:text-base tracking-wider uppercase mb-2 font-sans">
          {slide.subtitle}
        </span>

        {/* Big Bold Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight sm:leading-snug max-w-2xl mb-4 drop-shadow-md">
          {title}
        </h1>

        {/* Description */}
        <p className="text-stone-200 text-sm sm:text-lg max-w-xl mb-8 leading-relaxed font-light drop-shadow-sm">
          {description}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={slide.link}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('featured-products');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white hover:bg-pink-600 text-stone-900 hover:text-white px-8 py-3.5 rounded-full text-base font-bold transition-all shadow-xl hover:shadow-pink-600/30 flex items-center gap-2 group/btn transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>{buttonText}</span>
            {isRTL ? (
              <ArrowLeft
                size={18}
                className="transform group-hover/btn:-translate-x-1 transition-transform"
              />
            ) : (
              <ArrowRight
                size={18}
                className="transform group-hover/btn:translate-x-1 transition-transform"
              />
            )}
          </a>

          <a
            href="#categories"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('categories');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-black/40 hover:bg-black/60 text-white border border-white/30 backdrop-blur-xs px-6 py-3.5 rounded-full text-base font-semibold transition-all cursor-pointer"
          >
            {t.hero.exploreCategories}
          </a>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 inset-x-4 flex items-center justify-between pointer-events-none z-20">
        <button
          onClick={prevSlide}
          className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-pink-600 text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg"
          aria-label="Previous Slide"
        >
          {isRTL ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
        </button>
        <button
          onClick={nextSlide}
          className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-pink-600 text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg"
          aria-label="Next Slide"
        >
          {isRTL ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center items-center gap-2 z-20">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all rounded-full cursor-pointer ${
              idx === currentSlide
                ? 'w-8 h-2.5 bg-pink-500 shadow-lg'
                : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
