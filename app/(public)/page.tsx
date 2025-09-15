"use client";
import { useEffect, useState } from "react";
import { User, ShoppingCart, Search } from 'lucide-react';

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Timer for Staff Picks - resets daily at midnight
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const difference = tomorrow.getTime() - now.getTime();

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('nav')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Masthead Section */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out ${
          scrolled ? "shadow-lg" : "shadow-none"
        }`}
      >
        {/* Black top bar */}
        <div className="bg-black text-white px-6 flex items-center justify-between" style={{ minHeight: '120px', height: '120px' }}>
          <div
            className="font-chalets tracking-normal leading-none text-white"
            style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              lineHeight: '1',
              height: 'calc(100% - 4px)',
              display: 'flex',
              alignItems: 'center',
              letterSpacing: '0.02em'
            }}
          >
            DOPE CITY
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search For Dope Things"
                className="px-4 py-2 pl-10 rounded-md text-black dark:text-white dark:bg-gray-800 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <button className="p-2 hover:text-yellow-400 transition-colors">
              <User className="w-6 h-6" />
            </button>
            <button className="p-2 hover:text-yellow-400 transition-colors relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>

        {/* Fire gradient divider */}
        <div className="h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"></div>

        {/* Glassmorphic nav bar */}
        <nav
          className={`backdrop-blur-lg transition-all duration-300 ease-in-out ${
            scrolled
              ? "bg-white/30 dark:bg-gray-900/30 shadow-lg"
              : "bg-white/20 dark:bg-gray-900/20 shadow-sm"
          }`}
        >
          <ul className="flex items-center justify-center gap-6 py-3 flex-wrap relative">
            {/* Shop by Brand Dropdown */}
            <li className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'brands' ? null : 'brands')}
                className="text-black dark:text-white font-medium hover:text-yellow-500 transition-colors flex items-center gap-1"
              >
                Shop by Brand
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === 'brands' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 z-50">
                  <div className="py-2">
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-yellow-400/20 transition-colors">RAW</a>
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-yellow-400/20 transition-colors">Puffco</a>
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-yellow-400/20 transition-colors">Storz & Bickel</a>
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-yellow-400/20 transition-colors">ROOR</a>
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-yellow-400/20 transition-colors">View All Brands</a>
                  </div>
                </div>
              )}
            </li>

            {/* THCA & More Dropdown */}
            <li className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'thca' ? null : 'thca')}
                className="text-black dark:text-white font-medium hover:text-yellow-500 transition-colors flex items-center gap-1"
              >
                THCA &amp; More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === 'thca' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 z-50">
                  <div className="py-2">
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-yellow-400/20 transition-colors">THCA Flower</a>
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-yellow-400/20 transition-colors">Pre-Rolls</a>
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-yellow-400/20 transition-colors">Concentrates</a>
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-yellow-400/20 transition-colors">Edibles</a>
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-yellow-400/20 transition-colors">CBD Products</a>
                  </div>
                </div>
              )}
            </li>

            {/* Bongs Dropdown */}
            <li className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'bongs' ? null : 'bongs')}
                className="text-black dark:text-white font-medium hover:text-yellow-500 transition-colors flex items-center gap-1"
              >
                Bongs
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === 'bongs' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 z-50">
                  <div className="py-2">
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-yellow-400/20 transition-colors">Glass Bongs</a>
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-yellow-400/20 transition-colors">Beaker Bongs</a>
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-yellow-400/20 transition-colors">Straight Tube</a>
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-yellow-400/20 transition-colors">Percolator Bongs</a>
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-yellow-400/20 transition-colors">Mini Bongs</a>
                  </div>
                </div>
              )}
            </li>

            {/* Pipes Dropdown */}
            <li className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'pipes' ? null : 'pipes')}
                className="text-black dark:text-white font-medium hover:text-yellow-500 transition-colors flex items-center gap-1"
              >
                Pipes
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === 'pipes' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 z-50">
                  <div className="py-2">
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-yellow-400/20 transition-colors">Glass Pipes</a>
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-yellow-400/20 transition-colors">Spoon Pipes</a>
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-yellow-400/20 transition-colors">Sherlock Pipes</a>
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-yellow-400/20 transition-colors">Chillums</a>
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-yellow-400/20 transition-colors">One Hitters</a>
                  </div>
                </div>
              )}
            </li>

            {/* Dab Rigs */}
            <li>
              <a
                href="#"
                className="text-black dark:text-white font-medium hover:text-yellow-500 transition-colors"
              >
                Dab Rigs
              </a>
            </li>

            {/* Vaporizers */}
            <li>
              <a
                href="#"
                className="text-black dark:text-white font-medium hover:text-yellow-500 transition-colors"
              >
                Vaporizers
              </a>
            </li>

            {/* Accessories */}
            <li>
              <a
                href="#"
                className="text-black dark:text-white font-medium hover:text-yellow-500 transition-colors"
              >
                Accessories
              </a>
            </li>

            {/* Munchies */}
            <li>
              <a
                href="#"
                className="text-black dark:text-white font-medium hover:text-yellow-500 transition-colors"
              >
                Munchies
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Collections Grid */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Row 1 */}
          <a
            href="#"
            className="relative row-span-2 h-[500px] bg-cover bg-center rounded-xl overflow-hidden group"
            style={{
              backgroundImage: "url('/Images/RooRBong_collection.png'), linear-gradient(135deg, #1f2937 0%, #374151 100%)",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="font-bold text-lg mb-2">Bongs & Water Pipes</h3>
              <p className="text-sm opacity-90">Premium glass pieces for everyone</p>
            </div>
          </a>

          <a
            href="#"
            className="relative h-[240px] bg-cover bg-center rounded-xl overflow-hidden group"
            style={{ 
              backgroundImage: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
              backgroundSize: "cover"
            }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="font-bold">Grinders</h3>
              <p className="text-sm opacity-90">Precision tools for every lifestyle</p>
            </div>
          </a>

          <a
            href="#"
            className="relative h-[240px] bg-cover bg-center rounded-xl overflow-hidden group"
            style={{
              backgroundImage: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
              backgroundSize: "cover"
            }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="font-bold">E-Rigs</h3>
              <p className="text-sm opacity-90">Electric dabbing</p>
            </div>
          </a>

          {/* Row 2 */}
          <a
            href="#"
            className="relative h-[240px] bg-cover bg-center rounded-xl overflow-hidden group"
            style={{
              backgroundImage: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)",
              backgroundSize: "cover"
            }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="font-bold">Dab Rigs</h3>
              <p className="text-sm opacity-90">Concentrate essentials</p>
            </div>
          </a>

          <a
            href="#"
            className="relative row-span-2 h-[500px] bg-cover bg-center rounded-xl overflow-hidden group"
            style={{
              backgroundImage: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
              backgroundSize: "cover"
            }}
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="font-bold text-lg mb-2">Vaporizers</h3>
              <p className="text-sm opacity-90">Latest technology</p>
            </div>
          </a>

          {/* Row 3 */}
          <a
            href="#"
            className="relative h-[240px] bg-cover bg-center rounded-xl overflow-hidden group"
            style={{
              backgroundImage: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
              backgroundSize: "cover"
            }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="font-bold">Hand Pipes</h3>
              <p className="text-sm opacity-90">Classic pieces for everyone</p>
            </div>
          </a>

          <a
            href="#"
            className="relative h-[240px] bg-cover bg-center rounded-xl overflow-hidden group"
            style={{
              backgroundImage: "url('/Images/pre-rolls_collection.png'), linear-gradient(135deg, #be185d 0%, #ec4899 100%)",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="font-bold">Rolling Accessories</h3>
              <p className="text-sm opacity-90">Papers & pre-rolls for all</p>
            </div>
          </a>

          <a
            href="#"
            className="relative h-[240px] bg-cover bg-center rounded-xl overflow-hidden group"
            style={{
              backgroundImage: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
              backgroundSize: "cover"
            }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="font-bold">Dab Accessories</h3>
              <p className="text-sm opacity-90">Tools & torches</p>
            </div>
          </a>
        </div>

        {/* Staff Picks Section */}
        <section className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-chalets text-gray-900 dark:text-white mb-4">
              🔥 STAFF PICKS 🔥
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Limited time deals - New picks every day!
            </p>

            {/* Countdown Timer */}
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-xl shadow-lg">
              <span className="text-sm font-medium">SALE ENDS IN:</span>
              <div className="flex gap-2">
                <div className="bg-black/20 px-3 py-2 rounded-lg text-center min-w-[60px]">
                  <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-xs opacity-80">HOURS</div>
                </div>
                <div className="text-2xl font-bold">:</div>
                <div className="bg-black/20 px-3 py-2 rounded-lg text-center min-w-[60px]">
                  <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-xs opacity-80">MINS</div>
                </div>
                <div className="text-2xl font-bold">:</div>
                <div className="bg-black/20 px-3 py-2 rounded-lg text-center min-w-[60px]">
                  <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-xs opacity-80">SECS</div>
                </div>
              </div>
            </div>
          </div>

          {/* Staff Picks Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Staff Pick 1 */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                40% OFF
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Premium Glass Bong</h3>
                <p className="text-lg opacity-90 mb-4">18" Beaker Base with Percolator</p>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold">$89.99</span>
                  <span className="text-xl line-through opacity-70">$149.99</span>
                </div>
                <button className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors">
                  GRAB THIS DEAL
                </button>
              </div>
            </div>

            {/* Staff Pick 2 */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                50% OFF
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Electric Dab Rig</h3>
                <p className="text-lg opacity-90 mb-4">Temperature Control + LED Display</p>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold">$199.99</span>
                  <span className="text-xl line-through opacity-70">$399.99</span>
                </div>
                <button className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors">
                  GRAB THIS DEAL
                </button>
              </div>
            </div>
          </div>
        </section>


      </main>
    </div>
  );
}
