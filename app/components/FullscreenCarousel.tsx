'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabaseBrowser } from '../lib/supabase-browser';

interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  background_image_url: string;
  cta_text: string;
  cta_link: string;
  text_color: string;
  overlay_opacity: number;
  display_duration: number;
  is_active: boolean;
  sort_order: number;
}

// Fallback slides in case database is unavailable
const fallbackSlides: CarouselSlide[] = [
  {
    id: "fallback-1",
    title: "VIP CLUB",
    subtitle: "EXCLUSIVE REWARDS",
    description: "Join our VIP Club and unlock exclusive rewards, early access to new products, and special member pricing.",
    background_image_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/rewards/VIPClubblv1.jpeg",
    cta_text: "JOIN VIP CLUB",
    cta_link: "/rewards",
    text_color: "text-white",
    overlay_opacity: 0.15,
    display_duration: 5000,
    is_active: true,
    sort_order: 1
  },
  {
    id: "fallback-2",
    title: "PREMIUM GLASS",
    subtitle: "ARTISAN COLLECTION",
    description: "Discover our curated collection of premium glass pieces from renowned artists and top brands.",
    background_image_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/slide-us-0011-roortech.png",
    cta_text: "SHOP GLASS",
    cta_link: "/bongs",
    text_color: "text-white",
    overlay_opacity: 0.4,
    display_duration: 5000,
    is_active: true,
    sort_order: 2
  },
  {
    id: "fallback-3",
    title: "THCA PRE-ROLLS",
    subtitle: "PREMIUM QUALITY",
    description: "Experience the finest THCA pre-rolls, hand-rolled to perfection for quality and potency.",
    background_image_url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/rewards/Light-preroll.jpeg",
    cta_text: "SHOP PRE-ROLLS",
    cta_link: "/products?category=pre-rolls",
    text_color: "text-white",
    overlay_opacity: 0.4,
    display_duration: 5000,
    is_active: true,
    sort_order: 3
  }
];

export default function FullscreenCarousel() {
  const [slides, setSlides] = useState<CarouselSlide[]>(fallbackSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Fetch slides from database
  const fetchSlides = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabaseBrowser
        .from('carousel_slides')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (fetchError) {
        console.error('Error fetching carousel slides:', fetchError);
        setError(fetchError.message);
        // Keep using fallback slides
        return;
      }

      if (data && data.length > 0) {
        setSlides(data);
      } else {
        // No active slides found, use fallback
        console.warn('No active carousel slides found, using fallback slides');
      }
    } catch (err) {
      console.error('Error fetching carousel slides:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Keep using fallback slides
    } finally {
      setLoading(false);
    }
  };

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch slides on component mount
  useEffect(() => {
    if (mounted) {
      fetchSlides();
    }
  }, [mounted]);

  // Auto-advance slides based on current slide's display duration
  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;

    const currentSlideData = slides[currentSlide];
    const duration = currentSlideData?.display_duration || 5000;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, duration);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides, currentSlide]);

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

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="relative w-full overflow-hidden flex items-center justify-center" style={{ height: 'calc(100vh - 200px)' }}>
        <div className="text-white text-xl">Loading carousel...</div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="relative w-full overflow-hidden flex items-center justify-center" style={{ height: 'calc(100vh - 200px)' }}>
        <div className="text-white text-xl">Loading carousel...</div>
      </div>
    );
  }

  // Show error state with fallback
  if (error && slides.length === 0) {
    return (
      <div className="relative w-full overflow-hidden flex items-center justify-center bg-gray-900" style={{ height: 'calc(100vh - 200px)' }}>
        <div className="text-white text-center">
          <div className="text-xl mb-2">Unable to load carousel</div>
          <div className="text-sm text-gray-400">Using default content</div>
        </div>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];
  if (!currentSlideData) return null;

  // Check if this slide has text baked into the image (no overlay needed)
  const hasTextInImage = currentSlideData.background_image_url.includes('Screenshot%202025-09-24%20092028.png');

  // Check if this is the VIP Club slide that needs custom layout
  const isVipClubSlide = currentSlideData.background_image_url.includes('VIPClubblv1.jpeg') && currentSlideData.title === "VIP CLUB";

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url('${currentSlideData.background_image_url}')`,
        }}
      >
        {/* Dynamic overlay opacity */}
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: currentSlideData.overlay_opacity || 0.4 }}
        ></div>
      </div>

      {/* Content - Hide text overlay if image has text baked in */}
      {!hasTextInImage && (
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center max-w-4xl mx-auto px-6">
            {/* Subtitle */}
            <div className="mb-4">
              <span className={`inline-block px-4 py-2 rounded-full bg-dope-orange/20 backdrop-blur-sm border border-dope-orange/30 ${currentSlideData.text_color} text-sm font-medium uppercase tracking-wider`}>
                {currentSlideData.subtitle}
              </span>
            </div>

            {/* Main Title */}
            <h1
              className={`font-chalets tracking-wider leading-none mb-6 ${currentSlideData.text_color}`}
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
            <p className={`text-xl md:text-2xl mb-8 max-w-2xl mx-auto ${currentSlideData.text_color} opacity-90`}
               style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)' }}>
              {currentSlideData.description}
            </p>

            {/* CTA Button */}
            <Link
              href={currentSlideData.cta_link}
              className="inline-block bg-dope-orange hover:bg-dope-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {currentSlideData.cta_text}
            </Link>
          </div>
        </div>
      )}

      {/* Show just the CTA button for images with baked-in text */}
      {hasTextInImage && (
        <div className="relative z-10 h-full flex items-end justify-center pb-20">
          <Link
            href={currentSlideData.cta_link}
            className="inline-block bg-dope-orange hover:bg-dope-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {currentSlideData.cta_text}
          </Link>
        </div>
      )}

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
