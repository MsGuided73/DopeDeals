"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User, ShoppingCart, Search } from 'lucide-react';
import GlobalMasthead from '../components/GlobalMasthead';
import AgeVerification from '../components/AgeVerification';

import StaffPicksSection from '../components/StaffPicksSection';
import FullscreenCarousel from '../components/FullscreenCarousel';
import FeaturedProductsSection from '../components/FeaturedProductsSection';
import ScrollingBanner from '../components/ScrollingBanner';
import RecentlyViewedProducts from '../components/RecentlyViewedProducts';

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check age verification status
  useEffect(() => {
    const verified = localStorage.getItem('dope-city-age-verified');
    setIsAgeVerified(!!verified);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">


      {/* Age Verification Popup */}
      <AgeVerification />

      {/* Global Masthead - Always at the top */}
      <GlobalMasthead />

      {/* Main Content - Blurred when age verification is showing */}
      <div className={`${!isAgeVerified ? 'blur-lg pointer-events-none' : ''} transition-all duration-300`}>
        {/* Fullscreen Carousel - Now beneath the masthead */}
        <FullscreenCarousel />

        {/* VIP Membership Hero Section */}
        <div className="w-full px-6 pt-1 pb-1">
          <Link
            href="/rewards"
            className="relative block w-full h-128 bg-cover bg-center rounded-xl overflow-hidden group"
            style={{
              backgroundImage: "url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/rewards/slider1.png')",
              backgroundSize: "cover",
              backgroundPosition: "bottom"
            }}
          >
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent group-hover:from-black/80 group-hover:via-black/50 transition-all duration-300"></div>

            {/* VIP Content */}
            <div className="absolute left-8 top-1/2 transform -translate-y-1/2 text-white max-w-lg">
              <h2 className="font-chalets tracking-wider leading-none mb-8" style={{
                fontFamily: "'Chalets', 'Inter', system-ui, sans-serif",
                fontWeight: 'normal',
                letterSpacing: '0.02em',
                fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                lineHeight: '0.9',
                textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 16px rgba(0, 0, 0, 0.6)'
              }}>
                VIP REWARDS
              </h2>

              {/* Benefits List */}
              <ul className="space-y-3 text-lg font-medium mb-8">
                <li className="flex items-center" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)' }}>
                  <span className="text-dope-orange mr-3">•</span>
                  Extra Discounts
                </li>
                <li className="flex items-center" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)' }}>
                  <span className="text-dope-orange mr-3">•</span>
                  Guaranteed Lowest Prices
                </li>
                <li className="flex items-center" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)' }}>
                  <span className="text-dope-orange mr-3">•</span>
                  Exclusive Offers and Drops
                </li>
                <li className="flex items-center" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)' }}>
                  <span className="text-dope-orange mr-3">•</span>
                  Free Gifts and Tester Products
                </li>
                <li className="flex items-center" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)' }}>
                  <span className="text-dope-orange mr-3">•</span>
                  Bonus Rewards Program
                </li>
                <li className="flex items-center" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)' }}>
                  <span className="text-dope-orange mr-3">•</span>
                  Private Sales, Events & More
                </li>
              </ul>

              {/* CTA Button */}
              <button className="bg-dope-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg uppercase tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                LEARN MORE
              </button>
            </div>
          </Link>
        </div>

      {/* Collections Grid */}
      <main className="w-full px-0 py-0">
        {/* Enhanced Metallic Section Divider */}
        <div className="w-full -mt-0 mb-0">
          {/* Top metallic line - Increased size by 9x (from h-1 to h-9) */}
          <div className="h-9 bg-gradient-to-r from-transparent via-white to-transparent mb-8 shadow-lg"></div>
          <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mb-12"></div>

          {/* Collections Header - Clean Metallic Frame */}
          <div className="text-center mb-6 px-4 md:px-8">
            <div className="relative inline-block">
              {/* Title */}
              <h2 className="text-4xl md:text-7xl text-black font-chalets uppercase" style={{
                fontFamily: "'Chalets', 'Inter', system-ui, sans-serif",
                letterSpacing: '0.02em',
                fontWeight: 'normal',
                background: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 25%, #2a2a2a 50%, #4a4a4a 75%, #1a1a1a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none'
              }}>
                SHOP OUR COLLECTIONS
              </h2>
            </div>
          </div>

          {/* Bottom metallic lines */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mb-8"></div>
          <div className="h-1 bg-gradient-to-r from-transparent via-white to-transparent shadow-lg"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 h-auto md:h-[1400px] w-full">
          {/* BONGS - New lifestyle frame, same size as THCA Flower */}
          <Link
            href="/bongs"
            className="relative col-span-1 md:col-span-2 row-span-1 md:row-span-3 h-64 md:h-auto bg-cover bg-center rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,140,0,0.6)] hover:ring-2 hover:ring-dope-orange/50"
            style={{
              backgroundImage: "url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/RooR_6-bongs.png')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            title="Click anywhere to explore our premium Bongs collection!"
          >
            <div className="absolute bottom-2 left-2 text-white">
              <h3 className="font-chalets tracking-wider leading-none" style={{ fontFamily: "'Chalets', 'Inter', system-ui, sans-serif", fontWeight: 'normal', letterSpacing: '0.02em', fontSize: 'clamp(2.5rem, 10vw, 7rem)', lineHeight: '0.9', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 16px rgba(0, 0, 0, 0.6)' }}>BONGS</h3>
            </div>
            {/* Metallic CTA Button */}
            <div className="absolute top-2 right-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 rounded-md blur-sm"></div>
                <div className="relative bg-gradient-to-r from-dope-orange via-orange-400 to-dope-orange backdrop-blur-sm px-3 py-1 rounded-md text-white text-xs font-bold uppercase tracking-wide hover:from-orange-400 hover:to-orange-600 transition-all shadow-lg border border-orange-300/30">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-md"></div>
                  <span className="relative z-10">SHOP</span>
                </div>
              </div>
            </div>
          </Link>

          {/* DAB TOOLS - New collection with your specified image */}
          <Link
            href="/products?q=dab+tools"
            className="relative col-span-1 md:col-span-2 row-span-1 md:row-span-3 h-64 md:h-auto bg-cover bg-center rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,140,0,0.6)] hover:ring-2 hover:ring-dope-orange/50"
            style={{
              backgroundImage: "url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Dab_Tools.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            title="Click anywhere to explore our premium Dab Tools collection!"
          >
            <div className="absolute bottom-2 left-2 text-white">
              <h3 className="font-chalets tracking-wider leading-none" style={{ fontFamily: "'Chalets', 'Inter', system-ui, sans-serif", fontWeight: 'normal', letterSpacing: '0.02em', fontSize: 'clamp(2.5rem, 10vw, 7rem)', lineHeight: '0.9', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 16px rgba(0, 0, 0, 0.6)' }}>DAB TOOLS</h3>
            </div>
            {/* Metallic CTA Button */}
            <div className="absolute top-2 right-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 rounded-md blur-sm"></div>
                <div className="relative bg-gradient-to-r from-dope-orange via-orange-400 to-dope-orange backdrop-blur-sm px-3 py-1 rounded-md text-white text-xs font-bold uppercase tracking-wide hover:from-orange-400 hover:to-orange-600 transition-all shadow-lg border border-orange-300/30">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-md"></div>
                  <span className="relative z-10">SHOP</span>
                </div>
              </div>
            </div>
          </Link>

          {/* THCA Flower Card */}
          <Link
            href="/products?category=flower"
            className="relative col-span-1 md:col-span-2 row-span-1 md:row-span-3 h-64 md:h-auto bg-cover bg-center rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,140,0,0.6)] hover:ring-2 hover:ring-dope-orange/50"
            style={{
              backgroundImage: "url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/THCA_flower.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            title="Click anywhere to discover our premium THCA flower selection!"
          >
            <div className="absolute bottom-2 left-2 text-white">
              <h3 className="font-chalets tracking-wider leading-none" style={{ fontFamily: "'Chalets', 'Inter', system-ui, sans-serif", fontWeight: 'normal', letterSpacing: '0.02em', fontSize: 'clamp(2.5rem, 10vw, 7rem)', lineHeight: '0.9', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 16px rgba(0, 0, 0, 0.6)' }}>THCA FLOWER</h3>
            </div>
            {/* Metallic CTA Button */}
            <div className="absolute top-2 right-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 rounded-md blur-sm"></div>
                <div className="relative bg-gradient-to-r from-dope-orange via-orange-400 to-dope-orange backdrop-blur-sm px-3 py-1 rounded-md text-white text-xs font-bold uppercase tracking-wide hover:from-orange-400 hover:to-orange-600 transition-all shadow-lg border border-orange-300/30">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-md"></div>
                  <span className="relative z-10">SHOP</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Dab Rigs */}
          <Link
            href="/dab-rigs"
            className="relative col-span-1 md:col-span-2 row-span-1 md:row-span-3 h-64 md:h-auto bg-cover bg-center rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,140,0,0.6)] hover:ring-2 hover:ring-dope-orange/50"
            style={{
              backgroundImage: "url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Puffco%20site.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            title="Click anywhere to check out our Dope Dab Rigs!"        >

            <div className="absolute bottom-2 left-2 text-white">
              <h3 className="font-chalets tracking-wider leading-none" style={{ fontFamily: "'Chalets', 'Inter', system-ui, sans-serif", fontWeight: 'normal', letterSpacing: '0.02em', fontSize: 'clamp(2.5rem, 10vw, 7rem)', lineHeight: '0.9', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 16px rgba(0, 0, 0, 0.6)' }}>DAB RIGS</h3>
            </div>
            {/* Metallic CTA Button */}
            <div className="absolute top-2 right-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 rounded-md blur-sm"></div>
                <div className="relative bg-gradient-to-r from-dope-orange via-orange-400 to-dope-orange backdrop-blur-sm px-3 py-1 rounded-md text-white text-xs font-bold uppercase tracking-wide hover:from-orange-400 hover:to-orange-600 transition-all shadow-lg border border-orange-300/30">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-md"></div>
                  <span className="relative z-10">SHOP</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Prerolls */}
          <Link
            href="/products?category=pre-rolls"
            className="relative col-span-1 md:col-span-3 row-span-1 md:row-span-3 h-64 md:h-auto bg-cover bg-center rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,140,0,0.6)] hover:ring-2 hover:ring-dope-orange/50"
            style={{
              backgroundImage: "url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/PRE-ROLLS.jpeg')",
              backgroundSize: "cover"
            }}
            title="Click anywhere to explore our Pre-roll selection!"
          >

            <div className="absolute bottom-2 left-2 text-white">
              <h3 className="font-chalets tracking-wider leading-none" style={{ fontFamily: "'Chalets', 'Inter', system-ui, sans-serif", fontWeight: 'normal', letterSpacing: '0.02em', fontSize: 'clamp(2.5rem, 10vw, 7rem)', lineHeight: '0.9', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 16px rgba(0, 0, 0, 0.6)' }}>THCA PRE-ROLLS</h3>
            </div>
            {/* Metallic CTA Button */}
            <div className="absolute top-2 right-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 rounded-md blur-sm"></div>
                <div className="relative bg-gradient-to-r from-dope-orange via-orange-400 to-dope-orange backdrop-blur-sm px-3 py-1 rounded-md text-white text-xs font-bold uppercase tracking-wide hover:from-orange-400 hover:to-orange-600 transition-all shadow-lg border border-orange-300/30">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-md"></div>
                  <span className="relative z-10">SHOP</span>
                </div>
              </div>
            </div>
          </Link>

          {/* ACCESSORIES - Duplicate of E-Rigs card for second row */}
          <Link
            href="/products?category=accessories"
            className="relative col-span-1 md:col-span-1 row-span-1 md:row-span-3 h-64 md:h-auto bg-cover bg-center rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,140,0,0.6)] hover:ring-2 hover:ring-dope-orange/50"
            style={{
              backgroundImage: "url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Grinder%20&%20Supplies.png')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            title="Click anywhere to explore our premium Accessories!"
          >
            <div className="absolute bottom-2 left-2 text-white">
              <h3 className="font-chalets tracking-wider leading-none" style={{ fontFamily: "'Chalets', 'Inter', system-ui, sans-serif", fontWeight: 'normal', letterSpacing: '0.02em', fontSize: 'clamp(1.2rem, 4.5vw, 3rem)', lineHeight: '0.9', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 16px rgba(0, 0, 0, 0.6)' }}>ACCESSORIES</h3>
              <p className="text-xs md:text-base opacity-90 mt-1 md:mt-2" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(0, 0, 0, 0.6)' }}>Essential supplies</p>
            </div>
            {/* Metallic CTA Button */}
            <div className="absolute top-2 right-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 rounded-md blur-sm"></div>
                <div className="relative bg-gradient-to-r from-dope-orange via-orange-400 to-dope-orange backdrop-blur-sm px-3 py-1 rounded-md text-white text-xs font-bold uppercase tracking-wide hover:from-orange-400 hover:to-orange-600 transition-all shadow-lg border border-orange-300/30">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-md"></div>
                  <span className="relative z-10">SHOP</span>
                </div>
              </div>
            </div>
          </Link>

          {/* HOOKAH */}
          <Link
            href="/products?category=vaporizers"
            className="relative col-span-1 md:col-span-3 row-span-1 md:row-span-3 h-64 md:h-auto bg-cover bg-center rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,140,0,0.6)] hover:ring-2 hover:ring-dope-orange/50"
            style={{
              backgroundImage: "url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Hookah.jpeg')",
              backgroundSize: "cover"
            }}
            title="Click anywhere to discover our Hookahs!"
          >

            <div className="absolute bottom-2 left-2 text-white">
              <h3 className="font-chalets tracking-wider leading-none" style={{ fontFamily: "'Chalets', 'Inter', system-ui, sans-serif", fontWeight: 'normal', letterSpacing: '0.02em', fontSize: 'clamp(2.5rem, 10vw, 7rem)', lineHeight: '0.9', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 16px rgba(0, 0, 0, 0.6)' }}>HOOKAHS</h3>
            </div>
            {/* Metallic CTA Button */}
            <div className="absolute top-2 right-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 rounded-md blur-sm"></div>
                <div className="relative bg-gradient-to-r from-dope-orange via-orange-400 to-dope-orange backdrop-blur-sm px-3 py-1 rounded-md text-white text-xs font-bold uppercase tracking-wide hover:from-orange-400 hover:to-orange-600 transition-all shadow-lg border border-orange-300/30">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-md"></div>
                  <span className="relative z-10">SHOP</span>
                </div>
              </div>
            </div>
          </Link>

          {/* E-RIGS - Fills the top-right empty space */}
          <Link
            href="/category/e-rigs"
            className="relative col-span-1 md:col-span-1 row-span-1 md:row-span-3 h-64 md:h-auto bg-cover bg-center rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,140,0,0.6)] hover:ring-2 hover:ring-dope-orange/50"
            style={{
              backgroundImage: "url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Puffco_Zoom.png')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            title="Click anywhere to explore our premium E-Rigs!"
          >
            <div className="absolute bottom-2 left-2 text-white">
              <h3 className="font-chalets tracking-wider leading-none" style={{ fontFamily: "'Chalets', 'Inter', system-ui, sans-serif", fontWeight: 'normal', letterSpacing: '0.02em', fontSize: 'clamp(2.5rem, 10vw, 7rem)', lineHeight: '0.9', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 16px rgba(0, 0, 0, 0.6)' }}>E-RIGS</h3>
            </div>
            {/* Metallic CTA Button */}
            <div className="absolute top-2 right-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 rounded-md blur-sm"></div>
                <div className="relative bg-gradient-to-r from-dope-orange via-orange-400 to-dope-orange backdrop-blur-sm px-3 py-1 rounded-md text-white text-xs font-bold uppercase tracking-wide hover:from-orange-400 hover:to-orange-600 transition-all shadow-lg border border-orange-300/30">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-md"></div>
                  <span className="relative z-10">SHOP</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Torches & Lighters Card - Extended to bottom */}
          <Link
            href="/products?q=torch"
            className="relative col-span-1 md:col-span-2 row-span-1 md:row-span-3 h-64 md:h-auto bg-cover bg-center rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,140,0,0.6)] hover:ring-2 hover:ring-dope-orange/50"
            style={{
              backgroundImage: "url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Torch_Bowl.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            title="Click anywhere to light up with our premium torches and lighters!"
          >

            <div className="absolute bottom-2 left-2 text-white">
              <h3 className="font-chalets tracking-wider leading-none" style={{ fontFamily: "'Chalets', 'Inter', system-ui, sans-serif", fontWeight: 'normal', letterSpacing: '0.02em', fontSize: 'clamp(1.8rem, 7vw, 5rem)', lineHeight: '0.9', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 16px rgba(0, 0, 0, 0.6)' }}>TORCHES & LIGHTERS</h3>
              <p className="text-sm md:text-lg opacity-90 mt-1 md:mt-2" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(0, 0, 0, 0.6)' }}>Premium ignition tools</p>
            </div>
            {/* Metallic CTA Button */}
            <div className="absolute top-2 right-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 rounded-md blur-sm"></div>
                <div className="relative bg-gradient-to-r from-dope-orange via-orange-400 to-dope-orange backdrop-blur-sm px-3 py-1 rounded-md text-white text-xs font-bold uppercase tracking-wide hover:from-orange-400 hover:to-orange-600 transition-all shadow-lg border border-orange-300/30">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-md"></div>
                  <span className="relative z-10">SHOP</span>
                </div>
              </div>
            </div>
          </Link>
        </div>



        {/* Featured Products Section - Real Images Only */}
        <FeaturedProductsSection />

        {/* Scrolling Banner with Metallic Gradient */}
        <div className="mt-16 mb-16">
          <ScrollingBanner />
        </div>

        {/* Customer Reviews Section - Moved above footer */}
        <section className="mt-24 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-chalets text-gray-900 mb-4" style={{ letterSpacing: '-0.02em' }}>
              DOPE FEEDBACK
            </h2>
            <p className="text-xl text-gray-600">
              Real reviews from real customers
            </p>
          </div>

          {/* Reviews Carousel - Enhanced Cards */}
          <div className="relative overflow-hidden px-4">
            <div className="flex animate-scroll-reviews">
              {/* Review 1 - Larger Cards */}
              <div className="flex-shrink-0 w-96 mx-6 bg-white rounded-2xl p-8 shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
                    alt="Customer"
                    className="w-16 h-16 rounded-full mr-6"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Mike Johnson</h4>
                    <div className="flex text-yellow-400 text-lg">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  "Amazing quality! The glass is thick and the design is perfect. Fast shipping too. Will definitely order again!"
                </p>
              </div>

              {/* Review 2 */}
              <div className="flex-shrink-0 w-96 mx-6 bg-white rounded-2xl p-8 shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face"
                    alt="Customer"
                    className="w-16 h-16 rounded-full mr-6"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Sarah Chen</h4>
                    <div className="flex text-yellow-400 text-lg">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  "Best smoke shop online! Great prices and the customer service is top notch. Highly recommend DOPE CITY!"
                </p>
              </div>

              {/* Review 3 */}
              <div className="flex-shrink-0 w-96 mx-6 bg-white rounded-2xl p-8 shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
                    alt="Customer"
                    className="w-16 h-16 rounded-full mr-6"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Alex Rodriguez</h4>
                    <div className="flex text-yellow-400 text-lg">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  "The vaporizer I bought works perfectly. Great build quality and arrived exactly as described. 5 stars!"
                </p>
              </div>

              {/* Review 4 */}
              <div className="flex-shrink-0 w-96 mx-6 bg-white rounded-2xl p-8 shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
                    alt="Customer"
                    className="w-16 h-16 rounded-full mr-6"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Emma Wilson</h4>
                    <div className="flex text-yellow-400 text-lg">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  "Love the selection and quality. The packaging was discreet and professional. Will be a repeat customer!"
                </p>
              </div>

              {/* Review 5 */}
              <div className="flex-shrink-0 w-96 mx-6 bg-white rounded-2xl p-8 shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face"
                    alt="Customer"
                    className="w-16 h-16 rounded-full mr-6"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">David Kim</h4>
                    <div className="flex text-yellow-400 text-lg">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  "Excellent products and fast delivery. The grinder I ordered is solid and works great. Highly recommended!"
                </p>
              </div>

              {/* Review 6 */}
              <div className="flex-shrink-0 w-96 mx-6 bg-white rounded-2xl p-8 shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=80&h=80&fit=crop&crop=face"
                    alt="Customer"
                    className="w-16 h-16 rounded-full mr-6"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Jessica Taylor</h4>
                    <div className="flex text-yellow-400 text-lg">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  "Perfect experience from start to finish. Quality products, fair prices, and excellent customer support!"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Recently Viewed Products - Just above footer */}
        <RecentlyViewedProducts />


      </main>
      </div>
    </div>
  );
}
