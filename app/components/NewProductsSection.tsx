"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { addToCart } from '../lib/cart-utils';
import AutoScrollContainer from './AutoScrollContainer';
import { useCompliance } from '../contexts/ComplianceContext';

// ── Fresh Drops palette — clean white + lime green ────────────────────────
const RS = {
  bg: '#ffffff',          // clean white section background
  accent: '#52C41A',      // lime green (matches Hot Products CTA)
  accentLight: '#63D420', // lighter lime for gradients
  dark: '#1c1208',        // aged dark brown (kept for text)
  muted: '#6B7280',       // neutral grey for subtext
  white: '#ffffff',       // card background
};

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

  useEffect(() => {
    if (userZipCode && products.length > 0) {
      const idsToCheck = products.map(p => p.id).filter(id => !restrictedProductIds.includes(id));
      if (idsToCheck.length > 0) checkProductEligibility(idsToCheck);
    }
  }, [userZipCode, products, restrictedProductIds, checkProductEligibility]);

  const fetchNewProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/newest/products?limit=12');
      if (!response.ok) {
        let msg = `HTTP ${response.status}: ${response.statusText}`;
        try { msg = (await response.json()).error || msg; } catch { /* noop */ }
        throw new Error(msg);
      }
      const data = await response.json();
      if (!data.products) { setProducts([]); return; }
      setProducts(data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getPrice = (p: Product) => {
    const num = parseFloat(p.our_price.toString());
    return Number.isFinite(num) ? num.toFixed(2) : '0.00';
  };

  const handleAddToCart = async (productId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    try { await addToCart(productId, 1); } catch (e) { console.error(e); }
  };

  const renderCard = (product: Product, isDesktop: boolean) => {
    const isRestricted = restrictedProductIds.includes(product.id);
    const imageUrl = product.image_url ||
      (product.image_urls && product.image_urls.length > 0 ? product.image_urls[0] : null);
    const brand = product.brand_name && product.brand_name !== 'Unknown Brand'
      ? product.brand_name : null;

    return (
      <div
        key={product.id}
        className="group"
        style={{
          background: RS.white,
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(28,18,8,0.10)',
          transition: 'box-shadow 0.3s, transform 0.3s',
          flexShrink: isDesktop ? 0 : undefined,
          width: isDesktop ? '290px' : undefined,
          opacity: isRestricted ? 0.6 : 1,
          filter: isRestricted ? 'grayscale(1)' : undefined,
          pointerEvents: isRestricted ? 'none' : undefined,
          position: 'relative',
        }}
      >
        {/* Solid lime-green top accent bar */}
        <div style={{ height: '4px', background: 'linear-gradient(90deg, #63D420, #52C41A)', borderRadius: '1px 1px 0 0' }} />

        {/* Image */}
        <div style={{ position: 'relative', aspectRatio: '1', background: RS.bg, overflow: 'hidden' }}>
          <Link href={isRestricted ? '#' : `/product/${product.id}`} className="block w-full h-full">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, 290px"
                className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: RS.muted }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>📦</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '12px' }}>No Image</div>
                </div>
              </div>
            )}
          </Link>

          {/* "NEW ARRIVAL" ribbon badge */}
          <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, background: RS.accent, color: 'white', fontSize: '9px', fontWeight: 700, fontFamily: "'DM Sans',sans-serif", padding: '3px 8px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            🆕 NEW
          </div>

          {/* Restriction overlay */}
          {isRestricted && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', pointerEvents: 'none' }}>
              <div style={{ background: 'rgba(0,0,0,0.85)', border: '1px solid rgba(239,68,68,0.5)', borderRadius: '12px', padding: '18px', textAlign: 'center', transform: 'rotate(2deg)' }}>
                <div style={{ fontSize: '26px', marginBottom: '6px', color: '#ef4444' }}>🚫</div>
                <span style={{ color: 'white', fontFamily: "'DM Sans',sans-serif", fontWeight: 900, textTransform: 'uppercase', fontSize: '14px', lineHeight: 1, display: 'block' }}>Local Restriction</span>
                <span style={{ color: '#f87171', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', marginTop: '4px', display: 'block' }}>Limited Availability</span>
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '13px 15px 15px', display: 'flex', flexDirection: 'column' }}>
          {brand && (
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '10px', fontWeight: 700, color: RS.accent, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '3px' }}>
              {brand}
            </p>
          )}
          <Link href={isRestricted ? '#' : `/product/${product.id}`}>
            <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, color: RS.dark, fontSize: '14px', lineHeight: 1.35, marginBottom: '6px' }} className="line-clamp-2 group-hover:opacity-70 transition-opacity">
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: '21px', color: RS.accent, letterSpacing: '0.03em', marginBottom: '11px' }}>
            ${getPrice(product)}
          </div>

          {/* Side-by-side buttons */}
          <div style={{ display: 'flex', gap: '7px' }}>
            <button
              onClick={(e) => !isRestricted && handleAddToCart(product.id, e)}
              disabled={isRestricted}
              style={isRestricted
                ? { flex: 1, background: '#e5e5e5', color: '#999', fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em', padding: '9px 4px', border: 'none', cursor: 'not-allowed', textTransform: 'uppercase', borderRadius: '4px' }
                : { flex: 1, background: 'linear-gradient(to bottom, #63D420, #52C41A)', color: 'white', fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em', padding: '9px 4px', border: 'none', cursor: 'pointer', textTransform: 'uppercase', borderRadius: '4px', boxShadow: '0 2px 6px rgba(82,196,26,0.30)', transition: 'box-shadow 0.18s, transform 0.1s' }}
              onMouseEnter={e => { if (!isRestricted) { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 14px rgba(82,196,26,0.45)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; } }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 6px rgba(82,196,26,0.30)'; (e.currentTarget as HTMLButtonElement).style.transform = 'none'; }}
            >
              {isRestricted ? 'Unavailable' : 'Add to Cart'}
            </button>
            <Link
              href={isRestricted ? '#' : `/product/${product.id}`}
              style={{ flex: 1, border: '1.5px solid #52C41A', color: '#52C41A', fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em', padding: '8px 4px', textAlign: 'center', display: 'block', background: 'transparent', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '4px', transition: 'background 0.18s, color 0.18s' }}
              className="hover:bg-[#52C41A] hover:text-white"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <section style={{ marginTop: '64px', background: RS.bg, padding: '64px 16px' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'BebasNeue','Bebas Neue',sans-serif", color: RS.dark, fontSize: 'clamp(40px,7vw,80px)', letterSpacing: '0.02em' }}>FRESH DROPS</h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", color: '#ef4444', marginTop: '16px' }}>Unable to load new products. Please refresh the page.</p>
        </div>
      </section>
    );
  }

  if (!loading && products.length === 0) return null;

  return (
    // ── Roadside Stop: Fresh Drops Section ──────────────────────────────────
    <section style={{ marginTop: '64px', background: RS.bg, padding: '60px 0 72px', position: 'relative' }}>
      {/* Thin lime green top rule */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #63D420, #52C41A)' }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '44px', padding: '0 16px' }}>
        <div style={{ height: '3px', width: '48px', background: RS.accent, margin: '0 auto 14px' }} />
        <h2 style={{ fontFamily: "'BebasNeue','Bebas Neue',sans-serif", color: RS.dark, fontSize: 'clamp(44px,7vw,88px)', lineHeight: 1, letterSpacing: '0.02em', margin: 0 }}>
          FRESH DROPS
        </h2>
        <div style={{ borderTop: `1px dashed ${RS.accent}50`, margin: '20px auto 0', maxWidth: '360px' }} />
      </div>

      {/* Static responsive grid — all breakpoints */}
      <div style={{ padding: '0 24px' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {loading
            ? Array(10).fill(null).map((_, i) => (
                <div key={i} style={{ background: RS.white, overflow: 'hidden', borderRadius: '6px' }} className="animate-pulse">
                  <div style={{ height: '4px', background: `${RS.accent}30` }} />
                  <div className="aspect-square" style={{ background: '#f0f0f0' }} />
                  <div style={{ padding: '13px 15px' }}>
                    <div className="h-2 rounded mb-2 w-1/3" style={{ background: '#e0e0e0' }} />
                    <div className="h-4 rounded mb-3" style={{ background: '#e0e0e0' }} />
                    <div className="h-6 rounded w-1/2 mb-3" style={{ background: '#e0e0e0' }} />
                    <div style={{ display: 'flex', gap: '7px' }}>
                      <div className="h-9 flex-1 rounded" style={{ background: '#e0e0e0' }} />
                      <div className="h-9 flex-1 rounded" style={{ background: '#e0e0e0' }} />
                    </div>
                  </div>
                </div>
              ))
            : products.slice(0, 10).map((product) => renderCard(product, false))
          }
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', marginTop: '44px' }}>
        <Link
          href="/fresh-drops"
          style={{ display: 'inline-block', background: 'transparent', color: '#52C41A', fontFamily: "'BebasNeue','Bebas Neue',sans-serif", fontSize: '19px', letterSpacing: '0.06em', padding: '12px 48px', textDecoration: 'none', border: '2px solid #52C41A', borderRadius: '4px', transition: 'background 0.18s, color 0.18s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#52C41A'; (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = '#52C41A'; }}
        >
          VIEW ALL FRESH DROPS →
        </Link>
      </div>

      {/* Thin lime green bottom rule */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #52C41A, #63D420)' }} />
    </section>
  );
}
