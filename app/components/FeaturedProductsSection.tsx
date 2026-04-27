"use client";

import { useEffect, useState, type MouseEvent } from 'react';
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

    setFavorites((previous) => {
      const next = new Set(previous);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });

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
      await addToCart(productId, 1);
    } catch (err) {
      console.error('Error adding item to cart:', err);
    }
  };

  const renderProductCard = (product: Product, variant: 'mobile' | 'desktop') => {
    const transformedProduct = transformProductForCard(product);
    const isFavorite = favorites.has(product.id);
    const isRestricted = restrictedProductIds.includes(product.id);

    return (
      <div
        key={product.id}
        className="group"
        style={{
          background: '#ffffff',
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          transition: 'box-shadow 0.3s, transform 0.3s',
          flexShrink: variant === 'desktop' ? 0 : undefined,
          width: variant === 'desktop' ? '260px' : undefined,
          opacity: isRestricted ? 0.6 : 1,
          filter: isRestricted ? 'grayscale(1)' : undefined,
          position: 'relative',
          borderRadius: '6px',
        }}
      >
        {/* Light navbar green top accent bar with white stripe */}
        <div style={{ height: '4px', background: '#ffffff', borderTop: '1px solid #1B7A4D', borderBottom: '1px solid #1B7A4D', borderRadius: '6px 6px 0 0' }} />

        {/* Image & Info Link Wrapper */}
        <Link 
          href={isRestricted ? '#' : `/product/${product.id}`}
          className="block h-full no-underline"
        >
          {/* Image */}
          <div style={{ position: 'relative', width: '100%', aspectRatio: '1', background: '#ffffff', overflow: 'hidden' }}>
            {transformedProduct.image_url ? (
              <img
                src={transformedProduct.image_url}
                alt={transformedProduct.name}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = parent.querySelector('.img-fallback') as HTMLElement | null;
                    if (fallback) fallback.style.display = 'flex';
                  }
                }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  padding: '12px',
                  transition: 'transform 0.3s',
                }}
                className="group-hover:scale-105"
              />
            ) : null}
            <div
              className="img-fallback"
              style={{
                width: '100%', height: '100%',
                display: transformedProduct.image_url ? 'none' : 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: '#999', background: '#f5f5f5',
                position: 'absolute', inset: 0,
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>📦</div>
                <div style={{ fontSize: '11px', color: '#aaa' }}>No Image</div>
              </div>
            </div>
          </div>

          {/* Discount badge */}
          {transformedProduct.discount_percentage && (
            <div className="dg-price-badge" style={{ position: 'absolute', top: 8, left: 8 }}>
              -{transformedProduct.discount_percentage}%
            </div>
          )}

          {/* Wishlist */}
          {!isRestricted && (
            <button
              style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(255,255,255,0.92)', borderRadius: '50%', padding: '7px', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', opacity: 0, transition: 'opacity 0.2s', zIndex: 10 }}
              className="group-hover:opacity-100"
              aria-pressed={isFavorite}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              onClick={(event) => handleFavorite(product.id, event)}
            >
              <svg className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          )}

          {/* Restriction overlay */}
          {isRestricted && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <div style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid #fca5a5', borderRadius: '8px', padding: '12px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', marginBottom: '4px' }}>🚫</div>
                <span style={{ color: '#ef4444', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Local Restriction</span>
              </div>
            </div>
          )}

          {/* Info */}
          <div style={{ padding: '13px 15px 15px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            {/* Brand */}
            {transformedProduct.brand_name && transformedProduct.brand_name !== 'Unknown Brand' && (
              <p className="dg-lime-text-gradient" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '3px' }}>
                {transformedProduct.brand_name}
              </p>
            )}

            {/* Name */}
            <h3 style={{ fontWeight: 600, color: '#1c1208', fontSize: '14px', lineHeight: 1.35, marginBottom: '6px' }} className="line-clamp-2 transition-opacity">
              {transformedProduct.name}
            </h3>

            {/* Price */}
            <div style={{ fontWeight: 700, fontSize: '21px', letterSpacing: '0.03em', marginBottom: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="dg-lime-text-gradient">${formatPrice(transformedProduct.price)}</span>
              {transformedProduct.compare_at_price && (
                <span style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 400, textDecoration: 'line-through' }}>
                  ${formatPrice(transformedProduct.compare_at_price)}
                </span>
              )}
            </div>

            {/* Two-button row */}
            <div style={{ display: 'flex', gap: '7px' }}>
              <button
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  if (!isRestricted && product.stock_quantity > 0) {
                    handleAddToCart(product.id, event);
                  }
                }}
                disabled={isRestricted || product.stock_quantity <= 0}
                style={isRestricted || product.stock_quantity <= 0
                  ? { flex: 1, background: '#e5e5e5', color: '#999', fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em', padding: '9px 4px', border: 'none', cursor: 'not-allowed', textTransform: 'uppercase', borderRadius: '4px' }
                  : { flex: 1, background: 'radial-gradient(ellipse at 50% 35%, #3cb05b 0%, #2d8f47 55%, #226b35 100%)', color: 'white', fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em', padding: '9px 4px', border: 'none', cursor: 'pointer', textTransform: 'uppercase', borderRadius: '4px', boxShadow: '0 2px 6px rgba(82,196,26,0.30)', transition: 'box-shadow 0.18s, transform 0.1s' }}
                onMouseEnter={e => { if (!isRestricted && product.stock_quantity > 0) { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 14px rgba(82,196,26,0.45)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; } }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 6px rgba(82,196,26,0.30)'; (e.currentTarget as HTMLButtonElement).style.transform = 'none'; }}
              >
                {isRestricted ? 'Unavailable' : product.stock_quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <div
                style={{ flex: 1, border: '1.5px solid #2d8f47', color: '#2d8f47', fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em', padding: '8px 4px', textAlign: 'center', background: 'transparent', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '4px', transition: 'background 0.18s, color 0.18s' }}
                className="hover:bg-[#2d8f47] hover:text-white"
              >
                View Details
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  };


  return (
    <section style={{ background: '#ffffff', padding: '60px 0 72px', position: 'relative' }}>
      {/* Thin light navbar green top rule with white stripe */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'transparent', borderTop: '1px solid #1B7A4D', borderBottom: '1px solid #1B7A4D' }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '44px', padding: '0 16px' }}>
        <div style={{ height: '4px', width: '48px', background: 'transparent', borderTop: '1px solid #1B7A4D', borderBottom: '1px solid #1B7A4D', margin: '0 auto 14px' }} />
        <h2 style={{ fontFamily: "'BebasNeue','Bebas Neue',sans-serif", color: '#1c1208', fontSize: 'clamp(32px,5vw,64px)', lineHeight: 1, letterSpacing: '0.02em', margin: 0 }}>
          HOT PRODUCTS
        </h2>
        <p style={{ fontSize: '15px', color: '#6B7280', margin: '10px 0 0', maxWidth: '500px', marginInline: 'auto', lineHeight: 1.5 }}>
          In High Demand
        </p>
        <div style={{ borderTop: '1px dashed rgba(20,92,60,0.4)', margin: '20px auto 0', maxWidth: '360px' }} />
      </div>

      {/* Mobile grid */}
      <div className="block lg:hidden" style={{ padding: '0 16px' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-4">
          {products.map((product) => renderProductCard(product, 'mobile'))}
        </div>
      </div>

      {/* Desktop auto-scroll */}
      <div className="hidden lg:block" style={{ padding: '0 24px' }}>
        <AutoScrollContainer>
          {products.map((product) => renderProductCard(product, 'desktop'))}
        </AutoScrollContainer>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', marginTop: '44px' }}>
        <Link
          href="/hot-products"
          style={{ display: 'inline-block', background: 'transparent', color: '#2d8f47', fontFamily: "'BebasNeue','Bebas Neue',sans-serif", fontSize: '19px', letterSpacing: '0.06em', padding: '12px 48px', textDecoration: 'none', border: '2px solid #2d8f47', borderRadius: '4px', transition: 'background 0.18s, color 0.18s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'radial-gradient(ellipse at 50% 35%, #3cb05b 0%, #2d8f47 55%, #226b35 100%)'; (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = '#2d8f47'; }}
        >
          SHOP ALL HOT PRODUCTS →
        </Link>
      </div>

      {/* Thin light navbar green bottom rule with white stripe */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'transparent', borderTop: '1px solid #1B7A4D', borderBottom: '1px solid #1B7A4D' }} />
    </section>
  );
}

