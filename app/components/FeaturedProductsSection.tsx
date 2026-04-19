"use client";

import { useEffect, useState, type MouseEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
  
  const { restrictedProductIds, checkProductEligibility, userZipCode } = useCompliance();

  useEffect(() => {
    void fetchProducts();
    void fetchPersistedFavorites();
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

  const fetchPersistedFavorites = async () => {
    try {
      const response = await fetch('/api/favorites');
      if (response.ok) {
        const data = await response.json();
        if (data.favorites && Array.isArray(data.favorites)) {
          setFavorites(new Set(data.favorites));
        }
      }
      // 401 means the user isn't logged in — keep local state empty, which is correct.
    } catch {
      // Network errors are non-critical; local state remains empty.
    }
  };

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

  const handleFavorite = async (productId: string, event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const isCurrentlyFavorite = favorites.has(productId);

    // Optimistically update local state
    setFavorites((previous) => {
      const next = new Set(previous);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });

    // Persist to the API (no-op if the user isn't authenticated — API returns 401)
    try {
      const method = isCurrentlyFavorite ? 'DELETE' : 'POST';
      const response = await fetch('/api/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productSku: productId }),
      });
      if (!response.ok && response.status !== 401) {
        throw new Error(`API returned ${response.status}`);
      }
    } catch {
      // Revert optimistic update on network errors or unexpected API failures
      setFavorites((previous) => {
        const next = new Set(previous);
        if (isCurrentlyFavorite) {
          next.add(productId);
        } else {
          next.delete(productId);
        }
        return next;
      });
    }
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
    const isRestricted = restrictedProductIds.includes(product.id);

    // ── Open Road card styles ──────────────────────────────────────────────
    const amberColor = '#e8920a';
    const cardStyle: React.CSSProperties = {
      background: '#ffffff',
      overflow: 'hidden',
      boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
      transition: 'box-shadow 0.3s, transform 0.3s',
      flexShrink: variant === 'desktop' ? 0 : undefined,
      width: variant === 'desktop' ? '300px' : undefined,
      opacity: isRestricted ? 0.6 : 1,
      filter: isRestricted ? 'grayscale(1)' : undefined,
      pointerEvents: isRestricted ? 'none' : undefined,
      cursor: isRestricted ? 'not-allowed' : undefined,
      position: 'relative',
    };

    return (
      <div key={product.id} className="group" style={cardStyle}>
        {/* Amber speed stripe */}
        <div style={{ height: '3px', background: `linear-gradient(90deg, ${amberColor}, #f4ab2e)` }} />

        {/* Image area */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1', background: 'white', overflow: 'hidden' }}>
          <Link href={isRestricted ? '#' : `/product/${product.id}`} className="block w-full h-full">
            {transformedProduct.image_url ? (
              <Image
                src={transformedProduct.image_url}
                alt={transformedProduct.name}
                fill
                sizes="(max-width: 768px) 50vw, 300px"
                className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', background: '#f5f0e8' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>📦</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px' }}>No Image</div>
                </div>
              </div>
            )}
          </Link>

          {/* HOT badge */}
          <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, background: amberColor, color: 'white', fontSize: '10px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif", padding: '3px 8px', letterSpacing: '0.1em' }}>
            🔥 HOT
          </div>

          {/* Favorite button */}
          {!isRestricted && (
            <button
              style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.92)', borderRadius: '50%', padding: '7px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', opacity: 0, transition: 'opacity 0.2s', zIndex: 10 }}
              className="group-hover:opacity-100"
              aria-pressed={isFavorite}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              onClick={(event) => handleFavorite(product.id, event)}
            >
              <svg className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          )}

          {/* Restriction Overlay */}
          {isRestricted && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', pointerEvents: 'none' }}>
              <div style={{ background: 'rgba(0,0,0,0.88)', border: '1px solid rgba(239,68,68,0.5)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transform: 'rotate(-3deg)' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px', color: '#ef4444' }}>🚫</div>
                <span style={{ color: 'white', fontFamily: "'DM Sans', sans-serif", fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', fontSize: '16px', lineHeight: 1 }}>Local Restriction</span>
                <span style={{ color: '#f87171', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '6px' }}>Limited Availability</span>
              </div>
            </div>
          )}
        </div>

        {/* Card body */}
        <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column' }}>
          {/* Brand */}
          {transformedProduct.brand_name && transformedProduct.brand_name !== 'Unknown Brand' && (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 700, color: amberColor, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>
              {transformedProduct.brand_name}
            </p>
          )}

          {/* Name */}
          <Link href={isRestricted ? '#' : `/product/${product.id}`}>
            <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: '#1e1e1e', fontSize: '14px', lineHeight: 1.35, marginBottom: '6px' }} className="line-clamp-2 group-hover:text-[#e8920a] transition-colors">
              {transformedProduct.name}
            </h3>
          </Link>

          {/* Price */}
          <div style={{ marginBottom: '12px' }}>
            {transformedProduct.compare_at_price ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#999', textDecoration: 'line-through' }}>${formatPrice(transformedProduct.compare_at_price)}</span>
                  <span style={{ background: '#fef2e0', color: amberColor, padding: '2px 6px', fontSize: '10px', fontWeight: 700 }}>-{transformedProduct.discount_percentage}%</span>
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '22px', color: amberColor, letterSpacing: '0.01em' }}>${formatPrice(transformedProduct.price)}</div>
              </div>
            ) : (
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '22px', color: amberColor, letterSpacing: '0.01em' }}>${formatPrice(transformedProduct.price)}</div>
            )}
          </div>

          {/* Side-by-side buttons */}
          <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
            <button
              style={isRestricted ? { flex: 1, background: '#e5e5e5', color: '#999', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', padding: '10px 4px', border: 'none', cursor: 'not-allowed', textTransform: 'uppercase' } : { flex: 1, background: amberColor, color: 'white', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', padding: '10px 4px', border: 'none', cursor: 'pointer', textTransform: 'uppercase', transition: 'opacity 0.2s' }}
              className={isRestricted ? '' : 'hover:opacity-90'}
              onClick={(event) => !isRestricted && handleAddToCart(product.id, event)}
              disabled={isRestricted}
            >
              {isRestricted ? 'Unavailable' : 'Add to Cart'}
            </button>
            <Link
              href={isRestricted ? '#' : `/product/${product.id}`}
              style={{ flex: 1, border: `1.5px solid ${amberColor}`, color: amberColor, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', padding: '9px 4px', textAlign: 'center', display: 'block', background: 'transparent', textTransform: 'uppercase', textDecoration: 'none', transition: 'background 0.2s, color 0.2s' }}
              className="hover:bg-[#e8920a] hover:text-white"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <section style={{ marginTop: '64px', background: 'linear-gradient(180deg, #2d2622 0%, #5a4a3a 55%, #a07a4a 100%)', padding: '64px 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ height: '3px', width: '48px', background: '#e8920a', margin: '0 auto 16px' }} />
          <h2 style={{ fontFamily: "'BebasNeue', 'Bebas Neue', sans-serif", color: '#e8920a', fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: 1, letterSpacing: '0.05em' }}>HOT PRODUCTS</h2>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((skeleton) => (
            <div key={skeleton} style={{ background: 'white', overflow: 'hidden' }} className="animate-pulse">
              <div style={{ height: '3px', background: '#e8920a30' }} />
              <div className="aspect-square bg-gray-100" />
              <div style={{ padding: '14px 16px' }}>
                <div className="h-2 bg-gray-200 rounded mb-3 w-1/3" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div className="h-9 bg-gray-200 flex-1" />
                  <div className="h-9 bg-gray-200 flex-1" />
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
            className="text-4xl md:text-6xl font-black text-black mb-4 font-display-twilight"
          >
            HOT PRODUCTS
          </h1>
          <p className="text-red-500 mt-6">Error loading hot products: {error}</p>
        </div>
      </section>
    );
  }

  // Don't render the section if there are no products to show
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    // ── Open Road: Hot Products Section ──────────────────────────────────────
    <section style={{ marginTop: '64px', background: 'linear-gradient(180deg, #2d2622 0%, #5a4a3a 55%, #a07a4a 100%)', padding: '60px 0 72px' }}>
      {/* Ambient road-stripe accent */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: 'repeating-linear-gradient(180deg, #e8920a 0px, #e8920a 16px, transparent 16px, transparent 32px)', opacity: 0.18, transform: 'translateX(-50%)' }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px', position: 'relative', zIndex: 1, padding: '0 16px' }}>
          <div style={{ height: '3px', width: '48px', background: '#e8920a', margin: '0 auto 14px' }} />
          <h2 style={{ fontFamily: "'BebasNeue', 'Bebas Neue', sans-serif", color: '#e8920a', fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: 1, letterSpacing: '0.05em', margin: 0 }}>
            HOT PRODUCTS
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#8a8178', fontSize: '12px', letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: '10px' }}>
            Handpicked Favorites · Fastest Moving Items
          </p>
          <div style={{ borderTop: '1px dashed rgba(232,146,10,0.25)', margin: '20px auto 0', maxWidth: '360px' }} />
        </div>

        {/* Cards — mobile grid */}
        <div className="block lg:hidden" style={{ padding: '0 16px' }}>
          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-4">
            {products.map((product) => renderProductCard(product, 'mobile'))}
          </div>
        </div>

        {/* Cards — desktop auto-scroll */}
        <div className="hidden lg:block" style={{ padding: '0 24px' }}>
          <AutoScrollContainer>
            {products.map((product) => renderProductCard(product, 'desktop'))}
          </AutoScrollContainer>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '48px', position: 'relative', zIndex: 1 }}>
          <Link
            href="/hot-products"
            style={{ display: 'inline-block', background: '#e8920a', color: 'white', fontFamily: "'BebasNeue', 'Bebas Neue', sans-serif", fontSize: '20px', letterSpacing: '0.1em', padding: '14px 48px', textDecoration: 'none', transition: 'opacity 0.2s' }}
            className="hover:opacity-90"
          >
            VIEW ALL HOT PRODUCTS →
          </Link>
        </div>
      </div>
    </section>
  );
}
