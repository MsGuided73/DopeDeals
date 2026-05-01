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
          {products.map((product) => (
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
      </div>
    </section>
  );
}
