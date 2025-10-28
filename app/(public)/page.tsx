"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User, ShoppingCart, Search } from 'lucide-react';
import GlobalMasthead from '../components/GlobalMasthead';
import CollectionsGrid from '../components/CollectionsGrid';
import NewProductsSection from '../components/NewProductsSection';
import BrandLogoScrollbar from '../../components/BrandLogoScrollbar';

import StaffPicksSection from '../components/StaffPicksSection';
import FullscreenCarousel from '../components/FullscreenCarousel';
import FeaturedProductsSection from '../components/FeaturedProductsSection';
import RecentlyViewedProducts from '../components/RecentlyViewedProducts';

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

      {/* Global Masthead - Always at the top */}
      <GlobalMasthead />

      {/* Main Content */}
      <div>


        {/* VIP Membership Hero Section */}
        <div className="w-full px-6 pt-1 pb-1">
          <Link
            href="/rewards"
            className="relative block w-full h-128 bg-cover bg-center rounded-xl overflow-hidden group"
            style={{
              backgroundImage: "url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/rewards/slider1.png')",
              backgroundSize: "cover",
              backgroundPosition: "bottom"
            }}
          >
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent group-hover:from-black/80 group-hover:via-black/50 transition-all duration-300"></div>

            {/* VIP Content */}
            <div className="absolute left-8 top-1/2 transform -translate-y-1/2 text-white max-w-lg">
              <h2 className="font-chalets tracking-wider leading-none mb-8" style={{
                fontFamily: "'Chalets', 'Inter', system-ui, sans-serif",
                fontWeight: 'normal',
                letterSpacing: '0.02em',
                fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                lineHeight: '0.9',
                textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 16px rgba(0, 0, 0, 0.6)'
              }}>
                VIP REWARDS
              </h2>

              {/* Benefits List - Highway 420 Brand Voice */}
              <ul className="space-y-3 text-lg font-medium mb-8">
                <li className="flex items-center" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)' }}>
                  <span className="mr-3" style={{ color: '#2d8f47' }}>•</span>
                  Extra Scenic Route Savings
                </li>
                <li className="flex items-center" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)' }}>
                  <span className="mr-3" style={{ color: '#2d8f47' }}>•</span>
                  Best Fuel Economy Guaranteed
                </li>
                <li className="flex items-center" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)' }}>
                  <span className="mr-3" style={{ color: '#2d8f47' }}>•</span>
                  Exclusive Roadside Attractions
                </li>
                <li className="flex items-center" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)' }}>
                  <span className="mr-3" style={{ color: '#2d8f47' }}>•</span>
                  Free Test Drive Products
                </li>
                <li className="flex items-center" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)' }}>
                  <span className="mr-3" style={{ color: '#2d8f47' }}>•</span>
                  VIP Fast Lane Program
                </li>
                <li className="flex items-center" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)' }}>
                  <span className="mr-3" style={{ color: '#2d8f47' }}>•</span>
                  Members-Only Pit Stops
                </li>
              </ul>

              {/* CTA Button */}
              <button className="px-8 py-3 text-green-600 border-2 border-green-600 font-bold uppercase tracking-wide rounded-lg transition-all duration-300 hover:bg-green-600 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-green-600/25">
                TAKE THE FAST LANE
              </button>
            </div>
          </Link>
        </div>

      {/* Featured Products Section - Moved before Collections Grid */}
      <FeaturedProductsSection />

      {/* Collections Grid */}
      <main className="w-full px-0 py-0">
        {/* Enhanced Metallic Section Divider */}
        <div className="w-full -mt-0 mb-0">
          {/* Top metallic line - Increased size by 9x (from h-1 to h-9) */}
          <div className="h-9 bg-gradient-to-r from-transparent via-white to-transparent mb-8 shadow-lg"></div>
          <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mb-12"></div>

          {/* Collections Header - Clean Metallic Frame */}
          <div className="text-center mb-6 px-4 md:px-8">
            <div className="relative inline-block">
              {/* Title */}
              <h2 className="text-4xl md:text-7xl text-black font-chalets uppercase" style={{
                fontFamily: "'Chalets', 'Inter', system-ui, sans-serif",
                letterSpacing: '0.02em',
                fontWeight: 'normal',
                background: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 25%, #2a2a2a 50%, #4a4a4a 75%, #1a1a1a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none'
              }}>
                SHOP OUR COLLECTIONS
              </h2>
            </div>
          </div>

          {/* Bottom metallic lines */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mb-8"></div>
          <div className="h-1 bg-gradient-to-r from-transparent via-white to-transparent shadow-lg"></div>
        </div>

        <CollectionsGrid />

        {/* New Products Section */}
        <NewProductsSection />

        {/* Brand Logo Scrollbar */}
        <BrandLogoScrollbar />

        {/* Customer Reviews Section - Moved above footer */}
        <section className="mt-24 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-chalets text-gray-900 mb-4" style={{ letterSpacing: '-0.02em' }}>
              TRAVELER REVIEWS
            </h2>
            <p className="text-xl text-gray-600">
              Real reviews from fellow travelers on the Highway 420 journey
            </p>
          </div>

          {/* Reviews Carousel - Enhanced Cards */}
          <div className="relative overflow-hidden px-4">
            <div className="flex animate-scroll-reviews">
              {/* Review 1 - Larger Cards */}
              <div className="flex-shrink-0 w-96 mx-6 bg-white rounded-2xl p-8 shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
                    alt="Customer"
                    className="w-16 h-16 rounded-full mr-6"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Mike J.</h4>
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
                  <img
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face"
                    alt="Customer"
                    className="w-16 h-16 rounded-full mr-6"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Sarah C.</h4>
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
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
                    alt="Customer"
                    className="w-16 h-16 rounded-full mr-6"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Alex R.</h4>
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
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
                    alt="Customer"
                    className="w-16 h-16 rounded-full mr-6"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Emma W.</h4>
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
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face"
                    alt="Customer"
                    className="w-16 h-16 rounded-full mr-6"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">David K.</h4>
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
                  <img
                    src="https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=80&h=80&fit=crop&crop=face"
                    alt="Customer"
                    className="w-16 h-16 rounded-full mr-6"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Jessica T.</h4>
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

        {/* Recently Viewed Products - Just above footer */}
        <RecentlyViewedProducts />

      </main>
      </div>
    </div>
  );
}
