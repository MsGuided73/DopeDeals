'use client';
import { useState } from 'react';

export default function PipesHero() {
  const [activeCategory, setActiveCategory] = useState('all-pipes');

  return (
    <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 text-black overflow-hidden shadow-lg">
      {/* Orange Pipe Graphic - Far Left Edge - Full Height */}
      <div className="absolute left-0 top-0 w-64 bg-dope-orange z-10" style={{ height: '140px' }}>
        <div className="flex items-center justify-center h-full">
          <img
            src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/icons/pipe%20icon.png"
            alt="Hand Pipes"
            className="w-20 h-20 object-contain"
          />
        </div>
      </div>

      {/* Compact Header Bar */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="font-chalets text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-wider text-black leading-tight font-bold">
              GLASS PIPES & HAND PIPES
            </h1>
            <div className="hidden md:block w-16 h-0.5 bg-dope-orange-500"></div>
          </div>

          {/* Quick Stats - Compact */}
          <div className="hidden lg:flex items-center space-x-8 text-base">
            <div className="text-center">
              <div className="text-xl font-bold text-dope-orange-500">300+</div>
              <div className="text-sm text-gray-600 font-medium">Products</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-dope-orange-500">25+</div>
              <div className="text-sm text-gray-600 font-medium">Brands</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-dope-orange-500">FREE</div>
              <div className="text-sm text-gray-600 font-medium">Shipping $75+</div>
            </div>
          </div>
        </div>

        {/* Enhanced Description */}
        <p className="text-lg md:text-xl text-gray-800 mt-4 max-w-4xl font-semibold leading-relaxed tracking-wide">
          Discover our curated collection of high-quality glass pipes, spoon pipes, chillums, and premium borosilicate pieces
        </p>

        {/* Enhanced Category Navigation */}
        <div className="flex flex-wrap gap-3 mt-8">
          <button
            onClick={() => setActiveCategory('all-pipes')}
            className={`px-6 py-3 text-base rounded-lg font-semibold transition-all duration-300 ${
              activeCategory === 'all-pipes'
                ? 'bg-dope-orange-500 text-white transform scale-105'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-300 hover:border-dope-orange-400 hover:text-dope-orange-600'
            }`}
          >
            All Pipes
          </button>
          <button
            onClick={() => setActiveCategory('spoon-pipes')}
            className={`px-6 py-3 text-base rounded-lg font-semibold transition-all duration-300 ${
              activeCategory === 'spoon-pipes'
                ? 'bg-dope-orange-500 text-black transform scale-105'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-300 hover:border-dope-orange-400 hover:text-dope-orange-600'
            }`}
          >
            Spoon Pipes
          </button>
          <button
            onClick={() => setActiveCategory('chillums')}
            className={`px-6 py-3 text-base rounded-lg font-semibold transition-all duration-300 ${
              activeCategory === 'chillums'
                ? 'bg-dope-orange-500 text-white transform scale-105'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-300 hover:border-dope-orange-400 hover:text-dope-orange-600'
            }`}
          >
            Chillums
          </button>
          <button
            onClick={() => setActiveCategory('sherlock-pipes')}
            className={`px-6 py-3 text-base rounded-lg font-semibold transition-all duration-300 ${
              activeCategory === 'sherlock-pipes'
                ? 'bg-dope-orange-500 text-white transform scale-105'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-300 hover:border-dope-orange-400 hover:text-dope-orange-600'
            }`}
          >
            Sherlock Pipes
          </button>
          <button
            onClick={() => setActiveCategory('one-hitters')}
            className={`px-6 py-3 text-base rounded-lg font-semibold transition-all duration-300 ${
              activeCategory === 'one-hitters'
                ? 'bg-dope-orange-500 text-white transform scale-105'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-300 hover:border-dope-orange-400 hover:text-dope-orange-600'
            }`}
          >
            One Hitters
          </button>
        </div>
      </div>

      {/* Subtle Orange Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-dope-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>
    </div>
  );
}
