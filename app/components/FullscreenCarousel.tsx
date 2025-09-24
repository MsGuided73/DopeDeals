'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
  textColor: string;
}

const slides: CarouselSlide[] = [
  {
    id: 1,
    title: "VIP CLUB",
    subtitle: "EXCLUSIVE REWARDS",
    description: "Join our VIP Club and unlock exclusive rewards, early access to new products, and special member pricing.",
    backgroundImage: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/rewards/VIPClubblv1.jpeg",
    ctaText: "JOIN VIP CLUB",
    ctaLink: "/rewards",
    textColor: "text-white"
  },
  {
    id: 2,
    title: "PREMIUM GLASS",
    subtitle: "ARTISAN COLLECTION",
    description: "Discover our curated collection of premium glass pieces from renowned artists and top brands.",
    backgroundImage: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Bongs.jpeg",
    ctaText: "SHOP GLASS",
    ctaLink: "/bongs",
    textColor: "text-white"
  },
  {
    id: 3,
    title: "THCA FLOWER",
    subtitle: "PREMIUM QUALITY",
    description: "Experience the finest THCA flower strains, carefully selected for quality and potency.",
    backgroundImage: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/THCA_Flower.jpeg",
    ctaText: "SHOP THCA",
    ctaLink: "/products?q=thca+flower",
    textColor: "text-white"
  }
];

export default function FullscreenCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of manual interaction
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url('${currentSlideData.backgroundImage}')`,
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-6">
          {/* Subtitle */}
          <div className="mb-4">
            <span className={`inline-block px-4 py-2 rounded-full bg-dope-orange/20 backdrop-blur-sm border border-dope-orange/30 ${currentSlideData.textColor} text-sm font-medium uppercase tracking-wider`}>
              {currentSlideData.subtitle}
            </span>
          </div>

          {/* Main Title */}
          <h1 
            className={`font-chalets tracking-wider leading-none mb-6 ${currentSlideData.textColor}`}
            style={{
              fontFamily: "'Chalets', 'Inter', system-ui, sans-serif",
              fontSize: 'clamp(4rem, 12vw, 8rem)',
              lineHeight: '0.9',
              fontWeight: 'normal',
              letterSpacing: '0.02em',
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 16px rgba(0, 0, 0, 0.6)'
            }}
          >
            {currentSlideData.title}
          </h1>

          {/* Description */}
          <p className={`text-xl md:text-2xl mb-8 max-w-2xl mx-auto ${currentSlideData.textColor} opacity-90`}
             style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)' }}>
            {currentSlideData.description}
          </p>

          {/* CTA Button */}
          <Link
            href={currentSlideData.ctaLink}
            className="inline-block bg-dope-orange hover:bg-dope-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {currentSlideData.ctaText}
          </Link>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-dope-orange scale-125'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20 z-20">
        <div 
          className="h-full bg-dope-orange transition-all duration-300 ease-linear"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`
          }}
        />
      </div>
    </div>
  );
}
