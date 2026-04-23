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

// Brand tokens — matches FeaturedProductsSection on the landing page.
const LIME = "#52C41A";
const LIME_BRIGHT = "#63D420";
const LIME_DARK = "#3DA614";
const HOT_RED = "#E53E3E";
const INK = "#1c1208";

export default function HotProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHotProducts() {
      try {
        const response = await fetch("/api/products/featured");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        const rawProducts = Array.isArray(data) ? data : (data.products || []);
        const mappedProducts = rawProducts.map((p: any) => ({
          id: String(p.id),
          title: p.name || "Unknown Product",
          price: Number(p.sale_price || p.our_price || 0),
          image: p.image_url || null,
          category: p.category_id || "General",
          rating: 5,
          reviews: Math.floor(Math.random() * 50) + 10,
          is_featured: p.featured || false,
          is_active: p.is_active || false,
          slug: p.slug || String(p.id),
        }));
        setProducts(mappedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
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

    // Floating +1 animation — lime to match brand
    const btn = e.currentTarget as HTMLButtonElement;
    const rect = btn.getBoundingClientRect();
    const el = document.createElement("div");
    el.textContent = "+1";
    el.style.cssText = `position:fixed;left:${rect.left + rect.width / 2}px;top:${rect.top}px;color:${LIME};font-weight:800;pointer-events:none;z-index:1000;`;
    el.className = "animate-float-up";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  };

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh" }}>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          background: "#ffffff",
          padding: "72px 24px 56px",
          textAlign: "center",
        }}
      >
        {/* Top lime rule */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${LIME_BRIGHT}, ${LIME})`,
          }}
        />

        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>


          <div
            style={{
              height: "3px",
              width: "48px",
              background: LIME,
              margin: "0 auto 18px",
            }}
          />

          <h1
            style={{
              fontFamily: "'BebasNeue','Bebas Neue','Impact',sans-serif",
              color: INK,
              fontSize: "clamp(56px,10vw,128px)",
              lineHeight: 0.92,
              letterSpacing: "-0.01em",
              margin: "0 0 16px",
            }}
          >
            HOT PRODUCTS
          </h1>



          {/* Trust row */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "28px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            {[
              { icon: "🔥", label: `${products.length > 0 ? products.length : "20+"} Items` },
              { icon: "✓", label: "Fast Shipping" },
              { icon: "★", label: "Top Rated" },
            ].map(({ icon, label }, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "'Fira Sans','Inter',sans-serif",
                  color: "#6B7280",
                  fontSize: "12px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span style={{ color: LIME_DARK }}>{icon}</span>
                {label}
              </span>
            ))}
          </div>

          {/* Dashed lime divider */}
          <div
            style={{
              borderTop: `1px dashed rgba(82,196,26,0.4)`,
              margin: "0 auto",
              maxWidth: "360px",
            }}
          />
        </div>
      </section>

      {/* ── Grid ─────────────────────────────────────────────────────── */}
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px 80px" }}>
        <GlobalBreadcrumbs paths={[{ name: "Hot Products" }]} />

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  overflow: "hidden",
                  borderRadius: "6px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                }}
                className="animate-pulse"
              >
                <div
                  style={{
                    height: "4px",
                    background: `linear-gradient(90deg, ${LIME_BRIGHT}, ${LIME})`,
                    borderRadius: "6px 6px 0 0",
                  }}
                />
                <div className="aspect-square bg-gray-100" />
                <div style={{ padding: "14px 16px" }}>
                  <div className="h-2 bg-gray-200 rounded mb-3 w-1/3" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
                  <div style={{ display: "flex", gap: "8px" }}>
                    <div className="h-10 bg-gray-200 flex-1 rounded" />
                    <div className="h-10 bg-gray-200 flex-1 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <h3
              style={{
                fontFamily: "'Fira Sans','Inter',sans-serif",
                color: INK,
                fontSize: "20px",
                marginBottom: "12px",
              }}
            >
              Error loading products
            </h3>
            <p style={{ color: "#888" }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: "24px",
                padding: "12px 36px",
                background: `linear-gradient(to bottom, ${LIME_BRIGHT}, ${LIME})`,
                color: "white",
                fontFamily: "'Fira Sans','Inter',sans-serif",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                border: "none",
                cursor: "pointer",
                borderRadius: "4px",
                boxShadow: "0 2px 6px rgba(82,196,26,0.30)",
              }}
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group"
                style={{
                  background: "white",
                  overflow: "hidden",
                  borderRadius: "6px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  transition: "box-shadow 0.3s, transform 0.3s",
                }}
              >
                {/* Lime-green top accent bar */}
                <div
                  style={{
                    height: "4px",
                    background: `linear-gradient(90deg, ${LIME_BRIGHT}, ${LIME})`,
                    borderRadius: "6px 6px 0 0",
                  }}
                />

                {/* Image */}
                <Link href={`/product/${product.slug}`}>
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "1",
                      background: "white",
                      overflow: "hidden",
                    }}
                  >
                    {/* HOT badge — red keeps the "hot" semantic, doesn't fight the lime brand */}
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        zIndex: 10,
                        background: HOT_RED,
                        color: "white",
                        fontSize: "10px",
                        fontWeight: 800,
                        fontFamily: "'Fira Sans','Inter',sans-serif",
                        padding: "3px 8px",
                        letterSpacing: "0.1em",
                        borderRadius: "3px",
                      }}
                    >
                      🔥 HOT
                    </div>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#999",
                          background: "#f5f5f5",
                        }}
                      >
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: "40px", marginBottom: "8px" }}>📦</div>
                          <div
                            style={{
                              fontFamily: "'Fira Sans','Inter',sans-serif",
                              fontSize: "12px",
                            }}
                          >
                            No Image
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Body */}
                <div
                  style={{
                    padding: "13px 15px 15px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Fira Sans','Inter',sans-serif",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: LIME,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      marginBottom: "3px",
                    }}
                  >
                    {product.category}
                  </p>
                  <h3
                    style={{
                      fontFamily: "'Fira Sans','Inter',sans-serif",
                      fontWeight: 600,
                      color: INK,
                      fontSize: "14px",
                      lineHeight: 1.35,
                      marginBottom: "6px",
                    }}
                    className="line-clamp-2"
                  >
                    {product.title}
                  </h3>
                  <div
                    style={{
                      fontFamily: "'Fira Sans','Inter',sans-serif",
                      fontWeight: 700,
                      fontSize: "21px",
                      color: LIME,
                      letterSpacing: "0.03em",
                      marginBottom: "11px",
                    }}
                  >
                    ${product.price.toFixed(2)}
                  </div>

                  {/* Side-by-side buttons */}
                  <div style={{ display: "flex", gap: "7px" }}>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      style={{
                        flex: 1,
                        background: `linear-gradient(to bottom, ${LIME_BRIGHT}, ${LIME})`,
                        color: "white",
                        fontFamily: "'Fira Sans','Inter',sans-serif",
                        fontWeight: 700,
                        fontSize: "11px",
                        letterSpacing: "0.05em",
                        padding: "9px 4px",
                        border: "none",
                        cursor: "pointer",
                        textTransform: "uppercase",
                        borderRadius: "4px",
                        boxShadow: "0 2px 6px rgba(82,196,26,0.30)",
                        transition: "box-shadow 0.18s, transform 0.1s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.boxShadow =
                          "0 4px 14px rgba(82,196,26,0.45)";
                        (e.currentTarget as HTMLButtonElement).style.transform =
                          "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.boxShadow =
                          "0 2px 6px rgba(82,196,26,0.30)";
                        (e.currentTarget as HTMLButtonElement).style.transform = "none";
                      }}
                    >
                      Add to Cart
                    </button>
                    <Link
                      href={`/product/${product.slug}`}
                      style={{
                        flex: 1,
                        border: `1.5px solid ${LIME}`,
                        color: LIME,
                        fontFamily: "'Fira Sans','Inter',sans-serif",
                        fontWeight: 700,
                        fontSize: "11px",
                        letterSpacing: "0.05em",
                        padding: "8px 4px",
                        textAlign: "center",
                        display: "block",
                        background: "transparent",
                        textTransform: "uppercase",
                        textDecoration: "none",
                        borderRadius: "4px",
                        transition: "background 0.18s, color 0.18s",
                      }}
                      className="hover:bg-[#52C41A] hover:text-white"
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

      {/* ── Back link ────────────────────────────────────────────────── */}
      <div style={{ textAlign: "center", paddingBottom: "80px", position: "relative" }}>
        <Link
          href="/products"
          style={{
            fontFamily: "'Fira Sans','Inter',sans-serif",
            color: LIME_DARK,
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            textDecoration: "none",
            borderBottom: `1px solid ${LIME}`,
            paddingBottom: "2px",
          }}
        >
          ← Back to All Products
        </Link>

        {/* Bottom lime rule */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${LIME}, ${LIME_BRIGHT})`,
          }}
        />
      </div>
    </div>
  );
}
