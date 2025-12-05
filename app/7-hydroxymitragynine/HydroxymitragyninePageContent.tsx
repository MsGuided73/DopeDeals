'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  description: string;
  short_description?: string;
  our_price: number;
  sale_price?: number;
  image_url?: string;
  image_urls?: string[];
  sku: string;
  stock_quantity: number;
  brand_name?: string;
}

export default function HydroxymitragyninePageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/hydroxy-kratom?limit=24');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data.products || []);
        setTotalCount(data.totalCount || 0);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const getProductImage = (product: Product): string => {
    if (product.image_url && product.image_url.trim() !== '') {
      return product.image_url;
    }
    if (Array.isArray(product.image_urls) && product.image_urls.length > 0) {
      return product.image_urls[0];
    }
    return '/images/placeholder-product.jpg';
  };

  const getProductPrice = (product: Product) => {
    const price = product.sale_price || product.our_price;
    return typeof price === 'number' ? price.toFixed(2) : '0.00';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              🌿 Premium 7-Hydroxymitragynine & Kratom
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover our curated collection of high-quality 7-OH and Kratom products
            </p>
            <div className="flex justify-center gap-4 text-sm md:text-base">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                ✓ Lab Tested
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                ✓ Premium Quality
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                ✓ Discreet Shipping
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Products Coming Soon
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our premium 7-Hydroxymitragynine and Kratom collection is currently being stocked.
              Check back soon for exciting new products!
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Available Products ({totalCount})
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Premium 7-OH, 7-Hydroxymitragynine, and Kratom products
              </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <Image
                      src={getProductImage(product)}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                    {product.sale_price && product.sale_price < product.our_price && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        SALE
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {product.brand_name && (
                      <p className="text-xs text-green-600 dark:text-green-400 font-semibold mb-1">
                        {product.brand_name}
                      </p>
                    )}
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                      {product.name}
                    </h3>
                    {product.short_description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {product.short_description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        {product.sale_price && product.sale_price < product.our_price ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-green-600">
                              ${getProductPrice(product)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ${product.our_price.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            ${getProductPrice(product)}
                          </span>
                        )}
                      </div>
                      {product.stock_quantity > 0 ? (
                        <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-xs text-red-600 dark:text-red-400 font-semibold">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🔬</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Lab Tested
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                All products are third-party lab tested for purity and potency
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌿</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Premium Quality
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We source only the highest quality 7-OH and Kratom products
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Discreet Shipping
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Fast, discreet shipping with plain packaging for your privacy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
