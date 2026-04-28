'use client';
import Image from 'next/image';
import { useState } from 'react';

interface BongsHeroProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export default function BongsHero({ activeCategory, setActiveCategory }: BongsHeroProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#f9faf9] w-full border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* Hero Content Section */}
        <div className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center min-h-[400px]">
          
          {/* Left Column - Text */}
          <div className="w-full md:w-1/2 z-10 relative">
            <h1 className="font-chalets text-[3.5rem] leading-[0.9] md:text-[5rem] lg:text-[6rem] text-[#1a1a1a] font-bold uppercase tracking-tight mb-4">
              BONGS & <br /> WATER PIPES
            </h1>
            
            <h2 className="text-[#2d8f47] text-2xl md:text-3xl font-bold mb-3">
              Cleaner Hits. Smoother Pulls.
            </h2>
            
            <p className="text-gray-700 text-lg max-w-lg mb-8 leading-relaxed font-medium">
              Premium glass designed for better airflow, cooler smoke, and a smoother experience every time.
            </p>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center px-5 py-3 border-2 border-[#2d8f47] text-[#2d8f47] bg-white rounded font-semibold hover:bg-green-50 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Learn How Bongs Improve Your Sessions
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            
            {/* Expandable Content */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out absolute top-full left-0 w-full z-20 ${isExpanded ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-xl">
                <h4 className="text-xl font-semibold text-black mb-4">🧊 Why Bongs Hit Different</h4>
                <p className="text-gray-700 text-base mb-4 leading-relaxed">
                  Bongs aren't just bigger pipes — they're a whole different smoking experience. While pipes give you quick hits and joints burn fast,
                  bongs deliver massive, cool, filtered hits that let you savor every flavor molecule.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
                    <div className="text-2xl mb-2">🌊</div>
                    <h6 className="font-semibold text-black text-sm mb-1">Water Filtration</h6>
                    <p className="text-xs text-gray-600">Removes tar & cools smoke</p>
                  </div>
                  <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
                    <div className="text-2xl mb-2">💨</div>
                    <h6 className="font-semibold text-black text-sm mb-1">Bigger Hits</h6>
                    <p className="text-xs text-gray-600">More capacity, less effort</p>
                  </div>
                  <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
                    <div className="text-2xl mb-2">🎨</div>
                    <h6 className="font-semibold text-black text-sm mb-1">Art Pieces</h6>
                    <p className="text-xs text-gray-600">Functional glass art</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Illustration & Stats Box */}
          <div className="w-full md:w-1/2 absolute right-0 top-0 h-full flex flex-col justify-end hidden md:flex pointer-events-none">
            {/* Mountain Illustration Background */}
            <div className="absolute inset-0 bg-no-repeat bg-right-top bg-contain opacity-60" style={{ backgroundImage: "url('/images/mountain-landscape.png')", mixBlendMode: 'multiply' }}></div>
            
            {/* Stats Box - Positioned over the illustration */}
            <div className="absolute bottom-[-1.5rem] right-4 lg:right-8 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] py-5 px-8 flex items-center justify-between gap-8 border border-gray-100 w-[90%] lg:w-auto pointer-events-auto z-20">
              <div className="flex items-center gap-4">
                <div className="text-[#2d8f47]">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold text-[#1a1a1a]">500+</div>
                  <div className="text-sm text-gray-500 font-medium whitespace-nowrap">Premium Pieces</div>
                </div>
              </div>
              
              <div className="w-px h-12 bg-gray-200"></div>
              
              <div className="flex items-center gap-4">
                <div className="text-[#2d8f47]">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold text-[#1a1a1a]">50+</div>
                  <div className="text-sm text-gray-500 font-medium whitespace-nowrap">Trusted Brands</div>
                </div>
              </div>
              
              <div className="w-px h-12 bg-gray-200"></div>
              
              <div className="flex items-center gap-4">
                <div className="text-[#2d8f47]">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-lg font-bold text-[#1a1a1a]">Fast & Discreet</div>
                  <div className="text-sm text-gray-500 font-medium whitespace-nowrap">Shipping $50+</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 bg-white relative z-10 border-t border-gray-100 pt-10">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveCategory('all-bongs')}
              className={`px-5 py-2.5 text-sm md:text-base rounded-lg font-bold transition-all duration-200 ${
                activeCategory === 'all-bongs'
                  ? 'bg-[#1c352d] text-white shadow-md'
                  : 'bg-white text-gray-800 border border-gray-200 hover:border-[#1c352d] hover:text-[#1c352d]'
              }`}
            >
              All Bongs
            </button>
            <button
              onClick={() => setActiveCategory('beaker-bongs')}
              className={`px-5 py-2.5 text-sm md:text-base rounded-lg font-bold transition-all duration-200 ${
                activeCategory === 'beaker-bongs'
                  ? 'bg-[#1c352d] text-white shadow-md'
                  : 'bg-white text-gray-800 border border-gray-200 hover:border-[#1c352d] hover:text-[#1c352d]'
              }`}
            >
              Beaker Bongs
            </button>
            <button
              onClick={() => setActiveCategory('straight-tubes')}
              className={`px-5 py-2.5 text-sm md:text-base rounded-lg font-bold transition-all duration-200 ${
                activeCategory === 'straight-tubes'
                  ? 'bg-[#1c352d] text-white shadow-md'
                  : 'bg-white text-gray-800 border border-gray-200 hover:border-[#1c352d] hover:text-[#1c352d]'
              }`}
            >
              Straight Tubes
            </button>
            <button
              onClick={() => setActiveCategory('percolator-bongs')}
              className={`px-5 py-2.5 text-sm md:text-base rounded-lg font-bold transition-all duration-200 ${
                activeCategory === 'percolator-bongs'
                  ? 'bg-[#1c352d] text-white shadow-md'
                  : 'bg-white text-gray-800 border border-gray-200 hover:border-[#1c352d] hover:text-[#1c352d]'
              }`}
            >
              Percolator Bongs
            </button>
            <button
              onClick={() => setActiveCategory('mini-bongs')}
              className={`px-5 py-2.5 text-sm md:text-base rounded-lg font-bold transition-all duration-200 ${
                activeCategory === 'mini-bongs'
                  ? 'bg-[#1c352d] text-white shadow-md'
                  : 'bg-white text-gray-800 border border-gray-200 hover:border-[#1c352d] hover:text-[#1c352d]'
              }`}
            >
              Mini Bongs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
