"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import { addToCart } from "../lib/cart-utils";
import GlobalBreadcrumbs from "../components/GlobalBreadcrumbs";

// ── Roadside Stop palette ──────────────────────────────────────────────────
const RS = {
  bg: '#ffffff',          // white background
  hero: '#1c1208',        // aged dark brown for hero bg
  heroBg2: '#2e1c0d',     // lighter dark brown gradient end
  accent: '#bf6830',      // deep ochre/rust
  accentLight: '#d9883e', // lighter ochre
  dark: '#1c1208',        // dark text
  muted: '#8a7d6a',       // dusty road muted text
  white: '#ffffff',       // white cards
};

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  is_featured: boolean;
  is_active: boolean;
  slug: string;
  brand_name?: string;
  short_description?: string;
  stock_quantity?: number;
}

interface RawProduct {
  id: number;
  name: string;
  sale_price: number | null;
  our_price: number | null;
  image_url: string | null;
  category_id: string | null;
  featured: boolean;
  is_active: boolean;
  slug: string | null;
  brand_name: string | null;
  short_description: string | null;
  stock_quantity: number | null;
}

export default function FreshDropsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFreshDrops() {
      try {
        const response = await fetch('/api/newest/products?limit=24');
        if (!response.ok) throw new Error('Failed to fetch fresh drops');
        const data = await response.json();
        const rawProducts: RawProduct[] = Array.isArray(data) ? data : (data.products || []);
        setProducts(rawProducts.map((p) => ({
          id: String(p.id),
          title: p.name || 'Unknown Product',
          price: Number(p.sale_price || p.our_price || 0),
          image: p.image_url || '',
          category: p.category_id || 'Fresh Drop',
          rating: 5,
          reviews: 0,
          is_featured: p.featured || false,
          is_active: p.is_active || false,
          slug: p.slug || String(p.id),
          brand_name: p.brand_name || undefined,
          short_description: p.short_description || undefined,
          stock_quantity: p.stock_quantity || 0,
        })));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchFreshDrops();
  }, []);

  const handleAddToCart = (e: MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
    // Floating +1
    const btn = e.currentTarget as HTMLButtonElement;
    const rect = btn.getBoundingClientRect();
    const el = document.createElement('div');
    el.textContent = '+1';
    el.style.cssText = `position:fixed;left:${rect.left + rect.width / 2}px;top:${rect.top}px;color:${RS.accent};font-weight:700;pointer-events:none;z-index:1000;`;
    el.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-20px)', opacity: 0 }], { duration: 800, easing: 'ease-out' });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 800);
  };

  return (
    <div style={{ background: RS.bg, minHeight: '100vh' }}>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section style={{ background: `linear-gradient(160deg, ${RS.hero} 0%, ${RS.heroBg2} 50%, ${RS.hero} 100%)`, paddingTop: '80px', paddingBottom: '80px', position: 'relative', overflow: 'hidden' }}>

        {/* Horizontal dashed road marker */}
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: `repeating-linear-gradient(90deg, ${RS.accent} 0, ${RS.accent} 32px, transparent 32px, transparent 52px)`, opacity: 0.15, transform: 'translateY(-50%)' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          {/* Eyebrow */}
          <p style={{ fontFamily: "'DM Sans',sans-serif", color: RS.accent, fontSize: '11px', fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: '10px' }}>
            Highway 420 · Latest Arrivals
          </p>

          {/* Ochre accent rule */}
          <div style={{ height: '3px', width: '48px', background: RS.accent, margin: '0 auto 16px' }} />

          {/* Title */}
          <h1 style={{ fontFamily: "'BebasNeue','Bebas Neue',sans-serif", color: RS.bg, fontSize: 'clamp(56px,10vw,120px)', lineHeight: 1, letterSpacing: '0.02em', margin: '0 0 16px' }}>
            FRESH DROPS
          </h1>

          {/* Sub */}
          <p style={{ fontFamily: "'DM Sans',sans-serif", color: RS.muted, fontSize: '16px', maxWidth: '480px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            The latest arrivals, just pulled off the truck. Be the first to grab them.
          </p>

          <div style={{ borderTop: `1px dashed ${RS.accent}50`, maxWidth: '360px', margin: '0 auto 20px' }} />

          {/* Stat pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {[
              { icon: '🆕', label: `${products.length > 0 ? products.length : '24+'} New Arrivals` },
              { icon: '⚡', label: 'Limited Stock' },
              { icon: '💎', label: 'Premium Quality' },
            ].map(({ icon, label }, i) => (
              <span key={i} style={{ fontFamily: "'DM Sans',sans-serif", color: RS.muted, fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: RS.accent }}>{icon}</span>{label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Products Grid ─────────────────────────────────────────────────── */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px 80px' }}>
        <GlobalBreadcrumbs paths={[{ name: 'Fresh Drops' }]} />

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ background: RS.white, overflow: 'hidden' }} className="animate-pulse">
                <div style={{ height: '4px', background: `${RS.accent}30` }} />
                <div className="aspect-square" style={{ background: '#e4d5bc' }} />
                <div style={{ padding: '13px 15px' }}>
                  <div className="h-2 rounded mb-3 w-1/3" style={{ background: '#d4c5a9' }} />
                  <div className="h-4 rounded mb-2" style={{ background: '#d4c5a9' }} />
                  <div className="h-6 rounded w-1/2 mb-4" style={{ background: '#d4c5a9' }} />
                  <div style={{ display: 'flex', gap: '7px' }}>
                    <div className="h-10 flex-1" style={{ background: '#d4c5a9' }} />
                    <div className="h-10 flex-1" style={{ background: '#d4c5a9' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <h3 style={{ fontFamily: "'DM Sans',sans-serif", color: RS.dark, fontSize: '20px', marginBottom: '12px' }}>Error loading fresh drops</h3>
            <p style={{ color: RS.muted }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{ marginTop: '24px', padding: '12px 36px', background: RS.accent, color: 'white', fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}
              className="hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <div key={product.id} className="group" style={{ background: RS.white, overflow: 'hidden', boxShadow: '0 2px 14px rgba(28,18,8,0.09)', transition: 'box-shadow 0.3s, transform 0.3s' }}>
                {/* Rope-stitch dashed accent */}
                <div style={{ height: '4px', background: `repeating-linear-gradient(90deg, ${RS.accent} 0, ${RS.accent} 12px, transparent 12px, transparent 18px)`, opacity: 0.8 }} />

                {/* Image */}
                <Link href={`/product/${product.slug}`}>
                  <div style={{ position: 'relative', aspectRatio: '1', background: RS.bg, overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, background: RS.accent, color: 'white', fontSize: '9px', fontWeight: 700, fontFamily: "'DM Sans',sans-serif", padding: '3px 8px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                      🆕 NEW
                    </div>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: RS.muted }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '40px', marginBottom: '8px' }}>📦</div>
                          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '12px' }}>No Image</div>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Body */}
                <div style={{ padding: '13px 15px 15px', display: 'flex', flexDirection: 'column' }}>
                  {product.brand_name && (
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '10px', fontWeight: 700, color: RS.accent, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {product.brand_name}
                    </p>
                  )}
                  <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, color: RS.dark, fontSize: '14px', lineHeight: 1.35, marginBottom: '8px' }} className="line-clamp-2">
                    {product.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: '21px', color: RS.accent, letterSpacing: '0.03em' }}>${product.price.toFixed(2)}</span>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '10px', color: RS.accent, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Just Dropped</span>
                  </div>

                  {/* Side-by-side buttons */}
                  <div style={{ display: 'flex', gap: '7px' }}>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      style={{ flex: 1, background: RS.accent, color: 'white', fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em', padding: '10px 4px', border: 'none', cursor: 'pointer', textTransform: 'uppercase', transition: 'opacity 0.2s' }}
                      className="hover:opacity-85"
                    >
                      Add to Cart
                    </button>
                    <Link
                      href={`/product/${product.slug}`}
                      style={{ flex: 1, border: `1.5px solid ${RS.accent}`, color: RS.accent, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em', padding: '9px 4px', textAlign: 'center', display: 'block', background: 'transparent', textTransform: 'uppercase', textDecoration: 'none', transition: 'background 0.2s, color 0.2s' }}
                      className="hover:bg-[#bf6830] hover:text-white"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Back link ─────────────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', paddingBottom: '80px' }}>
        <Link
          href="/products"
          style={{ fontFamily: "'DM Sans',sans-serif", color: RS.accent, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: `1px solid ${RS.accent}`, paddingBottom: '2px' }}
        >
          ← Back to All Products
        </Link>
      </div>
    </div>
  );
}
