"use client";

import { useEffect, useState } from 'react';
import GlobalMastheadV3 from '../components/GlobalMasthead.v3';
import ReducedFooter from '../components/ReducedFooter';
import DealCard from '../components/DealCard';

interface Product {
  id: string;
  name: string;
  our_price: number;
  sale_price?: number | null;
  fire_price?: number | null;
  image_url: string | null;
  image_urls?: string[] | null;
  brand_name?: string | null;
  DD10?: boolean;
  DD15?: boolean;
}

export default function DealsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDeals() {
      try {
        setLoading(true);
        // Fetch up to 50 dope deals for the main deals page
        const response = await fetch('/api/dope-deals?limit=50');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.products) {
          setProducts(data.products);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    
    fetchDeals();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <GlobalMastheadV3 />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl text-gray-900 mb-4 tracking-wide" style={{ fontFamily: "'BebasNeue', 'Bebas Neue', sans-serif" }}>
            DOPE DEALS
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Unbeatable prices on premium glass, vapes, and accessories. Experience seamless shopping.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 animate-pulse">
            {Array(15).fill(null).map((_, i) => (
              <div key={i} className="bg-white aspect-[3/4] rounded-sm" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">
            <p>Failed to load deals. Please try refreshing the page.</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 sm:gap-4 md:gap-6">
            {products.map(product => (
              <DealCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p>No active deals found at the moment. Check back soon!</p>
          </div>
        )}
      </main>

      <ReducedFooter />
    </div>
  );
}
