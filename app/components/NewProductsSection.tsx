"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { addToCart } from '../lib/cart-utils';
import AutoScrollContainer from './AutoScrollContainer';
import { useCompliance } from '../contexts/ComplianceContext';

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

  const { restrictedProductIds, checkProductEligibility, userZipCode } = useCompliance();

  useEffect(() => {
    fetchNewProducts();
  }, []);

  // Pre-fetch eligibility for all products once they are loaded
  useEffect(() => {
    if (userZipCode && products.length > 0) {
      const idsToCheck = products.map(p => p.id).filter(id => !restrictedProductIds.includes(id));
      if (idsToCheck.length > 0) {
        checkProductEligibility(idsToCheck);
      }
    }
  }, [userZipCode, products, restrictedProductIds, checkProductEligibility]);

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

  const handleAddToCart = async (productId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const success = await addToCart(productId, 1);
      if (success) {
        // Success flow is handled by addToCart function with toast notifications
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const productsToShow = products;

  const renderProductCard = (product: Product, isDesktop: boolean) => {
    const transformedProduct = transformProductForCard(product);
    const isRestricted = restrictedProductIds.includes(product.id);

    const cardClassName = `group bg-white rounded-xl overflow-hidden transition-all duration-300 relative ${
      isDesktop ? 'flex-shrink-0 w-96' : 'block'
    } ${
      isRestricted 
        ? 'opacity-60 grayscale cursor-not-allowed pointer-events-none' 
        : 'hover:shadow-xl hover:border-dope-orange-300 hover:-translate-y-2'
    }`;

    return (
      <div key={product.id} className={cardClassName}>
        <div className="relative w-full aspect-square bg-white dark:bg-gray-800 overflow-hidden">
          <Link href={isRestricted ? '#' : `/product/${product.id}`} className="block w-full h-full">
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
          </Link>

          {/* Favorite Button (Hidden if restricted) */}
          {!isRestricted && (
            <button
              className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          )}

          {/* Restriction Overlay */}
          {isRestricted && (
            <div className="absolute inset-0 z-20 flex items-center justify-center p-8 pointer-events-none">
              <div className="bg-black/90 backdrop-blur-md border border-red-500/50 rounded-2xl p-5 flex flex-col items-center text-center shadow-2xl transform rotate-[2deg]">
                <div className="text-3xl mb-2 text-red-500">🚫</div>
                <span className="text-white font-black uppercase tracking-tighter text-xl leading-none whitespace-nowrap">Local Restriction</span>
                <span className="text-red-400 text-xs font-bold uppercase tracking-widest mt-1">Limited Availability</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col">
          <Link href={isRestricted ? '#' : `/product/${product.id}`} className="block">
            {transformedProduct.brand_name && (
              <p
                className="text-sm font-black text-dope-orange-600 mb-2 uppercase tracking-wide leading-tight"
                style={{
                  fontFamily:
                    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                }}
              >
                {transformedProduct.brand_name}
              </p>
            )}

            <h3
              className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-2 line-clamp-2 group-hover:text-dope-orange-700 transition-colors"
              style={{
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              }}
            >
              {transformedProduct.name}
            </h3>
          </Link>

          <div className="mt-auto">
            <Link href={isRestricted ? '#' : `/product/${product.id}`} className="block mb-4">
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
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  ${parseFloat(transformedProduct.price).toFixed(2)}
                </div>
              )}
            </Link>

            <button
              className={`w-full px-4 py-3 font-bold rounded-full transition-all duration-300 text-center text-sm relative z-10 ${
                isRestricted
                  ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed'
                  : 'bg-transparent text-green-800 border-2 border-green-800 hover:bg-green-800 hover:text-white hover:scale-105 hover:shadow-lg'
              }`}
              style={{
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                letterSpacing: '0.05em',
              }}
              onClick={(e) => !isRestricted && handleAddToCart(product.id, e)}
              disabled={isRestricted}
            >
              {isRestricted ? 'Unavailable in your ZIP' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="mt-16 bg-white dark:bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-black mb-4 font-display-twilight">
            FRESH DROPS
          </h1>
        </div>

        {/* Mobile: Grid layout */}
        <div className="block lg:hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 px-4">
            {productsToShow.slice(0, 6).map((product) => renderProductCard(product, false))}
          </div>
        </div>

        {/* Desktop: Auto-scrolling with manual controls */}
        <div className="hidden lg:block">
          <AutoScrollContainer>
            {productsToShow.map((product) => renderProductCard(product, true))}
          </AutoScrollContainer>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Link
            href="/fresh-drops"
            className="inline-block px-6 py-3 text-green-600 border-2 border-green-600 font-bold text-base rounded-lg transition-all duration-300 hover:bg-green-600 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-green-600/25"
          >
            VIEW ALL FRESH DROPS →
          </Link>
        </div>
      </div>
    </section>
  );
}
