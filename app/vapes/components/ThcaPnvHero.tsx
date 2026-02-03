'use client';

import { useState } from 'react';

export default function ThcaPnvHero() {
  const [activeCategory, setActiveCategory] = useState('all-thca');

  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 text-black overflow-hidden min-h-[300px] md:min-h-[250px] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-1 gap-8 items-center">
          {/* Header */}
          <div className="flex items-center justify-center lg:justify-start space-x-4">
            <h1 className="font-display-twilight text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-wider text-black leading-tight font-bold">
              THCA VAPES & CONCENTRATES
            </h1>
          </div>
        </div>

        {/* Description */}
        <p className="text-base md:text-lg text-gray-700 mt-6 font-medium leading-relaxed max-w-3xl">
          Discover premium THCA vaporizer products. From high-quality cartridges and concentrates to disposable vapes, enjoy pure, potent effects in convenient, discreet formats.
        </p>

        {/* Category Navigation */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={() => setActiveCategory('all-thca')}
            className={`px-6 py-3 text-base rounded-lg font-semibold transition-all duration-300 ${
              activeCategory === 'all-thca'
                ? 'bg-green-600 text-white transform scale-105'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-300 hover:border-green-400 hover:text-green-600'
            }`}
          >
            All THCA Products
          </button>
          <button
            onClick={() => setActiveCategory('cartridges')}
            className={`px-6 py-3 text-base rounded-lg font-semibold transition-all duration-300 ${
              activeCategory === 'cartridges'
                ? 'bg-green-600 text-white transform scale-105'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-300 hover:border-green-400 hover:text-green-600'
            }`}
          >
            THCA Cartridges
          </button>
          <button
            onClick={() => setActiveCategory('disposables')}
            className={`px-6 py-3 text-base rounded-lg font-semibold transition-all duration-300 ${
              activeCategory === 'disposables'
                ? 'bg-green-600 text-white transform scale-105'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-300 hover:border-green-400 hover:text-green-600'
            }`}
          >
            Disposable Vapes
          </button>
        </div>
      </div>
    </div>
  );
}
