'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function ThcaFlowerHero() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              🌿 Premium THCA Flower Collection
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              Premium THCA Flower
              <span className="block text-dope-orange-500">Hemp-Derived Wellness</span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg">
              Discover our curated selection of high-quality THCA flower products. From 3.5g singles to 28g bundles,
              all lab-tested and compliant with federal hemp regulations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="#products"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-dope-orange-500 hover:bg-dope-orange-600 transition-colors"
              >
                Shop THCA Flower
              </Link>
              <Link
                href="/thca"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                View All THCA Products
              </Link>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Lab Tested</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Free Shipping</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-square relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/thca-flower/thca-flower-hero.jpg"
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
