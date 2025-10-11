"use client";
import { useEffect, useState } from 'react';

interface StaffPickProduct {
  id: string;
  name: string;
  description?: string;
  short_description?: string;
  price: number;
  original_price: number;
  discount_percentage: number;
  vip_price?: number;
  imageUrl?: string;
  sku: string;
  stock_quantity: number;
  brand_name?: string;
  materials?: string[];
  featured: boolean;
  created_at: string;
  is_staff_pick: boolean;
}

interface StaffPicksResponse {
  products: StaffPickProduct[];
  message: string;
  total: number;
}

export default function StaffPicksSection() {
  const [products, setProducts] = useState<StaffPickProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStaffPicks() {
      try {
        setLoading(true);
        const response = await fetch('/api/featured/staff-picks?limit=2');

        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            // If we can't parse JSON, use the status text
          }
          console.error('Staff picks API error:', errorMessage);
          throw new Error(`Failed to fetch staff picks: ${errorMessage}`);
        }

        const data: StaffPicksResponse = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Error fetching staff picks:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchStaffPicks();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const getProductDescription = (product: StaffPickProduct) => {
    return product.short_description || product.description || 'Premium quality product';
  };

  if (loading) {
    return (
      <section className="mt-16">
        <div className="flex items-center justify-center mb-12">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 rounded-lg transform rotate-1"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-600 to-gray-900 rounded-lg transform -rotate-1"></div>
            <div className="relative bg-gradient-to-r from-black via-gray-800 to-black p-6 rounded-lg border-2 border-gray-600 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-lg animate-shimmer"></div>
              <h2 className="text-5xl font-chalets text-white mb-0 relative z-10" style={{
                letterSpacing: '-0.02em',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.1)'
              }}>
                DOPE DEALS
              </h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-900 rounded-xl overflow-hidden animate-pulse border border-gray-700">
              <div className="p-6">
                <div className="h-6 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded mb-4"></div>
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-gray-700 rounded w-16"></div>
                  <div className="h-8 bg-gray-700 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-16">
        <div className="flex items-center justify-center mb-12">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 rounded-lg transform rotate-1"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-600 to-gray-900 rounded-lg transform -rotate-1"></div>
            <div className="relative bg-gradient-to-r from-black via-gray-800 to-black p-6 rounded-lg border-2 border-gray-600 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-lg animate-shimmer"></div>
              <h2 className="text-5xl font-chalets text-white mb-0 relative z-10" style={{
                letterSpacing: '-0.02em',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.1)'
              }}>
                DOPE DEALS
              </h2>
            </div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-red-500">Error loading deals: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16">
      <div className="flex items-center justify-center mb-12">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 rounded-lg transform rotate-1"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-600 to-gray-900 rounded-lg transform -rotate-1"></div>
          <div className="relative bg-gradient-to-r from-black via-gray-800 to-black p-6 rounded-lg border-2 border-gray-600 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-lg animate-shimmer"></div>
            <h2 className="text-5xl font-chalets text-white mb-0 relative z-10" style={{
              letterSpacing: '-0.02em',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.1)'
            }}>
              DOPE DEALS
            </h2>
          </div>
        </div>
      </div>

      {/* Staff Picks Products - Clean Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-white relative overflow-hidden hover:shadow-lg hover:shadow-dope-orange-500/20 transition-all duration-300"
          >
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {product.discount_percentage}% OFF
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2 line-clamp-2 text-white">{product.name}</h3>
              <p className="text-gray-300 mb-4 line-clamp-2">{getProductDescription(product)}</p>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl font-bold text-dope-orange-400">{formatPrice(product.price)}</span>
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.original_price)}</span>
              </div>
              <button className="bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-6 py-3 rounded-lg font-bold transition-colors">
                GRAB THIS DEAL
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
