"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User, ShoppingCart, Search } from 'lucide-react';
import EnhancedSearchBar from '../components/EnhancedSearchBar';
import AgeVerification from '../components/AgeVerification';

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

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

  // Timer for Staff Picks - resets daily at midnight
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const difference = tomorrow.getTime() - now.getTime();

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('nav')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Custom Styles for Ghost Glow Button */}
      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 165, 0, 0.4), 0 0 40px rgba(255, 140, 0, 0.2), 0 0 60px rgba(255, 140, 0, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(255, 165, 0, 0.6), 0 0 60px rgba(255, 140, 0, 0.4), 0 0 90px rgba(255, 140, 0, 0.2);
          }
        }

        .ghost-glow-button {
          background: linear-gradient(135deg, rgba(255, 165, 0, 0.1) 0%, rgba(255, 140, 0, 0.05) 100%);
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }

        .ghost-glow-button:hover {
          animation: pulse-glow 2s ease-in-out infinite;
          background: linear-gradient(135deg, rgba(255, 165, 0, 0.15) 0%, rgba(255, 140, 0, 0.1) 100%);
        }

        .ghost-glow-button:active {
          animation: none;
          box-shadow: 0 0 25px rgba(255, 165, 0, 0.8), 0 0 50px rgba(255, 140, 0, 0.6), 0 0 75px rgba(255, 140, 0, 0.4);
          background: linear-gradient(135deg, rgba(255, 165, 0, 0.2) 0%, rgba(255, 140, 0, 0.15) 100%);
          transform: scale(0.98);
        }

        .ghost-glow-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .ghost-glow-button:hover::before {
          left: 100%;
        }
      `}</style>

      {/* Age Verification Popup */}
      <AgeVerification />

      {/* Main Content - Blurred when age verification is showing */}
      <div className={`${!isAgeVerified ? 'blur-lg pointer-events-none' : ''} transition-all duration-300`}>
        {/* Masthead Section */}
        <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out ${
          scrolled ? "shadow-lg" : "shadow-none"
        }`}
      >
        {/* Black top bar */}
        <div className="bg-black text-white px-6 flex items-center justify-between gap-8" style={{ minHeight: '140px', height: '140px' }}>
          {/* Left: HUGE DOPE CITY Logo */}
          <div
            className="font-chalets font-black leading-none text-white flex-shrink-0"
            style={{
              fontSize: 'clamp(4rem, 12vw, 7rem)',
              lineHeight: '1.1',
              letterSpacing: '0.01em'
            }}
          >
            DOPE CITY
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-3xl mx-8">
            <EnhancedSearchBar />
          </div>

          {/* Right: User Actions */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link href="/sitemap-page" className="p-2 hover:text-yellow-400 transition-colors" title="Site Map">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </Link>
            <Link href="/auth" className="p-2 hover:text-yellow-400 transition-colors" title="Account">
              <User className="w-6 h-6" />
            </Link>
            <Link href="/cart" className="p-2 hover:text-yellow-400 transition-colors relative" title="Shopping Cart">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </div>

        {/* DOPE Orange divider line */}
        <div className="h-1 bg-dope-orange"></div>

        {/* Glassmorphic nav bar */}
        <nav
          className={`backdrop-blur-lg transition-all duration-300 ease-in-out ${
            scrolled
              ? "bg-white/80 dark:bg-gray-900/80 shadow-lg"
              : "bg-white/70 dark:bg-gray-900/70 shadow-md"
          }`}
        >
          <ul className="flex items-center justify-center gap-8 py-5 flex-wrap relative">
            {/* Shop by Brand Dropdown */}
            <li className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'brands' ? null : 'brands')}
                className="text-black dark:text-white text-lg font-bold hover:text-yellow-500 transition-colors flex items-center gap-1"
              >
                Shop by Brand
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === 'brands' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 z-50">
                  <div className="py-2">
                    <Link href="/brands/raw-papers" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">RAW</Link>
                    <Link href="/brands/puffco" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Puffco</Link>
                    <Link href="/brands/storz-bickel" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Storz & Bickel</Link>
                    <Link href="/brands/roor-glass" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">ROOR</Link>
                    <Link href="/brands" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-medium">View All Brands</Link>
                  </div>
                </div>
              )}
            </li>

            {/* THCA & More Dropdown */}
            <li className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'thca' ? null : 'thca')}
                className="text-black dark:text-white text-lg font-bold hover:text-yellow-500 transition-colors flex items-center gap-1"
              >
                THCA &amp; More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === 'thca' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 z-50">
                  <div className="py-2">
                    <Link href="/products?q=thca" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">THCA Flower</Link>
                    <Link href="/products?q=pre-rolls" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Pre-Rolls</Link>
                    <Link href="/products?q=concentrates" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Concentrates</Link>
                    <Link href="/products?q=edibles" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Edibles</Link>
                    <Link href="/products?q=cbd" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">CBD Products</Link>
                  </div>
                </div>
              )}
            </li>

            {/* Bongs Dropdown */}
            <li className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'bongs' ? null : 'bongs')}
                className="text-black dark:text-white text-lg font-bold hover:text-yellow-500 transition-colors flex items-center gap-1"
              >
                Bongs
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === 'bongs' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 z-50">
                  <div className="py-2">
                    <Link href="/bongs" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">All Bongs</Link>
                    <Link href="/products?q=glass+bong" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Glass Bongs</Link>
                    <Link href="/products?q=beaker+bong" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Beaker Bongs</Link>
                    <Link href="/products?q=straight+tube" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Straight Tube</Link>
                    <Link href="/products?q=percolator" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Percolator Bongs</Link>
                  </div>
                </div>
              )}
            </li>

            {/* Pipes Dropdown */}
            <li className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'pipes' ? null : 'pipes')}
                className="text-black dark:text-white text-lg font-bold hover:text-yellow-500 transition-colors flex items-center gap-1"
              >
                Pipes
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === 'pipes' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 z-50">
                  <div className="py-2">
                    <Link href="/products?category=pipes" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">All Pipes</Link>
                    <Link href="/products?q=glass+pipe" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Glass Pipes</Link>
                    <Link href="/products?q=spoon+pipe" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Spoon Pipes</Link>
                    <Link href="/products?q=sherlock" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Sherlock Pipes</Link>
                    <Link href="/products?q=chillum" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Chillums</Link>
                  </div>
                </div>
              )}
            </li>

            {/* Dab Rigs */}
            <li>
              <Link
                href="/products?category=dab-rigs"
                className="text-black dark:text-white text-lg font-bold hover:text-dope-orange transition-colors"
              >
                Dab Rigs
              </Link>
            </li>

            {/* E-Rigs */}
            <li>
              <Link
                href="/category/e-rigs"
                className="text-black dark:text-white text-lg font-bold hover:text-dope-orange transition-colors"
              >
                E-Rigs
              </Link>
            </li>

            {/* Vaporizers */}
            <li>
              <Link
                href="/products?category=vaporizers"
                className="text-black dark:text-white text-lg font-bold hover:text-dope-orange transition-colors"
              >
                Vaporizers
              </Link>
            </li>

            {/* Accessories */}
            <li>
              <a
                href="#"
                className="text-black dark:text-white text-lg font-bold hover:text-yellow-500 transition-colors"
              >
                Accessories
              </a>
            </li>

            {/* Munchies */}
            <li>
              <a
                href="#"
                className="text-black dark:text-white text-lg font-bold hover:text-yellow-500 transition-colors"
              >
                Munchies
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Collections Grid */}
      <main className="w-full px-8 py-16">
        {/* Collections Header */}
        <div className="text-left mb-12">
          <h2 className="text-5xl font-black text-black mb-4 font-chalets uppercase tracking-tight">Our Collections</h2>
        </div>

        <div className="grid grid-cols-6 gap-6 h-[1200px] max-w-none">
          {/* THCA Pre-Rolls Featured Card - Takes up 2x2 space */}
          <Link
            href="/pre-rolls"
            className="relative col-span-2 row-span-2 bg-cover bg-center rounded-xl overflow-hidden group"
            style={{
              backgroundImage: "url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Pre-Roll%20Sample%204B.png')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            title="Click anywhere to discover our premium THCA pre-roll selection!"
          >
            {/* Ghost Button with Animated Glow - Positioned at Bottom Edge */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center pb-6">
              <button
                className="ghost-glow-button px-8 py-4 border border-white/0 rounded-lg font-bold text-white text-xl uppercase tracking-wide transition-all duration-300 hover:border-white/20 active:border-white/30"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                SHOP NOW
              </button>
            </div>
          </Link>

          {/* Pre-Rolls Card */}
          <Link
            href="/pre-rolls"
            className="relative col-span-2 row-span-1 bg-cover bg-center rounded-xl overflow-hidden group"
            style={{
              backgroundImage: "url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Pre-Roll%20Sample%203.png')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            title="Click anywhere to discover our fire pre-roll selection!"
          >
          </Link>

          {/* E-Rigs Card */}
          <Link
            href="/products?q=e-rig"
            className="relative col-span-2 row-span-1 bg-cover bg-center rounded-xl overflow-hidden group"
            style={{
              backgroundImage: "url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Screenshot%202025-09-12%20123511.png'), linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            title="Click anywhere to check out our electric dabbing rigs!"
          >

            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="font-bold text-xl">E-Rigs</h3>
              <p className="text-base opacity-90">Electric dabbing</p>
            </div>
          </Link>

          {/* Dab Rigs Card */}
          <Link
            href="/products?category=dab-rigs"
            className="relative col-span-1 row-span-2 bg-cover bg-center rounded-xl overflow-hidden group"
            style={{
              backgroundImage: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)",
              backgroundSize: "cover"
            }}
            title="Click anywhere to explore our concentrate essentials!"
          >

            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="font-bold text-xl">Dab Rigs</h3>
              <p className="text-base opacity-90">Concentrate essentials</p>
            </div>
          </Link>

          {/* Vaporizers Card - Large */}
          <Link
            href="/products?category=vaporizers"
            className="relative col-span-1 row-span-2 bg-cover bg-center rounded-xl overflow-hidden group"
            style={{
              backgroundImage: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
              backgroundSize: "cover"
            }}
            title="Click anywhere to discover our latest vaporizer technology!"
          >

            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="font-bold text-2xl mb-3">Vaporizers</h3>
              <p className="text-lg opacity-90">Latest technology</p>
            </div>
          </Link>

          {/* Hand Pipes Card */}
          <Link
            href="/pipes"
            className="relative col-span-2 row-span-1 bg-cover bg-center rounded-xl overflow-hidden group"
            style={{
              backgroundImage: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
              backgroundSize: "cover"
            }}
            title="Click anywhere to browse our classic hand pipe collection!"
          >

            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="font-bold text-xl">Hand Pipes</h3>
              <p className="text-base opacity-90">Classic pieces for everyone</p>
            </div>
          </Link>

          {/* Dab Accessories Card */}
          <Link
            href="/products?q=dab"
            className="relative col-span-2 row-span-1 bg-cover bg-center rounded-xl overflow-hidden group"
            style={{
              backgroundImage: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
              backgroundSize: "cover"
            }}
            title="Click anywhere to find all your dabbing tools & torches!"
          >

            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="font-bold text-xl">Dab Accessories</h3>
              <p className="text-base opacity-90">Tools & torches</p>
            </div>
          </Link>

          {/* Storage & Cases Card */}
          <Link
            href="/products?q=storage"
            className="relative col-span-2 row-span-1 bg-cover bg-center rounded-xl overflow-hidden group"
            style={{
              backgroundImage: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              backgroundSize: "cover"
            }}
            title="Click anywhere to keep your gear safe with our storage solutions!"
          >

            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="font-bold text-xl">Storage & Cases</h3>
              <p className="text-base opacity-90">Keep your gear safe</p>
            </div>
          </Link>

          {/* Rolling Accessories Card - Large */}
          <Link
            href="/products?q=rolling"
            className="relative col-span-4 row-span-1 bg-cover bg-center rounded-xl overflow-hidden group"
            style={{
              backgroundImage: "url('/Images/pre-rolls_collection.png'), linear-gradient(135deg, #be185d 0%, #ec4899 100%)",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >

            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="font-bold text-2xl">Rolling Accessories</h3>
              <p className="text-lg opacity-90">Papers & pre-rolls for all</p>
            </div>
          </Link>
        </div>

        {/* NEW ARRIVALS Section */}
        <section className="mt-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-5xl font-chalets text-gray-900 dark:text-white">
              NEW ARRIVALS
            </h2>
            <Link
              href="/products?filter=new"
              className="text-dope-orange-500 hover:text-dope-orange-600 font-medium text-lg transition-colors"
            >
              Shop all →
            </Link>
          </div>

          {/* New Arrivals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {/* Product 01 */}
            <div className="bg-gray-900 rounded-xl overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center h-80">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">📦</div>
                  <div className="text-sm">No Image</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-white font-medium mb-2 text-lg">Product 01</h3>
                <p className="text-gray-400 text-base mb-4">Premium glass piece</p>
                <div className="flex items-center justify-between">
                  <span className="text-dope-orange-400 font-bold text-xl">$29</span>
                  <div className="flex gap-3">
                    <button className="text-gray-400 hover:text-white text-base transition-colors">
                      View
                    </button>
                    <button className="bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-4 py-2 rounded text-base transition-colors">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product 02 */}
            <div className="bg-gray-900 rounded-xl overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center h-80">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">📦</div>
                  <div className="text-sm">No Image</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-white font-medium mb-2 text-lg">Product 02</h3>
                <p className="text-gray-400 text-base mb-4">High-quality accessory</p>
                <div className="flex items-center justify-between">
                  <span className="text-dope-orange-400 font-bold text-xl">$35</span>
                  <div className="flex gap-3">
                    <button className="text-gray-400 hover:text-white text-base transition-colors">
                      View
                    </button>
                    <button className="bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-4 py-2 rounded text-base transition-colors">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product 03 */}
            <div className="bg-gray-900 rounded-xl overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center h-80">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">📦</div>
                  <div className="text-sm">No Image</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-white font-medium mb-2 text-lg">Product 03</h3>
                <p className="text-gray-400 text-base mb-4">Latest innovation</p>
                <div className="flex items-center justify-between">
                  <span className="text-dope-orange-400 font-bold text-xl">$31</span>
                  <div className="flex gap-3">
                    <button className="text-gray-400 hover:text-white text-base transition-colors">
                      View
                    </button>
                    <button className="bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-4 py-2 rounded text-base transition-colors">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product 04 */}
            <div className="bg-gray-900 rounded-xl overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center h-80">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">📦</div>
                  <div className="text-sm">No Image</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-white font-medium mb-2 text-lg">Product 04</h3>
                <p className="text-gray-400 text-base mb-4">Premium quality</p>
                <div className="flex items-center justify-between">
                  <span className="text-dope-orange-400 font-bold text-xl">$32</span>
                  <div className="flex gap-3">
                    <button className="text-gray-400 hover:text-white text-base transition-colors">
                      View
                    </button>
                    <button className="bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-4 py-2 rounded text-base transition-colors">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-chalets text-gray-900 dark:text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Real reviews from real customers
            </p>
          </div>

          {/* Reviews Carousel */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll-reviews">
              {/* Review 1 */}
              <div className="flex-shrink-0 w-80 mx-4 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
                    alt="Customer"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Mike Johnson</h4>
                    <div className="flex text-yellow-400">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  "Amazing quality! The glass is thick and the design is perfect. Fast shipping too. Will definitely order again!"
                </p>
              </div>

              {/* Review 2 */}
              <div className="flex-shrink-0 w-80 mx-4 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face"
                    alt="Customer"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Sarah Chen</h4>
                    <div className="flex text-yellow-400">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  "Best smoke shop online! Great prices and the customer service is top notch. Highly recommend DOPE CITY!"
                </p>
              </div>

              {/* Review 3 */}
              <div className="flex-shrink-0 w-80 mx-4 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"
                    alt="Customer"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Alex Rodriguez</h4>
                    <div className="flex text-yellow-400">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  "The vaporizer I bought works perfectly. Great build quality and arrived exactly as described. 5 stars!"
                </p>
              </div>

              {/* Review 4 */}
              <div className="flex-shrink-0 w-80 mx-4 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"
                    alt="Customer"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Emma Wilson</h4>
                    <div className="flex text-yellow-400">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  "Love the selection and quality. The packaging was discreet and professional. Will be a repeat customer!"
                </p>
              </div>

              {/* Review 5 */}
              <div className="flex-shrink-0 w-80 mx-4 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face"
                    alt="Customer"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">David Kim</h4>
                    <div className="flex text-yellow-400">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  "Excellent products and fast delivery. The grinder I ordered is solid and works great. Highly recommended!"
                </p>
              </div>

              {/* Review 6 */}
              <div className="flex-shrink-0 w-80 mx-4 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=60&h=60&fit=crop&crop=face"
                    alt="Customer"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Jessica Taylor</h4>
                    <div className="flex text-yellow-400">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  "Perfect experience from start to finish. Quality products, fair prices, and excellent customer support!"
                </p>
              </div>

              {/* Duplicate reviews for seamless loop */}
              <div className="flex-shrink-0 w-80 mx-4 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
                    alt="Customer"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Mike Johnson</h4>
                    <div className="flex text-yellow-400">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  "Amazing quality! The glass is thick and the design is perfect. Fast shipping too. Will definitely order again!"
                </p>
              </div>

              <div className="flex-shrink-0 w-80 mx-4 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face"
                    alt="Customer"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Sarah Chen</h4>
                    <div className="flex text-yellow-400">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  "Best smoke shop online! Great prices and the customer service is top notch. Highly recommend DOPE CITY!"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Staff Picks Section */}
        <section className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-chalets text-gray-900 dark:text-white mb-4">
              🔥 STAFF PICKS 🔥
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Limited time deals - New picks every day!
            </p>

            {/* Countdown Timer */}
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-xl shadow-lg">
              <span className="text-sm font-medium">SALE ENDS IN:</span>
              <div className="flex gap-2">
                <div className="bg-black/20 px-3 py-2 rounded-lg text-center min-w-[60px]">
                  <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-xs opacity-80">HOURS</div>
                </div>
                <div className="text-2xl font-bold">:</div>
                <div className="bg-black/20 px-3 py-2 rounded-lg text-center min-w-[60px]">
                  <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-xs opacity-80">MINS</div>
                </div>
                <div className="text-2xl font-bold">:</div>
                <div className="bg-black/20 px-3 py-2 rounded-lg text-center min-w-[60px]">
                  <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-xs opacity-80">SECS</div>
                </div>
              </div>
            </div>
          </div>

          {/* Staff Picks Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Staff Pick 1 */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                40% OFF
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Premium Glass Bong</h3>
                <p className="text-lg opacity-90 mb-4">18" Beaker Base with Percolator</p>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold">$89.99</span>
                  <span className="text-xl line-through opacity-70">$149.99</span>
                </div>
                <button className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors">
                  GRAB THIS DEAL
                </button>
              </div>
            </div>

            {/* Staff Pick 2 */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                50% OFF
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Electric Dab Rig</h3>
                <p className="text-lg opacity-90 mb-4">Temperature Control + LED Display</p>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold">$199.99</span>
                  <span className="text-xl line-through opacity-70">$399.99</span>
                </div>
                <button className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors">
                  GRAB THIS DEAL
                </button>
              </div>
            </div>
          </div>
        </section>


      </main>
      </div>
    </div>
  );
}
