// app/components/GlobalMasthead.tsx  — DankGeek-style clean white header
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, ShoppingCart, X, Star, TrendingUp, Gift, Menu, Search, ChevronDown } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useNavigation } from "../contexts/NavigationContext";
import { useAuth } from "../contexts/AuthContext";

/* ── Navigation categories config ─────────────────────────────────────── */
const NAV_LINKS = [
  {
    label: "Water Pipes",
    href: "/bongs",
    children: [
      { label: "All Bongs & Water Pipes", href: "/bongs" },
      { label: "Beakers", href: "/bongs?type=beaker" },
      { label: "Straight Tubes", href: "/bongs?type=straight" },
      { label: "Below $50", href: "/bongs?maxPrice=50" },
    ],
  },
  {
    label: "Hand Pipes",
    href: "/pipes",
    children: [
      { label: "All Hand Pipes", href: "/pipes" },
      { label: "Spoon Pipes", href: "/pipes?type=spoon" },
      { label: "Bubblers", href: "/bubblers" },
    ],
  },
  {
    label: "Vapes & Carts",
    href: "/vapes",
    children: [
      { label: "All Vapes & Carts", href: "/vapes" },
      { label: "Cartridges", href: "/vapes?type=cartridge" },
      { label: "Disposables", href: "/vapes?type=disposable" },
      { label: "Desktop Vapes", href: "/vapes?type=vaporizer" },
    ],
  },
  {
    label: "Dab Rigs",
    href: "/dabsntools",
    children: null,
  },
  {
    label: "Pre-Rolls",
    href: "/pre-rolls",
    children: [
      { label: "All Pre-Rolls", href: "/pre-rolls" },
      { label: "Rolling Papers & Wraps", href: "/accessories?type=rolling" },
    ],
  },
  {
    label: "Edibles",
    href: "/edibles",
    children: null,
  },
  {
    label: "Shrooms & More",
    href: "/mushrooms",
    children: null,
  },
  {
    label: "Accessories",
    href: "/accessories",
    children: null,
  },
  {
    label: "THCA Flower",
    href: "/thca_flower",
    children: null,
  },
];

const CATEGORY_OPTIONS = ["All", "Water Pipes", "Hand Pipes", "Vaporizers", "Dab Rigs", "Edibles", "Mushrooms", "Accessories"];

