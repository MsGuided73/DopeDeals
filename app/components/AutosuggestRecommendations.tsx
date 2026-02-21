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

export default function AutosuggestRecommendations({ 
  limit = 8, 
  layout = 'scroll',
  showTitle = true,
  compact = false
}: { 
  limit?: number; 
  layout?: 'scroll' | 'grid';
  showTitle?: boolean;
  compact?: boolean;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendedProducts();
  }, [limit]); // Re-fetch if limit changes

  const fetchRecommendedProducts = async () => {
    try {
      setLoading(true);

      // Get recently viewed products to inform recommendations
      const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]') as Array<{id: string, viewedAt: number}>;

      let recommendedProducts: Product[] = [];

      if (recentlyViewed.length > 0) {
        // Use recently viewed products to find similar items
        const recentIds = recentlyViewed.slice(0, 3).map(item => item.id); // Get last 3 viewed

        try {
          // Fetch details of recently viewed products to understand user preferences
          const recentProductPromises = recentIds.map(id =>
            fetch(`/api/products/${id}`).then(res => res.ok ? res.json() : null)
          );

          const recentProducts = (await Promise.all(recentProductPromises)).filter(p => p !== null);

          if (recentProducts.length > 0) {
            // Extract categories and brands from recently viewed products
            const categories = [...new Set(recentProducts.map(p => p.category_id).filter(Boolean))];
            const brands = [...new Set(recentProducts.map(p => p.brand_id).filter(Boolean))];

            // Try to get products from same categories/brands first
            if (categories.length > 0 || brands.length > 0) {
              const categoryQuery = categories.length > 0 ? `category=${categories[0]}` : '';
              const brandQuery = brands.length > 0 ? `brand=${brands[0]}` : '';
              const queryParams = [categoryQuery, brandQuery].filter(Boolean).join('&');

              if (queryParams) {
                const similarResponse = await fetch(`/api/products?${queryParams}&limit=${limit}&exclude=${recentIds.join(',')}`);
                if (similarResponse.ok) {
                  const similarData = await similarResponse.json();
                  if (similarData.products && similarData.products.length > 0) {
                    recommendedProducts = similarData.products.slice(0, limit);
                  }
                }
              }
            }
          }
        } catch (recentError) {
          console.warn('Could not fetch recently viewed product details:', recentError);
        }
      }

      // If we don't have enough personalized recommendations, fill with featured products
      if (recommendedProducts.length < limit) {
        const featuredResponse = await fetch(`/api/products/featured?limit=${limit}`);

        if (featuredResponse.ok) {
          const featuredData = await featuredResponse.json();
          if (featuredData.products) {
            // Filter out products already in recommendations and recently viewed
            const existingIds = new Set([
              ...recommendedProducts.map(p => p.id),
              ...recentlyViewed.map(item => item.id)
            ]);

            const additionalProducts = featuredData.products
              .filter((p: Product) => !existingIds.has(p.id))
              .slice(0, limit - recommendedProducts.length);

            recommendedProducts = [...recommendedProducts, ...additionalProducts];
          }
        }
      }

      setProducts(recommendedProducts);
    } catch (err) {
      console.error('Error fetching recommended products:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Fallback to featured products on error
      try {
        const fallbackResponse = await fetch(`/api/products/featured?limit=${limit}`);
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          setProducts(fallbackData.products || []);
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        setProducts([]);
      }
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

    // Use our_price as the primary price, fallback to price if our_price is not available
    // Ensure we handle both potential property names from different API responses
    const displayPrice = product.our_price || (product as any).price || 0;

    return {
      id: product.id,
      name: product.name,
      price: displayPrice.toString(),
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

  const renderProductCard = (product: Product) => {
     const transformedProduct = transformProductForCard(product);
     const cardClasses = compact 
        ? "group bg-white rounded-lg border border-gray-100 hover:border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full"
        : "group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex-shrink-0 w-96";
     
     const imageClasses = compact
        ? "relative w-full aspect-square bg-gray-50 overflow-hidden"
        : "relative w-full aspect-square bg-white overflow-hidden";
        
     return (
        <Link
          key={product.id}
          href={`/product/${product.id}`}
          className={cardClasses}
        >
          <div className={imageClasses}>
            {transformedProduct.image_url ? (
              <img
                src={transformedProduct.image_url}
                alt={transformedProduct.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                <div className="text-center">
                  <div className="text-2xl mb-1">📦</div>
                  {!compact && <div className="text-sm font-medium">No Image</div>}
                </div>
              </div>
            )}

            {/* Favorite Button - hide on compact */}
            {!compact && (
              <button
                className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                onClick={(e) => e.stopPropagation()}>
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            )}
          </div>

          <div className={`flex flex-col flex-1 ${compact ? 'p-3' : 'p-4'}`}>
            {transformedProduct.brand_name && (
              <p className="text-[10px] font-black text-dope-orange-600 mb-1 uppercase tracking-wide leading-tight" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                {transformedProduct.brand_name}
              </p>
            )}

            <h3 className={`font-bold text-gray-900 leading-tight mb-2 line-clamp-2 group-hover:text-dope-orange-700 transition-colors ${compact ? 'text-sm' : 'text-lg'}`} style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
              {transformedProduct.name}
            </h3>

            <div className="mt-auto">
              <div className={compact ? "mb-2" : "mb-4"}>
                {transformedProduct.compare_at_price ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 line-through">
                        ${parseFloat(transformedProduct.compare_at_price.toString()).toFixed(2)}
                      </span>
                    </div>
                    <div className={`${compact ? 'text-sm' : 'text-xl'} font-bold text-green-600`}>
                      ${parseFloat(transformedProduct.price).toFixed(2)}
                    </div>
                  </div>
                ) : (
                  <div className={`${compact ? 'text-base' : 'text-xl'} font-bold text-gray-900`}>
                    ${parseFloat(transformedProduct.price).toFixed(2)}
                  </div>
                )}
              </div>

              <button
                className={`w-full bg-transparent text-green-800 border border-green-800 font-bold rounded-full transition-all duration-300 text-center hover:bg-green-800 hover:text-white ${compact ? 'py-1.5 text-xs' : 'py-3 text-sm hover:scale-105 hover:shadow-lg'}`}
                style={{
                  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  letterSpacing: '0.05em',
                }}
                onClick={async (e) => {
                  e.stopPropagation();
                  e.preventDefault(); // Prevent link navigation
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
                Add
              </button>
            </div>
          </div>
        </Link>
     );
  }

  if (loading) {
    return (
      <section className={compact ? "" : "bg-gray-50 py-8"}>
        <div className={compact ? "" : "max-w-7xl mx-auto px-4"}>
          {showTitle && (
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl text-black font-bold" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                  RECOMMENDED FOR YOU
                </h2>
              </div>
          )}
          <div className={`grid gap-4 ${limit <= 4 ? `grid-cols-${limit}` : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}`}>
            {Array.from({ length: Math.min(limit, 4) }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse h-64">
                <div className="aspect-square bg-muted"></div>
                <div className="p-3">
                  <div className="h-3 bg-muted-foreground/30 rounded mb-2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || products.length === 0) {
    return null; // Don't show the section if there's an error or no products
  }

  return (
    <section className={compact ? "" : "bg-gray-50 py-8 border-t border-gray-200"}>
      <div className={compact ? "" : "max-w-7xl mx-auto px-4"}>
        {/* Section Header */}
        {showTitle && (
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl text-black font-bold" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                RECOMMENDED FOR YOU
              </h2>
            </div>
        )}

        {layout === 'scroll' ? (
            /* Auto-scrolling container */
            <AutoScrollContainer
              autoScrollInterval={4000}
              scrollAmount={384} // Approximately width of one card (96 * 4)
              className="max-w-6xl mx-auto"
            >
              {products.slice(0, 8).map(renderProductCard)}
            </AutoScrollContainer>
        ) : (
            /* Grid layout */
            <div className={`grid grid-cols-2 ${limit === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-3 lg:grid-cols-4'} gap-4`}>
                {products.slice(0, limit).map(renderProductCard)}
            </div>
        )}
      </div>
    </section>
  );
}
