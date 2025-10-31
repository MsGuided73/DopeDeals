'use client';

import { useState } from 'react';

export default function PipesHero() {
  const [activeCategory, setActiveCategory] = useState('all-pipes');

  return (
    <div className="bg-white text-black overflow-hidden min-h-[300px] md:min-h-[250px] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Header */}
          <div className="flex items-center space-x-4">
            <h1 className="font-chalets text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-wider text-black leading-tight font-bold">
              GLASS PIPES & HAND PIPES
            </h1>
          </div>

          {/* Right Column - Stats */}
          <div className="flex justify-center lg:justify-end">
            <div className="flex items-center space-x-8 text-base">
              <div className="text-center">
                <div className="text-xl font-bold text-dope-orange-500">300+</div>
                <div className="text-sm text-gray-600 font-medium">Products</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-dope-orange-500">40+</div>
                <div className="text-sm text-gray-600 font-medium">Brands</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-dope-orange-500">FREE</div>
                <div className="text-sm text-gray-600 font-medium">Shipping $50+</div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-base md:text-lg text-gray-700 mt-6 font-medium leading-relaxed max-w-3xl">
          Discover our curated collection of high-quality glass pipes, spoon pipes, chillums, and premium borosilicate pieces designed for flavor and functionality.
        </p>

        {/* Category Navigation */}
        <div className="flex flex-wrap gap-3 mt-6">
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
                ? 'bg-dope-orange-500 text-white transform scale-105'
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
    </div>
  );
}
