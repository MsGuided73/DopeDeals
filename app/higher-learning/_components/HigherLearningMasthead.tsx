// app/higher-learning/_components/HigherLearningMasthead.tsx
// Editorial-tone navbar for the Higher Learning blog and all sub-sections.
// Cream-on-black logo on a light page-matched bar with sparse uppercase nav.
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { User, ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";

const NAV_LINKS = [
  { label: "SHOP",            href: "/" },
  { label: "GEAR",            href: "/dabsntools" },
  { label: "ROAD TRIPS",      href: "/road-trips" },
  { label: "HIGHER LEARNING", href: "/higher-learning" },
  { label: "ABOUT",           href: "/about" },
];

const SIGN_URL =
  "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/Highway420%20Sign.png";

export default function HigherLearningMasthead() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname() ?? "";
  const { user } = useAuth();
  const { cartCount } = useCart();

  const isActive = (href: string) => {
    if (href === "/higher-learning") return pathname.startsWith("/higher-learning");
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <style>{`
        .hl-mast {
          background: #F7F6F2;
          position: sticky;
          top: 0;
          z-index: 80;
        }
        .hl-mast-inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: stretch;
          gap: 24px;
        }
        .hl-brand {
          display: inline-flex;
          align-items: center;
          padding: 0;
          text-decoration: none;
          color: #0E2A1F;
          flex-shrink: 0;
        }
        .hl-brand-img {
          height: 110px;
          width: auto;
          object-fit: contain;
          display: block;
        }
        .hl-nav {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 56px;
        }
        .hl-navlink {
          font-family: 'Fira Sans','Inter',sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #0E2A1F;
          text-decoration: none;
          padding: 4px 2px;
          border-bottom: 2px solid transparent;
          transition: border-color 0.15s, color 0.15s;
        }
        .hl-navlink:hover { color: #1B7A4D; border-bottom-color: rgba(14,42,31,0.35); }
        .hl-navlink.active { border-bottom-color: #0E2A1F; }

        .hl-actions {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-shrink: 0;
        }
        .hl-icon-btn {
          background: transparent;
          border: none;
          color: #0E2A1F;
          cursor: pointer;
          padding: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: background 0.15s;
          text-decoration: none;
          position: relative;
        }
        .hl-icon-btn:hover { background: rgba(14,42,31,0.06); }
        .hl-cart-badge {
          position: absolute;
          top: -2px; right: -4px;
          min-width: 18px; height: 18px;
          background: #1B7A4D;
          color: #ffffff;
          border-radius: 9px;
          font-family: 'Fira Sans', sans-serif;
          font-size: 10px;
          font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          padding: 0 4px;
        }
        .hl-burger { display: none; }

        /* Drawer */
        .hl-drawer-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(2px);
          z-index: 199;
        }
        .hl-drawer {
          position: fixed;
          top: 0; right: 0; bottom: 0;
          width: min(320px, 86vw);
          background: #F7F6F2;
          border-left: 1px solid #E5E1D8;
          z-index: 200;
          display: flex;
          flex-direction: column;
        }
        .hl-drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-bottom: 1px solid #E5E1D8;
        }
        .hl-drawer-title {
          color: #0E2A1F;
          font-family: 'Fira Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .hl-drawer-link {
          padding: 14px 20px;
          color: #0E2A1F;
          font-family: 'Fira Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-decoration: none;
          border-bottom: 1px solid #EDEAE0;
        }
        .hl-drawer-link:hover { background: rgba(14,42,31,0.05); color: #1B7A4D; }

        @media (max-width: 1024px) {
          .hl-nav { display: none; }
          .hl-burger { display: inline-flex; }
        }
      `}</style>

      <header className="hl-mast">
        <div className="hl-mast-inner">
          {/* Brand */}
          <Link href="/" className="hl-brand" aria-label="Highway 420 home">
            <Image
              src={SIGN_URL}
              alt="Highway 420"
              width={220}
              height={220}
              className="hl-brand-img"
              priority
            />
          </Link>

          {/* Nav links (desktop) */}
          <nav className="hl-nav" aria-label="Higher Learning navigation">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`hl-navlink ${isActive(link.href) ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hl-actions">
            <Link
              href={user ? "/account" : "/signin"}
              className="hl-icon-btn"
              aria-label={user ? "Account" : "Sign in"}
            >
              <User style={{ width: 22, height: 22 }} strokeWidth={1.6} />
            </Link>
            <Link href="/cart" className="hl-icon-btn" aria-label={`Cart (${cartCount} items)`}>
              <ShoppingCart style={{ width: 22, height: 22 }} strokeWidth={1.6} />
              {cartCount > 0 && (
                <span className="hl-cart-badge">{cartCount > 99 ? '99+' : String(cartCount)}</span>
              )}
            </Link>
            <button
              className="hl-icon-btn hl-burger"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu style={{ width: 22, height: 22 }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {isMenuOpen && (
        <>
          <div className="hl-drawer-backdrop" onClick={() => setIsMenuOpen(false)} />
          <aside className="hl-drawer" role="dialog" aria-modal="true">
            <div className="hl-drawer-header">
              <span className="hl-drawer-title">Menu</span>
              <button
                className="hl-icon-btn"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
              >
                <X style={{ width: 22, height: 22 }} />
              </button>
            </div>
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="hl-drawer-link"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </aside>
        </>
      )}
    </>
  );
}
