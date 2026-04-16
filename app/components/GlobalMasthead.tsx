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
        /* ── Unified Realistic Wood Background ── */
        .hw-wood-bg {
          /* Warm walnut brown base */
          background-color: #3b2012; 
          background-image: 
            linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.4) 100%),
            url('https://images.unsplash.com/photo-1588691503932-aab708f33b1e?q=80&w=2000&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
          /* Blend to give it the deep rustic look */
          background-blend-mode: overlay, normal;
          box-shadow: inset 0 -8px 24px rgba(0,0,0,0.9), 0 12px 30px rgba(0,0,0,0.8);
          border-top: 1px solid rgba(255,255,255,0.1);
          border-bottom: 4px solid #0a0502;
          position: relative;
        }
        /* Add a warm amber tint overlay to match the lighting */
        .hw-wood-bg::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 10%, rgba(200,140,50,0.15) 0%, rgba(50,20,5,0.5) 100%);
          pointer-events: none;
          z-index: 0;
        }

        /* ── Enamel & Gold Category Buttons ── */
        .hw-badge {
          display: inline-flex;
          align-items: center;
          background: linear-gradient(180deg, #3a563a 0%, #223a22 45%, #182818 100%);
          border: 2px solid #b6924b; /* Distinct gold rim */
          border-bottom-width: 3px;
          border-right-width: 2px;
          box-shadow: 
            inset 0 2px 2px rgba(255,255,255,0.25), 
            0 4px 6px rgba(0,0,0,0.7);
          border-radius: 6px;
          color: #ebd197; /* Creamy gold text */
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: 0.04em;
          padding: 6px 20px;
          text-transform: uppercase;
          white-space: nowrap;
          transition: all 0.15s ease-out;
          cursor: pointer;
          text-decoration: none;
          text-shadow: 0 1px 2px rgba(0,0,0,0.9);
        }
        .hw-badge:hover {
          background: linear-gradient(180deg, #446644 0%, #294729 45%, #1c321c 100%);
          color: #fff8e1;
          border-color: #d1ad63;
        }
        .hw-badge:active {
          transform: translateY(2px);
          box-shadow: 0 1px 2px rgba(0,0,0,0.8);
          border-bottom-width: 1px;
        }

        /* ── Carved Inset Elements (Search & Actions) ── */
        .hw-inset-container {
          background: #180d06; /* Dark carved wood */
          box-shadow: 
            inset 0 6px 12px rgba(0,0,0,0.95), 
            inset 0 1px 3px rgba(0,0,0,0.9), 
            0 1px 1px rgba(255,255,255,0.12),
            inset 0 0 0 1px #050201; /* Black inner lip */
          border-radius: 12px; /* Not a pill, slightly rounded rectangle */
          height: 48px;
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 12px;
        }

        .hw-search-input {
          background: transparent;
          border: none;
          outline: none;
          color: #decba5;
          font-size: 17px;
          width: 100%;
          font-family: inherit;
        }
        .hw-search-input::placeholder { color: rgba(222,203,165,0.5); }

        /* ── Right Side Action Controls ── */
        .hw-action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #decba5;
          font-size: 16px;
          font-weight: 500;
          transition: color 0.15s;
          background: transparent;
          border: none;
          cursor: pointer;
          text-decoration: none;
        }
        .hw-action-btn:hover { color: #fff4d4; }
        
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
            <Link href="/" aria-label="Highway 420 home">
              <Image
                src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/3dassets/H420_Logo_Gold_Transparent.png"
                alt="HIGHWAY 420"
                width={340}
                height={73}
                style={{ height: "46px", width: "auto" }}
                className="object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
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
            Layout: [Logo left] ── [Categories centered, flex-1] ── [Search + Account + Cart right]
        ══════════════════════════════════════════════════════════════ */}
        <div className="hidden md:flex flex-row items-stretch w-full mx-auto relative z-10">

          {/* ══ LEFT: Logo — self-stretch spans the full masthead height ══ */}
          <Link
            href="/"
            className="flex-shrink-0 self-stretch flex items-center pl-4 lg:pl-6 pr-4 hover:brightness-110 transition-all duration-200"
            aria-label="Highway 420 home"
          >
            <Image
              src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/3dassets/H420_Logo_Gold_Transparent.png"
              alt="HIGHWAY 420"
              width={340}
              height={73}
              style={{
                height: "clamp(80px, 11vw, 130px)",
                width: "auto",
              }}
              className="object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
              priority
            />
          </Link>

          {/* ══ CENTRE: Category nav buttons — flex-1, centred ══ */}
          <div className="flex flex-1 items-center justify-center flex-wrap gap-x-3 gap-y-2 px-4 py-4">
            {NAV_CATEGORIES.map(cat => (
              <Link key={cat.href} href={cat.href} className="hw-badge">
                {cat.label}
              </Link>
            ))}
          </div>

          {/* ══ RIGHT: Search + Account + Cart ══ */}
          <div className="flex-shrink-0 flex items-center gap-2 pr-4 lg:pr-8 py-3">

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="hw-inset-container w-[180px] lg:w-[240px] xl:w-[300px]"
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
                placeholder="Search..."
                aria-label="Search products"
                className="hw-search-input"
                style={{ fontSize: "15px" }}
              />
            </form>

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
