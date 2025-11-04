// app/components/GlobalMastheadClient.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, ShoppingCart, X, Star, TrendingUp, Gift, Menu } from "lucide-react";
import { useCart } from "../contexts/CartContext";

export default function GlobalMastheadClient() {
  const [scrolled, setScrolled] = useState(() => (typeof window !== "undefined" ? window.scrollY > 0 : false));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [openNestedSubmenu, setOpenNestedSubmenu] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleDropdownLinkClick = () => {
    setOpenDropdown(null);
    setOpenSubmenu(null);
    setOpenNestedSubmenu(null);
  };

  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > window.innerHeight);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    return () => { if (hoverTimeout) clearTimeout(hoverTimeout); };
  }, [hoverTimeout]);

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
      <header className="z-50 relative">
        {/* === OUTER WRAPPER START === */}
        <div>
          {/* Promotional Banner */}
          <div className="text-white px-4 py-2 text-center relative overflow-hidden" style={{ backgroundColor: "#2d8f47" }}>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🔥</span>
              <span className="font-bold text-lg tracking-wide">SPECIAL: Free Gift for New Customers</span>
            </div>
            <div className="absolute left-0 top-0 bottom-0 w-2" style={{ backgroundColor: "#1a5c32" }} />
            <div className="absolute right-0 top-0 bottom-0 w-2" style={{ backgroundColor: "#1a5c32" }} />
          </div>

          {/* Main Masthead */}
          <div
            className="bg-black px-1 flex flex-wrap items-center justify-between gap-2 relative"
            style={{ minHeight: "100px" }}
          >
            {/* Logo */}
            <div className="flex-shrink-0 ml-2 h-full flex items-center order-1">
              <Link href="/" className="h-full flex items-center">
                <Image
                  src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/logo_Highway420-official_transparent.png"
                  alt="HIGHWAY 420 Logo"
                  width={120}
                  height={100}
                  className="object-contain h-full w-auto"
                  style={{ display: "block" }}
                  priority
                />
              </Link>
            </div>

            {/* Search (flex child that can wrap) */}
            <div
              className="
                order-3 w-full
                sm:order-2
                sm:flex-[1_1_500px] sm:min-w-[480px]
                md:flex-[1_1_600px] md:min-w-[560px]
                xl:flex-[1_1_700px]
                hidden md:block
              "
            >
              <div className="flex items-center justify-center h-full">
                {/* Search bar removed - using flexible original search bar */}
              </div>
            </div>

            {/* Right: User Actions */}
            <div className="flex items-center gap-3 flex-shrink-0 mr-5 text-white order-2 ml-auto">
              <Link
                href="/sitemap-page"
                className="hidden md:block p-3 hover:text-yellow-400 transition-all duration-300 hover:scale-110"
                title="Site Map"
              >
                <svg className="w-12 h-12 drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </Link>

              {/* Mobile Hamburger Menu Button */}
              <button
                onClick={() => setIsMenuOpen((v) => !v)}
                className="md:hidden p-3 hover:text-yellow-400 transition-all duration-300 hover:scale-110 bg-white/10 rounded-lg hover:bg-white/20"
                title="Menu"
              >
                <Menu className="w-8 h-8" strokeWidth={3} />
              </button>

              <button
                onClick={() => setShowProfileModal(true)}
                className="p-3 hover:text-yellow-400 transition-all duration-300 hover:scale-110 bg-white/10 rounded-lg hover:bg-white/20"
                title="Profile & Recommendations"
              >
                <User className="w-8 h-8" strokeWidth={3} />
              </button>

              <Link
                href="/cart"
                className="p-3 hover:text-yellow-400 transition-all duration-300 hover:scale-110 relative bg-white/10 rounded-lg hover:bg-white/20"
                title="Shopping Cart"
              >
                <ShoppingCart className="w-8 h-8" strokeWidth={3} />
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow-lg">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              </Link>
            </div>
          </div>
          {/* === END main masthead block === */}
        </div>
        {/* === OUTER WRAPPER END === */}

        {/* Navigation Links - Desktop Only - Sticky */}
        <nav className="hidden md:flex sticky top-0 left-0 right-0 justify-center items-center gap-6 py-3 bg-black z-40" style={{ minHeight: "48px" }}>
          {/* (unchanged dropdowns) */}
          {/* Shop Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === "shop" ? null : "shop")}
              className="text-white text-sm font-bold hover:text-yellow-400 transition-colors flex items-center gap-1"
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

                  {/* Categories Section */}
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
                          {/* THCA & More with Nested Submenu */}
                          <div className="relative">
                            <button
                              onMouseEnter={() => handleMouseEnter("nested", "thca-nested-categories")}
                              onMouseLeave={() => handleMouseLeaveWithDelay("nested")}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors flex items-center justify-between"
                            >
                              THCA &amp; More
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
                            Bongs &amp; Water Pipes
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

                  {/* Brands Section */}
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
                            Storz &amp; Bickel
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

          {/* THCA & More Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === "thca" ? null : "thca")}
              className="text-white text-sm font-bold hover:text-yellow-400 transition-colors flex items-center gap-1"
            >
              THCA &amp; More
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

          {/* Bongs Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === "bongs" ? null : "bongs")}
              className="text-white text-sm font-bold hover:text-yellow-400 transition-colors flex items-center gap-1"
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

          {/* Pipes Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === "pipes" ? null : "pipes")}
              className="text-white text-sm font-bold hover:text-yellow-400 transition-colors flex items-center gap-1"
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
          <Link href="/dabsntools" className="text-white text-sm font-bold hover:text-yellow-400 transition-colors">
            Dab Rigs
          </Link>
          <Link href="/products?category=accessories" className="text-white text-sm font-bold hover:text-yellow-400 transition-colors">
            Accessories
          </Link>
          <Link href="/products?category=edibles" className="text-white text-sm font-bold hover:text-yellow-400 transition-colors">
            Munchies
          </Link>
        </nav>
      </header>

      {/* Mobile Search Bar - Only on mobile - removed, using flexible original search bar */}

      <header className="z-50 relative">
        {/* Mobile Hamburger Menu - Only on mobile */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg" style={{ backgroundColor: "#f4f1e8" }}>
            <div className="px-4 py-6 space-y-4">
              {/* Main Navigation Links */}
              <div className="space-y-3">
                <Link href="/products" className="block text-black text-lg font-bold hover:text-yellow-500 transition-colors py-3 border-b border-gray-200/50" onClick={() => setIsMenuOpen(false)}>
                  Shop All Products
                </Link>
                <Link href="/bongs" className="block text-black text-lg font-bold hover:text-yellow-500 transition-colors py-3 border-b border-gray-200/50" onClick={() => setIsMenuOpen(false)}>
                  Bongs &amp; Water Pipes
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
                  Edibles &amp; Munchies
                </Link>

                {/* THCA Section */}
                <div className="pt-4">
                  <h3 className="text-black text-sm font-bold uppercase tracking-wide mb-3">THCA &amp; More</h3>
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

                {/* Brands Section */}
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

                {/* Account Section */}
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
      </header>
    </>
  );
}
