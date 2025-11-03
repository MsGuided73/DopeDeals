// app/components/GlobalMasthead.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, ShoppingCart, X, Star, TrendingUp, Gift, Menu } from "lucide-react";
import EnhancedSearchBar from "./EnhancedSearchBar";
import { useCart } from "../contexts/CartContext";
import { useNavigation } from "../contexts/NavigationContext";

const PROMO_TEXT = "🚀 FREE SHIPPING ON ORDERS OVER $99 • 🔥 HOT DEALS DAILY • 🌿 PREMIUM QUALITY GUARANTEED";

export default function GlobalMasthead() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [openNestedSubmenu, setOpenNestedSubmenu] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);


  // Get cart count (safe defaults provided by useCart hook)
  const { cartCount } = useCart();

  // Navigation context to hide floating nav when masthead is present
  const { setHasMasthead } = useNavigation();

  // Set hasMasthead to true when component mounts, false when unmounts
  useEffect(() => {
    setHasMasthead(true);
    return () => setHasMasthead(false);
  }, [setHasMasthead]);



  // Clear any pending hover timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
    };
  }, [hoverTimeout]);

  const handleDropdownLinkClick = () => {
    setOpenDropdown(null);
    setOpenSubmenu(null);
    setOpenNestedSubmenu(null);
  };

  const handleMouseLeaveWithDelay = (dropdownType: "main" | "submenu" | "nested") => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    const t = setTimeout(() => {
      if (dropdownType === "main") {
        setOpenDropdown(null);
        setOpenSubmenu(null);
        setOpenNestedSubmenu(null);
      } else if (dropdownType === "submenu") {
        setOpenSubmenu(null);
        setOpenNestedSubmenu(null);
      } else {
        setOpenNestedSubmenu(null);
      }
    }, 300);
    setHoverTimeout(t);
  };

  const handleMouseEnter = (type: "dropdown" | "submenu" | "nested", value: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    if (type === "dropdown") setOpenDropdown(value);
    else if (type === "submenu") setOpenSubmenu(value);
    else setOpenNestedSubmenu(value);
  };

  return (
    <>
    {/* Scrolling Banner */}
    <div
      className="bg-gradient-to-r from-green-800 via-green-700 to-green-800 text-white text-center py-2 overflow-hidden relative"
      role="banner"
      aria-label="Promotional announcements"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 via-transparent to-green-900/20 animate-pulse"></div>
      <div className="relative z-10 flex whitespace-nowrap animate-marquee hover:pause-marquee">
        <span className="inline-block px-8 font-bold text-sm tracking-wide" aria-hidden="true">
          {PROMO_TEXT}
        </span>
        <span className="inline-block px-8 font-bold text-sm tracking-wide" aria-hidden="true">
          {PROMO_TEXT}
        </span>
        <span className="inline-block px-8 font-bold text-sm tracking-wide" aria-hidden="true">
          {PROMO_TEXT}
        </span>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .hover\\:pause-marquee:hover .animate-marquee {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
          }
        }
      `}</style>
    </div>

    <header className="z-50 relative">
      {/* Single Compact Navigation Bar */}
      <div
        className="bg-black px-4 flex items-center justify-between gap-4 relative"
        style={{ minHeight: "65px", height: "65px" }}
      >
        {/* Left: Logo + Navigation Links */}
        <div className="flex items-center gap-6 flex-shrink-0">
          {/* Logo */}
          <div className="h-full flex items-center">
            <Link href="/" className="h-full flex items-center">
              <Image
                src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/logo_Highway420-official_transparent.png"
                alt="HIGHWAY 420 Logo"
                width={90}
                height={65}
                className="object-contain h-full w-auto"
                style={{ display: "block" }}
                priority
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Shop Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === "shop" ? null : "shop")}
                className="text-white text-sm font-black hover:text-yellow-400 transition-colors flex items-center gap-1"
              >
                Shop
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openDropdown === "shop" && (
                <div
                  className="absolute top-full left-0 mt-2 w-64 rounded-xl shadow-lg border border-gray-200 z-[50]"
                  style={{ backgroundColor: "#f4f1e8" }}
                  onMouseLeave={() => handleMouseLeaveWithDelay("main")}
                >
                  <div className="py-2">
                    <Link href="/products" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-medium">
                      All Products
                    </Link>
                    <div className="border-t border-gray-200/20 my-1" />

                    {/* Categories */}
                    <div className="relative">
                      <button
                        onMouseEnter={() => handleMouseEnter("submenu", "categories")}
                        onMouseLeave={() => handleMouseLeaveWithDelay("submenu")}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors flex items-center justify-between font-medium"
                      >
                        Shop by Category
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      {openSubmenu === "categories" && (
                        <div
                          className="absolute left-full top-0 ml-1 w-56 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 z-[60]"
                          onMouseEnter={() => handleMouseEnter("submenu", "categories")}
                          onMouseLeave={() => handleMouseLeaveWithDelay("submenu")}
                        >
                          <div className="py-2">
                            {/* Nested: THCA & More */}
                            <div className="relative">
                              <button
                                onMouseEnter={() => handleMouseEnter("nested", "thca-nested-categories")}
                                onMouseLeave={() => handleMouseLeaveWithDelay("nested")}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors flex items-center justify-between"
                              >
                                THCA & More
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>

                              {openNestedSubmenu === "thca-nested-categories" && (
                                <div
                                  className="absolute left-full top-0 ml-1 w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 z-[70]"
                                  onMouseEnter={() => handleMouseEnter("nested", "thca-nested-categories")}
                                  onMouseLeave={() => handleMouseLeaveWithDelay("nested")}
                                >
                                  <div className="py-2">
                                    <Link href="/thca_flower" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-medium">
                                      ⭐ THCA Flower
                                    </Link>
                                    <Link href="/thca_prerolls" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-medium">
                                      ⭐ THCA Pre-Rolls
                                    </Link>
                                    <div className="border-t border-gray-200/20 my-1" />
                                    <Link href="/thca_rosin" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                                      THCA Rosin
                                    </Link>
                                    <Link href="/thca_cbd" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                                      CBD Products
                                    </Link>
                                    <Link href="/thca_delta" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                                      Delta Products
                                    </Link>
                                    <Link href="/edibles" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                                      Edibles
                                    </Link>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="border-t border-gray-200/20 my-1" />
                            <Link href="/bongs" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                              Bongs & Water Pipes
                            </Link>
                            <Link href="/pipes" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                              Hand Pipes
                            </Link>
                            <Link href="/dab-rigs" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                              Dab Rigs
                            </Link>
                            <Link href="/thca_vapes" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                              Vaporizers
                            </Link>
                            <Link href="/accessories" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                              Accessories
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-200/20 my-1" />

                    {/* Brands */}
                    <div className="relative">
                      <button
                        onMouseEnter={() => handleMouseEnter("submenu", "brands")}
                        onMouseLeave={() => handleMouseLeaveWithDelay("submenu")}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors flex items-center justify-between font-medium"
                      >
                        Shop by Brand
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      {openSubmenu === "brands" && (
                        <div
                          className="absolute left-full top-0 ml-1 w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 z-[60]"
                          onMouseEnter={() => handleMouseEnter("submenu", "brands")}
                          onMouseLeave={() => handleMouseLeaveWithDelay("submenu")}
                        >
                          <div className="py-2">
                            <Link href="/brands/raw-papers" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                              RAW
                            </Link>
                            <Link href="/brands/puffco" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                              Puffco
                            </Link>
                            <Link href="/brands/crave" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                              Storz & Bickel
                            </Link>
                            <Link href="/brands/roor" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                              ROOR
                            </Link>
                            <div className="border-t border-gray-200/20 my-1" />
                            <Link href="/brands" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-medium">
                              View All Brands
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* THCA & More */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === "thca" ? null : "thca")}
                className="text-white text-sm font-black hover:text-yellow-400 transition-colors flex items-center gap-1"
              >
                THCA & More
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openDropdown === "thca" && (
                <div
                  className="absolute top-full left-0 mt-2 w-64 rounded-xl shadow-lg border border-gray-200 z-[50]"
                  style={{ backgroundColor: "#f4f1e8" }}
                  onMouseLeave={() => handleMouseLeaveWithDelay("main")}
                >
                  <div className="py-2">
                    <Link href="/thca_flower" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-medium">
                      THCA Flower
                    </Link>
                    <Link href="/thca_prerolls" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-medium">
                      THCA Pre-Rolls
                    </Link>
                    <div className="border-t border-gray-200/20 my-1" />
                    <Link href="/thca/thca_concentrate" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                      THCA Concentrates
                    </Link>
                    <Link href="/thca_rosin" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                      THCA Rosin
                    </Link>
                    <div className="border-t border-gray-200/20 my-1" />
                    <Link href="/thca_cbd" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                      CBD Products
                    </Link>
                    <Link href="/thca_delta" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                      Delta Products
                    </Link>
                    <Link href="/thca_edibles" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                      Edibles
                    </Link>
                    <div className="border-t border-gray-200/20 my-1" />
                    <Link href="/mushrooms" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                      🍄 Mushrooms
                    </Link>
                    <Link href="/nitrous-oxide" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                      Nitrous Oxide
                    </Link>
                    <Link href="/7-hydroxymitragynine" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                      7-Hydroxymitragynine
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Bongs */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === "bongs" ? null : "bongs")}
                className="text-white text-sm font-black hover:text-yellow-400 transition-colors flex items-center gap-1"
              >
                Bongs
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openDropdown === "bongs" && (
                <div
                  className="absolute top-full left-0 mt-2 w-48 rounded-xl shadow-lg border border-gray-200 z-[50]"
                  style={{ backgroundColor: "#f4f1e8" }}
                  onMouseLeave={() => handleMouseLeaveWithDelay("main")}
                >
                  <div className="py-2">
                    <Link href="/bongs" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                      All Bongs
                    </Link>
                    <Link href="/bubblers" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                      Bubblers
                    </Link>
                    <Link href="/products?q=glass+bong" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                      Glass Bongs
                    </Link>
                    <Link href="/products?q=beaker+bong" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                      Beaker Bongs
                    </Link>
                    <Link href="/products?q=straight+tube" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                      Straight Tube
                    </Link>
                    <Link href="/products?q=percolator" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                      Percolator Bongs
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Pipes */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === "pipes" ? null : "pipes")}
                className="text-white text-sm font-black hover:text-yellow-400 transition-colors flex items-center gap-1"
              >
                Pipes
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openDropdown === "pipes" && (
                <div
                  className="absolute top-full left-0 mt-2 w-48 rounded-xl shadow-lg border border-gray-200 z-[50]"
                  style={{ backgroundColor: "#f4f1e8" }}
                  onMouseLeave={() => handleMouseLeaveWithDelay("main")}
                >
                  <div className="py-2">
                    <Link href="/pipes" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                      All Pipes
                    </Link>
                    <Link href="/products?q=spoon+pipe" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                      Spoon Pipes
                    </Link>
                    <Link href="/products?q=sherlock+pipe" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                      Sherlock Pipes
                    </Link>
                    <Link href="/products?q=chillum" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                      Chillums
                    </Link>
                    <Link href="/products?q=one+hitter" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">
                      One Hitters
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Simple links */}
            <Link href="/dabsntools" className="text-white text-sm font-black hover:text-yellow-400 transition-colors">
              Dab Rigs
            </Link>
            <Link href="/products?category=accessories" className="text-white text-sm font-black hover:text-yellow-400 transition-colors">
              Accessories
            </Link>
            <Link href="/products?category=edibles" className="text-white text-sm font-black hover:text-yellow-400 transition-colors">
              Munchies
            </Link>
          </nav>
        </div>

        {/* Center: Search (desktop) */}
        <div
          className="absolute left-3/4 -translate-x-1/2 hidden md:block"
          style={{ width: "35%" }}
        >
          <div className="flex items-center justify-center">
            <EnhancedSearchBar />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 flex-shrink-0 text-white">
          <Link
            href="/sitemap-page"
            className="hidden md:block p-2 hover:text-yellow-400 transition-all duration-300 hover:scale-110"
            title="Site Map"
          >
            <svg className="w-8 h-8 drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            className="md:hidden p-2 hover:text-yellow-400 transition-all duration-300 hover:scale-110 bg-white/10 rounded-lg hover:bg-white/20"
            title="Menu"
          >
            <Menu className="w-6 h-6" strokeWidth={3} />
          </button>

          {/* Profile */}
          <button
            onClick={() => setShowProfileModal(true)}
            className="p-2 hover:text-yellow-400 transition-all duration-300 hover:scale-110 bg-white/10 rounded-lg hover:bg-white/20"
            title="Profile & Recommendations"
          >
            <User className="w-6 h-6" strokeWidth={3} />
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            className="p-2 hover:text-yellow-400 transition-all duration-300 hover:scale-110 relative bg-white/10 rounded-lg hover:bg-white/20"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-6 h-6" strokeWidth={3} />
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow-lg">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          </Link>
        </div>
      </div>

    </header>

    {/* Mobile Search (only mobile) */}
    <div className="md:hidden bg-black text-white px-4 pb-4">
      <EnhancedSearchBar />
    </div>

    {/* Mobile Menu */}
    {isMenuOpen && (
      <div
        className="md:hidden bg-white border-t border-gray-200 shadow-lg"
        style={{ backgroundColor: "#f4f1e8" }}
      >
        <div className="px-4 py-6 space-y-4">
          <div className="space-y-3">
            <Link href="/products" className="block text-black text-lg font-bold hover:text-yellow-500 transition-colors py-3 border-b border-gray-200/50" onClick={() => setIsMenuOpen(false)}>
              Shop All Products
            </Link>
            <Link href="/bongs" className="block text-black text-lg font-bold hover:text-yellow-500 transition-colors py-3 border-b border-gray-200/50" onClick={() => setIsMenuOpen(false)}>
              Bongs & Water Pipes
            </Link>
            <Link href="/pipes" className="block text-black text-lg font-bold hover:text-yellow-500 transition-colors py-3 border-b border-gray-200/50" onClick={() => setIsMenuOpen(false)}>
              Pipes
            </Link>
            <Link href="/dabsntools" className="block text-black text-lg font-bold hover:text-yellow-500 transition-colors py-3 border-b border-gray-200/50" onClick={() => setIsMenuOpen(false)}>
              Dab Rigs
            </Link>
            <Link href="/products?category=vaporizers" className="block text-black text-lg font-bold hover:text-yellow-500 transition-colors py-3 border-b border-gray-200/50" onClick={() => setIsMenuOpen(false)}>
              Vaporizers
            </Link>
            <Link href="/products?category=accessories" className="block text-black text-lg font-bold hover:text-yellow-500 transition-colors py-3 border-b border-gray-200/50" onClick={() => setIsMenuOpen(false)}>
              Accessories
            </Link>
            <Link href="/products?category=edibles" className="block text-black text-lg font-bold hover:text-yellow-500 transition-colors py-3 border-b border-gray-200/50" onClick={() => setIsMenuOpen(false)}>
              Edibles & Munchies
            </Link>

            {/* THCA */}
            <div className="pt-4">
              <h3 className="text-black text-sm font-bold uppercase tracking-wide mb-3">THCA & More</h3>
              <div className="space-y-2 pl-4">
                <Link href="/thca_flower" className="block text-gray-800 hover:text-yellow-500 transition-colors text-base" onClick={() => setIsMenuOpen(false)}>
                  THCA Flower
                </Link>
                <Link href="/thca_prerolls" className="block text-gray-800 hover:text-yellow-500 transition-colors text-base" onClick={() => setIsMenuOpen(false)}>
                  THCA Pre-Rolls
                </Link>
                <Link href="/thca_cbd" className="block text-gray-800 hover:text-yellow-500 transition-colors text-base" onClick={() => setIsMenuOpen(false)}>
                  CBD Products
                </Link>
                <Link href="/mushrooms" className="block text-gray-800 hover:text-yellow-500 transition-colors text-base" onClick={() => setIsMenuOpen(false)}>
                  🍄 Mushrooms
                </Link>
              </div>
            </div>

            {/* Brands */}
            <div className="pt-4">
              <h3 className="text-black text-sm font-bold uppercase tracking-wide mb-3">Brands</h3>
              <div className="space-y-2 pl-4">
                <Link href="/brands" className="block text-gray-800 hover:text-yellow-500 transition-colors text-base" onClick={() => setIsMenuOpen(false)}>
                  View All Brands
                </Link>
                <Link href="/brands/raw-papers" className="block text-gray-800 hover:text-yellow-500 transition-colors text-base" onClick={() => setIsMenuOpen(false)}>
                  RAW Papers
                </Link>
                <Link href="/brands/roor" className="block text-gray-800 hover:text-yellow-500 transition-colors text-base" onClick={() => setIsMenuOpen(false)}>
                  ROOR
                </Link>
              </div>
            </div>

            {/* Account */}
            <div className="pt-4 border-t border-gray-200/50">
              <div className="space-y-3">
                <Link href="/account" className="block text-black text-lg font-bold hover:text-yellow-500 transition-colors py-3" onClick={() => setIsMenuOpen(false)}>
                  My Account
                </Link>
                <Link href="/rewards" className="block text-black text-lg font-bold hover:text-yellow-500 transition-colors py-3" onClick={() => setIsMenuOpen(false)}>
                  VIP Rewards
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Profile Modal */}
    {showProfileModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-dope-orange to-orange-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Welcome to HIGHWAY 420</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Guest Mode - Sign in for personalized recommendations</p>
              </div>
            </div>
            <button onClick={() => setShowProfileModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Recommendations */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recommended for You</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <h4 className="font-medium text-gray-900 dark:text-white">Trending Now</h4>
                  </div>
                  <div className="space-y-2">
                    <Link href="/bongs" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      🔥 Premium Glass Bongs
                    </Link>
                    <Link href="/products?q=puffco" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      🔥 Puffco Peak Pro
                    </Link>
                    <Link href="/products?q=thca+flower" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      🔥 THCA Flower Collection
                    </Link>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Gift className="w-4 h-4 text-green-600" />
                    <h4 className="font-medium text-gray-900 dark:text-white">Staff Favorites</h4>
                  </div>
                  <div className="space-y-2">
                    <Link href="/products?q=raw+papers" className="block text-sm text-green-600 dark:text-green-400 hover:underline">
                      🌟 RAW Rolling Papers
                    </Link>
                    <Link href="/products?q=roor" className="block text-sm text-green-600 dark:text-green-400 hover:underline">
                      🌟 ROOR Glass Pieces
                    </Link>
                    <Link href="/products?q=grinder" className="block text-sm text-green-600 dark:text-green-400 hover:underline">
                      🌟 Premium Grinders
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link href="/account" className="flex items-center justify-center gap-2 bg-dope-orange hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                  <User className="w-4 h-4" />
                  Sign In / Sign Up
                </Link>
                <Link href="/rewards" className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium py-3 px-6 rounded-lg transition-colors">
                  <Gift className="w-4 h-4" />
                  VIP Rewards
                </Link>
              </div>
            </div>

            {/* Popular Categories */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Link href="/bongs" className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-4 text-center transition-colors">
                  <div className="text-2xl mb-2">🚬</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Bongs</div>
                </Link>
                <Link href="/products?q=thca+flower" className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-4 text-center transition-colors">
                  <div className="text-2xl mb-2">🌿</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">THCA Flower</div>
                </Link>
                <Link href="/products?category=vaporizers" className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-4 text-center transition-colors">
                  <div className="text-2xl mb-2">💨</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Vaporizers</div>
                </Link>
                <Link href="/products?category=dab-rigs" className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-4 text-center transition-colors">
                  <div className="text-2xl mb-2">⚗️</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Dab Rigs</div>
                </Link>
                <Link href="/products?category=accessories" className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-4 text-center transition-colors">
                  <div className="text-2xl mb-2">🔧</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Accessories</div>
                </Link>
                <Link href="/mushrooms" className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-4 text-center transition-colors">
                  <div className="text-2xl mb-2">🍄</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Mushrooms</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
