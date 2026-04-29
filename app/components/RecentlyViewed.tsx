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
  featured_product: boolean | string;
  brand_id: string | null;
  brand_name: string | null;
  category_id: string | null;
  created_at: string;
  updated_at: string;
}

interface RecentlyViewedProduct {
  id: string;
  viewedAt: number;
}

export default function RecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentlyViewedProducts();
  }, []);

  const fetchRecentlyViewedProducts = async () => {
    try {
      setLoading(true);

      // Get recently viewed product IDs from localStorage
      const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]') as RecentlyViewedProduct[];

      if (recentlyViewed.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      // Sort by most recently viewed and take the first 8
      const sortedIds = recentlyViewed
        .sort((a, b) => b.viewedAt - a.viewedAt)
        .slice(0, 8)
        .map(item => item.id);

      if (sortedIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      // Fetch product details for the recently viewed items
      const productPromises = sortedIds.map(id =>
        fetch(`/api/products/${id}`).then(res => res.ok ? res.json() : null)
      );

      const productResults = await Promise.all(productPromises);
      const validProducts = productResults.filter(product => product !== null);

      setProducts(validProducts);
    } catch (err) {
      console.error('Error fetching recently viewed products:', err);
      setProducts([]);
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
      price: (product.sale_price && product.sale_price < (product.our_price ?? 0)
        ? product.sale_price
        : (product.our_price ?? 0)).toString(),
      image_url: primaryImageUrl || undefined,
      featured: product.featured,
      stock_quantity: product.stock_quantity,
      brand_name: product.brand_name || 'Unknown Brand',
      short_description: getProductDescription(product),
      description: getProductDescription(product),
      sku: product.sku || '',
      compare_at_price: product.sale_price && product.sale_price < (product.our_price ?? 0) 
        ? product.our_price 
        : undefined,
      discount_percentage: product.sale_price && product.sale_price < (product.our_price ?? 0) && (product.our_price ?? 0) > 0
        ? Math.round((((product.our_price ?? 0) - product.sale_price) / (product.our_price ?? 0)) * 100)
        : undefined,
    };
  };

  if (loading) {
    return (
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl text-black font-bold" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
              RECENTLY VIEWED
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
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
      </section>
    );
  }

  if (products.length === 0) {
    return null; // Don't show the section if no recently viewed products
  }

  return (
    <section className="bg-white py-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl text-black font-bold" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
            RECENTLY VIEWED
          </h2>
        </div>

        {/* Auto-scrolling container with 4 products visible */}
        <AutoScrollContainer
          autoScrollInterval={4000}
          scrollAmount={384} // Approximately width of one card (96 * 4)
          className="max-w-6xl mx-auto"
        >
          {products.map((product) => {
            const transformedProduct = transformProductForCard(product);
            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex-shrink-0 w-96 border border-gray-200"
              >
                <div className="relative w-full aspect-square bg-white overflow-hidden p-6">
                  {transformedProduct.image_url ? (
                    <img
                      src={transformedProduct.image_url}
                      alt={transformedProduct.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
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
                    <p className="text-sm font-black text-dope-orange-600 mb-2 uppercase tracking-wide leading-tight" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                      {transformedProduct.brand_name}
                    </p>
                  )}

                  <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 line-clamp-2 group-hover:text-dope-orange-700 transition-colors" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
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
                              -{transformedProduct.discount_percentage}%
                            </span>
                          </div>
                          <div className="text-xl font-bold text-green-600">
                            ${parseFloat(transformedProduct.price).toFixed(2)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xl font-bold text-gray-900">
                          ${parseFloat(transformedProduct.price).toFixed(2)}
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
                        try {
                          const success = await addToCart(product.id, 1);
                          if (success) {
                            // Success flow is handled by addToCart function with toast notifications
                            // and cart state updates via window.dispatchEvent
                          }
                        } catch (error) {
                          console.error('Error adding item to cart:', error);
                          // Error handling is already done by addToCart function with toast notifications
                        }
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
    </section>
  );
}
