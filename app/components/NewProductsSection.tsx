"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { addToCart } from '../lib/cart-utils';

interface Product {
  id: string;
  name: string;
  description: string | null;
  short_description: string | null;
  our_price: number;
  sale_price?: number | null;
  fire_price?: number | null;
  image_url: string | null;
  image_urls?: string[] | null;
  sku: string | null;
  stock_quantity: number;
  is_active: boolean;
  featured: boolean;
  featured_product: boolean | string;
  brand_id: string | null;
  brand_name: string | null;
  category_id: string | null;
  created_at: string;
  updated_at: string;
}

export default function NewProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNewProducts();
  }, []);

  const fetchNewProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/newest/products?limit=12');

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If we can't parse JSON, use the status text
        }
        console.error('New products API error:', errorMessage);
        throw new Error(`Failed to fetch new products: ${errorMessage}`);
      }

      const data = await response.json();

      if (!data.products) {
        console.warn('No new products data received');
        setProducts([]);
        return;
      }

      setProducts(data.products);
    } catch (err) {
      console.error('Error fetching new products:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getProductDescription = (product: Product): string => {
    return product.short_description || product.description || 'Premium quality product';
  };

  const transformProductForCard = (product: Product) => {
    const primaryImageUrl = product.image_url ||
                           (product.image_urls && product.image_urls.length > 0 ? product.image_urls[0] : null);

    return {
      id: product.id,
      name: product.name,
      price: product.our_price.toString(),
      image_url: primaryImageUrl || undefined,
      featured: product.featured,
      stock_quantity: product.stock_quantity,
      brand_name: product.brand_name || 'Unknown Brand',
      short_description: getProductDescription(product),
      description: getProductDescription(product),
      sku: product.sku || '',
      compare_at_price: product.sale_price && product.sale_price < product.our_price ? product.sale_price : undefined,
      discount_percentage: product.sale_price && product.sale_price < product.our_price
        ? Math.round(((product.our_price - product.sale_price) / product.our_price) * 100)
        : undefined,
    };
  };

  if (loading) {
    return (
      <section className="mt-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl text-black mb-4">
            FRESH DROPS
          </h1>
        </div>
        <div className="flex space-x-6 pb-4 px-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse flex-shrink-0 w-72 h-80">
              <div className="aspect-square bg-muted"></div>
              <div className="p-4">
                <div className="h-4 bg-muted-foreground/30 rounded mb-2"></div>
                <div className="h-6 bg-muted-foreground/20 rounded mb-4"></div>
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-muted-foreground/20 rounded w-16"></div>
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
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl text-black mb-4">
            FRESH DROPS
          </h1>
          <p className="text-red-500 mt-6">Error loading fresh drops: {error}</p>
        </div>
      </section>
    );
  }

  const productsToShow = products;

  return (
    <section className="mt-16 bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl text-black mb-4">
            FRESH DROPS
          </h1>
        </div>

        {/* Auto-Scroll Container */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll-horizontal">
            {/* First set of products */}
            {productsToShow.slice(0, 10).map((product) => {
              const transformedProduct = transformProductForCard(product);
              return (
                <Link
                  key={`first-${product.id}`}
                  href={`/product/${product.id}`}
                  className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex-shrink-0 w-72 h-80 block mx-3"
                >
                  <div className="relative w-full aspect-square bg-gray-50 dark:bg-gray-800 overflow-hidden">
                    {transformedProduct.image_url ? (
                      <img
                        src={transformedProduct.image_url}
                        alt={transformedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 dark:bg-gray-800">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📦</div>
                          <div className="text-sm font-medium">No Image</div>
                        </div>
                      </div>
                    )}

                    {/* New Badge */}
                    <div className="absolute top-3 left-3">
                      <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        NEW
                      </div>
                    </div>

                    {/* Favorite Button */}
                    <button
                      className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                      onClick={(e) => e.stopPropagation()}>
                      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  <div className="p-4 flex flex-col h-full">
                    {transformedProduct.brand_name && (
                      <p className="text-sm font-semibold text-dope-orange-600 mb-1 uppercase tracking-wide">
                        {transformedProduct.brand_name}
                      </p>
                    )}

                    <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight mb-2 line-clamp-2 group-hover:text-dope-orange-700 transition-colors">
                      {transformedProduct.name}
                    </h3>

                    {transformedProduct.short_description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {transformedProduct.short_description}
                      </p>
                    )}

                    <div className="mt-auto">
                      <div className="mb-3">
                        {transformedProduct.compare_at_price ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500 line-through">
                                ${parseFloat(transformedProduct.compare_at_price.toString()).toFixed(2)}
                              </span>
                              <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                Save {transformedProduct.discount_percentage}%
                              </span>
                            </div>
                            <div className="text-xl font-bold text-green-600">
                              ${parseFloat(transformedProduct.price).toFixed(2)}
                            </div>
                          </div>
                        ) : (
                          <div className="text-xl font-bold text-gray-900 dark:text-white">
                            ${parseFloat(transformedProduct.price).toFixed(2)}
                          </div>
                        )}
                      </div>

                      <button
                        className="w-full text-center px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition-all duration-300 text-sm font-highway uppercase tracking-wide hover:scale-105 hover:shadow-lg hover:shadow-green-600/25"
                        style={{
                          fontFamily: "'Highway Gothic', 'Arial', sans-serif",
                          fontWeight: 'normal',
                          letterSpacing: '0.05em',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Check It Out
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
            {/* Second set of products for continuous scrolling */}
            {productsToShow.slice(0, 10).map((product) => {
              const transformedProduct = transformProductForCard(product);
              return (
                <Link
                  key={`second-${product.id}`}
                  href={`/product/${product.id}`}
                  className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex-shrink-0 w-72 h-80 block mx-3"
                >
                  <div className="relative w-full aspect-square bg-gray-50 dark:bg-gray-800 overflow-hidden">
                    {transformedProduct.image_url ? (
                      <img
                        src={transformedProduct.image_url}
                        alt={transformedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 dark:bg-gray-800">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📦</div>
                          <div className="text-sm font-medium">No Image</div>
                        </div>
                      </div>
                    )}

                    {/* New Badge */}
                    <div className="absolute top-3 left-3">
                      <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        NEW
                      </div>
                    </div>

                    {/* Favorite Button */}
                    <button
                      className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                      onClick={(e) => e.stopPropagation()}>
                      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  <div className="p-4 flex flex-col h-full">
                    {transformedProduct.brand_name && (
                      <p className="text-sm font-semibold text-dope-orange-600 mb-1 uppercase tracking-wide">
                        {transformedProduct.brand_name}
                      </p>
                    )}

                    <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight mb-2 line-clamp-2 group-hover:text-dope-orange-700 transition-colors">
                      {transformedProduct.name}
                    </h3>

                    {transformedProduct.short_description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {transformedProduct.short_description}
                      </p>
                    )}

                    <div className="mt-auto">
                      <div className="mb-3">
                        {transformedProduct.compare_at_price ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500 line-through">
                                ${parseFloat(transformedProduct.compare_at_price.toString()).toFixed(2)}
                              </span>
                              <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                Save {transformedProduct.discount_percentage}%
                              </span>
                            </div>
                            <div className="text-xl font-bold text-green-600">
                              ${parseFloat(transformedProduct.price).toFixed(2)}
                            </div>
                          </div>
                        ) : (
                          <div className="text-xl font-bold text-gray-900 dark:text-white">
                            ${parseFloat(transformedProduct.price).toFixed(2)}
                          </div>
                        )}
                      </div>

                      <button
                        className="w-full text-center px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition-all duration-300 text-sm font-highway uppercase tracking-wide hover:scale-105 hover:shadow-lg hover:shadow-green-600/25"
                        style={{
                          fontFamily: "'Highway Gothic', 'Arial', sans-serif",
                          fontWeight: 'normal',
                          letterSpacing: '0.05em',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Check It Out
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-colors duration-200">
            View All Fresh Drops
          </Link>
        </div>
      </div>
    </section>
  );
}
