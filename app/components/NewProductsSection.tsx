"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AutoScrollContainer, { type ProductViewMode } from './AutoScrollContainer';
import ViewModeToggle from './ViewModeToggle';
import UniversalProductCard from './UniversalProductCard';
import { addToCart } from '../lib/cart-utils';
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
  rating?: number;
  review_count?: number;
}

export default function NewProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ProductViewMode>('manual');

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
    return (
      <UniversalProductCard
        key={product.id}
        product={{
          ...product,
          price: product.sale_price && product.sale_price < (product.our_price ?? 0) 
            ? product.sale_price 
            : (product.our_price ?? 0),
          compare_at_price: product.sale_price && product.sale_price < (product.our_price ?? 0) 
            ? product.our_price 
            : undefined,
        }}
        viewMode="grid"
        size="medium"
        showQuickView={false}
        context="homepage"
        className={isDesktop ? 'w-[290px] flex-shrink-0' : ''}
      />
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
        <h2 style={{ fontFamily: "'BebasNeue','Bebas Neue',sans-serif", color: RS.dark, fontSize: 'clamp(32px,5vw,64px)', fontWeight: 400, lineHeight: 1, letterSpacing: '0.02em', margin: 0 }}>
          FRESH DROPS
        </h2>
        <p style={{ fontFamily: "'Fira Sans','Inter',sans-serif", fontSize: '15px', color: '#5B6560', margin: '10px 0 0', maxWidth: '500px', marginInline: 'auto', lineHeight: 1.5 }}>
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
