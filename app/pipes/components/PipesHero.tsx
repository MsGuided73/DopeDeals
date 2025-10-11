'use client';
import { useState } from 'react';

export default function PipesHero() {
  const [activeCategory, setActiveCategory] = useState('all-pipes');

  return (
    <div className="relative bg-black text-white overflow-hidden">
      {/* Orange Pipe Graphic - Far Left Edge - Full Height */}
      <div className="absolute left-0 top-0 w-20 md:w-24 bg-dope-orange z-10" style={{ height: '140px' }}>
        <div className="flex items-center justify-center h-full">
          <img
            src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/page-graphics/titlebar-grphc_handpipes.png"
            alt="Hand Pipes"
            className="w-12 h-12 md:w-16 md:h-16 object-contain"
          />
        </div>
      </div>

      {/* Compact Header Bar */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="font-chalets text-4xl md:text-5xl lg:text-6xl tracking-wider text-white leading-tight">
              GLASS PIPES & HAND PIPES
            </h1>
            <div className="hidden md:block w-16 h-0.5 bg-dope-orange-500"></div>
          </div>

          {/* Quick Stats - Compact */}
          <div className="hidden lg:flex items-center space-x-6 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-dope-orange-500">300+</div>
              <div className="text-xs text-gray-400">Products</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-dope-orange-500">25+</div>
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
          Discover our curated collection of high-quality glass pipes, spoon pipes, chillums, and premium borosilicate pieces
        </p>

        {/* Enhanced Category Navigation */}
        <div className="flex flex-wrap gap-2 mt-6">
          <button
            onClick={() => setActiveCategory('all-pipes')}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,140,0,0.5)] ${
              activeCategory === 'all-pipes'
                ? 'bg-dope-orange-500 text-white shadow-[0_0_20px_rgba(255,140,0,0.6)]'
                : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 hover:border-dope-orange-400'
            }`}
          >
            All Pipes
          </button>
          <button
            onClick={() => setActiveCategory('spoon-pipes')}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,140,0,0.5)] ${
              activeCategory === 'spoon-pipes'
                ? 'bg-dope-orange-500 text-white shadow-[0_0_20px_rgba(255,140,0,0.6)]'
                : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 hover:border-dope-orange-400'
            }`}
          >
            Spoon Pipes
          </button>
          <button
            onClick={() => setActiveCategory('chillums')}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,140,0,0.5)] ${
              activeCategory === 'chillums'
                ? 'bg-dope-orange-500 text-white shadow-[0_0_20px_rgba(255,140,0,0.6)]'
                : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 hover:border-dope-orange-400'
            }`}
          >
            Chillums
          </button>
          <button
            onClick={() => setActiveCategory('sherlock-pipes')}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,140,0,0.5)] ${
              activeCategory === 'sherlock-pipes'
                ? 'bg-dope-orange-500 text-white shadow-[0_0_20px_rgba(255,140,0,0.6)]'
                : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 hover:border-dope-orange-400'
            }`}
          >
            Sherlock Pipes
          </button>
          <button
            onClick={() => setActiveCategory('one-hitters')}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,140,0,0.5)] ${
              activeCategory === 'one-hitters'
                ? 'bg-dope-orange-500 text-white shadow-[0_0_20px_rgba(255,140,0,0.6)]'
                : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 hover:border-dope-orange-400'
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