export default function GlobalMasthead() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showCategorySelect, setShowCategorySelect] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const { user } = useAuth();
  const { cartCount } = useCart();
  const { setHasMasthead } = useNavigation();

  const displayName = user
    ? (user.user_metadata?.first_name || user.user_metadata?.firstName || user.email?.split("@")[0] || "You")
    : null;

  useEffect(() => {
    setHasMasthead(true);
    return () => setHasMasthead(false);
  }, [setHasMasthead]);

  useEffect(() => {
    if (isSearchOpen) setTimeout(() => searchRef.current?.focus(), 60);
  }, [isSearchOpen]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
  };

  const openDropdownMenu = (label: string) => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setOpenDropdown(label);
  };

  const closeDropdownWithDelay = () => {
    dropdownTimerRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;600;700;800&display=swap');



        /* ── Header shell ── */
        .dg-header {
          background: linear-gradient(to bottom, #145C3C, #1B7A4D);
          border-bottom: 1px solid #0F4A30;
          position: relative;
          z-index: 100;
        }

        /* ── Top bar (search + icons) ── */
        .dg-topbar {
          max-width: 1440px;
          margin: 0 auto;
          /* base horizontal padding; overridden via inline style when in grid layout */
          padding: 12px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          width: 100%;
          box-sizing: border-box;
        }
        .dg-topbar-inner {
          display: contents;
        }

        /* ── Logo link ── */
        .dg-logo-link {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          text-decoration: none;
          transition: filter 0.15s;
        }
        .dg-logo-link:hover { filter: brightness(1.05) drop-shadow(0 2px 8px rgba(76,145,65,0.35)); }

        /* ── Search form ── */
        .dg-search-form {
          flex: 1;
          display: flex;
          align-items: center;
          background: #F5F5F2;
          border-radius: 6px;
          border: 1.5px solid rgba(0,0,0,0.08);
          overflow: hidden;
          height: 44px;
          transition: border-color 0.15s, background 0.15s;
        }
        .dg-search-form:focus-within {
          border-color: rgba(255,255,255,0.5);
          background: #ffffff;
        }
        .dg-cat-select {
          background: transparent;
          border: none;
          border-right: 1.5px solid #D8D8D4;
          font-family: 'Fira Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #2A2B2A;
          padding: 0 10px 0 12px;
          height: 100%;
          cursor: pointer;
          outline: none;
          white-space: nowrap;
          min-width: 80px;
          max-width: 130px;
        }
        .dg-cat-select option { background: #F5F5F2; color: #2A2B2A; }
        .dg-search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'Fira Sans', sans-serif;
          font-size: 14px;
          color: #2A2B2A;
          padding: 0 12px;
          height: 100%;
        }
        .dg-search-input::placeholder { color: #9A9A9A; }
        .dg-search-btn {
          border: none;
          background: #5BAD52;
          color: #fff;
          padding: 0 16px;
          height: 100%;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: background 0.15s;
        }
        .dg-search-btn:hover { background: #4A9442; }

        /* ── Right icon buttons ── */
        .dg-icon-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #ffffff;
          font-family: 'Fira Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.03em;
          padding: 6px 10px;
          text-decoration: none;
          border-radius: 4px;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .dg-icon-btn:hover { background: rgba(255,255,255,0.15); }
        .dg-icon-btn svg { flex-shrink: 0; }

        /* ── Cart badge ── */
        .dg-cart-badge {
          position: absolute;
          top: -6px; right: -6px;
          min-width: 18px; height: 18px;
          background: #E53E3E;
          color: #fff;
          border-radius: 9px;
          font-size: 10px;
          font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          padding: 0 3px;
          border: 1.5px solid #1B7A4D;
        }

        /* ── Navigation bar ── */
        .dg-navbar {
          border-top: 1px solid rgba(255,255,255,0.12);
          background: transparent;
        }
        .dg-navinner {
          position: relative;
          padding: 0 16px;
          display: flex;
          align-items: center;
          gap: 2px;
          width: 100%;
          box-sizing: border-box;
        }
        .dg-navlink {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 10px 12px;
          font-family: 'Fira Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
          text-decoration: none;
          white-space: nowrap;
          border-bottom: 2px solid transparent;
          transition: color 0.15s, border-color 0.15s;
          cursor: pointer;
          background: transparent;
          border-top: none;
          border-left: none;
          border-right: none;
        }
        .dg-navlink:hover, .dg-navlink.active {
          color: #ffffff;
          border-bottom-color: rgba(255,255,255,0.8);
        }

        /* ── Dropdown panel ── */
        .dg-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          min-width: 200px;
          background: #ffffff;
          border: 1px solid #E8E8E8;
          border-top: 2px solid #5BAD52;
          border-radius: 0 0 6px 6px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          z-index: 200;
          padding: 8px 0;
        }
        .dg-dropdown-link {
          display: block;
          padding: 9px 16px;
          font-family: 'Fira Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #2A2B2A;
          text-decoration: none;
          transition: background 0.1s, color 0.1s;
        }
        .dg-dropdown-link:hover {
          background: #F5F5F5;
          color: #5BAD52;
        }

        /* ── Mobile drawer ── */
        .dg-drawer {
          background: #145C3C;
          border-top: 1px solid rgba(255,255,255,0.12);
          box-shadow: 0 8px 24px rgba(0,0,0,0.25);
        }
        .dg-drawer-link {
          display: block;
          padding: 13px 20px;
          font-family: 'Fira Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255,255,255,0.88);
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          transition: color 0.15s, background 0.15s;
        }
        .dg-drawer-link:hover { background: rgba(255,255,255,0.1); color: #ffffff; }
        .dg-drawer-link:last-child { border-bottom: none; }

        /* ── Mobile search overlay ── */
        .dg-mobile-search {
          position: absolute;
          inset: 0;
          background: #145C3C;
          z-index: 50;
          display: flex;
          align-items: center;
          padding: 0 12px;
          gap: 8px;
        }
      `}</style>


      <header className="dg-header">

        {/* ══════════════════════════════════════════════════════════════
            MOBILE (< md)
        ══════════════════════════════════════════════════════════════ */}
        <div className="md:hidden relative">

          {/* Mobile search overlay */}
          {isSearchOpen && (
            <div className="dg-mobile-search">
              <form onSubmit={handleSearch} className="dg-search-form flex-1" style={{ height: 40 }}>
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search…"
                  className="dg-search-input"
                />
                <button type="submit" className="dg-search-btn" aria-label="Search">
                  <Search style={{ width: 16, height: 16 }} />
                </button>
              </form>
              <button
                type="button"
                onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#2A2B2A", padding: 4 }}
                aria-label="Close search"
              >
                <X style={{ width: 22, height: 22 }} />
              </button>
            </div>
          )}

          {/* Mobile top bar */}
          <div className={`flex items-center px-4 py-3 gap-3 ${isSearchOpen ? "invisible" : "visible"}`}>
            {/* Logo */}
            <Link href="/" className="dg-logo-link" aria-label="Highway 420 home">
              <Image
                src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/3dassets/Shield_Logo2.png"
                alt="HIGHWAY 420"
                width={120}
                height={120}
                style={{ height: '52px', width: 'auto' }}
                className="object-contain"
                priority
              />
            </Link>

            <div className="flex-1" />

            {/* Search */}
            <button className="dg-icon-btn" onClick={() => setIsSearchOpen(true)} aria-label="Search">
              <Search style={{ width: 20, height: 20 }} />
            </button>

            {/* Cart */}
            <Link href="/cart" className="dg-icon-btn relative" aria-label="Cart">
              <ShoppingCart style={{ width: 20, height: 20 }} />
              {cartCount > 0 && <span className="dg-cart-badge">{cartCount > 99 ? "99+" : cartCount}</span>}
            </Link>

            {/* Hamburger */}
            <button className="dg-icon-btn" onClick={() => setIsMenuOpen(v => !v)} aria-label="Menu">
              {isMenuOpen ? <X style={{ width: 22, height: 22 }} /> : <Menu style={{ width: 22, height: 22 }} />}
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            DESKTOP (≥ md)
        ══════════════════════════════════════════════════════════════ */}
        <div className="hidden md:block">
          {/*
            Grid layout:
              col 1 = shield (auto width, 2-row span)
              col 2 = topbar + navbar stacked
            The shield will naturally fill the height of both rows — no clipping, no overflow.
          */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gridTemplateRows: 'auto auto',
            width: '100%',
          }}>

            {/* ── Col 1, rows 1-2: Shield ── */}
            <Link
              href="/"
              className="dg-logo-link"
              aria-label="Highway 420 home"
              style={{
                gridColumn: '1',
                gridRow: '1 / 3',
                alignSelf: 'stretch',
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px 8px 20px',
              }}
            >
              <Image
                src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/3dassets/Aged%20Logo-Transparent.png"
                alt="HIGHWAY 420"
                width={200}
                height={200}
                style={{ height: '100%', width: 'auto', maxHeight: '120px', minHeight: '80px', display: 'block' }}
                className="object-contain"
                priority
              />
            </Link>

            {/* ── Col 2, row 1: Topbar — search only, centered ── */}
            <div className="dg-topbar" style={{ gridColumn: '2', gridRow: '1', margin: 0, padding: '10px 24px 10px 16px', justifyContent: 'center' }}>
              <form onSubmit={handleSearch} className="dg-search-form" style={{ flex: 'none', width: '100%', maxWidth: 560 }}>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="dg-cat-select"
                  aria-label="Search category"
                >
                  {CATEGORY_OPTIONS.map(c => <option key={c}>{c}</option>)}
                </select>
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands…"
                  aria-label="Search products"
                  className="dg-search-input"
                />
                <button type="submit" className="dg-search-btn" aria-label="Search">
                  <Search style={{ width: 16, height: 16 }} />
                </button>
              </form>
            </div>

            {/* ── Col 2, row 2: Navbar — centered links + icons far right ── */}
            <nav className="dg-navbar" aria-label="Primary navigation"
              style={{ gridColumn: '2', gridRow: '2', width: '100%' }}
            >
              <div className="dg-navinner" style={{ margin: 0, padding: '0 16px', position: 'relative' }}>

                {/* Nav links — truly centered via absolute positioning */}
                <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', top: 0, bottom: 0 }}>
                  {NAV_LINKS.map(link => (
                    <div
                      key={link.href}
                      className="relative"
                      onMouseEnter={() => link.children && openDropdownMenu(link.label)}
                      onMouseLeave={() => link.children && closeDropdownWithDelay()}
                    >
                      <Link
                        href={link.href}
                        className={`dg-navlink ${openDropdown === link.label ? "active" : ""}`}
                      >
                        {link.label}
                        {link.children && <ChevronDown style={{ width: 12, height: 12, opacity: 0.6 }} />}
                      </Link>

                      {link.children && openDropdown === link.label && (
                        <div
                          className="dg-dropdown"
                          onMouseEnter={() => openDropdownMenu(link.label)}
                          onMouseLeave={closeDropdownWithDelay}
                        >
                          {link.children.map(child => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="dg-dropdown-link"
                              onClick={() => setOpenDropdown(null)}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Account + Cart — absolutely anchored to far right */}
                <div style={{ position: 'absolute', right: 16, top: 0, bottom: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="dg-icon-btn"
                    aria-label="Account"
                  >
                    <User style={{ width: 24, height: 24 }} />
                    {displayName ? displayName : "Account"}
                  </button>
                  <Link
                    href="/cart"
                    className="dg-icon-btn relative"
                    aria-label={`Cart (${cartCount} items)`}
                  >
                    <ShoppingCart style={{ width: 24, height: 24 }} />
                    Cart
                    {cartCount > 0 && <span className="dg-cart-badge">{cartCount > 99 ? "99+" : String(cartCount)}</span>}
                  </Link>
                </div>

              </div>
            </nav>
          </div>{/* /grid wrapper */}
        </div>{/* /hidden md:block */}
      </header>

      {/* ══════════════════════════════════════════════════════════════
          MOBILE DRAWER
      ══════════════════════════════════════════════════════════════ */}
      {isMenuOpen && (
        <div className="dg-drawer md:hidden">
          <nav>
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="dg-drawer-link"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ borderTop: "2px solid #F0F0F0", marginTop: 4 }}>
              <Link href={user ? "/account" : "/signin"} className="dg-drawer-link" onClick={() => setIsMenuOpen(false)}>
                {user ? "My Account" : "Sign In / Sign Up"}
              </Link>
              <Link href="/rewards" className="dg-drawer-link" onClick={() => setIsMenuOpen(false)}>
                VIP Rewards
              </Link>
              <Link href="/cart" className="dg-drawer-link" onClick={() => setIsMenuOpen(false)}>
                Cart {cartCount > 0 ? `(${cartCount})` : ""}
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          PROFILE MODAL
      ══════════════════════════════════════════════════════════════ */}
      {showProfileModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={e => { if (e.target === e.currentTarget) setShowProfileModal(false); }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#4C9141" }}>
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    {user ? `Welcome back, ${displayName}` : "Welcome to Highway 420"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {user ? user.email : "Sign in for personalised recommendations"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <h3 className="font-semibold text-gray-900 text-sm">Recommended for You</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg p-3 bg-blue-50">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-gray-900 text-sm">Trending</span>
                    </div>
                    <Link href="/mushrooms" className="block text-sm text-blue-600 hover:underline mb-1" onClick={() => setShowProfileModal(false)}>🔥 Premium Mushrooms</Link>
                    <Link href="/thca_flower" className="block text-sm text-blue-600 hover:underline" onClick={() => setShowProfileModal(false)}>🔥 THCA Flower</Link>
                  </div>
                  <div className="rounded-lg p-3 bg-green-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Gift className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-gray-900 text-sm">Staff Picks</span>
                    </div>
                    <Link href="/thca_pnv" className="block text-sm text-green-600 hover:underline" onClick={() => setShowProfileModal(false)}>🌟 Premium Pre-Rolls & Vapes</Link>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href={user ? "/account" : "/signin"}
                    onClick={() => setShowProfileModal(false)}
                    className="dg-btn-primary"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {user ? "Go to Dashboard" : "Sign In / Sign Up"}
                  </Link>
                  <Link
                    href="/rewards"
                    onClick={() => setShowProfileModal(false)}
                    className="dg-btn-outline"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    VIP Rewards
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
