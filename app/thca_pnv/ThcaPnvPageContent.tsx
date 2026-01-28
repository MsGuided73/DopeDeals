'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { addToCart } from '../lib/cart-utils';

interface Product {
  id: string;
  name: string;
  description: string | null;
  short_description: string | null;
  our_price: number;
  sale_price?: number | null;
  image_url: string | null;
  image_urls?: string[] | null;
  sku: string | null;
  stock_quantity: number;
  is_active: boolean;
  featured: boolean;
  brand_name: string | null;
  nicotine_product: boolean;
  tobacco_product: boolean;
}

export default function ThcaPnvPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchThcaPnvProducts();
  }, []);

  const fetchThcaPnvProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching THCA PNV products...');
      const response = await fetch('/api/products/thca-pre-rolls?limit=30');

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If we can't parse JSON, use the status text
        }
        console.error('THCA PNV API error:', errorMessage);
        throw new Error(`Failed to fetch THCA PNV products: ${errorMessage}`);
      }

      const data = await response.json();
      console.log('THCA PNV data received:', data);

      if (!data.products) {
        console.warn('No THCA PNV products data received');
        setProducts([]);
        return;
      }

      setProducts(data.products);
    } catch (err) {
      console.error('Error fetching THCA PNV products:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getProductDescription = (product: Product): string => {
    return product.short_description || product.description || 'Premium quality THCA pre-rolls and vape products';
  };

  const transformProductForCard = (product: Product) => {
    const primaryImageUrl = product.image_url ||
                           (product.image_urls && product.image_urls.length > 0 ? product.image_urls[0] : null);

    return {
      id: product.id,
      name: product.name,
      originalPrice: product.our_price,
      salePrice: product.sale_price || product.our_price,
      discountPercent: product.sale_price ? Math.round(((product.our_price - product.sale_price) / product.our_price) * 100) : 0,
      image_url: primaryImageUrl || undefined,
      skilled: product.featured,
      stock_quantity: product.stock_quantity,
      brand_name: product.brand_name || 'Unknown Brand',
      short_description: getProductDescription(product),
      description: getProductDescription(product),
      sku: product.sku || '',
      compare_at_price: product.sale_price && product.sale_price < product.our_price ? product.our_price : undefined,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Hero Section Skeleton */}
          <div className="text-center mb-16">
            <div className="h-16 bg-white/20 rounded-lg mb-4 animate-pulse mx-auto max-w-2xl"></div>
            <div className="h-6 bg-white/10 rounded-lg mb-2 animate-pulse mx-auto max-w-xl"></div>
            <div className="h-6 bg-white/10 rounded-lg animate-pulse mx-auto max-w-lg"></div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-3"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-red-400 via-pink-500 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display-twilight">
              🌿 Premium THCA Pre-Rolls & Vapes
            </h1>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
              <p className="text-white/90 mb-6">{error}</p>
              <button
                onClick={fetchThcaPnvProducts}
                className="bg-white text-purple-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display-twilight">
              🌿 Premium THCA Pre-Rolls & Vapes
            </h1>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">Coming Soon</h2>
              <p className="text-white/90 text-lg">
                Our premium THCA pre-rolls and vape cartridges are currently being curated.
                We're working hard to bring you the highest quality products.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display-twilight">
            🌿 Premium THCA Pre-Rolls & Vapes
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Discover our curated collection of premium THCA pre-rolls and vape cartridges
          </p>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
            <span className="text-white font-medium">{products.length} Products Available</span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {products.map((product) => {
            const transformedProduct = transformProductForCard(product);
            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 block"
              >
                <div className="relative w-full aspect-square bg-white dark:bg-gray-800 overflow-hidden">
                  {transformedProduct.image_url ? (
                    <img
                      src={transformedProduct.image_url}
                      alt={transformedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🌿</div>
                        <div className="text-sm font-medium">Image Coming Soon</div>
                      </div>
                    </div>
                  )}

                  {/* Featured Badge */}
                  {product.featured && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-emerald-400 to-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      ⭐ Featured
                    </div>
                  )}

                  {/* Brand Badge */}
                  {transformedProduct.brand_name && transformedProduct.brand_name !== 'Unknown Brand' && (
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                      {transformedProduct.brand_name}
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {transformedProduct.name}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 flex-grow">
                    {transformedProduct.short_description}
                  </p>

                  <div className="mt-auto">
                    <div className="mb-4">
                      {transformedProduct.compare_at_price ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 line-through">
                              ${transformedProduct.compare_at_price.toFixed(2)}
                            </span>
                            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                              {transformedProduct.discountPercent}% OFF
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-green-600">
                            ${transformedProduct.salePrice.toFixed(2)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          ${transformedProduct.salePrice.toFixed(2)}
                        </div>
                      )}
                    </div>

                    <button
                      className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-full transition-all duration-300 text-center text-sm hover:from-emerald-600 hover:to-green-700 hover:scale-105 hover:shadow-lg"
                      onClick={async (e) => {
                        e.stopPropagation();
                        await addToCart(product.id);
                      }}
                    >
                      Add to Cart 🛒
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Need More Options?</h2>
            <p className="text-white/90 mb-6">
              Check out our full catalog of premium cannabinoid products and wellness items.
            </p>
            <Link
              href="/products"
              className="inline-block bg-white text-green-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
            >
              Browse All Products →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
