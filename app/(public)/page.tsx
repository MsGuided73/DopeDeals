"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User, ShoppingCart, Search } from 'lucide-react';
import CollectionsGrid from '../components/CollectionsGrid';
import NewProductsSection from '../components/NewProductsSection';
import BrandLogoScrollbar from '../../components/BrandLogoScrollbar';
import DopeDealsSection from '../components/DopeDealsSection';
import FeaturedProductsSection from '../components/FeaturedProductsSection';

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check age verification status
  useEffect(() => {
    const verified = localStorage.getItem('dope-city-age-verified');
    setIsAgeVerified(!!verified);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Age Verification Popup */}
      {/* <AgeVerification /> */}



      {/* Main Content */}
      <div>

        {/* Collections Grid */}
        <main className="w-full px-0 py-0">
          {/* Enhanced Metallic Section Divider - Adjusted spacing */}
          <div className="w-full -mt-0 mb-1">
            {/* Top metallic line - Reduced by 50% */}
            <div className="h-4 bg-gradient-to-r from-transparent via-white to-transparent mb-3 shadow-lg"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mb-4"></div>

            {/* Bottom metallic lines */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mb-2"></div>
            <div className="h-1 bg-gradient-to-r from-transparent via-white to-transparent shadow-lg"></div>
          </div>

          <CollectionsGrid />

          {/* Featured Products Section - Moved below Collections Grid */}
          <FeaturedProductsSection />

          {/* New Products Section */}
          <NewProductsSection />

          {/* Brand Logo Scrollbar */}
          <BrandLogoScrollbar />

          {/* Customer Reviews Section - Moved above footer */}
          <section className="mt-24 mb-16">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-chalets font-bold mb-4" style={{
                letterSpacing: '-0.02em',
                color: '#000000'
              }}>
                HIGH PRAISE
              </h1>
            </div>

            {/* Reviews Carousel - Enhanced Cards */}
            <div className="relative overflow-hidden px-4">
              <div className="flex animate-scroll-reviews">
                {/* Review 1 - Larger Cards */}
                <div className="flex-shrink-0 w-96 mx-6 bg-white rounded-2xl p-8 shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full mr-6 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                      <span className="text-2xl">🥦</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Mike J., CA</h4>
                      <div className="flex text-yellow-400 text-lg">
                        ★★★★★
                      </div>
                    </div>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    "Amazing quality! The glass is thick and the design is perfect. Fast shipping too. Will definitely order again!"
                  </p>
                </div>

                {/* Review 2 */}
                <div className="flex-shrink-0 w-96 mx-6 bg-white rounded-2xl p-8 shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full mr-6 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                      <span className="text-2xl">🌿</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Sarah C., TX</h4>
                      <div className="flex text-yellow-400 text-lg">
                        ★★★★★
                      </div>
                    </div>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    "Best smoke shop online! Great prices and the customer service is top notch. Highly recommend DOPE CITY!"
                  </p>
                </div>

                {/* Review 3 */}
                <div className="flex-shrink-0 w-96 mx-6 bg-white rounded-2xl p-8 shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full mr-6 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <span className="text-2xl">🫧</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Alex R., CO</h4>
                      <div className="flex text-yellow-400 text-lg">
                        ★★★★★
                      </div>
                    </div>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    "The vaporizer I bought works perfectly. Great build quality and arrived exactly as described. 5 stars!"
                  </p>
                </div>

                {/* Review 4 */}
                <div className="flex-shrink-0 w-96 mx-6 bg-white rounded-2xl p-8 shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full mr-6 bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                      <span className="text-2xl">💨</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Emma W., FL</h4>
                      <div className="flex text-yellow-400 text-lg">
                        ★★★★★
                      </div>
                    </div>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    "Love the selection and quality. The packaging was discreet and professional. Will be a repeat customer!"
                  </p>
                </div>

                {/* Review 5 */}
                <div className="flex-shrink-0 w-96 mx-6 bg-white rounded-2xl p-8 shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full mr-6 bg-gradient-to-br from-lime-400 to-emerald-600 flex items-center justify-center">
                      <span className="text-2xl">🌱</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">David K., NY</h4>
                      <div className="flex text-yellow-400 text-lg">
                        ★★★★★
                      </div>
                    </div>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    "Excellent products and fast delivery. The grinder I ordered is solid and works great. Highly recommended!"
                  </p>
                </div>

                {/* Review 6 */}
                <div className="flex-shrink-0 w-96 mx-6 bg-white rounded-2xl p-8 shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full mr-6 bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center">
                      <span className="text-2xl">🍀</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Jessica T., WA</h4>
                      <div className="flex text-yellow-400 text-lg">
                        ★★★★★
                      </div>
                    </div>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    "Perfect experience from start to finish. Quality products, fair prices, and excellent customer support!"
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Dope Deals Section - Moved to bottom */}
        <DopeDealsSection />
      </div>
    </div>
  );
}
