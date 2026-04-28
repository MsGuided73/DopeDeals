"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

/* ── Mirror the primary navbar's category structure exactly ─────────────── */
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
  { label: "Dab Rigs", href: "/dabsntools", children: null },
  {
    label: "Pre-Rolls",
    href: "/pre-rolls",
    children: [
      { label: "All Pre-Rolls", href: "/pre-rolls" },
      { label: "Rolling Papers & Wraps", href: "/accessories?type=rolling" },
    ],
  },
  { label: "Edibles", href: "/edibles", children: null },
  { label: "Shrooms & More", href: "/mushrooms", children: null },
  { label: "Accessories", href: "/accessories", children: null },
  { label: "THCA Flower", href: "/thca_flower", children: null },
];

export default function FloatingNav() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openMenu = (label: string) => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setOpenDropdown(label);
  };

  const closeWithDelay = () => {
    dropdownTimerRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  if (!isScrolled || pathname === "/cart" || pathname === "/checkout") {
    return null;
  }

  return (
    <>
      <style>{`
        .fn-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          background: linear-gradient(to bottom, #145C3C, #1B7A4D);
          border-bottom: 1px solid #0F4A30;
          box-shadow: 0 2px 16px rgba(0,0,0,0.15);
        }
        .fn-inner {
          display: flex;
          align-items: center;
          padding: 0 24px;
          gap: 0;
          height: 60px;
        }

        .fn-links {
          display: flex;
          align-items: center;
          gap: 0;
          flex: 1;
          justify-content: center;
        }
        .fn-link {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 0 14px;
          height: 60px;
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
        .fn-link:hover, .fn-link.active {
          color: #ffffff;
          border-bottom-color: rgba(255,255,255,0.8);
        }
        .fn-dropdown {
          position: absolute;
          top: calc(100% + 2px);
          left: 0;
          min-width: 210px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-top: 2px solid #2d8f47;
          border-radius: 0 0 6px 6px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.10);
          z-index: 100;
          padding: 6px 0;
        }
        .fn-dropdown-link {
          display: block;
          padding: 9px 18px;
          font-family: 'Fira Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          text-decoration: none;
          transition: background 0.12s, color 0.12s;
        }
        .fn-dropdown-link:hover {
          background: #f0fce8;
          color: #3a9e12;
        }
        .fn-navitem {
          display: flex;
          align-items: center;
          height: 100%;
        }
        /* Vertical pipe dividers between nav items */
        .fn-navitem + .fn-navitem::before {
          content: '';
          display: block;
          width: 1px;
          height: 18px;
          background: #E8E4D9;
          flex-shrink: 0;
          align-self: center;
        }

        /* ── Right-side toggle button ── */
        .fn-mobile-toggle {
          display: none;
          background: transparent;
          border: none;
          color: #ffffff;
          padding: 8px;
          cursor: pointer;
          margin-left: auto;
        }
        @media (max-width: 1279px) {
          .fn-links {
            display: none;
          }
          .fn-mobile-toggle {
            display: block;
          }
        }

        /* ── Left-side drawer + backdrop ── */
        .fn-drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
          z-index: 10000;
          animation: fn-fade-in 0.2s ease-out;
        }
        .fn-drawer {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: min(340px, 86vw);
          background: #145C3C;
          border-right: 1px solid rgba(255,255,255,0.14);
          box-shadow: 10px 0 28px rgba(0,0,0,0.35);
          z-index: 10001;
          overflow-y: auto;
          animation: fn-slide-in-left 0.28s ease-out;
          display: flex;
          flex-direction: column;
        }
        .fn-drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.14);
          flex-shrink: 0;
        }
        .fn-drawer-title {
          font-family: 'Fira Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #ffffff;
          text-transform: uppercase;
        }
        .fn-drawer-close {
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
        .fn-drawer-close:hover { background: rgba(255,255,255,0.12); }
        .fn-drawer-link {
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
        .fn-drawer-link:hover { background: rgba(255,255,255,0.1); color: #ffffff; }

        @keyframes fn-slide-in-left {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        @keyframes fn-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      <nav className="fn-bar" aria-label="Secondary navigation">
        <div className="fn-inner">


          {/* Nav links — centered within remaining space */}
          <div className="fn-links">
            {NAV_LINKS.map((link) => (
              <div
                key={link.href}
                className="relative fn-navitem"
                onMouseEnter={() => link.children && openMenu(link.label)}
                onMouseLeave={() => link.children && closeWithDelay()}
              >
                <Link
                  href={link.href}
                  className={`fn-link ${openDropdown === link.label ? "active" : ""}`}
                >
                  {link.label}
                  {link.children && (
                    <ChevronDown style={{ width: 11, height: 11, opacity: 0.55 }} />
                  )}
                </Link>

                {link.children && openDropdown === link.label && (
                  <div
                    className="fn-dropdown"
                    onMouseEnter={() => openMenu(link.label)}
                    onMouseLeave={closeWithDelay}
                  >
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="fn-dropdown-link"
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

          {/* Hamburger Icon - pushed to right, visible on < xl */}
          <button className="fn-mobile-toggle" onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
            <Menu style={{ width: 26, height: 26 }} />
          </button>

        </div>
      </nav>

      {/* Drawer */}
      {isMenuOpen && (
        <>
          <div
            className="fn-drawer-backdrop xl:hidden"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="fn-drawer xl:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
          >
            <div className="fn-drawer-header">
              <span className="fn-drawer-title">Menu</span>
              <button
                type="button"
                className="fn-drawer-close"
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
                  className="fn-drawer-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
        </>
      )}
    </>
  );
}
