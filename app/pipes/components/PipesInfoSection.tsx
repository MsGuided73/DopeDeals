'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function PipesInfoSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="bg-white dark:bg-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
              <Link href="/" className="hover:text-dope-orange-500 transition-colors">
                Online Headshop
              </Link>
              <span className="mx-2">›</span>
              <span className="text-gray-900 dark:text-white">Hand Pipes</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              HAND PIPES
            </h1>

            {/* Description */}
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                Looking for a new hobby? An introspective one, a hobby that leads to higher thinking? Well, you've hit the 
                jackpot! At DankGeek, we know that whether you're a seasoned pro or a budding bud enthusiast, finding a 
                hand pipe fit for you can really make a difference. With vibrant designs that provide smooth hits, our 
                collection has something for everyone.
              </p>
              
              <p className="text-gray-500 dark:text-gray-400">
                At Dank Geek, we've carefully curated the perfect selection of hand pipes to satisfy any and all your 
                smoking needs. So go ahead, explore our repertoire of pipes, and get ready to find your new perfect 
                piece.
              </p>
            </div>

            {/* Intro to Hand Pipes Section */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-200 dark:text-gray-600 mb-4">
                INTRO TO HAND PIPES?
              </h2>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {/* This space can be used for additional content if needed */}
                </div>

                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="inline-flex items-center text-dope-orange-500 hover:text-dope-orange-600 font-medium transition-colors"
                >
                  {isExpanded ? 'Show less' : 'Learn more about Hand Pipes'}
                  <svg
                    className={`ml-2 h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Expandable Content */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-screen opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    What Are Hand Pipes?
                  </h3>

                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Hand pipes, also known as spoon pipes or bowl pipes, are one of the most popular and convenient smoking devices available.
                    These compact, portable pieces are designed for dry herb consumption and offer a simple, effective way to enjoy your favorite materials.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Types of Hand Pipes
                  </h4>

                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                    <li><strong>Spoon Pipes:</strong> The most common type, featuring a bowl, stem, and mouthpiece in a spoon-like shape</li>
                    <li><strong>Chillums:</strong> Straight, tube-like pipes that are simple and discreet</li>
                    <li><strong>Sherlock Pipes:</strong> Curved pipes reminiscent of the famous detective's pipe</li>
                    <li><strong>One Hitters:</strong> Small, discrete pipes designed for single hits</li>
                    <li><strong>Steamrollers:</strong> Straight pipes with carb holes at the end for powerful hits</li>
                  </ul>

                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Materials & Construction
                  </h4>

                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Our hand pipes are crafted from various high-quality materials:
                  </p>

                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                    <li><strong>Borosilicate Glass:</strong> Heat-resistant, durable, and provides pure flavor</li>
                    <li><strong>Wood:</strong> Natural, traditional option with unique grain patterns</li>
                    <li><strong>Metal:</strong> Extremely durable and portable, perfect for travel</li>
                    <li><strong>Silicone:</strong> Flexible, unbreakable, and easy to clean</li>
                    <li><strong>Stone:</strong> Unique, natural materials with excellent heat retention</li>
                  </ul>

                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    How to Use a Hand Pipe
                  </h4>

                  <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                    <li>Grind your dry herb to a medium consistency</li>
                    <li>Pack the bowl loosely, avoiding over-packing</li>
                    <li>Cover the carb hole (if present) with your finger</li>
                    <li>Light the material while inhaling gently</li>
                    <li>Release the carb hole to clear the chamber</li>
                    <li>Clean regularly for optimal performance</li>
                  </ol>

                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Care & Maintenance
                  </h4>

                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Proper maintenance ensures your hand pipe provides the best experience:
                  </p>

                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                    <li>Clean after every few uses with isopropyl alcohol and salt</li>
                    <li>Use pipe cleaners for hard-to-reach areas</li>
                    <li>Store in a safe place to prevent damage</li>
                    <li>Replace screens regularly if your pipe uses them</li>
                  </ul>

                  <p className="text-gray-700 dark:text-gray-300">
                    Whether you're a beginner or experienced enthusiast, our collection of hand pipes offers something for everyone.
                    From artistic glass pieces to practical everyday pipes, find the perfect addition to your collection.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                HAND PIPES CATEGORIES
                <svg className="ml-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </h3>
              
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/pipes?category=dab-straws" 
                    className="text-gray-600 dark:text-gray-300 hover:text-dope-orange-500 transition-colors"
                  >
                    Dab Straws
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/pipes?category=glass-pipes" 
                    className="text-gray-600 dark:text-gray-300 hover:text-dope-orange-500 transition-colors"
                  >
                    Glass Pipes
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/pipes?category=metal-pipes" 
                    className="text-gray-600 dark:text-gray-300 hover:text-dope-orange-500 transition-colors"
                  >
                    Metal Pipes
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/pipes?category=wood-pipes" 
                    className="text-gray-600 dark:text-gray-300 hover:text-dope-orange-500 transition-colors"
                  >
                    Wood Pipes
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/pipes?category=silicone-pipes" 
                    className="text-gray-600 dark:text-gray-300 hover:text-dope-orange-500 transition-colors"
                  >
                    Silicone Pipes
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/pipes?category=stone-pipes" 
                    className="text-gray-600 dark:text-gray-300 hover:text-dope-orange-500 transition-colors"
                  >
                    Stone Pipes
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
