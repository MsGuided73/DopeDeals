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
      {/* ──────────────────────────────────────────────────────────────────
          GLOBAL STYLES — scoped to masthead elements
      ────────────────────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        .hw-header { font-family: 'Space Grotesk', system-ui, sans-serif; }

        /* ── Category badge ── */
        .hw-badge {
          display: inline-flex;
          align-items: center;
          background: ${BG_BADGE};
          border: 1px solid rgba(160,120,25,0.38);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.55);
          color: #C4D0BA;
          letter-spacing: 0.09em;
          font-size: 11px;
          font-weight: 600;
          padding: 5px 14px;
          border-radius: 4px;
          text-transform: uppercase;
          white-space: nowrap;
          transition: all 0.15s ease-out;
          cursor: pointer;
          text-decoration: none;
        }
        .hw-badge:hover {
          background: linear-gradient(145deg, #2A4E38 0%, #1E3828 55%, #182E22 100%);
          border-color: rgba(200,155,35,0.6);
          color: #D8E8CE;
        }

        /* ── Search input field ── */
        .hw-search-field {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.45);
          border-radius: 6px;
          height: 38px;
          display: flex;
          align-items: center;
          padding: 0 12px;
          gap: 8px;
          flex: 1;
          min-width: 0;
          transition: all 0.2s ease;
        }
        .hw-search-field:focus-within {
          background: rgba(255,255,255,0.11);
          border-color: rgba(180,140,40,0.5);
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.35), 0 0 0 2px rgba(140,105,20,0.18);
        }
        .hw-search-field input {
          background: transparent;
          border: none;
          outline: none;
          color: #E8E4DC;
          font-size: 13px;
          width: 100%;
          font-family: inherit;
        }
        .hw-search-field input::placeholder { color: rgba(200,196,185,0.48); }

        /* ── Cart circle button ── */
        .hw-cart-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          min-width: 38px;
          border-radius: 50%;
          background: ${BG_CART};
          border: 1px solid rgba(160,120,25,0.40);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.10), 0 1px 4px rgba(0,0,0,0.5);
          color: #C4D0BA;
          text-decoration: none;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }
        .hw-cart-btn:hover {
          border-color: rgba(200,155,35,0.6);
          color: #D8E8CE;
        }

        /* ── Ghost icon button (search icon, user, menu) ── */
        .hw-ghost-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          height: 38px;
          padding: 0 10px;
          border-radius: 5px;
          color: #C4C0B4;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.04em;
          transition: background 0.15s, color 0.15s;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          background: transparent;
          border: none;
        }
        .hw-ghost-btn:hover { background: rgba(255,255,255,0.07); color: #E8E4DC; }
        /* Square icon-only variant (search, menu) */
        .hw-ghost-btn.icon-only { padding: 0; width: 38px; }

        /* ── Mobile search overlay ── */
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

        /* ── Mobile drawer ── */
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

        /* ── Cart badge ── */
        .hw-cart-badge {
          position: absolute;
          top: -5px; right: -5px;
          width: 17px; height: 17px;
          border-radius: 50%;
          background: linear-gradient(135deg, #E5B830 0%, #C49A20 100%);
          border: 1.5px solid rgba(0,0,0,0.3);
          box-shadow: 0 1px 3px rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
          font-size: 8px; font-weight: 700; color: #000;
          line-height: 1;
        }
      `}</style>

      <header className="hw-header relative z-50 w-full">

        {/* ══════════════════════════════════════════════════════════════
            ROW 1 — Brand bar
        ══════════════════════════════════════════════════════════════ */}
        <div
          style={{
            background: "#1A1008",
            boxShadow: "0 6px 28px rgba(0,0,0,0.80), 0 2px 8px rgba(0,0,0,0.5)",
            minHeight: "64px",
          }}
          className="relative flex items-center"
        >
          {/* ── SVG procedural wood grain (Row 1) ── */}
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="xMidYMid slice"
            style={{ zIndex: 0 }}
          >
            <defs>
              <filter id="hw-grain-r1" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
                {/* Low X-frequency = long horizontal grain runs; moderate Y = fine grain lines */}
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.006 0.38"
                  numOctaves="5"
                  seed="7"
                  stitchTiles="stitch"
                  result="noise"
                />
                {/* Map greyscale noise → warm walnut tones */}
                <feColorMatrix
                  in="noise"
                  type="matrix"
                  values="0.50 0 0 0 0.14  0.25 0 0 0 0.07  0.06 0 0 0 0.02  0 0 0 0.85 0"
                />
              </filter>
              <linearGradient id="hw-shimmer-r1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#DDBA50" stopOpacity="0.12" />
                <stop offset="5%"   stopColor="#DDBA50" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#DDBA50" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Solid walnut base */}
            <rect width="100%" height="100%" fill="#1A1008" />
            {/* Procedural grain */}
            <rect width="100%" height="100%" filter="url(#hw-grain-r1)" />
            {/* Amber top-edge shimmer */}
            <rect width="100%" height="100%" fill="url(#hw-shimmer-r1)" />
          </svg>
          {/* Ambient centre glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(180,130,30,0.04) 0%, transparent 70%)" }}
          />

          {/* ── Mobile search overlay (full-width, absolute) ── */}
          {isSearchOpen && (
            <div className="hw-search-overlay md:hidden">
              <form onSubmit={handleSearch} className="hw-search-field flex-1">
                <Search style={{ width: 14, height: 14, color: "rgba(200,196,185,0.5)", flexShrink: 0 }} strokeWidth={2} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search Highway 420..."
                  aria-label="Search"
                />
              </form>
              <button
                type="button"
                onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                className="hw-ghost-btn icon-only"
                aria-label="Close search"
              >
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              MOBILE ROW  (hidden when search is open on mobile)
          ───────────────────────────────────────────────────────── */}
          <div
            className={`w-full flex items-center px-3 gap-2 md:hidden ${isSearchOpen ? "invisible" : "visible"}`}
          >
            {/* Logo — compact on mobile */}
            <Link href="/" className="flex-shrink-0" aria-label="Highway 420 home">
              <Image
                src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/logo_Highway420-official_transparent.png"
                alt="HIGHWAY 420"
                width={340}
                height={73}
                style={{ height: "44px", width: "auto" }}
                className="object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                priority
              />
            </Link>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Search icon */}
            <button
              className="hw-ghost-btn icon-only"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
            >
              <Search style={{ width: 18, height: 18 }} strokeWidth={2} />
            </button>

            {/* Cart */}
            <Link href="/cart" className="hw-cart-btn" aria-label="Cart">
              <ShoppingCart style={{ width: 16, height: 16 }} strokeWidth={2} />
              {cartCount > 0 && (
                <span className="hw-cart-badge">{cartCount > 99 ? "99+" : cartCount}</span>
              )}
            </Link>

            {/* Hamburger */}
            <button
              className="hw-ghost-btn icon-only"
              onClick={() => setIsMenuOpen(v => !v)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen
                ? <X   style={{ width: 20, height: 20 }} strokeWidth={2} />
                : <Menu style={{ width: 20, height: 20 }} strokeWidth={2} />
              }
            </button>
          </div>

          {/* ─────────────────────────────────────────────────────────
              DESKTOP ROW  (hidden on mobile)
          ───────────────────────────────────────────────────────── */}
          <div className="hidden md:flex w-full items-center px-6 lg:px-10 gap-4 relative z-10">
            {/* Logo + wordmark */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-3" aria-label="Highway 420 home">
              <Image
                src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/logo_Highway420-official_transparent.png"
                alt="HIGHWAY 420"
                width={340}
                height={73}
                style={{ height: "64px", width: "auto" }}
                className="object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                priority
              />
              <span
                style={{
                  fontFamily: "'Big Shoulders Display', 'Oswald', Impact, sans-serif",
                  fontSize: "32px",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  lineHeight: 1,
                  color: "#EDE8DC",
                  whiteSpace: "nowrap",
                  textShadow: "0 2px 8px rgba(0,0,0,0.85), 0 0 24px rgba(180,140,30,0.15)",
                  userSelect: "none",
                }}
              >
                Highway 420
              </span>
            </Link>

            {/* Search bar — desktop (always visible, no icon-only toggle) */}
            <form onSubmit={handleSearch} className="hw-search-field" style={{ maxWidth: "520px" }}>
              <Search style={{ width: 14, height: 14, color: "rgba(200,196,185,0.5)", flexShrink: 0 }} strokeWidth={2} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Highway 420..."
                aria-label="Search products"
              />
            </form>

            <div className="flex-1" />

            {/* User/profile */}
            <button
              className="hw-ghost-btn"
              onClick={() => setShowProfileModal(true)}
              aria-label="Profile"
            >
              <User style={{ width: 16, height: 16 }} strokeWidth={2} />
              {displayName && (
                <span className="max-w-[72px] truncate">{displayName}</span>
              )}
            </button>

            {/* Cart */}
            <Link href="/cart" className="hw-cart-btn" aria-label={`Cart (${cartCount} items)`}>
              <ShoppingCart style={{ width: 16, height: 16 }} strokeWidth={2} />
              {cartCount > 0 && (
                <span className="hw-cart-badge">{cartCount > 99 ? "99+" : cartCount}</span>
              )}
            </Link>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            ROW 2 — Category badge strip (desktop only)
        ══════════════════════════════════════════════════════════════ */}
        <div
          className="relative hidden md:flex items-center justify-center px-6 gap-2 flex-wrap"
          style={{
            background: "#1E1009",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4), inset 0 -1px 0 rgba(0,0,0,0.6), 0 4px 18px rgba(0,0,0,0.55)",
            minHeight: "48px",
          }}
        >
          {/* ── SVG procedural wood grain (Row 2) ── */}
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="xMidYMid slice"
            style={{ zIndex: 0 }}
          >
            <defs>
              <filter id="hw-grain-r2" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.007 0.45"
                  numOctaves="5"
                  seed="13"
                  stitchTiles="stitch"
                  result="noise"
                />
                <feColorMatrix
                  in="noise"
                  type="matrix"
                  values="0.55 0 0 0 0.16  0.27 0 0 0 0.08  0.06 0 0 0 0.02  0 0 0 0.90 0"
                />
              </filter>
              <linearGradient id="hw-bevel-r2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#DDBA50" stopOpacity="0.16" />
                <stop offset="6%"   stopColor="#DDBA50" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#DDBA50" stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="#1E1009" />
            <rect width="100%" height="100%" filter="url(#hw-grain-r2)" />
            <rect width="100%" height="100%" fill="url(#hw-bevel-r2)" />
          </svg>
          <div className="absolute top-0 inset-x-0 h-px" style={{ background: "rgba(220,185,80,0.14)", zIndex: 1 }} />
          {NAV_CATEGORIES.map(cat => (
            <Link key={cat.href} href={cat.href} className="hw-badge" style={{ position: "relative", zIndex: 1 }}>{cat.label}</Link>
          ))}
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
