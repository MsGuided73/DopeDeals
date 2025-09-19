"use client";
import { useState } from 'react';
import { User, ShoppingCart, Search, Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function DopeCityHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <Link href="/brands" className="text-white hover:text-yellow-400 font-medium transition-colors">
              Shop by Brand
            </Link>
            <Link href="/products?q=thca" className="text-white hover:text-yellow-400 font-medium transition-colors">
              THCA & More
            </Link>
            <Link href="/bongs" className="text-white hover:text-yellow-400 font-medium transition-colors">
              Bongs
            </Link>
            <Link href="/pipes" className="text-white hover:text-yellow-400 font-medium transition-colors">
              Pipes
            </Link>
            <Link href="/products?category=dab-rigs" className="text-white hover:text-yellow-400 font-medium transition-colors">
              Dab Rigs
            </Link>
            <Link href="/products?category=dry-herb-vaporizers" className="text-white hover:text-yellow-400 font-medium transition-colors">
              Dry Herb Vaporizers
            </Link>
            <Link href="/products?category=accessories" className="text-white hover:text-yellow-400 font-medium transition-colors">
              Accessories
            </Link>
            <Link href="/products?category=munchies" className="text-white hover:text-yellow-400 font-medium transition-colors">
              Munchies
            </Link>
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
                0
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
            <Link href="/brands" className="block text-white hover:text-yellow-400 font-medium transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
              Shop by Brand
            </Link>
            <Link href="/products?q=thca" className="block text-white hover:text-yellow-400 font-medium transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
              THCA & More
            </Link>
            <Link href="/bongs" className="block text-white hover:text-yellow-400 font-medium transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
              Bongs
            </Link>
            <Link href="/pipes" className="block text-white hover:text-yellow-400 font-medium transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
              Pipes
            </Link>
            <Link href="/products?category=dab-rigs" className="block text-white hover:text-yellow-400 font-medium transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
              Dab Rigs
            </Link>
            <Link href="/products?category=dry-herb-vaporizers" className="block text-white hover:text-yellow-400 font-medium transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
              Dry Herb Vaporizers
            </Link>
            <Link href="/products?category=accessories" className="block text-white hover:text-yellow-400 font-medium transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
              Accessories
            </Link>
            <Link href="/products?category=munchies" className="block text-white hover:text-yellow-400 font-medium transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
              Munchies
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
