// app/components/GlobalMasthead.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, ShoppingCart, X, Star, TrendingUp, Gift, Menu } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useNavigation } from "../contexts/NavigationContext";
import EnhancedSearchBar from "./EnhancedSearchBar";

const PROMO_TEXT = "🚀 FREE SHIPPING ON ORDERS OVER $75 • 🔥 HOT DEALS DAILY • 🌿 PREMIUM QUALITY GUARANTEED";

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

  useEffect(() => {
    setHasMasthead(true);
    return () => setHasMasthead(false);
  }, [setHasMasthead]);

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
        className="bg-gradient-to-r from-green-800 via-green-700 to-green-800 text-white text-center py-1 overflow-hidden relative"
        role="banner"
        aria-label="Promotional announcements"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 via-transparent to-green-900/20 animate-pulse"></div>
        <div className="relative z-10 flex whitespace-nowrap animate-marquee hover:pause-marquee">
          <span className="inline-block px-8 font-bold text-sm tracking-wide">
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
          .animate-marquee { animation: marquee 30s linear infinite; }
          .hover\\:pause-marquee.animate-marquee:hover { animation-play-state: paused; }
          @media (prefers-reduced-motion: reduce) {
            .animate-marquee { animation: none; }
          }
        `}</style>
      </div>

      <header className="z-50 relative">
        {/* Two-Row Navbar Layout */}
        <div className="relative" style={{ minHeight: "110px" }}>
          {/* Enhanced 3D Black Bar Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900 shadow-2xl">
            {/* Metallic texture overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
            {/* Subtle pattern for depth */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                               radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}></div>
            {/* Top highlight for 3D effect */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            {/* Bottom shadow for depth */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-black/50 to-transparent"></div>
          </div>

          {/* Top Row: Logo + Search Bar (equal padding) - Desktop */}
          <div className="hidden md:flex items-center px-6 py-2 relative" style={{ height: "30px" }}>
            {/* Logo - Left side, spans both rows */}
            <div className="absolute left-6 top-0 z-10 flex items-center" style={{ height: "120px", maxWidth: "400px" }}>
              <Link href="/" className="flex items-center h-full w-full">
                <Image
                  src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/logo_Highway420-official_transparent.png"
                  alt="HIGHWAY 420 Logo"
                  width={400}
                  height={86}
                  className="object-contain w-full h-full"
                  style={{ display: "block", maxHeight: "120px" }}
                  priority
                />
              </Link>
            </div>

            {/* Search Bar - Equal padding from both sides */}
            <div className="absolute left-1/2 top-2 transform -translate-x-1/2" style={{ width: "calc(100% - 300px)" }}>
              <div className="max-w-2xl w-full mx-auto">
                <EnhancedSearchBar />
              </div>
            </div>
          </div>

          {/* Mobile: Logo Row - Spans full navbar height */}
          <div className="md:hidden flex items-center px-4 py-2 relative" style={{ height: "30px" }}>
            {/* Logo - Spans full navbar height on mobile */}
            <div className="absolute left-0 top-0 z-10 flex items-center" style={{ height: "60px", width: "60px" }}>
              <Link href="/" className="flex items-center h-full">
                <Image
                  src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/logo_Highway420-official_transparent.png"
                  alt="HIGHWAY 420 Logo"
                  width={60}
                  height={43}
                  className="object-contain w-full h-auto"
                  style={{ display: "block" }}
                  priority
                />
              </Link>
            </div>
          </div>

          {/* Bottom Row: Navigation Links + User Icons */}
          <div className="flex items-center justify-between px-4 group" style={{ height: "30px" }}>
            {/* Navigation Links - Centered at bottom */}
            <nav className="hidden md:flex items-center gap-6 absolute bottom-0 left-1/2 transform -translate-x-1/2 group-hover:scale-105 transition-transform duration-300">
              {/* Vapes Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === "vapes" ? null : "vapes")}
                  className="text-white text-sm font-black hover:text-yellow-400 transition-colors flex items-center gap-1"
                >
                  Vapes
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openDropdown === "vapes" && (
                  <div
                    className="absolute top-full left-0 mt-2 w-64 rounded-xl shadow-lg border border-gray-200 z-[50]"
                    style={{ backgroundColor: "#f4f1e8" }}
                    onMouseLeave={() => handleMouseLeaveWithDelay("main")}
                  >
                    <div className="py-2">
                      <Link href="/thca_pnv" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
                        ⭐ All Vapes
                      </Link>
                      <div className="border-t border-gray-200/20 my-1" />

                      {/* THCA Products */}
                      <Link href="/thca_pnv" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
                        THCA Products
                      </Link>
                      <Link href="/thca_pnv" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
                        D8 Products
                      </Link>
                      <Link href="/thca_pnv" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
                        D10 Products
                      </Link>
                      <Link href="/thca_pnv" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
                        THCp Products
                      </Link>
                      <Link href="/thca_pnv" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
                        THCv Products
                      </Link>

                      <div className="border-t border-gray-200/20 my-1" />

                      {/* Vape Equipment */}
                      <Link href="/thca_pnv" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
                        Vaporizers
                      </Link>
                      <Link href="/dabsntools" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
                        E-Rigs
                      </Link>
                      <Link href="/products?q=cartridge" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
                        Cartridges
                      </Link>
                      <Link href="/products?q=battery" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
                        Batteries
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* THCA+ */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === "thca" ? null : "thca")}
                  className="text-white text-sm font-black hover:text-yellow-400 transition-colors flex items-center gap-1"
                >
                  THCA+
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
                      <Link href="/thca_flower" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
                        THCA Flower
                      </Link>
                      <Link href="/thca_pnv" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
                        THCA Pre-Rolls
                      </Link>
                      <div className="border-t border-gray-200/20 my-1" />
                      <Link href="/thca_pnv" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
                        THCA Concentrates
                      </Link>
                      <div className="border-t border-gray-200/20 my-1" />
                      <Link href="/thca_cbd" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
                        CBD Products
                      </Link>
                      <Link href="/thca_delta" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
                        Delta Products
                      </Link>
                      <Link href="/thca_edibles" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
                        Edibles
                      </Link>
                      <div className="border-t border-gray-200/20 my-1" />
                      <Link href="/thca_shrooms" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
                        🍄 Mushrooms
                      </Link>
                      <Link href="/nitrous-oxide" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
                        Nitrous Oxide
                      </Link>
                      <Link href="/7-hydroxymitragynine" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
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
                      <Link href="/bongs" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
                        All Bongs
                      </Link>
                      <Link href="/bubblers" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
                        Bubblers
                      </Link>
                      <Link href="/products?q=glass+bong" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
                        Glass Bongs
                      </Link>
                      <Link href="/products?q=beaker+bong" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
                        Beaker Bongs
                      </Link>
                      <Link href="/products?q=straight+tube" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
                        Straight Tube
                      </Link>
                      <Link href="/products?q=percolator" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
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
                      <Link href="/pipes" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
                        All Pipes
                      </Link>
                      <Link href="/products?q=spoon+pipe" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
                        Spoon Pipes
                      </Link>
                      <Link href="/products?q=sherlock+pipe" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
                        Sherlock Pipes
                      </Link>
                      <Link href="/products?q=chillum" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
                        Chillums
                      </Link>
                      <Link href="/products?q=one+hitter" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-bold">
                        One Hitters
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Simple links */}
              <Link href="/dabsntools" className="text-white text-sm font-black hover:text-yellow-400 transition-colors">
                Dab-Rigs
              </Link>
              <Link href="/products?category=accessories" className="text-white text-sm font-black hover:text-yellow-400 transition-colors">
                Accessories
              </Link>
              <Link href="/blog" className="text-white text-sm font-black hover:text-yellow-400 transition-colors">
                Blog
              </Link>
            </nav>

            {/* User Icons - Right side of bottom row */}
            <div className="absolute right-4 flex items-center gap-4 text-white">
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
        </div>
      </header>

      {/* Mobile Search Bar - Pops out below navbar */}
      <div className="md:hidden bg-gray-50 border-b border-gray-200 px-4 py-3">
        <EnhancedSearchBar />
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg" style={{ backgroundColor: "#f4f1e8" }}>
          <div className="px-4 py-6 space-y-4">
            <div className="space-y-3">
              <Link href="/products" className="block text-black text-lg font-bold hover:text-yellow-500 transition-colors py-3 border-b border-gray-200/50" onClick={() => setIsMenuOpen(false)}>
                Shop All Products
              </Link>

              {/* Vapes Section */}
              <div className="pt-2">
                <h3 className="text-black text-sm font-bold uppercase tracking-wide mb-3">Vapes</h3>
                <div className="space-y-2 pl-4">
                  <Link href="/thca_pnv" className="block text-gray-800 hover:text-yellow-500 transition-colors text-base" onClick={() => setIsMenuOpen(false)}>
                    All Vapes
                  </Link>
                  <Link href="/thca_pnv" className="block text-gray-800 hover:text-yellow-500 transition-colors text-base" onClick={() => setIsMenuOpen(false)}>
                    THCA Products
                  </Link>
                  <Link href="/thca_pnv" className="block text-gray-800 hover:text-yellow-500 transition-colors text-base" onClick={() => setIsMenuOpen(false)}>
                    D8 Products
                  </Link>
                  <Link href="/thca_pnv" className="block text-gray-800 hover:text-yellow-500 transition-colors text-base" onClick={() => setIsMenuOpen(false)}>
                    D10 Products
                  </Link>
                  <Link href="/thca_pnv" className="block text-gray-800 hover:text-yellow-500 transition-colors text-base" onClick={() => setIsMenuOpen(false)}>
                    THCp Products
                  </Link>
                  <Link href="/thca_pnv" className="block text-gray-800 hover:text-yellow-500 transition-colors text-base" onClick={() => setIsMenuOpen(false)}>
                    THCv Products
                  </Link>
                  <Link href="/thca_pnv" className="block text-gray-800 hover:text-yellow-500 transition-colors text-base" onClick={() => setIsMenuOpen(false)}>
                    Vaporizers
                  </Link>
                  <Link href="/dabsntools" className="block text-gray-800 hover:text-yellow-500 transition-colors text-base" onClick={() => setIsMenuOpen(false)}>
                    E-Rigs
                  </Link>
                  <Link href="/products?q=cartridge" className="block text-gray-800 hover:text-yellow-500 transition-colors text-base" onClick={() => setIsMenuOpen(false)}>
                    Cartridges
                  </Link>
                  <Link href="/products?q=battery" className="block text-gray-800 hover:text-yellow-500 transition-colors text-base" onClick={() => setIsMenuOpen(false)}>
                    Batteries
                  </Link>
                </div>
              </div>

              <Link href="/bongs" className="block text-black text-lg font-bold hover:text-yellow-500 transition-colors py-3 border-b border-gray-200/50" onClick={() => setIsMenuOpen(false)}>
                Bongs & Water Pipes
              </Link>
              <Link href="/pipes" className="block text-black text-lg font-bold hover:text-yellow-500 transition-colors py-3 border-b border-gray-200/50" onClick={() => setIsMenuOpen(false)}>
                Pipes
              </Link>
              <Link href="/dabsntools" className="block text-black text-lg font-bold hover:text-yellow-500 transition-colors py-3 border-b border-gray-200/50" onClick={() => setIsMenuOpen(false)}>
                Dab Rigs
              </Link>
              <Link href="/accessories" className="block text-black text-lg font-bold hover:text-yellow-500 transition-colors py-3 border-b border-gray-200/50" onClick={() => setIsMenuOpen(false)}>
                Accessories
              </Link>
              <Link href="/edibles" className="block text-black text-lg font-bold hover:text-yellow-500 transition-colors py-3 border-b border-gray-200/50" onClick={() => setIsMenuOpen(false)}>
                Edibles & Munchies
              </Link>

              {/* THCA */}
              <div className="pt-4">
                <h3 className="text-black text-sm font-bold uppercase tracking-wide mb-3">THCA+</h3>
                <div className="space-y-2 pl-4">
                  <Link href="/thca_flower" className="block text-gray-800 hover:text-yellow-500 transition-colors text-base" onClick={() => setIsMenuOpen(false)}>
                    THCA Flower
                  </Link>
                  <Link href="/thca_pnv" className="block text-gray-800 hover:text-yellow-500 transition-colors text-base" onClick={() => setIsMenuOpen(false)}>
                    THCA Pre-Rolls
                  </Link>
                  <Link href="/cbd" className="block text-gray-800 hover:text-yellow-500 transition-colors text-base" onClick={() => setIsMenuOpen(false)}>
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
                      <Link href="/puffco" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        🔥 Puffco Peak Pro
                      </Link>
                      <Link href="/thca_flower" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">
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
                      <Link href="/accessories_grinders" className="block text-sm text-green-600 dark:text-green-400 hover:underline">
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
                  <Link href="/signin" className="flex items-center justify-center gap-2 bg-dope-orange hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors">
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
                  <Link href="/thca_flower" className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-4 text-center transition-colors">
                    <div className="text-2xl mb-2">🌿</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">THCA Flower</div>
                  </Link>
                  <Link href="/thca_pnv" className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-4 text-center transition-colors">
                    <div className="text-2xl mb-2">💨</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Vaporizers</div>
                  </Link>
                  <Link href="/dabsntools" className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-4 text-center transition-colors">
                    <div className="text-2xl mb-2">⚗️</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Dab Rigs</div>
                  </Link>
                  <Link href="/accessories" className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-4 text-center transition-colors">
                    <div className="text-2xl mb-2">🔧</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Accessories</div>
                  </Link>
                  <Link href="/shrooms" className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-4 text-center transition-colors">
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
