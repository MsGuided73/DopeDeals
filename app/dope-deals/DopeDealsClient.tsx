"use client";

import { useEffect, useState } from 'react';
import UniversalProductCard from '../components/UniversalProductCard';
import Link from 'next/link';
import { Search, ChevronDown, Star } from 'lucide-react';

const DD = {
  accent:  '#2d8f47',
  dark:    '#1c1208',
  muted:   '#6B7280',
};

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
      setIsSticky(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
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
    { name: "Water Pipes", href: "/bongs", hasDropdown: true },
    { name: "Hand Pipes", href: "/pipes", hasDropdown: true },
    { name: "Vapes", href: "/vapes", hasDropdown: true },
    { name: "Dab Rigs", href: "/dabsntools", hasDropdown: false },
    { name: "Pre-Rolls", href: "/pre-rolls", hasDropdown: true },
    { name: "Edibles", href: "/edibles", hasDropdown: false },
    { name: "Shrooms", href: "/mushrooms", hasDropdown: false },
    { name: "Accessories", href: "/accessories", hasDropdown: false },
    { name: "THCA Flower", href: "/thca_flower", hasDropdown: false }
  ];

  return (
    <div className="bg-white">
      <div style={{ textAlign: 'center', margin: '44px 0 24px', padding: '0 16px' }}>
        <div style={{ height: '3px', width: '48px', background: DD.accent, margin: '0 auto 14px' }} />
        <h2 style={{ fontFamily: "'BebasNeue','Bebas Neue',sans-serif", color: DD.dark, fontSize: 'clamp(32px,5vw,64px)', lineHeight: 1, letterSpacing: '0.02em', margin: 0 }}>
          DOPE DEALS
        </h2>
        <p style={{ fontSize: '15px', color: DD.muted, margin: '10px 0 0', maxWidth: '500px', marginInline: 'auto', lineHeight: 1.5 }}>
          Savings Worth the Detour
        </p>
        <div style={{ borderTop: `1px dashed ${DD.accent}50`, margin: '20px auto 0', maxWidth: '360px' }} />
      </div>

      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-8 py-12 flex items-start gap-12 bg-white">
        <aside className="hidden lg:block w-[240px] flex-shrink-0">
          <div className="sticky top-8 transition-all duration-700 ease-out">
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

            <ul className="flex flex-col gap-4">
              {sidebarCategories.map((cat, i) => (
                <li 
                  key={cat.name} 
                  className="text-[11px] font-medium tracking-wide text-gray-600 hover:text-[#145C3C] cursor-pointer transition-all duration-500 ease-out uppercase"
                  style={{
                    fontFamily: "'Fira Sans', sans-serif",
                    opacity: isSticky ? 1 : 0.8,
                    transform: isSticky ? 'translateX(0)' : 'translateX(-8px)',
                    transitionDelay: `${isSticky ? 100 + i * 40 : 0}ms`
                  }}
                >
                  <Link href={cat.href} className="flex items-center justify-between w-full h-full">
                    <span>{cat.name}</span>
                    {cat.hasDropdown && <ChevronDown size={12} className="text-gray-400" />}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-12">
              <h3 className="text-[12px] font-bold uppercase tracking-widest text-gray-800 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Average Rating
              </h3>
              <div className="flex flex-col gap-3">
                {[5, 4].map(stars => (
                  <div key={stars} className="flex items-center gap-2 cursor-pointer group">
                    <div className="flex text-[#d2691e]">
                      {[...Array(stars)].map((_, i) => (
                        <Star key={i} size={11} fill="currentColor" strokeWidth={0} />
                      ))}
                      {[...Array(5 - stars)].map((_, i) => (
                        <Star key={i + stars} size={11} fill="none" strokeWidth={1} className="text-gray-300" />
                      ))}
                    </div>
                    <span className="text-[11px] text-gray-500 group-hover:text-gray-800 transition-colors">({Math.floor(Math.random() * 20) + 1})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 pb-20">
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
                <UniversalProductCard 
                  key={p.id} 
                  product={{
                    ...p,
                    price: (p.DD15 ? 0.85 : p.DD10 ? 0.90 : 1) * p.our_price,
                    compare_at_price: p.our_price,
                  }} 
                  size="medium"
                  showRating={true}
                  showBrand={true}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
