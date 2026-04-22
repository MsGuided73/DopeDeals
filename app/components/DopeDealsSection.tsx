"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { addToCart } from '../lib/cart-utils';
import AutoScrollContainer from './AutoScrollContainer';
import { useCompliance } from '../contexts/ComplianceContext';

// ── Dope Deals palette — mirrors Hot Products brand green ─────────────────
const DD = {
  accent:  '#52C41A',
  accentL: '#63D420',
  dark:    '#1c1208',
  muted:   '#6B7280',
  white:   '#ffffff',
  grad:    'radial-gradient(ellipse at 50% 35%, #5FD01D 0%, #52C41A 55%, #42A416 100%)',
  gradHover: 'radial-gradient(ellipse at 50% 35%, #72E028 0%, #5FD01D 55%, #4DBA17 100%)',
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

  const { restrictedProductIds, checkProductEligibility, userZipCode } = useCompliance();

  useEffect(() => { fetchDopeDeals(); }, []);

  useEffect(() => {
    if (userZipCode && products.length > 0) {
      const idsToCheck = products.map(p => p.id).filter(id => !restrictedProductIds.includes(id));
      if (idsToCheck.length > 0) checkProductEligibility(idsToCheck);
    }
  }, [userZipCode, products, restrictedProductIds, checkProductEligibility]);

  const fetchDopeDeals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dope-deals?limit=20');
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

  const getDiscountPercent = (p: Product) => p.DD15 ? 15 : p.DD10 ? 10 : 0;

  const getSalePrice = (p: Product) => {
    const disc = getDiscountPercent(p);
    const base = parseFloat(p.our_price.toString());
    return disc > 0 ? base * (1 - disc / 100) : base;
  };

  const getImageUrl = (p: Product) =>
    p.image_url || (p.image_urls && p.image_urls.length > 0 ? p.image_urls[0] : null);

  const renderCard = (product: Product, isDesktop: boolean) => {
    const isRestricted = restrictedProductIds.includes(product.id);
    const disc = getDiscountPercent(product);
    const salePrice = getSalePrice(product);
    const origPrice = parseFloat(product.our_price.toString());
    const imageUrl = getImageUrl(product);
    const brand = product.brand_name && product.brand_name !== 'Unknown Brand'
      ? product.brand_name : null;

    return (
      <div
        key={product.id}
        className="group"
        style={{
          background: DD.white,
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          transition: 'box-shadow 0.3s, transform 0.3s',
          flexShrink: isDesktop ? 0 : undefined,
          width: isDesktop ? '260px' : undefined,
          opacity: isRestricted ? 0.6 : 1,
          filter: isRestricted ? 'grayscale(1)' : undefined,
          position: 'relative',
          borderRadius: '6px',
        }}
      >
        {/* Lime-green top accent bar */}
        <div style={{ height: '4px', background: `linear-gradient(90deg, ${DD.accentL}, ${DD.accent})`, borderRadius: '6px 6px 0 0' }} />

        {/* Image */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1', background: DD.white, overflow: 'hidden' }}>
          <Link href={isRestricted ? '#' : `/product/${product.id}`} className="block w-full h-full">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 50vw, 260px"
                className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: DD.muted, background: '#f5f5f5', position: 'absolute', inset: 0 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>📦</div>
                  <div style={{ fontSize: '11px', color: '#aaa' }}>No Image</div>
                </div>
              </div>
            )}
          </Link>

          {/* Discount badge */}
          {disc > 0 && (
            <div style={{ position: 'absolute', top: 8, left: 8, background: '#E53E3E', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '3px', letterSpacing: '0.05em', zIndex: 10 }}>
              -{disc}% OFF
            </div>
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
        </div>

        {/* Body */}
        <div style={{ padding: '13px 15px 15px', display: 'flex', flexDirection: 'column' }}>
          {brand && (
            <p className="dg-lime-text-gradient" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '3px' }}>
              {brand}
            </p>
          )}
          <Link href={isRestricted ? '#' : `/product/${product.id}`}>
            <h3 style={{ fontWeight: 600, color: DD.dark, fontSize: '14px', lineHeight: 1.35, marginBottom: '6px' }} className="line-clamp-2 group-hover:opacity-70 transition-opacity">
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div style={{ fontWeight: 700, fontSize: '21px', letterSpacing: '0.03em', marginBottom: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="dg-lime-text-gradient">${salePrice.toFixed(2)}</span>
            {disc > 0 && (
              <span style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 400, textDecoration: 'line-through' }}>
                ${origPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '7px' }}>
            <button
              onClick={async (e) => { e.stopPropagation(); if (!isRestricted) await addToCart(product.id, 1); }}
              disabled={isRestricted}
              style={isRestricted
                ? { flex: 1, background: '#e5e5e5', color: '#999', fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em', padding: '9px 4px', border: 'none', cursor: 'not-allowed', textTransform: 'uppercase', borderRadius: '4px' }
                : { flex: 1, background: DD.grad, color: 'white', fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em', padding: '9px 4px', border: 'none', cursor: 'pointer', textTransform: 'uppercase', borderRadius: '4px', boxShadow: '0 2px 6px rgba(82,196,26,0.30)', transition: 'box-shadow 0.18s, transform 0.1s' }}
              onMouseEnter={e => { if (!isRestricted) { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 14px rgba(82,196,26,0.45)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; } }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 6px rgba(82,196,26,0.30)'; (e.currentTarget as HTMLButtonElement).style.transform = 'none'; }}
            >
              {isRestricted ? 'Unavailable' : 'Add to Cart'}
            </button>
            <Link
              href={isRestricted ? '#' : `/product/${product.id}`}
              style={{ flex: 1, border: `1.5px solid ${DD.accent}`, color: DD.accent, fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em', padding: '8px 4px', textAlign: 'center', display: 'block', background: 'transparent', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '4px', transition: 'background 0.18s, color 0.18s' }}
              className="hover:bg-[#52C41A] hover:text-white"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    );
  };

  // ── Loading skeleton (matches Hot Products style) ────────────────────────
  if (loading) {
    return (
      <section style={{ background: DD.white, padding: '60px 0 72px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg, ${DD.accentL}, ${DD.accent})` }} />
        <div style={{ textAlign: 'center', marginBottom: '44px', padding: '0 16px' }}>
          <div style={{ height: '14px', width: '160px', background: '#e8f5e1', borderRadius: '6px', margin: '0 auto 14px' }} />
          <div style={{ height: '3px', width: '48px', background: '#e8f5e1', margin: '0 auto 14px' }} />
          <div style={{ height: '80px', width: '280px', background: '#e8f5e1', borderRadius: '6px', margin: '0 auto' }} />
        </div>
        <div style={{ padding: '0 24px' }}>
          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 animate-pulse">
            {Array(10).fill(null).map((_, i) => (
              <div key={i} style={{ background: DD.white, overflow: 'hidden', borderRadius: '6px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ height: '4px', background: `${DD.accent}30` }} />
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
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section style={{ background: DD.white, padding: '60px 0 72px', position: 'relative' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'BebasNeue','Bebas Neue',sans-serif", color: DD.dark, fontSize: 'clamp(44px,7vw,88px)', letterSpacing: '0.02em' }}>DOPE DEALS</h2>
          <p style={{ color: '#ef4444', marginTop: '16px' }}>Unable to load deals. Please refresh.</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section id="dope-deals" style={{ background: DD.white, padding: '60px 0 72px', position: 'relative' }}>
      {/* Thin lime green top rule */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg, ${DD.accentL}, ${DD.accent})` }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '44px', padding: '0 16px' }}>
        <div style={{ height: '3px', width: '48px', background: DD.accent, margin: '0 auto 14px' }} />
        <h2 style={{ fontFamily: "'BebasNeue','Bebas Neue',sans-serif", color: DD.dark, fontSize: 'clamp(44px,7vw,88px)', lineHeight: 1, letterSpacing: '0.02em', margin: 0 }}>
          DOPE DEALS
        </h2>
        <div style={{ borderTop: `1px dashed ${DD.accent}50`, margin: '20px auto 0', maxWidth: '360px' }} />
      </div>

      {/* Mobile grid */}
      <div className="block lg:hidden" style={{ padding: '0 16px' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-4">
          {products.slice(0, 6).map(p => renderCard(p, false))}
        </div>
      </div>

      {/* Desktop auto-scroll */}
      <div className="hidden lg:block" style={{ padding: '0 24px' }}>
        <AutoScrollContainer>
          {products.map(p => renderCard(p, true))}
        </AutoScrollContainer>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', marginTop: '44px' }}>
        <Link
          href="/products"
          style={{ display: 'inline-block', background: 'transparent', color: DD.accent, fontFamily: "'BebasNeue','Bebas Neue',sans-serif", fontSize: '19px', letterSpacing: '0.06em', padding: '12px 48px', textDecoration: 'none', border: `2px solid ${DD.accent}`, borderRadius: '4px', transition: 'background 0.18s, color 0.18s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = DD.grad; (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = DD.accent; }}
        >
          SHOP ALL DEALS →
        </Link>
      </div>

      {/* Thin lime green bottom rule */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg, ${DD.accent}, ${DD.accentL})` }} />
    </section>
  );
}
