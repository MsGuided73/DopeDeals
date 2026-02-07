"use client";

import { useEffect, useState, type MouseEvent } from 'react';
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
  brand_id: string | null;
  brand_name: string | null;
  category_id: string | null;
  created_at: string;
  updated_at: string;
}

interface ProductCardData {
  id: string;
  name: string;
  price: string;
  image_url?: string;
  featured: boolean;
  stock_quantity: number;
  brand_name: string;
  short_description: string;
  description: string;
  sku: string;
  compare_at_price?: number;
  discount_percentage?: number;
}

const systemFontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

const formatPrice = (value: string | number): string => {
  const numeric = typeof value === 'number' ? value : Number.parseFloat(value);
  return Number.isFinite(numeric) ? numeric.toFixed(2) : '0.00';
};

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    void fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products/featured');

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, fall back to the HTTP status text.
        }
        console.error('Featured products API error:', errorMessage);
        throw new Error(`Failed to fetch featured products: ${errorMessage}`);
      }

      const data = await response.json();

      if (!data.products) {
        console.warn('No featured products data received');
        setProducts([]);
        return;
      }

      setProducts(data.products);
    } catch (err) {
      console.error('Error fetching featured products:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getProductDescription = (product: Product): string => {
    return product.short_description || product.description || 'Premium quality product';
  };

  const transformProductForCard = (product: Product): ProductCardData => {
    const primaryImageUrl =
      product.image_url ||
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
      compare_at_price:
        product.sale_price && product.sale_price < product.our_price ? product.sale_price : undefined,
      discount_percentage:
        product.sale_price && product.sale_price < product.our_price && product.our_price > 0
          ? Math.round(((product.our_price - product.sale_price) / product.our_price) * 100)
          : undefined,
    };
  };

  const handleFavorite = (productId: string, event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setFavorites((previous) => {
      const next = new Set(previous);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });

    // TODO: Implement API call to persist favorites for the user.
  };

  const handleAddToCart = async (productId: string, event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const success = await addToCart(productId, 1);
      if (success) {
        // Toast notifications and cart updates are handled within addToCart.
      }
    } catch (err) {
      console.error('Error adding item to cart:', err);
      // addToCart already surfaces the user-facing error feedback.
    }
  };

  const renderProductCard = (product: Product, variant: 'mobile' | 'desktop') => {
    const transformedProduct = transformProductForCard(product);
    const isFavorite = favorites.has(product.id);
    const cardClassName = `group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative ${
      variant === 'desktop' ? 'flex-shrink-0 w-96' : 'block'
    }`;

    return (
      <div key={product.id} className={cardClassName}>
        <div className="relative w-full aspect-square bg-white dark:bg-gray-800 overflow-hidden">
          <Link href={`/product/${product.id}`} className="block w-full h-full">
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

          <button
            className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
            aria-pressed={isFavorite}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            onClick={(event) => handleFavorite(product.id, event)}
          >
            <svg
              className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-700'}`}
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
        </div>

        <div className="p-4 flex flex-col">
          <Link href={`/product/${product.id}`} className="block">
            {transformedProduct.brand_name && (
              <p
                className="text-sm font-black text-dope-orange-600 mb-2 uppercase tracking-wide leading-tight"
                style={{ fontFamily: systemFontFamily }}
              >
                {transformedProduct.brand_name}
              </p>
            )}

            <h3
              className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-2 line-clamp-2 group-hover:text-dope-orange-700 transition-colors"
              style={{ fontFamily: systemFontFamily }}
            >
              {transformedProduct.name}
            </h3>
          </Link>

          <div className="mt-auto">
            <Link href={`/product/${product.id}`} className="block mb-4">
              {transformedProduct.compare_at_price ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 line-through">
                      ${formatPrice(transformedProduct.compare_at_price)}
                    </span>
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                      -{transformedProduct.discount_percentage}%
                    </span>
                  </div>
                  <div className="text-xl font-bold text-green-600">${formatPrice(transformedProduct.price)}</div>
                </div>
              ) : (
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  ${formatPrice(transformedProduct.price)}
                </div>
              )}
            </Link>

            <button
              className="w-full px-4 py-3 bg-transparent text-green-800 border-2 border-green-800 font-bold rounded-full transition-all duration-300 text-center text-sm hover:bg-green-800 hover:text-white hover:scale-105 hover:shadow-lg relative z-10"
              style={{ fontFamily: systemFontFamily, letterSpacing: '0.05em' }}
              onClick={(event) => handleAddToCart(product.id, event)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <section className="mt-16">
        <div className="text-center mb-12">
          <h1
            className="text-5xl md:text-7xl font-black text-black mb-4 font-display-twilight"
          >
            HOT PRODUCTS
          </h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 px-4">
          {[1, 2, 3, 4, 5, 6].map((skeleton) => (
            <div
              key={skeleton}
              className="bg-card border border-border rounded-xl overflow-hidden animate-pulse"
            >
              <div className="aspect-square bg-muted" />
              <div className="p-3">
                <div className="h-3 bg-muted-foreground/30 rounded mb-2" />
                <div className="h-4 bg-muted-foreground/20 rounded mb-3" />
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-muted-foreground/20 rounded w-12" />
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
          <h1
            className="text-4xl md:text-5xl text-black mb-4 font-display-twilight"
          >
            HOT PRODUCTS
          </h1>
          <p className="text-red-500 mt-6">Error loading hot products: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16 bg-white dark:bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1
            className="text-5xl md:text-7xl font-black text-black mb-4 font-display-twilight"
          >
            HOT PRODUCTS
          </h1>
        </div>

        <div className="block lg:hidden">
          <div className="flex justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 px-4 max-w-6xl">
              {products.map((product) => renderProductCard(product, 'mobile'))}
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <AutoScrollContainer>
            {products.map((product) => renderProductCard(product, 'desktop'))}
          </AutoScrollContainer>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-block px-6 py-3 text-green-600 border-2 border-green-600 font-bold text-base rounded-lg transition-all duration-300 hover:bg-green-600 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-green-600/25"
          >
            VIEW ALL HOT PRODUCTS →
          </Link>
        </div>
      </div>
    </section>
  );
}
