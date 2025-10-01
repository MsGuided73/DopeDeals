"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string | null;
  short_description: string | null;
  price: number;
  imageUrl: string | null;
  stock_quantity: number;
  is_active: boolean;
}

interface FeaturedProductsResponse {
  products: Product[];
  total: number;
}

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/featured/products?limit=8');

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If we can't parse JSON, use the status text
        }
        console.error('Featured products API error:', errorMessage);
        throw new Error(`Failed to fetch featured products: ${errorMessage}`);
      }

      const data: FeaturedProductsResponse = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error fetching featured products:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  const getProductDescription = (product: Product): string => {
    return product.short_description || product.description || 'Premium quality product';
  };

  if (loading) {
    return (
      <section className="mt-24">
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
                FEATURED PRODUCTS
              </h2>
            </div>
          </div>
        </div>
        
        {/* Shop All Link - Centered Below Title */}
        <div className="text-center mb-8">
          <Link
            href="/products"
            className="text-dope-orange-500 hover:text-dope-orange-600 font-medium text-lg transition-colors"
          >
            Shop all →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-900 rounded-xl overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-800 h-80"></div>
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
      <section className="mt-24">
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
                FEATURED PRODUCTS
              </h2>
            </div>
          </div>
          <p className="text-red-500 mt-6">Error loading featured products: {error}</p>
        </div>
      </section>
    );
  }

  // Filter products to only show those with real images
  const productsWithRealImages = products.filter(product =>
    product.imageUrl &&
    !product.imageUrl.includes('placehold.co') &&
    !product.imageUrl.includes('placeholder') &&
    !product.imageUrl.includes('unsplash.com') &&
    !product.imageUrl.includes('picsum.photos') &&
    !product.imageUrl.includes('lorempixel.com') &&
    !product.imageUrl.includes('dummyimage.com')
  );

  return (
    <section className="mt-24">
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
              FEATURED PRODUCTS
            </h2>
          </div>
        </div>
      </div>

      {/* Shop All Link - Centered Below Title */}
      <div className="text-center mb-8">
        <Link
          href="/products"
          className="text-dope-orange-500 hover:text-dope-orange-600 font-medium text-lg transition-colors"
        >
          Shop all →
        </Link>
      </div>

      {/* Products Grid - Only show products with real images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
        {productsWithRealImages.slice(0, 4).map((product) => (
          <div key={product.id} className="bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden group hover:scale-105 transition-all duration-300 border border-gray-700 hover:border-dope-orange-500/50 shadow-xl hover:shadow-[0_0_30px_rgba(255,140,0,0.6)] hover:ring-2 hover:ring-dope-orange/50">
            <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center h-80 overflow-hidden relative">
              {/* Subtle frame overlay */}
              <div className="absolute inset-2 border border-gray-600/30 rounded-lg pointer-events-none"></div>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  // Hide products with broken images
                  (e.target as HTMLImageElement).closest('.bg-gradient-to-br')?.style.setProperty('display', 'none');
                }}
              />
            </div>
            <div className="p-6 bg-gradient-to-b from-gray-900/50 to-black/80">
              <h3 className="text-white font-semibold mb-2 text-lg line-clamp-2 group-hover:text-dope-orange-400 transition-colors">{product.name}</h3>
              <p className="text-gray-300 text-base mb-4 line-clamp-2">{getProductDescription(product)}</p>
              <div className="flex items-center justify-between">
                <span className="text-dope-orange-500 font-bold text-xl">${product.price.toFixed(2)}</span>
                <div className="flex gap-2">
                  <Link
                    href={`/products/${product.id}`}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm transition-colors"
                  >
                    View
                  </Link>
                  <button className="bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-4 py-2 rounded text-base transition-colors">
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Show message if no products with real images */}
        {productsWithRealImages.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400 text-lg">No products with verified images available at the moment.</p>
            <p className="text-gray-500 text-sm mt-2">Check back soon for new arrivals!</p>
          </div>
        )}
      </div>
    </section>
  );
}
