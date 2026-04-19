"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import { addToCart } from "../lib/cart-utils";
import GlobalBreadcrumbs from "../components/GlobalBreadcrumbs";

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
}

export default function HotProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHotProducts() {
      try {
        const response = await fetch('/api/products/featured');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        const rawProducts = Array.isArray(data) ? data : (data.products || []);
        const mappedProducts = rawProducts.map((p: any) => ({
          id: String(p.id),
          title: p.name || 'Unknown Product',
          price: Number(p.sale_price || p.our_price || 0),
          image: p.image_url || null,
          category: p.category_id || 'General',
          rating: 5,
          reviews: Math.floor(Math.random() * 50) + 10,
          is_featured: p.featured || false,
          is_active: p.is_active || false,
          slug: p.slug || String(p.id),
        }));
        setProducts(mappedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchHotProducts();
  }, []);

  const handleAddToCart = (e: MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);

    // Floating +1 animation
    const btn = e.currentTarget as HTMLButtonElement;
    const rect = btn.getBoundingClientRect();
    const el = document.createElement('div');
    el.textContent = '+1';
    el.style.cssText = `position:fixed;left:${rect.left + rect.width / 2}px;top:${rect.top}px;color:#e8920a;font-weight:700;pointer-events:none;z-index:1000;`;
    el.className = 'animate-float-up';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  };

  const amber = '#e8920a';

  return (
    <div style={{ background: '#f5f0e8', minHeight: '100vh' }}>

      {/* ── Hero (diner v2 styling) ──────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          background: 'radial-gradient(ellipse at 50% 40%, #2a1e15 0%, #120c08 60%, #0d0d0b 100%)',
          overflow: 'hidden',
          padding: '96px 24px 120px',
        }}
      >
        {/* CRT scanlines */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'repeating-linear-gradient(0deg, rgba(0,0,0,0.045) 0px, rgba(0,0,0,0.045) 1px, transparent 1px, transparent 3px)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
        {/* Bottom amber radial glow */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '30%',
            background:
              'radial-gradient(ellipse at 50% 100%, rgba(232,146,10,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1280px', margin: '0 auto' }}>
          <p
            style={{
              fontFamily: "'DM Sans',sans-serif",
              color: amber,
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              marginBottom: '18px',
            }}
          >
            Highway 420 · Curated Collection
          </p>
          <h1
            style={{
              fontFamily: "'BebasNeue','Bebas Neue',sans-serif",
              color: '#fff8ec',
              fontSize: 'clamp(56px,10vw,120px)',
              lineHeight: 0.92,
              letterSpacing: '0.05em',
              margin: '0 0 18px',
              textShadow:
                '0 0 6px rgba(255, 232, 175, 0.95), 0 0 14px rgba(255, 200, 110, 0.75), 0 0 28px rgba(232, 146, 10, 0.65), 0 0 60px rgba(232, 146, 10, 0.45)',
            }}
          >
            HOT PRODUCTS
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans',sans-serif",
              color: 'rgba(255,255,255,0.78)',
              fontSize: '16px',
              maxWidth: '560px',
              margin: '0 0 28px',
              lineHeight: 1.6,
            }}
          >
            Our fastest-moving items — handpicked favorites customers can&apos;t stop buying.
          </p>
          <div style={{ borderTop: '1px dashed rgba(232,146,10,0.35)', maxWidth: '360px', margin: '0 0 22px' }} />
          <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
            {[
              { icon: '🔥', label: `${products.length > 0 ? products.length : '20+'} Items` },
              { icon: '✓', label: 'Fast Shipping' },
              { icon: '★', label: 'Top Rated' },
            ].map(({ icon, label }, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  color: 'rgba(255,255,255,0.65)',
                  fontSize: '12px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ color: amber }}>{icon}</span>
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grid ──────────────────────────────────────────────────────────── */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px 80px' }}>
        <GlobalBreadcrumbs paths={[{ name: 'Hot Products' }]} />

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ background: 'white', overflow: 'hidden' }} className="animate-pulse">
                <div style={{ height: '3px', background: `${amber}30` }} />
                <div className="aspect-square bg-gray-100" />
                <div style={{ padding: '14px 16px' }}>
                  <div className="h-2 bg-gray-200 rounded mb-3 w-1/3" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div className="h-10 bg-gray-200 flex-1" />
                    <div className="h-10 bg-gray-200 flex-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <h3 style={{ fontFamily: "'DM Sans',sans-serif", color: '#1e1e1e', fontSize: '20px', marginBottom: '12px' }}>Error loading products</h3>
            <p style={{ color: '#888' }}>{error}</p>
            <button onClick={() => window.location.reload()} style={{ marginTop: '24px', padding: '12px 36px', background: amber, color: 'white', fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <div key={product.id} className="group" style={{ background: 'white', overflow: 'hidden', boxShadow: '0 2px 14px rgba(0,0,0,0.07)', transition: 'box-shadow 0.3s,transform 0.3s' }}>
                {/* Speed stripe */}
                <div style={{ height: '3px', background: `linear-gradient(90deg,${amber},#f4ab2e)` }} />

                {/* Image */}
                <Link href={`/product/${product.slug}`}>
                  <div style={{ position: 'relative', aspectRatio: '1', background: 'white', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, background: amber, color: 'white', fontSize: '10px', fontWeight: 700, fontFamily: "'DM Sans',sans-serif", padding: '3px 8px', letterSpacing: '0.1em' }}>
                      🔥 HOT
                    </div>
                    {product.image ? (
                      <img src={product.image} alt={product.title} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', background: '#f5f0e8' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '40px', marginBottom: '8px' }}>📦</div>
                          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '12px' }}>No Image</div>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Body */}
                <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '10px', fontWeight: 700, color: amber, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {product.category}
                  </p>
                  <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, color: '#1e1e1e', fontSize: '14px', lineHeight: 1.35, marginBottom: '8px' }} className="line-clamp-2">
                    {product.title}
                  </h3>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: '22px', color: amber, letterSpacing: '0.03em', marginBottom: '12px' }}>
                    ${product.price.toFixed(2)}
                  </div>

                  {/* Side-by-side buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      style={{ flex: 1, background: amber, color: 'white', fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', padding: '10px 4px', border: 'none', cursor: 'pointer', textTransform: 'uppercase', transition: 'opacity 0.2s' }}
                      className="hover:opacity-90"
                    >
                      Add to Cart
                    </button>
                    <Link
                      href={`/product/${product.slug}`}
                      style={{ flex: 1, border: `1.5px solid ${amber}`, color: amber, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', padding: '9px 4px', textAlign: 'center', display: 'block', background: 'transparent', textTransform: 'uppercase', textDecoration: 'none', transition: 'background 0.2s,color 0.2s' }}
                      className="hover:bg-[#e8920a] hover:text-white"
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
        <Link href="/products" style={{ fontFamily: "'DM Sans',sans-serif", color: amber, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: `1px solid ${amber}`, paddingBottom: '2px' }}>
          ← Back to All Products
        </Link>
      </div>
    </div>
  );
}
