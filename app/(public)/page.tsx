"use client";
import { useEffect, useState } from "react";
import { User, ShoppingCart, Search } from 'lucide-react';

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
        <div className="bg-black text-white py-4 px-6 flex items-center justify-between">
          <div className="text-2xl font-bold font-chalets">DOPE CITY</div>
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

        {/* Golden yellow divider */}
        <div className="h-1 bg-yellow-400"></div>

        {/* Glassmorphic nav bar */}
        <nav
          className={`backdrop-blur-md transition-all duration-300 ease-in-out ${
            scrolled
              ? "bg-white/90 dark:bg-gray-900/90 shadow-md"
              : "bg-white/70 dark:bg-gray-900/70 shadow-sm"
          }`}
        >
          <ul className="flex items-center justify-center gap-6 py-3 flex-wrap">
            <li>
              <a
                href="#"
                className="text-black dark:text-white font-medium hover:text-yellow-500 transition-colors"
              >
                Shop by Brand
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-black dark:text-white font-medium hover:text-yellow-500 transition-colors"
              >
                THCA &amp; More
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-black dark:text-white font-medium hover:text-yellow-500 transition-colors"
              >
                Bongs
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-black dark:text-white font-medium hover:text-yellow-500 transition-colors"
              >
                Pipes
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-black dark:text-white font-medium hover:text-yellow-500 transition-colors"
              >
                Dab Rigs
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-black dark:text-white font-medium hover:text-yellow-500 transition-colors"
              >
                Dry Herb Vaporizers
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-black dark:text-white font-medium hover:text-yellow-500 transition-colors"
              >
                Accessories
              </a>
            </li>
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
            className="relative row-span-2 h-[500px] bg-cover bg-center rounded-lg overflow-hidden group"
            style={{ 
              backgroundImage: "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
              backgroundSize: "cover"
            }}
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="font-bold text-lg mb-2">Bongs & Water Pipes</h3>
              <p className="text-sm opacity-90">Premium glass pieces</p>
            </div>
          </a>

          <a
            href="#"
            className="relative h-[240px] bg-cover bg-center rounded-lg overflow-hidden group"
            style={{ 
              backgroundImage: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
              backgroundSize: "cover"
            }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="font-bold">Grinders</h3>
              <p className="text-sm opacity-90">Precision tools</p>
            </div>
          </a>

          <a
            href="#"
            className="relative h-[240px] bg-cover bg-center rounded-lg overflow-hidden group"
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
            className="relative h-[240px] bg-cover bg-center rounded-lg overflow-hidden group"
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
            className="relative row-span-2 h-[500px] bg-cover bg-center rounded-lg overflow-hidden group"
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
            className="relative h-[240px] bg-cover bg-center rounded-lg overflow-hidden group"
            style={{ 
              backgroundImage: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
              backgroundSize: "cover"
            }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="font-bold">Hand Pipes</h3>
              <p className="text-sm opacity-90">Classic smoking</p>
            </div>
          </a>

          <a
            href="#"
            className="relative h-[240px] bg-cover bg-center rounded-lg overflow-hidden group"
            style={{ 
              backgroundImage: "linear-gradient(135deg, #be185d 0%, #ec4899 100%)",
              backgroundSize: "cover"
            }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="font-bold">Rolling Accessories</h3>
              <p className="text-sm opacity-90">Papers & more</p>
            </div>
          </a>

          <a
            href="#"
            className="relative h-[240px] bg-cover bg-center rounded-lg overflow-hidden group"
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
      </main>
    </div>
  );
}
