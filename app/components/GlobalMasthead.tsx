// app/components/GlobalMasthead.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, ShoppingCart, X, Star, TrendingUp, Gift, Menu, Search } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useNavigation } from "../contexts/NavigationContext";
import { useAuth } from "../contexts/AuthContext";

const NAV_CATEGORIES = [
  { label: "VAPES",       href: "/vapes" },
  { label: "PRE-ROLLS",   href: "/pre-rolls" },
  { label: "FLOWER",      href: "/thca_flower" },
  { label: "EDIBLES",     href: "/edibles" },
  { label: "MUSHROOMS",   href: "/mushrooms" },
  { label: "GLASS",       href: "/bongs" },
  { label: "ACCESSORIES", href: "/accessories" },
];

// ─── Shared gradient colours ───────────────────────────────────────────────
const BG_BADGE = "linear-gradient(145deg, #213D2C 0%, #162A1D 55%, #112318 100%)";
const BG_CART  = "linear-gradient(145deg, #213D2C 0%, #162A1D 100%)";

export default function GlobalMasthead() {
  const [isMenuOpen,        setIsMenuOpen]        = useState(false);
  const [isSearchOpen,      setIsSearchOpen]      = useState(false);
  const [showProfileModal,  setShowProfileModal]  = useState(false);
  const [searchQuery,       setSearchQuery]       = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { user }           = useAuth();
  const { cartCount }      = useCart();
  const { setHasMasthead } = useNavigation();

  const displayName = user
    ? (user.user_metadata?.first_name ||
       user.user_metadata?.firstName  ||
       user.email?.split("@")[0]      ||
       "You")
    : null;

  useEffect(() => {
    setHasMasthead(true);
    return () => setHasMasthead(false);
  }, [setHasMasthead]);

  // Auto-focus search input when search overlay opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 60);
    }
  }, [isSearchOpen]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Bebas+Neue&display=swap');

        /* ── Unified Realistic Wood Background ── */
        .hw-wood-bg {
          /* Warm walnut brown base */
          background-color: #3b2012;
          background-image:
            linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.40) 100%),
            url('https://images.unsplash.com/photo-1588691503932-aab708f33b1e?q=80&w=2000&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
          background-blend-mode: overlay, normal;
          box-shadow:
            inset 0 -8px 24px rgba(0,0,0,0.9),
            0 2px 10px rgba(0,0,0,0.70),
            0 6px 28px rgba(0,0,0,0.45);
          border-top: 1px solid rgba(255,255,255,0.09);
          border-bottom: 3px solid rgba(0,0,0,0.95);
          position: relative;
        }
        /* Soft ambient warmth overlay */
        .hw-wood-bg::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            /* upper-right warmth — boosted */
            radial-gradient(ellipse 60% 80% at 82% 0%,  rgba(220,170,90,0.22) 0%, transparent 68%),
            /* centre-top ambient — boosted */
            radial-gradient(ellipse 80% 50% at 50% 0%,  rgba(160,110,50,0.13) 0%, rgba(30,12,3,0.35) 100%),
            /* direct spotlight over search-bar area */
            radial-gradient(ellipse 40% 70% at 50% 55%,  rgba(190,140,60,0.10) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }
        /* Deep dark shadow seam at the bottom edge */
        .hw-wood-bg::after {
          content: "";
          position: absolute;
          bottom: -8px;
          left: 0;
          right: 0;
          height: 20px;
          background: radial-gradient(
            ellipse 70% 100% at 50% 0%,
            rgba(0,0,0,0.90) 0%,
            rgba(0,0,0,0.55) 35%,
            rgba(0,0,0,0.18) 62%,
            transparent      85%
          );
          pointer-events: none;
          z-index: 1;
        }

        /* ── Category Nav Buttons — dark enamel, cream text ── */
        .hw-badge {
          display: inline-flex;
          align-items: center;
          background: linear-gradient(180deg, #1e3a1e 0%, #142a14 50%, #0e1e0e 100%);
          border: 1px solid rgba(80,110,65,0.80);
          border-bottom: 1px solid rgba(40,65,30,0.95);
          box-shadow:
            inset 0 1px 1px rgba(255,255,255,0.10),
            inset 0 -1px 2px rgba(0,0,0,0.55),
            0 2px 5px rgba(0,0,0,0.55);
          border-radius: 5px;
          color: #e2ddd0;
          font-family: 'Oswald', system-ui, sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.18em;
          padding: 5px 13px;
          text-transform: uppercase;
          white-space: nowrap;
          transition: all 0.15s ease-out;
          cursor: pointer;
          text-decoration: none;
          text-shadow: 0 1px 3px rgba(0,0,0,0.95);
        }
        .hw-badge:hover {
          background: linear-gradient(180deg, #253f25 0%, #192e19 50%, #111f11 100%);
          color: #f0ece4;
          border-color: rgba(100,140,80,0.9);
          box-shadow:
            inset 0 1px 1px rgba(255,255,255,0.15),
            0 2px 8px rgba(0,0,0,0.7);
        }
        .hw-badge:active {
          transform: translateY(1px);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.7);
        }

        /* ── Carved Inset Elements (Search & Actions) ── */
        .hw-inset-container {
          background: #180d06;
          box-shadow:
            inset 0 6px 12px rgba(0,0,0,0.95),
            inset 0 1px 3px rgba(0,0,0,0.9),
            inset 0 0 0 1px #050201,
            /* inner amber glow — lit-from-within effect */
            inset 0 0 18px rgba(180,120,40,0.22),
            inset 0 0 6px  rgba(210,150,60,0.12),
            0 1px 1px rgba(255,255,255,0.12),
            /* warm outer glow — simulates overhead lamp */
            0 0 16px rgba(190,130,45,0.28),
            0 0 38px rgba(160,100,25,0.14);
          border-radius: 12px;
          height: 48px;
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 12px;
        }

        /* Radial spotlight on the centre column — highlights search bar area */
        .hw-center-zone {
          background:
            radial-gradient(
              ellipse 85% 95% at 50% 40%,
              rgba(210,155,60,0.22) 0%,
              rgba(180,110,30,0.10) 48%,
              transparent 72%
            );
        }

        .hw-search-input {
          background: transparent;
          border: none;
          outline: none;
          color: #ddd8cc;
          font-size: 17px;
          width: 100%;
          font-family: inherit;
        }
        .hw-search-input::placeholder { color: rgba(210,205,190,0.45); }

        /* ── Right Side Action Controls ── */
        .hw-action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #ddd8cc;
          font-size: 16px;
          font-weight: 500;
          transition: color 0.15s;
          background: transparent;
          border: none;
          cursor: pointer;
          text-decoration: none;
        }
        .hw-action-btn:hover { color: #f0ece8; }
        
        /* The gold circle button from the mockup */
        .hw-action-circle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(180deg, #e4c575 0%, #b6924b 40%, #896924 100%);
          border: 2px solid #4a3411; /* Dark wood border ring */
          color: #1a0d05;
          box-shadow: 
            inset 0 1px 2px rgba(255,255,255,0.6), 
            inset 0 -1px 2px rgba(0,0,0,0.4),
            0 2px 4px rgba(0,0,0,0.8);
          transition: transform 0.15s, filter 0.15s;
          position: relative;
        }
        .hw-action-circle:hover {
          filter: brightness(1.15);
          transform: scale(1.05);
        }

        /* ── Mobile Overlays & Drawers ── */
        .hw-search-overlay {
          position: absolute;
          inset: 0;
          z-index: 30;
          display: flex;
          align-items: center;
          padding: 0 12px;
          gap: 8px;
          background: linear-gradient(180deg, #1E1C16 0%, #171510 100%);
        }

        .hw-drawer {
          background: linear-gradient(180deg, #1A1814 0%, #141210 100%);
          border-top: 1px solid rgba(220,185,80,0.10);
          box-shadow: 0 12px 32px rgba(0,0,0,0.7);
          overflow: hidden;
        }
        .hw-drawer-link {
          display: flex;
          align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          color: #C4C0B4;
          font-size: 13px;
          letter-spacing: 0.08em;
          font-weight: 600;
          text-decoration: none;
          text-transform: uppercase;
          transition: color 0.15s, padding-left 0.15s;
        }
        .hw-drawer-link:hover { color: #E8E4DC; padding-left: 4px; }
        .hw-drawer-link:last-child { border-bottom: none; }

        .hw-cart-badge {
          position: absolute;
          top: -6px; right: -6px;
          width: 20px; height: 20px;
          border-radius: 50%;
          background: #d32f2f;
          border: 1.5px solid #d4af37;
          box-shadow: 0 2px 4px rgba(0,0,0,0.6);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 800; color: #fff;
          line-height: 1;
        }
      `}</style>

      <header className="hw-header relative w-full hw-wood-bg" style={{ zIndex: 100 }}>

        {/* ══════════════════════════════════════════════════════════════
            MOBILE VIEW (Compact, retains icon/hamburger design)
        ══════════════════════════════════════════════════════════════ */}
        <div className="md:hidden relative z-10 pb-4">
          {/* Mobile Search Overlay */}
          {isSearchOpen && (
            <div className="hw-search-overlay">
              <form onSubmit={handleSearch} className="hw-inset-container flex-1" style={{ height: "40px", borderRadius: "20px" }}>
                <Search style={{ width: 14, height: 14, color: "rgba(222,203,165,0.6)", flexShrink: 0 }} strokeWidth={2.5} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="hw-search-input"
                />
              </form>
              <button
                type="button"
                onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                className="hw-action-btn ml-2"
                aria-label="Close search"
              >
                <X style={{ width: 22, height: 22 }} />
              </button>
            </div>
          )}

          {/* Mobile Top Bar */}
          <div className={`w-full flex items-center px-4 py-3 gap-3 ${isSearchOpen ? "invisible" : "visible"}`}>
            <Link href="/" aria-label="Highway 420 home" className="flex items-center" style={{ gap: '8px' }}>
              <Image
                src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/3dassets/Shield_Logo2.png"
                alt="HIGHWAY 420"
                width={120}
                height={120}
                style={{ height: '44px', width: 'auto', flexShrink: 0 }}
                className="object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                priority
              />
              <Image
                src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/3dassets/H420%20Wordmark-v3.png"
                alt="HIGHWAY 420"
                width={0}
                height={0}
                sizes="100vw"
                style={{
                  height: '24px',
                  width: 'auto',
                  flexShrink: 0,
                  transform: 'translateY(-1px)',
                  filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.85))',
                  mixBlendMode: 'screen',
                }}
                className="object-contain"
                priority
              />
            </Link>
            
            <div className="flex-1" />
            
            <button className="hw-action-btn" onClick={() => setIsSearchOpen(true)} aria-label="Search">
              <Search style={{ width: 20, height: 20 }} strokeWidth={2.5} />
            </button>
            
            <Link href="/cart" className="relative group" aria-label="Cart">
              <div className="w-[38px] h-[38px] rounded-full border border-[rgba(212,175,55,0.4)] bg-[rgba(10,5,0,0.5)] flex items-center justify-center text-[#decba5]">
                <ShoppingCart style={{ width: 18, height: 18 }} />
              </div>
              {cartCount > 0 && <span className="hw-cart-badge">{cartCount > 99 ? "99+" : cartCount}</span>}
            </Link>

            <button className="hw-action-btn" onClick={() => setIsMenuOpen(v => !v)}>
              {isMenuOpen ? <X style={{ width: 24, height: 24 }} strokeWidth={2} /> : <Menu style={{ width: 24, height: 24 }} strokeWidth={2} />}
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            DESKTOP VIEW
            Layout: [Logo left] ── [Search centred / Categories centred] ── [Account + Cart right]
        ══════════════════════════════════════════════════════════════ */}
        <div className="hidden md:flex flex-row items-stretch w-full mx-auto relative z-10">

          {/* ══ LEFT: Brand Lockup — shield + single-line wordmark ══ */}
          <Link
            href="/"
            className="flex-shrink-0 self-stretch flex items-center pl-4 lg:pl-6 pr-4 hover:brightness-110 transition-all duration-200 relative z-10"
            aria-label="Highway 420 home"
          >
            {/* Brand lockup wrapper — sits in the upper portion of the nav, not dead centre */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Shield — tall, spanning nearly full masthead height */}
              <Image
                src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/3dassets/Shield_Logo2.png"
                alt="HIGHWAY 420"
                width={120}
                height={120}
                style={{ height: 'clamp(80px, 11vw, 130px)', width: 'auto', flexShrink: 0 }}
                className="object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
                priority
              />
              <Image
                src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/3dassets/H420%20Wordmark-v3.png"
                alt="HIGHWAY 420"
                width={0}
                height={0}
                sizes="100vw"
                style={{
                  height: 'clamp(80px, 11vw, 130px)',
                  width: 'auto',
                  flexShrink: 0,
                  filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.90))',
                  mixBlendMode: 'screen',
                }}
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* ══ CENTRE: absolute overlay — true page-center for search + category buttons ══ */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 py-3 pointer-events-none">

            {/* Search bar */}
            <form
              onSubmit={handleSearch}
              className="hw-inset-container w-full max-w-[480px] pointer-events-auto"
              style={{ height: "44px" }}
            >
              <Search
                style={{ width: 16, height: 16, color: "rgba(222,203,165,0.6)", flexShrink: 0 }}
                strokeWidth={2}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Highway 420..."
                aria-label="Search products"
                className="hw-search-input"
              />
            </form>

            {/* Category nav buttons */}
            <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1 pointer-events-auto">
              {NAV_CATEGORIES.map(cat => (
                <Link key={cat.href} href={cat.href} className="hw-badge">
                  {cat.label}
                </Link>
              ))}
            </div>

          </div>

          {/* ══ RIGHT: Account + Cart ══ */}
          <div className="flex-shrink-0 flex items-center gap-2 pr-4 lg:pr-8 relative z-10 ml-auto">

            {/* Account */}
            <button
              onClick={() => setShowProfileModal(true)}
              className="hw-action-btn hw-inset-container gap-2 px-3"
              style={{ height: "44px", flexShrink: 0 }}
            >
              <User style={{ width: 17, height: 17 }} />
              <span className="hidden xl:inline whitespace-nowrap">{displayName || "Account"}</span>
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="hw-action-circle flex-shrink-0"
              style={{ width: "44px", height: "44px" }}
              aria-label={`Cart (${cartCount} items)`}
            >
              <ShoppingCart style={{ width: 18, height: 18 }} strokeWidth={2.5} />
              {cartCount > 0 && (
                <span className="hw-cart-badge">{cartCount > 99 ? "99+" : String(cartCount)}</span>
              )}
            </Link>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════
            MOBILE DRAWER — slides down from masthead
        ══════════════════════════════════════════════════════════════ */}
        {isMenuOpen && (
          <div className="hw-drawer md:hidden">
            <nav className="px-5 py-2">
              {/* Categories */}
              {NAV_CATEGORIES.map(cat => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="hw-drawer-link"
                  onClick={closeMenu}
                >
                  {cat.label}
                </Link>
              ))}

              {/* Account links */}
              <div className="mt-2 mb-1 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <Link href={user ? "/account" : "/signin"} className="hw-drawer-link" onClick={closeMenu}
                  style={{ letterSpacing: "0.06em" }}>
                  {user ? "MY ACCOUNT" : "SIGN IN / SIGN UP"}
                </Link>
                <Link href="/rewards" className="hw-drawer-link" onClick={closeMenu}
                  style={{ letterSpacing: "0.06em" }}>
                  VIP REWARDS
                </Link>
                <Link href="/cart" className="hw-drawer-link" onClick={closeMenu}
                  style={{ letterSpacing: "0.06em" }}>
                  CART {cartCount > 0 ? `(${cartCount})` : ""}
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════════════════════════════════
          PROFILE MODAL
      ══════════════════════════════════════════════════════════════════ */}
      {showProfileModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
          onClick={e => { if (e.target === e.currentTarget) setShowProfileModal(false); }}
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-br from-green-700 to-green-900">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                    {user ? `Welcome back, ${displayName}` : "Welcome to HIGHWAY 420"}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user ? user.email : "Sign in for personalised recommendations"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Recommended for You</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-gray-900 dark:text-white text-sm">Trending</span>
                    </div>
                    <Link href="/mushrooms"  className="block text-sm text-blue-600 dark:text-blue-400 hover:underline mb-1" onClick={() => setShowProfileModal(false)}>🔥 Premium Mushrooms</Link>
                    <Link href="/thca_flower" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline" onClick={() => setShowProfileModal(false)}>🔥 THCA Flower</Link>
                  </div>
                  <div className="rounded-xl p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Gift className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-gray-900 dark:text-white text-sm">Staff Picks</span>
                    </div>
                    <Link href="/thca_pnv" className="block text-sm text-green-600 dark:text-green-400 hover:underline" onClick={() => setShowProfileModal(false)}>🌟 Premium Pre-Rolls & Vapes</Link>
                  </div>
                </div>
              </div>

              <div className="border-t dark:border-gray-700 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link
                    href={user ? "/account" : "/signin"}
                    onClick={() => setShowProfileModal(false)}
                    className="flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-medium py-3 px-4 rounded-xl transition-colors text-sm"
                  >
                    <User className="w-4 h-4" />
                    {user ? "Go to Dashboard" : "Sign In / Sign Up"}
                  </Link>
                  <Link
                    href="/rewards"
                    onClick={() => setShowProfileModal(false)}
                    className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-xl transition-colors text-sm"
                  >
                    <Gift className="w-4 h-4" /> VIP Rewards
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
