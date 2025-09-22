"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User, ShoppingCart } from 'lucide-react';
import EnhancedSearchBar from './EnhancedSearchBar';

export default function GlobalMasthead() {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div>
        {/* Main Masthead - Match Home Page Exactly */}
        <div className="bg-black text-white px-1 flex items-center justify-between gap-2" style={{ minHeight: '140px', height: '140px' }}>
          {/* Left: HUGE DOPE CITY Logo - Expanded to edges with minimal spacing */}
          <div
            className="font-chalets font-black leading-none text-white flex-shrink-0 tracking-wider"
            style={{
              fontFamily: "'Chalets', 'Inter', system-ui, sans-serif",
              fontSize: 'clamp(4rem, 16vw, 9rem)',
              lineHeight: '0.9',
              fontWeight: 'normal'
            }}
          >
            <Link href="/">
              DOPE CITY
            </Link>
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
            {/* Shop by Category */}
            <li className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'categories' ? null : 'categories')}
                className="text-black dark:text-white text-lg font-bold hover:text-yellow-500 transition-colors flex items-center gap-1"
              >
                Shop by Category
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === 'categories' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 z-50">
                  <div className="py-2">
                    <Link href="/products" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-medium">All Products</Link>
                    <div className="border-t border-gray-200/20 my-1"></div>

                    {/* THCA & More with Submenu */}
                    <div className="relative">
                      <button
                        onMouseEnter={() => setOpenSubmenu('thca')}
                        onMouseLeave={() => setOpenSubmenu(null)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors flex items-center justify-between"
                      >
                        THCA & More
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      {/* THCA Submenu */}
                      {openSubmenu === 'thca' && (
                        <div
                          className="absolute left-full top-0 ml-1 w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 z-60"
                          onMouseEnter={() => setOpenSubmenu('thca')}
                          onMouseLeave={() => setOpenSubmenu(null)}
                        >
                          <div className="py-2">
                            <Link href="/products?q=thca+flower" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-medium">⭐ THCA Flower</Link>
                            <Link href="/pre-rolls" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-medium">⭐ THCA Pre-Rolls</Link>
                            <div className="border-t border-gray-200/20 my-1"></div>
                            <Link href="/products?q=thca+concentrates" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">THCA Concentrates</Link>
                            <Link href="/products?q=thca+diamonds" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">THCA Diamonds</Link>
                            <Link href="/products?q=thca+sauce" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">THCA Sauce</Link>
                            <Link href="/products?q=thca+rosin" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">THCA Rosin</Link>
                            <Link href="/products?q=cbd" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">CBD Products</Link>
                            <Link href="/products?q=delta" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Delta Products</Link>
                            <Link href="/products?q=edibles" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Edibles</Link>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-200/20 my-1"></div>
                    <Link href="/bongs" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Bongs & Water Pipes</Link>
                    <Link href="/pipes" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Hand Pipes</Link>
                    <Link href="/products?category=dab-rigs" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Dab Rigs</Link>
                    <Link href="/products?category=vaporizers" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Vaporizers</Link>
                    <Link href="/products?q=torch" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Torches & Lighters</Link>
                    <Link href="/products?category=accessories" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Accessories</Link>
                    <Link href="/products?q=grinder" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Grinders</Link>
                    <Link href="/products?q=rolling" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Rolling Papers</Link>
                  </div>
                </div>
              )}
            </li>

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
                    <Link href="/brands/roor" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">ROOR</Link>
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
                <div className="absolute top-full left-0 mt-2 w-56 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 z-50">
                  <div className="py-2">
                    <Link href="/products?q=thca+flower" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-medium">THCA Flower</Link>
                    <Link href="/pre-rolls" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-medium">THCA Pre-Rolls</Link>
                    <div className="border-t border-gray-200/20 my-1"></div>
                    <Link href="/products?q=thca+concentrate" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">THCA Concentrates</Link>
                    <Link href="/products?q=thca+diamond" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">THCA Diamonds</Link>
                    <Link href="/products?q=thca+sauce" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">THCA Sauce</Link>
                    <Link href="/products?q=thca+rosin" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">THCA Rosin</Link>
                    <div className="border-t border-gray-200/20 my-1"></div>
                    <Link href="/products?q=cbd" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">CBD Products</Link>
                    <Link href="/products?q=delta" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Delta Products</Link>
                    <Link href="/products?q=edible" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Edibles</Link>
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
                    <Link href="/pipes" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">All Pipes</Link>
                    <Link href="/products?q=spoon+pipe" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Spoon Pipes</Link>
                    <Link href="/products?q=sherlock+pipe" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Sherlock Pipes</Link>
                    <Link href="/products?q=chillum" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Chillums</Link>
                    <Link href="/products?q=one+hitter" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">One Hitters</Link>
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
              <Link
                href="/products?category=accessories"
                className="text-black dark:text-white text-lg font-bold hover:text-yellow-500 transition-colors"
              >
                Accessories
              </Link>
            </li>

            {/* Munchies */}
            <li>
              <Link
                href="/products?category=edibles"
                className="text-black dark:text-white text-lg font-bold hover:text-yellow-500 transition-colors"
              >
                Munchies
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
