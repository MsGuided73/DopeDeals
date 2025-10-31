'use client';
import { useState } from 'react';

export default function DabsntoolsHero() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all-dabsntools');

  // Smooth scroll to category sections
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 text-black overflow-hidden">
      {/* Compact Header Bar */}
      <div className="relative w-full max-w-none mx-0 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Title and Accent Line */}
            <div className="flex items-center space-x-4">
              <h1 className="font-chalets-legweb text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-wider text-gray-900 leading-tight font-bold">
                DAB RIGS & CONCENTRATE TOOLS
              </h1>
              <div className="hidden md:block w-16 h-1 bg-dope-orange-500"></div>
            </div>
          </div>

          {/* Quick Stats - Compact */}
          <div className="hidden lg:flex items-center space-x-8 text-base">
            <div className="text-center">
              <div className="text-xl font-bold text-dope-orange-500">150+</div>
              <div className="text-sm text-gray-700 font-medium">Products</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-dope-orange-500">12+</div>
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
          🧪 Complete your concentrate experience with precision glass rigs, innovative e-rigs, portable devices, and essential dabbing tools from top brands.
        </p>

        {/* Expandable Dab Rigs Info */}
        <div className="mt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center text-dope-orange-400 hover:text-dope-orange-300 font-medium transition-colors text-sm"
          >
            {isExpanded ? 'Hide concentration equipment details' : 'Why quality concentrate gear matters'}
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
              <h4 className="text-xl font-semibold text-black mb-4">🧪 Why Quality Concentrate Gear Matters</h4>
              <p className="text-gray-700 text-base mb-4 leading-relaxed">
                Premium concentrate equipment transforms your dabbing experience. From handcrafted glass perfection to cutting-edge electric innovation, the right tools preserve terpenes, provide consistent hits, and make every session exceptional.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-dope-orange-500/10 rounded-lg p-3 text-center border border-dope-orange-200">
                  <div className="text-2xl mb-2">💎</div>
                  <h6 className="font-semibold text-black text-xs mb-1">Terpene Preservation</h6>
                  <p className="text-[10px] text-gray-600">Maintain flavor integrity</p>
                </div>
                <div className="bg-dope-orange-500/10 rounded-lg p-3 text-center border border-dope-orange-200">
                  <div className="text-2xl mb-2">⚖️</div>
                  <h6 className="font-semibold text-black text-xs mb-1">Precision Control</h6>
                  <p className="text-[10px] text-gray-600">Perfect temperature & dosage</p>
                </div>
                <div className="bg-dope-orange-500/10 rounded-lg p-3 text-center border border-dope-orange-200">
                  <div className="text-2xl mb-2">🔬</div>
                  <h6 className="font-semibold text-black text-xs mb-1">Pure Experience</h6>
                  <p className="text-[10px] text-gray-600">Clean, efficient vapor</p>
                </div>
                <div className="bg-dope-orange-500/10 rounded-lg p-3 text-center border border-dope-orange-200">
                  <div className="text-2xl mb-2">🏆</div>
                  <h6 className="font-semibold text-black text-xs mb-1">Premium Quality</h6>
                  <p className="text-[10px] text-gray-600">Built to last</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h6 className="font-semibold text-black text-base mb-3">🎯 Choosing the Right Concentrate Equipment</h6>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-1">
                    <span className="font-medium text-gray-700">Glass Rigs:</span>
                    <span className="text-dope-orange-600 font-medium">Traditional perfection, pure experience</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-medium text-gray-700">E-Rigs:</span>
                    <span className="text-dope-orange-600 font-medium">Precision temperature, set-it-and-forget-it</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-medium text-gray-700">Portable:</span>
                    <span className="text-dope-orange-600 font-medium">Take your concentrates anywhere</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-medium text-gray-700">Tools:</span>
                    <span className="text-dope-orange-600 font-medium">Essential accessories for the perfect setup</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Category Navigation */}
        <div className="flex flex-wrap gap-3 mt-8">
          <button
            onClick={() => {
              setActiveCategory('all-dabsntools');
              scrollToSection('all-dabsntools-section');
            }}
            className={`px-6 py-3 text-base rounded-lg font-semibold transition-all duration-300 ${
              activeCategory === 'all-dabsntools'
                ? 'bg-dope-orange-500 text-white transform scale-105'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-300 hover:border-dope-orange-400'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => {
              setActiveCategory('glass-rigs');
              scrollToSection('glass-rigs-section');
            }}
            className={`px-6 py-3 text-base rounded-lg font-semibold transition-all duration-300 ${
              activeCategory === 'glass-rigs'
                ? 'bg-dope-orange-500 text-white transform scale-105'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-300 hover:border-dope-orange-400'
            }`}
          >
            Glass Rigs
          </button>
          <button
            onClick={() => {
              setActiveCategory('e-rigs');
              scrollToSection('e-rigs-section');
            }}
            className={`px-6 py-3 text-base rounded-lg font-semibold transition-all duration-300 ${
              activeCategory === 'e-rigs'
                ? 'bg-dope-orange-500 text-white transform scale-105'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-300 hover:border-dope-orange-400'
            }`}
          >
            E-Rigs
          </button>
          <button
            onClick={() => {
              setActiveCategory('portable-rigs');
              scrollToSection('portable-rigs-section');
            }}
            className={`px-6 py-3 text-base rounded-lg font-semibold transition-all duration-300 ${
              activeCategory === 'portable-rigs'
                ? 'bg-dope-orange-500 text-white transform scale-105'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-300 hover:border-dope-orange-400'
            }`}
          >
            Portable Rigs
          </button>
          <button
            onClick={() => {
              setActiveCategory('concentrate-tools');
              scrollToSection('concentrate-tools-section');
            }}
            className={`px-6 py-3 text-base rounded-lg font-semibold transition-all duration-300 ${
              activeCategory === 'concentrate-tools'
                ? 'bg-dope-orange-500 text-white transform scale-105'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-300 hover:border-dope-orange-400'
            }`}
          >
            Tools
          </button>
        </div>
      </div>

      {/* Subtle Orange Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-dope-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>
    </div>
  );
}</content>
