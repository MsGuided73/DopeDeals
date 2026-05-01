"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { addToCart } from '../lib/cart-utils';
import AutoScrollContainer from './AutoScrollContainer';
import UniversalProductCard from './UniversalProductCard';

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
              {products.slice(0, 8).map((product) => (
                <UniversalProductCard
                  key={product.id}
                  product={product}
                  size="medium"
                  className="flex-shrink-0 w-96"
                  showBrand={true}
                  showRating={true}
                />
              ))}
            </AutoScrollContainer>
        ) : (
            /* Grid layout */
            <div className={`grid grid-cols-2 ${limit === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-3 lg:grid-cols-4'} gap-4`}>
                {products.slice(0, limit).map((product) => (
                  <UniversalProductCard
                    key={product.id}
                    product={product}
                    size={compact ? "small" : "medium"}
                    showBrand={true}
                    showRating={true}
                  />
                ))}
            </div>
        )}
      </div>
    </section>
  );
}
