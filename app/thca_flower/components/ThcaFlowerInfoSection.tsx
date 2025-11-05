'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ThcaFlowerInfoSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-dope-orange-500 transition-colors">
                Online Headshop
              </Link>
              <span className="mx-2">›</span>
              <Link href="/thca" className="hover:text-dope-orange-500 transition-colors">
                THCA & More
              </Link>
              <span className="mx-2">›</span>
              <span className="text-gray-900">THCA Flower</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              🌿 THCA Flower — Nature's Finest
            </h1>

            {/* Initial Description */}
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                Experience the purest form of hemp-derived wellness with our premium THCA flower collection.
                From single grams to bulk bundles, each product is lab-tested, compliant, and crafted for exceptional quality.
              </p>
            </div>

            {/* Expandable Content */}
            <div className="mt-8">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center text-dope-orange-500 hover:text-dope-orange-600 font-medium transition-colors text-lg"
              >
                {isExpanded ? 'Show less about THCA flower' : 'Learn everything about THCA flower'}
                <svg
                  className={`ml-2 h-5 w-5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Expandable Content */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-screen opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-8 text-gray-700">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">🌱 What is THCA Flower?</h2>
                    <p className="text-lg">
                      THCA (Tetrahydrocannabinolic Acid) is the raw, non-psychoactive precursor to THC found naturally in hemp plants.
                      Our THCA flower contains less than 0.3% Delta-9 THC, making it federally legal and perfect for wellness-focused consumers.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">🔬 Lab Tested & Compliant</h2>
                    <p className="text-lg mb-4">
                      Every batch of our THCA flower undergoes rigorous third-party lab testing to ensure:
                    </p>
                    <div className="bg-green-50 rounded-lg p-6 mb-4">
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          THCA content verification
                        </li>
                        <li className="flex items-center">
                          <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          < 0.3% Delta-9 THC compliance
                        </li>
                        <li className="flex items-center">
                          <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Heavy metals & contaminants testing
                        </li>
                        <li className="flex items-center">
                          <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Microbial safety screening
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">📏 Size Options</h2>
                    <p className="text-lg mb-4">
                      Choose the perfect amount for your needs:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <strong>3.5g Singles</strong> – Perfect for trying new strains or occasional use.
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <strong>7g Half Ounces</strong> – Great value for regular consumers.
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <strong>14g Quarter Pounds</strong> – Bulk savings for dedicated users.
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <strong>28g Half Pounds</strong> – Maximum value for heavy users.
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 THCA Pre-Rolls</h2>
                    <p className="text-lg mb-4">
                      Experience convenience with our infused THCA prerolls:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <strong>Single Prerolls</strong> – Perfect for on-the-go wellness.
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <strong>5-Packs</strong> – Share with friends or stock up.
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <strong>10-Packs</strong> – Bulk convenience at great prices.
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <strong>Infused Options</strong> – Enhanced with natural terpenes.
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">💨 How to Use THCA Flower</h2>
                    <p className="text-lg mb-4">
                      THCA flower can be enjoyed in various ways:
                    </p>
                    <div className="bg-blue-50 rounded-lg p-6 mb-4">
                      <div className="space-y-3 text-sm">
                        <div><strong>Smoking:</strong> Use with pipes, bongs, or joints for immediate effects</div>
                        <div><strong>Vaporizing:</strong> Low-temperature vaping preserves THCA content</div>
                        <div><strong>Topicals:</strong> Can be infused into oils for external use</div>
                        <div><strong>Edibles:</strong> Decarboxylate first for internal consumption</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">🛒 Recommended Accessories</h2>
                    <p className="text-lg mb-4">
                      Enhance your THCA flower experience with these accessories:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <Link href="/pipes" className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                        <strong>Glass Pipes</strong> – Premium smoking accessories for the best experience.
                      </Link>
                      <Link href="/bongs" className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                        <strong>Bongs & Water Pipes</strong> – Smooth, filtered hits every time.
                      </Link>
                      <Link href="/dabsntools" className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                        <strong>Vaporizers</strong> – Temperature-controlled for optimal THCA preservation.
                      </Link>
                      <Link href="/accessories" className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                        <strong>Grinders & Storage</strong> – Keep your flower fresh and ready.
                      </Link>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">📦 Shipping & Returns</h2>
                    <p className="text-lg">
                      Free shipping on orders over $50. Discreet packaging and fast delivery.
                      30-day return policy on all THCA flower products.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Quick Links */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                THCA Flower Options
                <svg className="ml-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </h3>

              <ul className="space-y-3">
                <li>
                  <Link
                    href="#sizes"
                    className="text-gray-600 hover:text-dope-orange-500 transition-colors"
                  >
                    Flower Sizes (3.5g - 28g)
                  </Link>
                </li>
                <li>
                  <Link
                    href="#prerolls"
                    className="text-gray-600 hover:text-dope-orange-500 transition-colors"
                  >
                    THCA Pre-Rolls
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pipes"
                    className="text-gray-600 hover:text-dope-orange-500 transition-colors"
                  >
                    Recommended Pipes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/bongs"
                    className="text-gray-600 hover:text-dope-orange-500 transition-colors"
                  >
                    Recommended Bongs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dabsntools"
                    className="text-gray-600 hover:text-dope-orange-500 transition-colors"
                  >
                    Vaporizers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/accessories"
                    className="text-gray-600 hover:text-dope-orange-500 transition-colors"
                  >
                    Storage & Accessories
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
