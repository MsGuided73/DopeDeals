"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User, ShoppingCart, X, Star, TrendingUp, Gift, Menu } from 'lucide-react';
import EnhancedSearchBar from './EnhancedSearchBar';
import { useCart } from '../contexts/CartContext';

export default function GlobalMasthead() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Get cart context
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle delayed closing of dropdowns
  const handleMouseLeaveWithDelay = (dropdownType: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    const timeout = setTimeout(() => {
      if (dropdownType === 'main') {
        setOpenDropdown(null);
        setOpenSubmenu(null);
      } else if (dropdownType === 'submenu') {
        setOpenSubmenu(null);
      }
    }, 150); // 150ms delay
    setHoverTimeout(timeout);
  };

  const handleMouseEnter = (type: string, value: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    if (type === 'dropdown') {
      setOpenDropdown(value);
    } else if (type === 'submenu') {
      setOpenSubmenu(value);
    }
  };

  return (
    <header className="sticky top-0 z-50">
      <div>
        {/* Main Masthead - Mobile Optimized */}
        <div className="bg-black text-white">
          {/* Top Row: Logo, Icons */}
          <div className="flex items-center justify-between px-4 py-3">
            {/* Left: DOPE CITY Logo - Smaller on mobile */}
            <div className="flex-1 min-w-0">
              <Link href="/" className="block">
                <h1 className="font-chalets text-xl md:text-4xl font-black text-white tracking-wider truncate" style={{
                  fontFamily: "'Chalets', 'Inter', system-ui, sans-serif",
                  fontWeight: 'normal'
                }}>
                  DOPE CITY
                </h1>
              </Link>
            </div>

            {/* Right: Compact Icons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setShowProfileModal(true)}
                className="p-1.5 hover:text-yellow-400 transition-colors"
                title="Profile & Recommendations"
              >
                <User className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <Link href="/cart" className="p-1.5 hover:text-yellow-400 transition-colors relative" title="Shopping Cart">
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              </Link>
              <button
                className="p-1.5 hover:text-yellow-400 transition-colors md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                title="Menu"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search Bar - Below masthead */}
          <div className="px-4 pb-3">
            <EnhancedSearchBar />
          </div>
        </div>

        {/* DOPE Orange divider line - THICK */}
        <div className="h-2 bg-dope-orange"></div>

        {/* Glassmorphic nav bar - Desktop Only */}
        <nav className="hidden md:block bg-white/90 backdrop-blur-md">
          <ul className="flex items-center justify-center gap-8 py-5 flex-wrap relative">
            {/* Shop Dropdown - Consolidated Categories and Brands */}
            <li
              className="relative"
              onMouseEnter={() => handleMouseEnter('dropdown', 'shop')}
              onMouseLeave={() => handleMouseLeaveWithDelay('main')}
            >
              <button
                onClick={() => setOpenDropdown(openDropdown === 'shop' ? null : 'shop')}
                className="text-black dark:text-white text-lg font-bold hover:text-yellow-500 transition-colors flex items-center gap-1"
              >
                Shop
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === 'shop' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 z-50">
                  <div className="py-2">
                    <Link href="/products" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-medium">All Products</Link>
                    <div className="border-t border-gray-200/20 my-1"></div>

                    {/* Categories Section */}
                    <div className="relative">
                      <button
                        onMouseEnter={() => handleMouseEnter('submenu', 'categories')}
                        onMouseLeave={() => handleMouseLeaveWithDelay('submenu')}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors flex items-center justify-between font-medium"
                      >
                        Shop by Category
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      {/* Categories Submenu */}
                      {openSubmenu === 'categories' && (
                        <div
                          className="absolute left-full top-0 ml-1 w-56 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 z-60"
                          onMouseEnter={() => handleMouseEnter('submenu', 'categories')}
                          onMouseLeave={() => handleMouseLeaveWithDelay('submenu')}
                        >
                          <div className="py-2">
                            {/* THCA & More with Nested Submenu */}
                            <div className="relative">
                              <button
                                onMouseEnter={() => handleMouseEnter('submenu', 'thca-nested-categories')}
                                onMouseLeave={() => handleMouseLeaveWithDelay('submenu')}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors flex items-center justify-between"
                              >
                                THCA & More
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>

                              {/* THCA Nested Submenu */}
                              {openSubmenu === 'thca-nested-categories' && (
                                <div
                                  className="absolute left-full top-0 ml-1 w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 z-70"
                                  onMouseEnter={() => handleMouseEnter('submenu', 'thca-nested-categories')}
                                  onMouseLeave={() => handleMouseLeaveWithDelay('submenu')}
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
                    </div>

                    <div className="border-t border-gray-200/20 my-1"></div>

                    {/* Brands Section */}
                    <div className="relative">
                      <button
                        onMouseEnter={() => handleMouseEnter('submenu', 'brands')}
                        onMouseLeave={() => handleMouseLeaveWithDelay('submenu')}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors flex items-center justify-between font-medium"
                      >
                        Shop by Brand
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      {/* Brands Submenu */}
                      {openSubmenu === 'brands' && (
                        <div
                          className="absolute left-full top-0 ml-1 w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 z-60"
                          onMouseEnter={() => handleMouseEnter('submenu', 'brands')}
                          onMouseLeave={() => handleMouseLeaveWithDelay('submenu')}
                        >
                          <div className="py-2">
                            <Link href="/brands/raw-papers" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">RAW</Link>
                            <Link href="/brands/puffco" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Puffco</Link>
                            <Link href="/brands/storz-bickel" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Storz & Bickel</Link>
                            <Link href="/brands/roor" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">ROOR</Link>
                            <div className="border-t border-gray-200/20 my-1"></div>
                            <Link href="/brands" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-medium">View All Brands</Link>
                          </div>
                        </div>
                      )}
                    </div>
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
                THCA & More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === 'thca' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 z-50">
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
                    <div className="border-t border-gray-200/20 my-1"></div>
                    {/* New Product Types at bottom */}
                    <Link href="/mushrooms" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">🍄 Mushrooms</Link>
                    <Link href="/nitrous-oxide" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Nitrous Oxide</Link>
                    <Link href="/7-hydroxymitragynine" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">7-Hydroxymitragynine</Link>
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
                    <Link href="/bubblers" className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors">Bubblers</Link>
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

      {/* Profile Modal with Guest Recommendations */}
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
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Welcome to DOPE CITY</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Guest Mode - Sign in for personalized recommendations</p>
                </div>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Guest Recommendations */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recommended for You</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Trending Products */}
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

                  {/* Staff Picks */}
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
                  <button
                    onClick={() => window.location.href = '/auth'}
                    className="flex items-center justify-center gap-2 bg-dope-orange hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Sign In / Sign Up
                  </button>
                  <Link
                    href="/rewards"
                    className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    <Gift className="w-4 h-4" />
                    VIP Rewards
                  </Link>
                </div>
              </div>

              {/* Featured Categories */}
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
    </header>
  );
}
