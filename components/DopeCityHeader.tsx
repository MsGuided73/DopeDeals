"use client";
import { useState, useEffect, useRef } from 'react';
import { User, ShoppingCart, Search, Menu, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useCart } from './contexts/CartContext';

export default function DopeCityHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isThcaDropdownOpen, setIsThcaDropdownOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const shopDropdownRef = useRef<HTMLDivElement>(null);

  // Get cart context
  const { cartCount } = useCart();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsThcaDropdownOpen(false);
      }
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(event.target as Node)) {
        setIsShopDropdownOpen(false);
      }
    }

    if (isThcaDropdownOpen || isShopDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isThcaDropdownOpen, isShopDropdownOpen]);

  // Close dropdown on ESC key
  useEffect(() => {
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsThcaDropdownOpen(false);
        setIsShopDropdownOpen(false);
      }
    }

    if (isThcaDropdownOpen || isShopDropdownOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isThcaDropdownOpen, isShopDropdownOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" aria-label="Go to home" className="inline-block">
              <h1 className="text-2xl lg:text-3xl font-black text-white tracking-wider">
                <span className="text-white">DOPE</span>
                <span className="text-yellow-400 ml-2">CITY</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {/* Shop Dropdown */}
            <div
              className="relative"
              ref={shopDropdownRef}
              onMouseEnter={() => setIsShopDropdownOpen(true)}
              onMouseLeave={() => setIsShopDropdownOpen(false)}
            >
              <button
                className="flex items-center text-white hover:text-yellow-400 font-medium transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShopDropdownOpen(!isShopDropdownOpen);
                }}
              >
                Shop
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>

              {isShopDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-black/98 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl z-[100]">
                  <div className="py-3">
                    <div className="px-4 py-2 text-yellow-400 font-semibold text-sm uppercase tracking-wide">
                      Shop by Category
                    </div>
                    <Link
                      href="/bongs"
                      className="block px-4 py-2 text-white hover:text-yellow-400 hover:bg-white/10 transition-all duration-200 font-medium"
                      onClick={() => setIsShopDropdownOpen(false)}
                    >
                      🥛 Bongs
                    </Link>
                    <Link
                      href="/pipes"
                      className="block px-4 py-2 text-white hover:text-yellow-400 hover:bg-white/10 transition-all duration-200 font-medium"
                      onClick={() => setIsShopDropdownOpen(false)}
                    >
                      🚬 Pipes
                    </Link>
                    <Link
                      href="/products?category=dab-rigs"
                      className="block px-4 py-2 text-white hover:text-yellow-400 hover:bg-white/10 transition-all duration-200 font-medium"
                      onClick={() => setIsShopDropdownOpen(false)}
                    >
                      ⚗️ Dab Rigs
                    </Link>
                    <Link
                      href="/products?category=dry-herb-vaporizers"
                      className="block px-4 py-2 text-white hover:text-yellow-400 hover:bg-white/10 transition-all duration-200 font-medium"
                      onClick={() => setIsShopDropdownOpen(false)}
                    >
                      🌿 Dry Herb Vaporizers
                    </Link>
                    <Link
                      href="/products?category=accessories"
                      className="block px-4 py-2 text-white hover:text-yellow-400 hover:bg-white/10 transition-all duration-200 font-medium"
                      onClick={() => setIsShopDropdownOpen(false)}
                    >
                      🔧 Accessories
                    </Link>
                    <Link
                      href="/products?category=munchies"
                      className="block px-4 py-2 text-white hover:text-yellow-400 hover:bg-white/10 transition-all duration-200 font-medium"
                      onClick={() => setIsShopDropdownOpen(false)}
                    >
                      🍪 Munchies
                    </Link>
                    <div className="border-t border-white/20 my-2"></div>
                    <div className="px-4 py-2 text-yellow-400 font-semibold text-sm uppercase tracking-wide">
                      Shop by Brand
                    </div>
                    <Link
                      href="/brands"
                      className="block px-4 py-2 text-white hover:text-yellow-400 hover:bg-white/10 transition-all duration-200 font-medium"
                      onClick={() => setIsShopDropdownOpen(false)}
                    >
                      🏪 All Brands
                    </Link>
                    <Link
                      href="/brands/roor"
                      className="block px-4 py-2 text-white hover:text-yellow-400 hover:bg-white/10 transition-all duration-200 font-medium"
                      onClick={() => setIsShopDropdownOpen(false)}
                    >
                      👑 RooR
                    </Link>
                    <Link
                      href="/brands/puffco"
                      className="block px-4 py-2 text-white hover:text-yellow-400 hover:bg-white/10 transition-all duration-200 font-medium"
                      onClick={() => setIsShopDropdownOpen(false)}
                    >
                      🅿️ Puffco
                    </Link>
                  </div>
                </div>
              )}
            </div>
            {/* THCA & More Dropdown */}
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={() => setIsThcaDropdownOpen(true)}
              onMouseLeave={() => setIsThcaDropdownOpen(false)}
            >
              <button
                className="flex items-center text-white hover:text-yellow-400 font-medium transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsThcaDropdownOpen(!isThcaDropdownOpen);
                }}
              >
                THCA & More
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>

              {isThcaDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-black/98 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl z-[100]">
                  <div className="py-3">
                    <Link
                      href="/products?q=thca"
                      className="block px-4 py-3 text-white hover:text-yellow-400 hover:bg-white/10 transition-all duration-200 font-medium"
                      onClick={() => setIsThcaDropdownOpen(false)}
                    >
                      THCA Products
                    </Link>
                    <Link
                      href="/products?q=mushrooms"
                      className="block px-4 py-3 text-white hover:text-yellow-400 hover:bg-white/10 transition-all duration-200 font-medium"
                      onClick={() => setIsThcaDropdownOpen(false)}
                    >
                      🍄 Mushrooms
                    </Link>
                    <Link
                      href="/products?q=nitrous-oxide"
                      className="block px-4 py-3 text-white hover:text-yellow-400 hover:bg-white/10 transition-all duration-200 font-medium"
                      onClick={() => setIsThcaDropdownOpen(false)}
                    >
                      ⚡ Nitrous Oxide
                    </Link>
                    <Link
                      href="/products?q=7-hydroxymitragynine"
                      className="block px-4 py-3 text-white hover:text-yellow-400 hover:bg-white/10 transition-all duration-200 font-medium"
                      onClick={() => setIsThcaDropdownOpen(false)}
                    >
                      🌿 7-Hydroxymitragynine
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <form action="/products" className="relative w-full">
              <input
                type="text"
                name="q"
                placeholder="Search For Dope Things"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
              <button type="submit" aria-label="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* User Account */}
            <Link href="/auth" className="text-white hover:text-yellow-400 transition-colors" aria-label="Account">
              <User className="w-6 h-6" />
            </Link>
            
            {/* Shopping Cart */}
            <Link href="/cart" className="text-white hover:text-yellow-400 transition-colors relative" aria-label="Cart">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-white hover:text-yellow-400 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form action="/products" className="relative">
            <input
              type="text"
              name="q"
              placeholder="Search For Dope Things"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
            <button type="submit" aria-label="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-black/95 backdrop-blur-md border-t border-white/10">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-4">
            {/* Shop Section */}
            <div className="py-2">
              <div className="text-yellow-400 font-semibold py-2 mb-3 text-sm uppercase tracking-wide">
                Shop by Category
              </div>
              <div className="space-y-2">
                <Link href="/bongs" className="block text-white hover:text-yellow-400 transition-colors py-2 pl-4 border-l-2 border-gray-600 hover:border-yellow-400" onClick={() => setIsMenuOpen(false)}>
                  🥛 Bongs
                </Link>
                <Link href="/pipes" className="block text-white hover:text-yellow-400 transition-colors py-2 pl-4 border-l-2 border-gray-600 hover:border-yellow-400" onClick={() => setIsMenuOpen(false)}>
                  🚬 Pipes
                </Link>
                <Link href="/products?category=dab-rigs" className="block text-white hover:text-yellow-400 transition-colors py-2 pl-4 border-l-2 border-gray-600 hover:border-yellow-400" onClick={() => setIsMenuOpen(false)}>
                  ⚗️ Dab Rigs
                </Link>
                <Link href="/products?category=dry-herb-vaporizers" className="block text-white hover:text-yellow-400 transition-colors py-2 pl-4 border-l-2 border-gray-600 hover:border-yellow-400" onClick={() => setIsMenuOpen(false)}>
                  🌿 Dry Herb Vaporizers
                </Link>
                <Link href="/products?category=accessories" className="block text-white hover:text-yellow-400 transition-colors py-2 pl-4 border-l-2 border-gray-600 hover:border-yellow-400" onClick={() => setIsMenuOpen(false)}>
                  🔧 Accessories
                </Link>
                <Link href="/products?category=munchies" className="block text-white hover:text-yellow-400 transition-colors py-2 pl-4 border-l-2 border-gray-600 hover:border-yellow-400" onClick={() => setIsMenuOpen(false)}>
                  🍪 Munchies
                </Link>
              </div>
            </div>

            {/* Shop by Brand Section */}
            <div className="py-2">
              <div className="text-yellow-400 font-semibold py-2 mb-3 text-sm uppercase tracking-wide border-t border-gray-600 pt-4">
                Shop by Brand
              </div>
              <div className="space-y-2">
                <Link href="/brands" className="block text-white hover:text-yellow-400 transition-colors py-2 pl-4 border-l-2 border-gray-600 hover:border-yellow-400" onClick={() => setIsMenuOpen(false)}>
                  🏪 All Brands
                </Link>
                <Link href="/brands/roor" className="block text-white hover:text-yellow-400 transition-colors py-2 pl-4 border-l-2 border-gray-600 hover:border-yellow-400" onClick={() => setIsMenuOpen(false)}>
                  👑 RooR
                </Link>
                <Link href="/brands/puffco" className="block text-white hover:text-yellow-400 transition-colors py-2 pl-4 border-l-2 border-gray-600 hover:border-yellow-400" onClick={() => setIsMenuOpen(false)}>
                  🅿️ Puffco
                </Link>
              </div>
            </div>

            {/* THCA & More Section */}
            <div className="py-2">
              <div className="text-yellow-400 font-semibold py-2 mb-3 text-sm uppercase tracking-wide border-t border-gray-600 pt-4">
                THCA & More
              </div>
              <div className="space-y-2">
                <Link href="/products?q=thca" className="block text-white hover:text-yellow-400 transition-colors py-2 pl-4 border-l-2 border-gray-600 hover:border-yellow-400" onClick={() => setIsMenuOpen(false)}>
                  THCA Products
                </Link>
                <Link href="/products?q=mushrooms" className="block text-white hover:text-yellow-400 transition-colors py-2 pl-4 border-l-2 border-gray-600 hover:border-yellow-400" onClick={() => setIsMenuOpen(false)}>
                  🍄 Mushrooms
                </Link>
                <Link href="/products?q=nitrous-oxide" className="block text-white hover:text-yellow-400 transition-colors py-2 pl-4 border-l-2 border-gray-600 hover:border-yellow-400" onClick={() => setIsMenuOpen(false)}>
                  ⚡ Nitrous Oxide
                </Link>
                <Link href="/products?q=7-hydroxymitragynine" className="block text-white hover:text-yellow-400 transition-colors py-2 pl-4 border-l-2 border-gray-600 hover:border-yellow-400" onClick={() => setIsMenuOpen(false)}>
                  🌿 7-Hydroxymitragynine
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
