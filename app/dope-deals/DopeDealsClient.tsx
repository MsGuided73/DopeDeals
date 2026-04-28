"use client";

import { useEffect, useState } from 'react';
import MinimalProductCard from '../components/MinimalProductCard';
import { Search, ChevronDown } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string | null;
  our_price: number;
  image_url: string | null;
  image_urls?: string[] | null;
  brand_name: string | null;
  DD10: boolean;
  DD15: boolean;
}

export default function DopeDealsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // The Global Masthead is ~150-200px tall. Once we scroll past 150px, we trigger the sticky state.
      setIsSticky(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initially
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Fetch dope deals
    const fetchDeals = async () => {
      try {
        const response = await fetch('/api/dope-deals?limit=40');
        const data = await response.json();
        if (data.products) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const sidebarCategories = [
    { name: "420 BUNDLES & DEALS", hasDropdown: false },
    { name: "NEW ARRIVALS", hasDropdown: false },
    { name: "ACCESSORIES", hasDropdown: true },
    { name: "DR DABBER", hasDropdown: true },
    { name: "EXOTIC SNACKS", hasDropdown: false },
    { name: "FOCUS V", hasDropdown: true },
    { name: "GENERAL MERCH", hasDropdown: true },
    { name: "GLASS", hasDropdown: true },
    { name: "HEADY GLASS", hasDropdown: false },
    { name: "IRIDESCENT GLASS", hasDropdown: false },
    { name: "PUFFCO", hasDropdown: true },
    { name: "VAPORIZERS", hasDropdown: true },
    { name: "NEWSLETTER", hasDropdown: false },
    { name: "WHOLESALE", hasDropdown: false }
  ];

  return (
    <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-8 py-12 flex items-start gap-12 bg-white">
      {/* LEFT SIDEBAR */}
      <aside className="hidden lg:block w-[240px] flex-shrink-0">
        <div className={`sticky top-8 transition-all duration-700 ease-out`}>
          {/* Animated Title that fades/slides in when scrolled */}
          <div className="overflow-hidden mb-6 h-[24px]">
            <h2 
              className="text-[14px] font-bold tracking-widest text-[#145C3C] uppercase whitespace-nowrap transition-transform duration-700 ease-out"
              style={{
                fontFamily: "'Outfit', sans-serif",
                transform: isSticky ? 'translateY(0)' : 'translateY(100%)',
                opacity: isSticky ? 1 : 0
              }}
            >
              Shop By Category
            </h2>
          </div>

          {/* Search bar matching screenshot */}
          <div className="flex mb-8 border border-gray-300 rounded-sm overflow-hidden h-[38px]">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full text-[13px] px-3 outline-none text-gray-700 placeholder-gray-400"
              style={{ fontFamily: "'Fira Sans', sans-serif" }}
            />
            <button className="bg-[#b44b25] text-white px-3 flex items-center justify-center hover:bg-[#9a3d1b] transition-colors">
              <Search size={16} />
            </button>
          </div>

          {/* Filter by Price Mockup */}
          <div className="mb-10">
            <h3 className="text-[12px] font-bold uppercase tracking-widest text-gray-800 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Filter By Price
            </h3>
            <div className="w-full h-1 bg-gray-200 rounded-full relative mb-3 mt-2">
              <div className="absolute left-0 right-0 h-full bg-gray-400 rounded-full" />
              <div className="absolute left-0 w-3 h-3 bg-gray-600 rounded-full top-1/2 -translate-y-1/2 -translate-x-1 cursor-pointer" />
              <div className="absolute right-0 w-3 h-3 bg-gray-600 rounded-full top-1/2 -translate-y-1/2 translate-x-1 cursor-pointer" />
            </div>
            <div className="flex justify-between items-center">
              <button className="bg-gray-600 text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Filter
              </button>
              <span className="text-[12px] text-gray-600" style={{ fontFamily: "'Fira Sans', sans-serif" }}>
                Price: $0 — $800
              </span>
            </div>
          </div>

          {/* Links */}
          <ul className="flex flex-col gap-4">
            {sidebarCategories.map((cat, i) => (
              <li 
                key={cat.name} 
                className="flex items-center justify-between text-[11px] font-medium tracking-wide text-gray-600 hover:text-[#145C3C] cursor-pointer transition-all duration-500 ease-out uppercase"
                style={{
                  fontFamily: "'Fira Sans', sans-serif",
                  opacity: isSticky ? 1 : 0.8,
                  transform: isSticky ? 'translateX(0)' : 'translateX(-8px)',
                  transitionDelay: `${isSticky ? 100 + i * 40 : 0}ms`
                }}
              >
                <span>{cat.name}</span>
                {cat.hasDropdown && <ChevronDown size={12} className="text-gray-400" />}
              </li>
            ))}
          </ul>

          {/* Average Rating Mockup */}
          <div className="mt-12">
            <h3 className="text-[12px] font-bold uppercase tracking-widest text-gray-800 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Average Rating
            </h3>
            <div className="flex flex-col gap-3">
              {[5, 4].map(stars => (
                <div key={stars} className="flex items-center gap-2 cursor-pointer group">
                  <div className="flex text-[#d2691e]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} fill={i < stars ? "currentColor" : "none"} strokeWidth={i < stars ? 0 : 1} className={i >= stars ? "text-gray-300" : ""} />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-500 group-hover:text-gray-800 transition-colors">({Math.floor(Math.random() * 20) + 1})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT */}
      <main className="flex-1 min-w-0 pb-20">
        {/* Top Header Row */}
        <div className="flex justify-between items-center mb-8 pb-3" style={{ fontFamily: "'Fira Sans', sans-serif" }}>
          <div className="text-[12px] text-gray-500 font-medium">
            Showing 1–{products.length} of {products.length} results
          </div>
          <select className="text-[12px] bg-transparent border-none outline-none text-gray-700 cursor-pointer hover:text-black">
            <option>Sort by latest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 animate-pulse">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-square bg-[#f8f8f8] w-full rounded-sm" />
                <div className="h-3 w-3/4 bg-gray-200 rounded-sm" />
                <div className="h-3 w-1/4 bg-gray-200 rounded-sm" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-14">
            {products.map(p => (
              <MinimalProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// Ensure Star is imported if used directly here for the rating mockups
import { Star } from 'lucide-react';
