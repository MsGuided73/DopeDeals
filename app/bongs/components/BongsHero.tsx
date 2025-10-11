'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function BongsHero() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all-bongs');
  return (
    <div className="relative bg-black text-white overflow-hidden">
      {/* Compact Header Bar */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="font-chalets text-4xl md:text-5xl lg:text-6xl tracking-wider text-white leading-tight">
              BONGS & WATER PIPES
            </h1>
            <div className="hidden md:block w-16 h-0.5 bg-dope-orange-500"></div>
          </div>

          {/* Quick Stats - Compact */}
          <div className="hidden lg:flex items-center space-x-6 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-dope-orange-500">500+</div>
              <div className="text-xs text-gray-400">Products</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-dope-orange-500">50+</div>
              <div className="text-xs text-gray-400">Brands</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-dope-orange-500">FREE</div>
              <div className="text-xs text-gray-400">Shipping $50+</div>
            </div>
          </div>
        </div>

        {/* Compact Description */}
        <p className="text-sm text-gray-300 mt-2 max-w-2xl">
          💨 From desktop beasts to pocket rockets — bongs that hit different. Water filtration, massive rips, and glass art that belongs in museums (or your living room).
        </p>

        {/* Expandable Bong Info */}
        <div className="mt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center text-dope-orange-400 hover:text-dope-orange-300 font-medium transition-colors text-sm"
          >
            {isExpanded ? 'Hide bong details' : 'Learn why bongs hit different'}
            <svg
              className={`ml-2 h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Expandable Content */}
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-screen opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-3">🧊 Why Bongs Hit Different</h4>
              <p className="text-gray-300 text-sm mb-3">
                Bongs aren't just bigger pipes — they're a whole different smoking experience. While pipes give you quick hits and joints burn fast,
                bongs deliver massive, cool, filtered hits that let you savor every flavor molecule.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="bg-dope-orange-500/20 rounded-lg p-3 text-center">
                  <div className="text-xl mb-1">🌊</div>
                  <h6 className="font-semibold text-white text-xs">Water Filtration</h6>
                  <p className="text-xs text-gray-300">Removes tar & cools smoke</p>
                </div>
                <div className="bg-dope-orange-500/20 rounded-lg p-3 text-center">
                  <div className="text-xl mb-1">💨</div>
                  <h6 className="font-semibold text-white text-xs">Bigger Hits</h6>
                  <p className="text-xs text-gray-300">More capacity, less effort</p>
                </div>
                <div className="bg-dope-orange-500/20 rounded-lg p-3 text-center">
                  <div className="text-xl mb-1">🎨</div>
                  <h6 className="font-semibold text-white text-xs">Art Pieces</h6>
                  <p className="text-xs text-gray-300">Functional glass art</p>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-3">
                <h6 className="font-semibold text-white text-sm mb-2">🎯 Bong vs Pipe vs Joint</h6>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Pipes:</span>
                    <span className="text-dope-orange-400">Quick, portable, direct hits</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Joints:</span>
                    <span className="text-dope-orange-400">Social, burn fast, paper taste</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bongs:</span>
                    <span className="text-dope-orange-400">Massive, cool, filtered perfection</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Category Navigation */}
        <div className="flex flex-wrap gap-2 mt-6">
          <button
            onClick={() => setActiveCategory('all-bongs')}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,140,0,0.5)] ${
              activeCategory === 'all-bongs'
                ? 'bg-dope-orange-500 text-white shadow-[0_0_20px_rgba(255,140,0,0.6)]'
                : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 hover:border-dope-orange-400'
            }`}
          >
            All Bongs
          </button>
          <button
            onClick={() => setActiveCategory('beaker-bongs')}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,140,0,0.5)] ${
              activeCategory === 'beaker-bongs'
                ? 'bg-dope-orange-500 text-white shadow-[0_0_20px_rgba(255,140,0,0.6)]'
                : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 hover:border-dope-orange-400'
            }`}
          >
            Beaker Bongs
          </button>
          <button
            onClick={() => setActiveCategory('straight-tubes')}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,140,0,0.5)] ${
              activeCategory === 'straight-tubes'
                ? 'bg-dope-orange-500 text-white shadow-[0_0_20px_rgba(255,140,0,0.6)]'
                : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 hover:border-dope-orange-400'
            }`}
          >
            Straight Tubes
          </button>
          <button
            onClick={() => setActiveCategory('percolator-bongs')}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,140,0,0.5)] ${
              activeCategory === 'percolator-bongs'
                ? 'bg-dope-orange-500 text-white shadow-[0_0_20px_rgba(255,140,0,0.6)]'
                : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 hover:border-dope-orange-400'
            }`}
          >
            Percolator Bongs
          </button>
          <button
            onClick={() => setActiveCategory('mini-bongs')}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,140,0,0.5)] ${
              activeCategory === 'mini-bongs'
                ? 'bg-dope-orange-500 text-white shadow-[0_0_20px_rgba(255,140,0,0.6)]'
                : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 hover:border-dope-orange-400'
            }`}
          >
            Mini Bongs
          </button>
        </div>
      </div>

      {/* Subtle Orange Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-dope-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>
    </div>
  );
}
