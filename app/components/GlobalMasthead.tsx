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
    label: "Vapes",
    href: "/vapes",
    children: [
      { label: "All Vapes", href: "/vapes" },
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
    label: "Shrooms",
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
  {
    label: "Brands",
    href: "/#brands",
    children: null,
  },
  {
    label: "Higher Learning",
    href: "/higher-learning",
    children: null,
  },
];



export default function GlobalMasthead() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
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

        /* ── Top bar (search only — icons moved to navbar) ── */
        .dg-topbar {
          max-width: 1440px;
          margin: 0 auto;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
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
        .dg-logo-link:hover { filter: brightness(1.05) drop-shadow(0 2px 8px rgba(82,196,26,0.35)); }

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
          background: radial-gradient(ellipse at 50% 35%, #3cb05b 0%, #2d8f47 55%, #226b35 100%);
          color: #fff;
          padding: 0 16px;
          height: 100%;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: background 0.15s;
        }
        .dg-search-btn:hover { background: radial-gradient(ellipse at 50% 35%, #4ec16c 0%, #3cb05b 55%, #287d3e 100%); }

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

        /* ── Navigation bar — highway road-sign double-border at BOTTOM ── */
        .dg-navbar {
          /* Thick outer line at very bottom, thin inner line above it */
          border-bottom: 3px solid rgba(255,255,255,0.95);
          position: relative;
          background: transparent;
        }
        /* Inner thin line — sits 4px above the thick bottom border */
        .dg-navbar::before {
          content: '';
          position: absolute;
          bottom: 6px; /* 3px border + 3px gap */
          left: 0;
          right: 0;
          height: 1px;
          background: rgba(255,255,255,0.85);
          pointer-events: none;
        }
        .dg-navinner {
          position: relative;
          padding: 0 16px;
          display: flex;
          align-items: center;
          width: 100%;
          box-sizing: border-box;
          min-height: 52px; /* extra height for the double-line design */
        }
        .dg-navlink {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 13px 12px;
          font-family: 'Fira Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
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
          color: #A7F3D0;
          border-bottom-color: #A7F3D0;
        }

        /* Vertical pipe dividers between nav items */
        .dg-navitem + .dg-navitem::before {
          content: '';
          display: block;
          width: 1px;
          height: 18px;
          background: rgba(255,255,255,0.35);
          flex-shrink: 0;
          align-self: center;
        }

        /* ── Dropdown panel ── (matches premium dark green header) */
        .dg-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          min-width: 220px;
          background: linear-gradient(to bottom, #145C3C, #0F4A30);
          border: 1px solid rgba(255,255,255,0.12);
          border-top: 2px solid #A7F3D0;
          border-radius: 0 0 8px 8px;
          box-shadow: 0 12px 32px rgba(0,0,0,0.35);
          z-index: 200;
          padding: 8px 0;
        }
        .dg-dropdown-link {
          display: block;
          padding: 10px 18px;
          font-family: 'Fira Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #ffffff;
          text-decoration: none;
          transition: background 0.15s, color 0.15s, padding-left 0.15s;
          letter-spacing: 0.02em;
        }
        .dg-dropdown-link:hover {
          background: rgba(255,255,255,0.08);
          color: #A7F3D0;
          padding-left: 22px;
        }

        /* ── Right-side drawer + backdrop ── */
        .dg-drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
          z-index: 199;
          animation: dg-fade-in 0.2s ease-out;
        }
        .dg-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(340px, 86vw);
          background: #145C3C;
          border-left: 1px solid rgba(255,255,255,0.14);
          box-shadow: -10px 0 28px rgba(0,0,0,0.35);
          z-index: 200;
          overflow-y: auto;
          animation: dg-slide-in-right 0.28s ease-out;
          display: flex;
          flex-direction: column;
        }
        .dg-drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.14);
          flex-shrink: 0;
        }
        .dg-drawer-title {
          font-family: 'Fira Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #ffffff;
          text-transform: uppercase;
        }
        .dg-drawer-close {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #ffffff;
          padding: 6px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
        }
        .dg-drawer-close:hover { background: rgba(255,255,255,0.12); }
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
        .dg-drawer-section-divider {
          border-top: 1px solid rgba(255,255,255,0.18);
          margin-top: 4px;
        }

        @keyframes dg-slide-in-right {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes dg-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

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
            COMPACT (< xl) — hamburger layout for phones, tablets, and
            narrow desktop/split-screen viewports
        ══════════════════════════════════════════════════════════════ */}
        <div className="xl:hidden relative">

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

          {/* Compact top bar — mirrors desktop double-line navbar at bottom */}
          <div className={`dg-navbar flex items-center px-4 py-3 gap-3 ${isSearchOpen ? "invisible" : "visible"}`}>
            {/* Logo */}
            <Link href="/" className="dg-logo-link" aria-label="Highway 420 home">
              <Image
                src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/logo_Highway420-official_transparent.png"
                alt="HIGHWAY 420"
                width={200}
                height={200}
                style={{
                  height: '96px',
                  width: 'auto',
                  transform: 'scale(1.15)',
                  transformOrigin: 'left center',
                }}
                className="object-contain"
                priority
              />
            </Link>

            <div className="flex-1" />

            {/* Profile */}
            <button
              onClick={() => setShowProfileModal(true)}
              aria-label="Account"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                background: 'transparent',
                border: '1.5px solid rgba(255,255,255,0.80)',
                borderRadius: '999px',
                color: '#ffffff',
                fontFamily: "'Fira Sans', sans-serif",
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {displayName && (
                <span className="hidden sm:block" style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {displayName}
                </span>
              )}
              <User style={{ width: 18, height: 18 }} />
            </button>

            {/* Search */}
            <button className="dg-icon-btn" onClick={() => setIsSearchOpen(true)} aria-label="Search">
              <Search style={{ width: 20, height: 20 }} />
            </button>

            {/* Cart — styling matching desktop */}
            <Link
              href="/cart"
              aria-label={`Cart (${cartCount} items)`}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '9px 14px',
                background: '#ffffff',
                borderRadius: '6px',
                color: '#145C3C',
                textDecoration: 'none',
                transition: 'background 0.15s, transform 0.1s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = '#f0f0ec';
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = '#ffffff';
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              }}
            >
              <ShoppingCart style={{ width: 24, height: 24 }} />
              {cartCount > 0 && (
                <span className="dg-cart-badge" style={{ borderColor: '#145C3C' }}>
                  {cartCount > 99 ? '99+' : String(cartCount)}
                </span>
              )}
            </Link>

            {/* Hamburger */}
            <button className="dg-icon-btn" onClick={() => setIsMenuOpen(v => !v)} aria-label="Menu">
              {isMenuOpen ? <X style={{ width: 22, height: 22 }} /> : <Menu style={{ width: 22, height: 22 }} />}
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            DESKTOP (≥ xl) — full nav with centered links + right icons
        ══════════════════════════════════════════════════════════════ */}
        <div className="hidden xl:block">
          {/*
            Full-width stacked layout.
            The logo is absolutely positioned so BOTH the search row and the nav row
            span 100% of the header width — meaning left:50% in each row refers to
            the exact same screen center.
          */}
          <div style={{ position: 'relative', width: '100%' }}>

            {/* ── Logo: absolutely positioned, spans full header height ── */}
            <Link
              href="/"
              className="dg-logo-link"
              aria-label="Highway 420 home"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                padding: '2px 16px 14px 4px',
              }}
            >
              <Image
                src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/logo_Highway420-official_transparent.png"
                alt="HIGHWAY 420"
                width={300}
                height={300}
                style={{
                  height: '100%',
                  width: 'auto',
                  maxHeight: '160px',
                  minHeight: '100px',
                  display: 'block',
                  transform: 'translateY(2px) scale(1.15)',
                  transformOrigin: 'left center',
                  filter: 'drop-shadow(0 4px 12px rgba(255,255,255,0.28)) drop-shadow(0 1px 4px rgba(255,255,255,0.18))',
                }}
                className="object-contain"
                priority
              />
            </Link>

            {/* ── Row 1: Topbar — search centered, icons pinned right ── */}
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '68px',
              padding: '10px 16px',
            }}>
              <form onSubmit={handleSearch} className="dg-search-form" style={{ width: '100%', maxWidth: 580 }}>
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

              {/* Profile + Cart — absolutely pinned to the right of the topbar */}
              <div style={{
                position: 'absolute',
                right: '16px',
                top: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                {/* Profile — ghost pill: white outline, name left of icon */}
                <button
                  onClick={() => setShowProfileModal(true)}
                  aria-label="Account"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '7px 14px',
                    background: 'transparent',
                    border: '1.5px solid rgba(255,255,255,0.80)',
                    borderRadius: '999px',
                    color: '#ffffff',
                    fontFamily: "'Fira Sans', sans-serif",
                    fontSize: '13px',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'background 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {displayName && (
                    <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {displayName}
                    </span>
                  )}
                  <User style={{ width: 18, height: 18, flexShrink: 0 }} />
                </button>

                {/* Cart — solid white, enlarged icon, no text */}
                <Link
                  href="/cart"
                  aria-label={`Cart (${cartCount} items)`}
                  style={{
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '9px 14px',
                    background: '#ffffff',
                    borderRadius: '6px',
                    color: '#145C3C',
                    textDecoration: 'none',
                    transition: 'background 0.15s, transform 0.1s',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = '#f0f0ec';
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = '#ffffff';
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                  }}
                >
                  <ShoppingCart style={{ width: 26, height: 26 }} />
                  {cartCount > 0 && (
                    <span className="dg-cart-badge" style={{ borderColor: '#145C3C' }}>
                      {cartCount > 99 ? '99+' : String(cartCount)}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* ── Row 2: Navbar — full width, links truly centered, icons far right ── */}
            <nav className="dg-navbar" aria-label="Primary navigation" style={{ width: '100%' }}>
              <div className="dg-navinner" style={{ position: 'relative', padding: '0 16px' }}>

                {/* Nav links — left:50% relative to the FULL header width */}
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  top: 0,
                  bottom: 0,
                }}>
                  {NAV_LINKS.map(link => (
                    <div
                      key={link.href}
                      className="dg-navitem relative"
                      style={{ display: 'flex', alignItems: 'center' }}
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

              </div>{/* /dg-navinner */}
            </nav>

          </div>{/* /relative wrapper */}
        </div>{/* /hidden xl:block */}
      </header>

      {/* ══════════════════════════════════════════════════════════════
          RIGHT-SIDE SLIDE-IN DRAWER (shown < xl)
      ══════════════════════════════════════════════════════════════ */}
      {isMenuOpen && (
        <>
          <div
            className="dg-drawer-backdrop xl:hidden"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="dg-drawer xl:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
          >
            <div className="dg-drawer-header">
              <span className="dg-drawer-title">Menu</span>
              <button
                type="button"
                className="dg-drawer-close"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
              >
                <X style={{ width: 22, height: 22 }} />
              </button>
            </div>
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
              <div className="dg-drawer-section-divider">
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
          </aside>
        </>
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
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#2d8f47" }}>
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
