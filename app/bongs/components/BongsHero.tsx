'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function BongsHero() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all-bongs');

  return (
    <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 text-black overflow-hidden">
      {/* Compact Header Bar */}
      <div className="relative w-full max-w-none mx-0 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Title and Accent Line */}
            <div className="flex items-center space-x-4">
              <h1 className="font-chalets text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-wider text-gray-900 leading-tight font-bold">
                BONGS & WATER PIPES
              </h1>
              <div className="hidden md:block w-16 h-1 bg-dope-orange-500"></div>
            </div>
          </div>

          {/* Quick Stats - Compact */}
          <div className="hidden lg:flex items-center space-x-8 text-base">
            <div className="text-center">
              <div className="text-xl font-bold text-dope-orange-500">500+</div>
              <div className="text-sm text-gray-700 font-medium">Products</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-dope-orange-500">50+</div>
              <div className="text-sm text-gray-700 font-medium">Brands</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-dope-orange-500">FREE</div>
              <div className="text-sm text-gray-700 font-medium">Shipping $50+</div>
            </div>
          </div>
        </div>

        {/* Enhanced Description */}
        <p className="text-base md:text-lg text-gray-800 mt-3 max-w-3xl font-medium leading-relaxed">
          Enjoy next-level filtration with our premium bongs and bubblers. Designed for flavor and airflow, these glass pieces make every pull smoother than the last. Shop bongs and bubblers online for a cleaner, cooler smoke every time.
        </p>

        {/* Expandable Bong Info */}
        <div className="mt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center text-dope-orange-600 hover:text-dope-orange-300 font-medium transition-colors text-sm"
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
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 border border-gray-200 shadow-lg">
              <h4 className="text-xl font-semibold text-black mb-4">🧊 Why Bongs Hit Different</h4>
              <p className="text-gray-700 text-base mb-4 leading-relaxed">
                Bongs aren't just bigger pipes — they're a whole different smoking experience. While pipes give you quick hits and joints burn fast,
                bongs deliver massive, cool, filtered hits that let you savor every flavor molecule.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-dope-orange-500/10 rounded-lg p-4 text-center border border-dope-orange-200">
                  <div className="text-2xl mb-2">🌊</div>
                  <h6 className="font-semibold text-black text-sm mb-1">Water Filtration</h6>
                  <p className="text-xs text-gray-600">Removes tar & cools smoke</p>
                </div>
                <div className="bg-dope-orange-500/10 rounded-lg p-4 text-center border border-dope-orange-200">
                  <div className="text-2xl mb-2">💨</div>
                  <h6 className="font-semibold text-black text-sm mb-1">Bigger Hits</h6>
                  <p className="text-xs text-gray-600">More capacity, less effort</p>
                </div>
                <div className="bg-dope-orange-500/10 rounded-lg p-4 text-center border border-dope-orange-200">
                  <div className="text-2xl mb-2">🎨</div>
                  <h6 className="font-semibold text-black text-sm mb-1">Art Pieces</h6>
                  <p className="text-xs text-gray-600">Functional glass art</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h6 className="font-semibold text-black text-base mb-3">🎯 Bong vs Pipe vs Joint</h6>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-1">
                    <span className="font-medium text-gray-700">Pipes:</span>
                    <span className="text-dope-orange-600 font-medium">Quick, portable, direct hits</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-medium text-gray-700">Joints:</span>
                    <span className="text-dope-orange-600 font-medium">Social, burn fast, paper taste</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-medium text-gray-700">Bongs:</span>
                    <span className="text-dope-orange-600 font-medium">Massive, cool, filtered perfection</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Category Navigation */}
        <div className="flex flex-wrap gap-3 mt-8">
          <button
            onClick={() => setActiveCategory('all-bongs')}
            className={`px-6 py-3 text-base rounded-lg font-semibold transition-all duration-300 ${
              activeCategory === 'all-bongs'
                ? 'bg-dope-orange-600 text-white transform scale-105'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-300 hover:border-dope-orange-400'
            }`}
          >
            All Bongs
          </button>
          <button
            onClick={() => setActiveCategory('beaker-bongs')}
            className={`px-6 py-3 text-base rounded-lg font-semibold transition-all duration-300 ${
              activeCategory === 'beaker-bongs'
                ? 'bg-dope-orange-600 text-white transform scale-105'
                : 'bg-white hover:bg-white text-gray-800 border-2 border-gray-300 hover:border-dope-orange-400'
            }`}
          >
            Beaker Bongs
          </button>
          <button
            onClick={() => setActiveCategory('straight-tubes')}
            className={`px-6 py-3 text-base rounded-lg font-semibold transition-all duration-300 ${
              activeCategory === 'straight-tubes'
                ? 'bg-dope-orange-600 text-white transform scale-105'
                : 'bg-white hover:bg-white text-gray-800 border-2 border-gray-300 hover:border-dope-orange-400'
            }`}
          >
            Straight Tubes
          </button>
          <button
            onClick={() => setActiveCategory('percolator-bongs')}
            className={`px-6 py-3 text-base rounded-lg font-semibold transition-all duration-300 ${
              activeCategory === 'percolator-bongs'
                ? 'bg-dope-orange-600 text-white transform scale-105'
                : 'bg-white hover:bg-white text-gray-800 border-2 border-gray-300 hover:border-dope-orange-400'
            }`}
          >
            Percolator Bongs
          </button>
          <button
            onClick={() => setActiveCategory('mini-bongs')}
            className={`px-6 py-3 text-base rounded-lg font-semibold transition-all duration-300 ${
              activeCategory === 'mini-bongs'
                ? 'bg-dope-orange-500 text-white transform scale-105'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-300 hover:border-dope-orange-400'
            }`}
          >
            Mini Bongs
          </button>
        </div>
      </div>
    </div>
  );
}
