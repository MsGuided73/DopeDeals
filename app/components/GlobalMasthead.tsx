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
  { label: "PIPES",       href: "/pipes" },
  { label: "BONGS",       href: "/bongs" },
  { label: "DAB RIGS",    href: "/dabsntools" },
  { label: "ACCESSORIES", href: "/accessories" },
];

// ─── Shared gradient colours ───────────────────────────────────────────────
const BG_BADGE = "linear-gradient(145deg, #213D2C 0%, #162A1D 55%, #112318 100%)";
const BG_CART  = "linear-gradient(145deg, #213D2C 0%, #162A1D 100%)";

export default function GlobalMasthead() {
  const [isMenuOpen,               setIsMenuOpen]               = useState(false);
  const [isSearchOpen,             setIsSearchOpen]             = useState(false);
  const [showProfileModal,         setShowProfileModal]         = useState(false);
  const [isDesktopSearchCollapsed, setIsDesktopSearchCollapsed] = useState(false);
  const [isNavCollapsed,           setIsNavCollapsed]           = useState(false);
  const [searchQuery,              setSearchQuery]              = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const logoRef        = useRef<HTMLDivElement>(null);
  const searchRef      = useRef<HTMLFormElement>(null);
  const catNavRef      = useRef<HTMLDivElement>(null);

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

  // Desktop: collapse search bar + category nav when logo contacts them
  useEffect(() => {
    let collapsed = false;
    let navCollapsed = false;
    const naturalW = { search: 0, nav: 0 };

    const check = () => {
      if (!logoRef.current) return;
      const logoRight = logoRef.current.getBoundingClientRect().right;
      const vw = window.innerWidth;

      // ── Search bar ─────────────────────────────────────────────────
      if (!collapsed && searchRef.current) {
        // Only capture naturalW when the element is actually rendered and sized
        if (!naturalW.search && searchRef.current.offsetWidth > 0) {
          naturalW.search = searchRef.current.offsetWidth;
        }
        const searchLeft = searchRef.current.getBoundingClientRect().left;
        if (logoRight + 20 >= searchLeft) {
          collapsed = true;
          setIsDesktopSearchCollapsed(true);
        }
      } else if (collapsed) {
        const sw = naturalW.search || 480;
        const estimatedSearchLeft = (vw - sw) / 2;
        if (logoRight + 48 < estimatedSearchLeft) {
          collapsed = false;
          setIsDesktopSearchCollapsed(false);
        }
      }

      // ── Category nav ───────────────────────────────────────────────
      if (!navCollapsed && catNavRef.current) {
        // Only capture naturalW when the element is actually rendered and sized.
        // A zero offsetWidth means fonts/images haven't loaded yet — skip this tick.
        if (!naturalW.nav && catNavRef.current.offsetWidth > 0) {
          naturalW.nav = catNavRef.current.offsetWidth;
        }
        // Don't collapse until we have a real measurement
        if (naturalW.nav > 0) {
          const navLeft = catNavRef.current.getBoundingClientRect().left;
          if (logoRight + 20 >= navLeft) {
            navCollapsed = true;
            setIsNavCollapsed(true);
          }
        }
      } else if (navCollapsed) {
        const nw = naturalW.nav || 520;
        const estimatedNavLeft = (vw - nw) / 2;
        if (logoRight + 64 < estimatedNavLeft) {
          navCollapsed = false;
          setIsNavCollapsed(false);
        }
      }
    };

    // Defer the first check until after paint so fonts + images have rendered
    // and offsetWidth reflects the real layout — prevents false collapse on mount.
    let rafId = requestAnimationFrame(() => {
      check();
      const ro = new ResizeObserver(check);
      ro.observe(document.documentElement);
      // Store disconnect so the cleanup below can reach it
      (rafId as any) = ro;
    });

    return () => {
      if (typeof (rafId as any).disconnect === 'function') {
        (rafId as any).disconnect();
      } else {
        cancelAnimationFrame(rafId as unknown as number);
      }
    };
  }, []);

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

        /* ── Unified Realistic Wood Background (WoodGrain1) — ANTIQUED ── */
        .hw-wood-bg {
          /* Deeper, aged walnut base */
          background-color: #2a1809;
          background-image:
            /* 1. Corner-darkening vignette — edges look worn/dirty */
            radial-gradient(ellipse 130% 90% at 50% 50%, transparent 38%, rgba(10, 4, 0, 0.55) 100%),
            /* 2. Sepia patina — warm brown wash that ages the highlights */
            linear-gradient(180deg, rgba(85, 50, 22, 0.42) 0%, rgba(45, 22, 8, 0.52) 100%),
            /* 3. Directional shade — top brighter than bottom */
            linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.30) 100%),
            /* 4. The wood texture itself */
            url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Textures/WoodGrain2.png');
          background-size: auto, auto, auto, auto;
          background-position: center, center, center, center;
          background-repeat: no-repeat, no-repeat, no-repeat, repeat;
          background-blend-mode: multiply, multiply, overlay, normal;
          box-shadow:
            inset 0 -8px 24px rgba(0,0,0,0.92),
            0 2px 10px rgba(0,0,0,0.72),
            0 6px 28px rgba(0,0,0,0.50);
          border-top: 1px solid rgba(120, 80, 40, 0.30);  /* warm aged trim instead of bright white */
          border-bottom: 3px solid rgba(0,0,0,0.97);
          position: relative;
        }
        /* Aged ambient overlay — dimmer "gas-lamp" warmth + smoke-stained corners */
        .hw-wood-bg::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            /* Smoke-stain patina at top corners (years of grime) */
            radial-gradient(ellipse 55% 55% at 0% 0%,   rgba(20, 10, 2, 0.42) 0%, transparent 62%),
            radial-gradient(ellipse 55% 55% at 100% 0%, rgba(20, 10, 2, 0.42) 0%, transparent 62%),
            /* Dim overhead gas-lamp glow — much softer than before */
            radial-gradient(ellipse 70% 55% at 50% 0%,  rgba(180, 130, 55, 0.12) 0%, transparent 70%),
            /* Faint center wash over the search-bar area */
            radial-gradient(ellipse 35% 60% at 50% 55%, rgba(180, 130, 55, 0.06) 0%, transparent 70%);
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

        /* ── Category Nav Buttons — heavily worn antique wood plaques (WoodGrain2) ── */
        .hw-badge {
          display: inline-flex;
          align-items: center;
          /* Deeply worn wood: uneven corner damage + stronger sepia + WoodGrain2 */
          background-image:
            /* corner damage — each corner has its own darkened wear spot (uneven) */
            radial-gradient(ellipse 35% 45% at 0%   0%,   rgba(0,0,0,0.55) 0%, transparent 55%),
            radial-gradient(ellipse 30% 40% at 100% 100%, rgba(0,0,0,0.50) 0%, transparent 55%),
            radial-gradient(ellipse 22% 28% at 100% 0%,   rgba(0,0,0,0.40) 0%, transparent 60%),
            radial-gradient(ellipse 22% 28% at 0%   100%, rgba(0,0,0,0.35) 0%, transparent 60%),
            /* overall edge darkening */
            radial-gradient(ellipse 110% 100% at 50% 50%, transparent 25%, rgba(0,0,0,0.65) 100%),
            /* deeper sepia grime */
            linear-gradient(170deg, rgba(55, 30, 12, 0.45) 0%, rgba(20, 10, 3, 0.65) 100%),
            /* directional shade — light from above */
            linear-gradient(180deg, rgba(255, 220, 165, 0.10) 0%, rgba(0, 0, 0, 0.25) 100%),
            url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Textures/WoodGrain2.png');
          background-size: auto, auto, auto, auto, auto, auto, auto, auto;
          background-position: center, center, center, center, center, center, center, center;
          background-repeat: no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, repeat;
          background-blend-mode: multiply, multiply, multiply, multiply, multiply, multiply, overlay, normal;
          border: 1.5px solid rgba(215, 205, 182, 0.70);   /* tarnished off-white (not pure bright) */
          box-shadow:
            /* face dimension — strong top bevel, deep bottom recess */
            inset 0 2px 0 rgba(240, 234, 220, 0.38),
            inset 0 3px 2px rgba(255, 220, 165, 0.15),
            inset 0 -5px 10px rgba(0, 0, 0, 0.70),
            inset 0 -1px 0 rgba(0, 0, 0, 0.55),
            /* STACKED "extruded block" thickness — each layer a darker wood tone, builds an 8px visible side */
            0 2px 0 rgba(60, 35, 15, 0.95),
            0 4px 0 rgba(40, 22, 8, 0.95),
            0 6px 0 rgba(22, 12, 4, 0.93),
            0 8px 0 rgba(10, 5, 0, 0.92),
            /* multi-step ambient shadow on the wall behind */
            0 10px 14px rgba(0, 0, 0, 0.65),
            0 16px 28px rgba(0, 0, 0, 0.45),
            0 22px 40px rgba(0, 0, 0, 0.25),
            /* outer hairline for separation */
            0 0 0 1px rgba(0, 0, 0, 0.55);
          border-radius: 4px;
          color: #cfc1a8;                                  /* tarnished cream — worn off-white with a subtle grime tint */
          font-family: 'Oswald', system-ui, sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.18em;
          padding: 7px 15px;
          text-transform: uppercase;
          white-space: nowrap;
          transition: transform 0.15s ease-out, box-shadow 0.15s ease-out, color 0.15s ease-out, border-color 0.15s ease-out;
          cursor: pointer;
          text-decoration: none;
          /* text-shadow: sharp dark underlayer + faint blur (makes letters read as worn/stamped) */
          text-shadow:
            0 1px 2px rgba(0, 0, 0, 0.98),
            0 0 3px rgba(0, 0, 0, 0.70);
        }
        .hw-badge:hover {
          /* Lift the plaque higher — wood thickness becomes more visible */
          color: #ede2c8;                                /* slightly cleaner cream when "lit" */
          border-color: rgba(240, 234, 220, 0.95);
          transform: translateY(-2px);
          box-shadow:
            /* face dimension — slightly stronger highlights */
            inset 0 2px 0 rgba(240, 234, 220, 0.50),
            inset 0 3px 2px rgba(255, 230, 175, 0.22),
            inset 0 -5px 10px rgba(0, 0, 0, 0.70),
            inset 0 -1px 0 rgba(0, 0, 0, 0.55),
            /* STACKED thickness — bumped to 10px tall block on lift */
            0 2px 0 rgba(60, 35, 15, 0.95),
            0 4px 0 rgba(40, 22, 8, 0.95),
            0 6px 0 rgba(22, 12, 4, 0.93),
            0 8px 0 rgba(10, 5, 0, 0.92),
            0 10px 0 rgba(5, 2, 0, 0.90),
            /* deeper ambient shadow */
            0 12px 18px rgba(0, 0, 0, 0.68),
            0 20px 32px rgba(0, 0, 0, 0.50),
            0 28px 48px rgba(0, 0, 0, 0.28),
            0 0 0 1px rgba(0, 0, 0, 0.55),
            /* aged amber lamp glow */
            0 0 22px rgba(170, 110, 40, 0.28);
        }
        .hw-badge:active {
          /* Press down — compress the thickness, deepen the inset shadow */
          transform: translateY(6px);
          box-shadow:
            inset 0 2px 5px rgba(0, 0, 0, 0.75),
            inset 0 -1px 0 rgba(240, 234, 220, 0.10),
            /* only 2px of thickness left — rest got pressed away */
            0 2px 0 rgba(20, 10, 3, 0.90),
            0 3px 6px rgba(0, 0, 0, 0.55),
            0 0 0 1px rgba(0, 0, 0, 0.55);
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
                style={{ height: '58px', width: 'auto', flexShrink: 0 }}
                className="object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                priority
              />
              {/* WORDMARK TEMPORARILY HIDDEN — uncomment to restore
              <Image
                src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/3dassets/H420%20Wordmark-v3.png"
                alt="HIGHWAY 420"
                width={0}
                height={0}
                sizes="100vw"
                style={{
                  height: '38px',
                  width: 'auto',
                  flexShrink: 0,
                  transform: 'translateY(-1px)',
                  filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.85))',
                  mixBlendMode: 'screen',
                }}
                className="object-contain"
                priority
              />
              */}
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

            <Link href={user ? "/account" : "/signin"} className="relative" aria-label="Account">
              <div className="w-[38px] h-[38px] rounded-full border border-[rgba(212,175,55,0.4)] bg-[rgba(10,5,0,0.5)] flex items-center justify-center text-[#decba5]">
                <User style={{ width: 18, height: 18 }} />
              </div>
            </Link>

            <button className="hw-action-btn" onClick={() => setIsMenuOpen(v => !v)} aria-label="Menu">
              {isMenuOpen ? <X style={{ width: 24, height: 24 }} strokeWidth={2} /> : <Menu style={{ width: 24, height: 24 }} strokeWidth={2} />}
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            DESKTOP VIEW
            Layout: [Logo left] ── [Search centred / Categories centred] ── [Account + Cart right]
        ══════════════════════════════════════════════════════════════ */}
        <div className="hidden md:flex flex-row items-stretch w-full mx-auto relative z-10" style={{ minHeight: '120px' }}>

          {/* ══ LEFT: Brand Lockup — shield + single-line wordmark ══ */}
          <Link
            href="/"
            className="flex-shrink-0 self-stretch flex items-center pl-4 lg:pl-6 pr-4 hover:brightness-110 transition-all duration-200 relative z-10"
            aria-label="Highway 420 home"
          >
            {/* Brand lockup wrapper — ref used for search-collapse collision detection */}
            <div ref={logoRef} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Shield — tall, spanning nearly full masthead height */}
              <Image
                src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/3dassets/Shield_Logo2.png"
                alt="HIGHWAY 420"
                width={120}
                height={120}
                style={{ height: 'clamp(110px, 13vw, 155px)', width: 'auto', flexShrink: 0 }}
                className="object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
                priority
              />
              {/* WORDMARK TEMPORARILY HIDDEN — uncomment to restore
              <Image
                src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/3dassets/H420%20Wordmark-v3.png"
                alt="HIGHWAY 420"
                width={0}
                height={0}
                sizes="100vw"
                style={{
                  height: 'clamp(80px, 8.5vw, 115px)',
                  width: 'auto',
                  flexShrink: 0,
                  filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.90))',
                  mixBlendMode: 'screen',
                }}
                className="object-contain"
                priority
              />
              */}
            </div>
          </Link>

          {/* ══ CENTRE: absolute overlay — true page-center for search + category buttons ══ */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4 py-3 pointer-events-none">

            {/* Search bar — hidden when logo contacts it; icon migrates to right nav */}
            {!isDesktopSearchCollapsed && (
              <form
                ref={searchRef}
                onSubmit={handleSearch}
                className="hw-inset-container w-full max-w-[480px] pointer-events-auto"
                style={{ height: '44px' }}
              >
                <Search
                  style={{ width: 16, height: 16, color: 'rgba(222,203,165,0.6)', flexShrink: 0 }}
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
            )}

            {/* Category nav buttons — hidden when logo contacts them; hamburger migrates to right nav */}
            {!isNavCollapsed && (
              <div ref={catNavRef} className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1 pointer-events-auto">
                {NAV_CATEGORIES.map(cat => (
                  <Link key={cat.href} href={cat.href} className="hw-badge">
                    {cat.label}
                  </Link>
                ))}
              </div>
            )}

          </div>

          {/* ══ RIGHT: collapsed icons + Account + Cart ══ */}
          <div className="flex-shrink-0 flex items-center gap-2 pr-4 lg:pr-8 relative z-10 ml-auto">

            {/* Search icon — migrates here when search bar is contacted by logo */}
            {isDesktopSearchCollapsed && (
              <button
                type="button"
                className="hw-action-circle flex-shrink-0"
                style={{ width: '44px', height: '44px' }}
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
              >
                <Search style={{ width: 18, height: 18 }} strokeWidth={2} />
              </button>
            )}

            {/* Hamburger — migrates here when category nav is contacted by logo */}
            {isNavCollapsed && (
              <button
                className="hw-action-circle flex-shrink-0"
                style={{ width: '44px', height: '44px' }}
                onClick={() => setIsMenuOpen(v => !v)}
                aria-label="Navigation menu"
              >
                {isMenuOpen
                  ? <X    style={{ width: 20, height: 20 }} strokeWidth={2} />
                  : <Menu style={{ width: 20, height: 20 }} strokeWidth={2} />}
              </button>
            )}

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

          {/* Desktop search overlay (shown when collapsed search icon is clicked) */}
          {isDesktopSearchCollapsed && isSearchOpen && (
            <div
              className="absolute inset-0 z-40 flex items-center gap-4 px-6"
              style={{ background: 'linear-gradient(180deg, #1E1C16 0%, #171510 100%)' }}
            >
              <form
                onSubmit={handleSearch}
                className="hw-inset-container flex-1"
                style={{ height: '48px' }}
              >
                <Search style={{ width: 16, height: 16, color: 'rgba(222,203,165,0.6)', flexShrink: 0 }} strokeWidth={2} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search Highway 420..."
                  className="hw-search-input"
                />
              </form>
              <button
                type="button"
                onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                className="hw-action-btn"
                aria-label="Close search"
              >
                <X style={{ width: 22, height: 22 }} />
              </button>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            MOBILE DRAWER — slides down from masthead
        ══════════════════════════════════════════════════════════════ */}
        {isMenuOpen && (
          <div className="hw-drawer">
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
