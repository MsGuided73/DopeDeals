"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
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
          background: #ffffff;
          border-bottom: 2px solid #e5e7eb;
          box-shadow: 0 2px 16px rgba(0,0,0,0.10);
        }
        .fn-inner {
          display: flex;
          align-items: center;
          padding: 0 24px;
          gap: 0;
          height: 60px;
        }
        .fn-logo {
          flex-shrink: 0;
          margin-right: 28px;
          display: flex;
          align-items: center;
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
          color: #111827;
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
          color: #52C41A;
          border-bottom-color: #52C41A;
        }
        .fn-dropdown {
          position: absolute;
          top: calc(100% + 2px);
          left: 0;
          min-width: 210px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-top: 2px solid #52C41A;
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
      `}</style>

      <nav className="fn-bar" aria-label="Secondary navigation">
        <div className="fn-inner">

          {/* Wordmark logo */}
          <Link href="/" className="fn-logo" aria-label="Highway 420 home">
            <Image
              src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/3dassets/10inWM.png"
              alt="Highway 420"
              width={130}
              height={44}
              style={{ objectFit: "contain", height: "44px", width: "auto" }}
              priority
            />
          </Link>

          {/* Nav links — centered */}
          <div className="fn-links">
            {NAV_LINKS.map((link) => (
              <div
                key={link.href}
                className="relative"
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

        </div>
      </nav>
    </>
  );
}
