'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function ThcaFlowerHero() {
  return (
    <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950 py-12 md:py-20 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-900/10 blur-3xl rounded-full translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-emerald-900/10 blur-3xl rounded-full -translate-x-1/4 translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-emerald-950/50 text-emerald-400 border border-emerald-800/50 backdrop-blur-sm">
              🌿 Premium THCA Flower Collection
            </div>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white font-display-twilight leading-tight">
              Premium THCA Flower
              <span className="block text-emerald-400 mt-2">Hemp-Derived Wellness</span>
            </h1>

            <p className="text-lg text-gray-300 max-w-lg font-light tracking-wide">
              Discover our curated selection of high-quality THCA flower products. From 3.5g singles to 28g bundles,
              all lab-tested and compliant with federal hemp regulations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="#products"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-lg text-white bg-emerald-600 hover:bg-emerald-500 hover:scale-105 hover:shadow-lg hover:shadow-emerald-900/20 transition-all duration-300"
              >
                Shop THCA Flower
              </Link>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-6 pt-8 max-w-md">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-900/30 rounded-xl flex items-center justify-center border border-emerald-800/30">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-300">Lab Tested purity</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-900/30 rounded-xl flex items-center justify-center border border-emerald-800/30">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-300">Discreet Shipping</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-square relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/Collections%20Grid/Flower_hero_image.png"
                alt="Premium THCA Flower Collection"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
              <span className="text-2xl">🌿</span>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-dope-orange-500 text-white rounded-full p-3 shadow-lg">
              <span className="text-sm font-bold">THCA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
