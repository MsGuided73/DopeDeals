"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { addToCart } from '../lib/cart-utils';
import AutoScrollContainer, { type ProductViewMode } from './AutoScrollContainer';
import ViewModeToggle from './ViewModeToggle';
import { useCompliance } from '../contexts/ComplianceContext';

// ── Fresh Drops palette — clean white + lime green ────────────────────────
const RS = {
  bg: '#F5F5F5',          // light gray section background (matches Shop by Category)
  accent: '#2d8f47',      // lime green (matches Hot Products CTA)
  accentLight: '#3cb05b', // lighter lime for gradients
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
  // Defaults to 'grid' since the original layout was a static grid.
  const [viewMode, setViewMode] = useState<ProductViewMode>('grid');

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
    const activePrice = p.sale_price && p.sale_price < (p.our_price ?? 0) ? p.sale_price : (p.our_price ?? 0);
    const num = parseFloat(activePrice.toString());
    return Number.isFinite(num) ? num.toFixed(2) : '0.00';
  };

  const getOriginalPrice = (p: Product) => {
    if (p.sale_price && p.sale_price < (p.our_price ?? 0)) {
      const num = parseFloat((p.our_price ?? 0).toString());
      return Number.isFinite(num) ? num.toFixed(2) : null;
    }
    return null;
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
        {/* Light navbar green top accent bar with white stripe */}
        <div style={{ height: '4px', background: '#ffffff', borderTop: '1px solid #1B7A4D', borderBottom: '1px solid #1B7A4D', borderRadius: '1px 1px 0 0' }} />

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
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '11px' }}>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: '21px', color: RS.accent, letterSpacing: '0.03em' }}>
              ${getPrice(product)}
            </div>
            {getOriginalPrice(product) && (
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '12px', color: '#9ca3af', textDecoration: 'line-through' }}>
                ${getOriginalPrice(product)}
              </div>
            )}
          </div>

          {/* Side-by-side buttons */}
          <div style={{ display: 'flex', gap: '7px' }}>
            <button
              onClick={(e) => !isRestricted && handleAddToCart(product.id, e)}
              disabled={isRestricted}
              style={isRestricted
                ? { flex: 1, background: '#e5e5e5', color: '#999', fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em', padding: '9px 4px', border: 'none', cursor: 'not-allowed', textTransform: 'uppercase', borderRadius: '4px' }
                : { flex: 1, background: 'linear-gradient(to bottom, #3cb05b, #2d8f47)', color: 'white', fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em', padding: '9px 4px', border: 'none', cursor: 'pointer', textTransform: 'uppercase', borderRadius: '4px', boxShadow: '0 2px 6px rgba(82,196,26,0.30)', transition: 'box-shadow 0.18s, transform 0.1s' }}
              onMouseEnter={e => { if (!isRestricted) { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 14px rgba(82,196,26,0.45)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; } }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 6px rgba(82,196,26,0.30)'; (e.currentTarget as HTMLButtonElement).style.transform = 'none'; }}
            >
              {isRestricted ? 'Unavailable' : 'Add to Cart'}
            </button>
            <Link
              href={isRestricted ? '#' : `/product/${product.id}`}
              style={{ flex: 1, border: '1.5px solid #2d8f47', color: '#2d8f47', fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em', padding: '8px 4px', textAlign: 'center', display: 'block', background: 'transparent', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '4px', transition: 'background 0.18s, color 0.18s' }}
              className="hover:bg-[#2d8f47] hover:text-white"
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
          <h2 style={{ fontFamily: "'BebasNeue','Bebas Neue',sans-serif", color: RS.dark, fontSize: 'clamp(32px,5vw,64px)', letterSpacing: '0.02em' }}>FRESH DROPS</h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", color: '#ef4444', marginTop: '16px' }}>Unable to load new products. Please refresh the page.</p>
        </div>
      </section>
    );
  }

  if (!loading && products.length === 0) return null;

  return (
    // ── Roadside Stop: Fresh Drops Section ──────────────────────────────────
    <section style={{ marginTop: '64px', background: RS.bg, padding: '60px 0 72px', position: 'relative' }}>
      {/* Thin light navbar green top rule with white stripe */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'transparent', borderTop: '1px solid #1B7A4D', borderBottom: '1px solid #1B7A4D' }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '44px', padding: '0 16px' }}>
        <div style={{ height: '4px', width: '48px', background: 'transparent', borderTop: '1px solid #1B7A4D', borderBottom: '1px solid #1B7A4D', margin: '0 auto 14px' }} />
        <h2 style={{ fontFamily: "'BebasNeue','Bebas Neue',sans-serif", color: RS.dark, fontSize: 'clamp(32px,5vw,64px)', lineHeight: 1, letterSpacing: '0.02em', margin: 0 }}>
          FRESH DROPS
        </h2>
        <p style={{ fontSize: '15px', color: RS.muted, margin: '10px 0 0', maxWidth: '500px', marginInline: 'auto', lineHeight: 1.5 }}>
          Just Hit the Road
        </p>
        <div style={{ borderTop: `1px dashed rgba(20,92,60,0.5)`, margin: '20px auto 0', maxWidth: '360px' }} />
      </div>

      {/* View mode toggle — desktop only (mobile keeps the dense static grid) */}
      <div className="hidden lg:flex max-w-7xl mx-auto justify-end mb-4 px-6">
        <ViewModeToggle mode={viewMode} onChange={setViewMode} />
      </div>

      {/* Mobile: keep the original dense static grid (no scroll on small screens) */}
      <div className="block lg:hidden" style={{ padding: '0 24px' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-4">
          {loading
            ? Array(6).fill(null).map((_, i) => (
                <div key={i} style={{ background: RS.white, overflow: 'hidden', borderRadius: '6px' }} className="animate-pulse">
                  <div style={{ height: '4px', background: `${RS.accent}30` }} />
                  <div className="aspect-square" style={{ background: '#f0f0f0' }} />
                  <div style={{ padding: '13px 15px' }}>
                    <div className="h-2 rounded mb-2 w-1/3" style={{ background: '#e0e0e0' }} />
                    <div className="h-4 rounded mb-3" style={{ background: '#e0e0e0' }} />
                    <div className="h-6 rounded w-1/2 mb-3" style={{ background: '#e0e0e0' }} />
                  </div>
                </div>
              ))
            : products.slice(0, 6).map((product) => renderCard(product, false))
          }
        </div>
      </div>

      {/* Desktop: AutoScrollContainer driven by the selected view mode.
          Pass isDesktop=true so cards have fixed width + flex-shrink:0,
          which is what auto/manual scroll modes need to render correctly. */}
      <div className="hidden lg:block" style={{ padding: '0 24px' }}>
        <AutoScrollContainer mode={viewMode}>
          {products.slice(0, 10).map((product) => renderCard(product, true))}
        </AutoScrollContainer>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', marginTop: '44px' }}>
        <Link
          href="/fresh-drops"
          style={{ display: 'inline-block', background: 'transparent', color: '#2d8f47', fontFamily: "'BebasNeue','Bebas Neue',sans-serif", fontSize: '19px', letterSpacing: '0.06em', padding: '12px 48px', textDecoration: 'none', border: '2px solid #2d8f47', borderRadius: '4px', transition: 'background 0.18s, color 0.18s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#2d8f47'; (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = '#2d8f47'; }}
        >
          VIEW ALL FRESH DROPS →
        </Link>
      </div>

      {/* Thin light navbar green bottom rule with white stripe */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'transparent', borderTop: '1px solid #1B7A4D', borderBottom: '1px solid #1B7A4D' }} />
    </section>
  );
}
