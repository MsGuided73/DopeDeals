"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { addToCart } from '../lib/cart-utils';
import AutoScrollContainer from './AutoScrollContainer';

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
  DD10: boolean;
  DD15: boolean;
  brand_name: string | null;
  category_id: string | null;
  created_at: string;
  updated_at: string;
}

export default function DopeDealsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDopeDeals();
  }, []);

  const fetchDopeDeals = async () => {
    try {
      setLoading(true);
      console.log('Fetching dope deals products...');
      const response = await fetch('/api/dope-deals?limit=20');

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If we can't parse JSON, use the status text
        }
        console.error('Dope deals API error:', errorMessage);
        throw new Error(`Failed to fetch dope deals: ${errorMessage}`);
      }

      const data = await response.json();
      console.log('Dope deals data received:', data);

      if (!data.products) {
        console.warn('No dope deals data received');
        setProducts([]);
        return;
      }

      setProducts(data.products);
    } catch (err) {
      console.error('Error fetching dope deals:', err);
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

    // Calculate sale price based on discount
    const discountPercent = product.DD10 ? 10 : product.DD15 ? 15 : 0;
    const originalPrice = product.our_price;
    const salePrice = discountPercent > 0 ? originalPrice * (1 - discountPercent / 100) : originalPrice;

    return {
      id: product.id,
      name: product.name,
      originalPrice,
      salePrice,
      discountPercent,
      image_url: primaryImageUrl || undefined,
      skilled: product.featured,
      stock_quantity: product.stock_quantity,
      brand_name: product.brand_name || 'Unknown Brand',
      short_description: getProductDescription(product),
      description: getProductDescription(product),
      sku: product.sku || '',
      compare_at_price: discountPercent > 0 ? originalPrice : undefined,
    };
  };

  if (loading) {
    return (
      <section className="mt-16 bg-white dark:bg-gray-950 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl text-black mb-4">
              🔥 DOPE DEALS 🔥
            </h1>
          </div>
          {/* Mobile: Grid layout */}
          <div className="block lg:hidden">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 px-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-square bg-muted"></div>
                  <div className="p-3">
                    <div className="h-3 bg-muted-foreground/30 rounded mb-2"></div>
                    <div className="h-4 bg-muted-foreground/20 rounded mb-3"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-muted-foreground/20 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Horizontal scrolling */}
          <div className="hidden lg:flex lg:overflow-x-auto lg:gap-6 lg:pb-4 lg:px-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse flex-shrink-0 w-96">
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
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-16 bg-white dark:bg-gray-950 py-12">
        <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl text-black mb-4">
            🔥 DOPE DEALS 🔥
          </h1>
            <p className="text-red-500 mt-6">Error loading dope deals: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null; // Don't show section if no dope deals available
  }

  return (
    <section className="mt-16 bg-white dark:bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl text-black mb-4">
              🔥 DOPE DEALS 🔥
            </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Unbeatable deals on premium cannabis products - limited time offers!
          </p>
        </div>

        {/* Responsive Container - Grid on mobile, horizontal scroll on larger screens */}
        <div className="max-w-7xl mx-auto px-4">
          {/* Mobile: Grid layout */}
          <div className="block lg:hidden">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 px-4">
              {products.slice(0, 6).map((product) => {
                const transformedProduct = transformProductForCard(product);
                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 block"
                  >
                  <div className="relative w-full aspect-square bg-white dark:bg-gray-800 overflow-hidden">
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

                    {/* Favorite Button */}
                    <button
                      className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                      onClick={(e) => e.stopPropagation()}>
                      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  <div className="p-4 flex flex-col">
                    {transformedProduct.brand_name && (
                      <p className="text-sm font-black text-dope-orange-600 mb-2 uppercase tracking-wide" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                        {transformedProduct.brand_name}
                      </p>
                    )}

                    <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-2 line-clamp-2 group-hover:text-dope-orange-700 transition-colors" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                      {transformedProduct.name}
                    </h3>

                    <div className="mt-auto">
                      <div className="mb-4">
                        {transformedProduct.compare_at_price ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500 line-through">
                                ${parseFloat(transformedProduct.compare_at_price.toString()).toFixed(2)}
                              </span>
                              <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                {transformedProduct.discountPercent}%
                              </span>
                            </div>
                            <div className="text-xl font-bold text-green-600">
                              ${transformedProduct.salePrice.toFixed(2)}
                            </div>
                          </div>
                        ) : (
                          <div className="text-xl font-bold text-gray-900 dark:text-white">
                            ${transformedProduct.salePrice.toFixed(2)}
                          </div>
                        )}
                      </div>

                      <button
                        className="w-full px-4 py-3 bg-transparent text-green-800 border-2 border-green-800 font-bold rounded-full transition-all duration-300 text-center text-sm hover:bg-green-800 hover:text-white hover:scale-105 hover:shadow-lg"
                        style={{
                          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                          letterSpacing: '0.05em',
                        }}
                        onClick={async (e) => {
                          e.stopPropagation();
                          await addToCart(product.id);
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop: Auto-scrolling with manual controls */}
          <div className="hidden lg:block">
            <AutoScrollContainer>
              {products.map((product) => {
                const transformedProduct = transformProductForCard(product);
                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex-shrink-0 w-96"
                  >
                    <div className="relative w-full aspect-square bg-white dark:bg-gray-800 overflow-hidden">
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

                      {/* Favorite Button */}
                      <button
                        className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                        onClick={(e) => e.stopPropagation()}>
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>

                    <div className="p-4 flex flex-col">
                      {transformedProduct.brand_name && (
                        <p className="text-sm font-black text-dope-orange-600 mb-2 uppercase tracking-wide" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                          {transformedProduct.brand_name}
                        </p>
                      )}

                      <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-2 line-clamp-2 group-hover:text-dope-orange-700 transition-colors" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                        {transformedProduct.name}
                      </h3>

                      <div className="mt-auto">
                        <div className="mb-4">
                          {transformedProduct.compare_at_price ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 line-through">
                                  ${parseFloat(transformedProduct.compare_at_price.toString()).toFixed(2)}
                                </span>
                                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                  {transformedProduct.discountPercent}%
                                </span>
                              </div>
                              <div className="text-xl font-bold text-green-600">
                                ${transformedProduct.salePrice.toFixed(2)}
                              </div>
                            </div>
                          ) : (
                            <div className="text-xl font-bold text-gray-900 dark:text-white">
                              ${transformedProduct.salePrice.toFixed(2)}
                            </div>
                          )}
                        </div>

                        <button
                          className="w-full px-4 py-3 bg-transparent text-green-800 border-2 border-green-800 font-bold rounded-full transition-all duration-300 text-center text-sm hover:bg-green-800 hover:text-white hover:scale-105 hover:shadow-lg"
                          style={{
                            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                            letterSpacing: '0.05em',
                          }}
                          onClick={async (e) => {
                            e.stopPropagation();
                            await addToCart(product.id);
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </AutoScrollContainer>
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg black-600 hover:bg- text-white rounded-full font-medium transition-colors duration-200">
            Shop All Deals
          </Link>
        </div>
      </div>
    </section>
  );
}
