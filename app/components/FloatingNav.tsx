"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useNavigation } from "../contexts/NavigationContext";

export default function FloatingNav() {
  const { hasMasthead } = useNavigation();
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [openNestedSubmenu, setOpenNestedSubmenu] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Clear any pending hover timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
    };
  }, [hoverTimeout]);

  // Handle scroll to show/hide floating nav
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 200); // Show floating nav after 200px scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Always render the floating nav - it can coexist with the masthead

  const handleDropdownLinkClick = () => {
    setOpenDropdown(null);
    setOpenSubmenu(null);
    setOpenNestedSubmenu(null);
  };

  const handleMouseLeaveWithDelay = (dropdownType: "main" | "submenu" | "nested") => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    const t = setTimeout(() => {
      if (dropdownType === "main") {
        setOpenDropdown(null);
        setOpenSubmenu(null);
        setOpenNestedSubmenu(null);
      } else if (dropdownType === "submenu") {
        setOpenSubmenu(null);
        setOpenNestedSubmenu(null);
      } else {
        setOpenNestedSubmenu(null);
      }
    }, 300);
    setHoverTimeout(t);
  };

  const handleMouseEnter = (type: "dropdown" | "submenu" | "nested", value: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    if (type === "dropdown") setOpenDropdown(value);
    else if (type === "submenu") setOpenSubmenu(value);
    else setOpenNestedSubmenu(value);
  };

  // Only show floating nav when scrolled past 200px
  if (!isScrolled || pathname === "/cart" || pathname === "/checkout") {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black z-[60] border-b border-gray-800">
      <div className="flex items-center justify-center gap-4 py-2 px-4">
        {/* Vapes Dropdown */}
        <div className="relative">
          <button
            onMouseEnter={() => handleMouseEnter("dropdown", "vapes")}
            onMouseLeave={() => handleMouseLeaveWithDelay("main")}
            className="text-white text-sm font-bold hover:text-yellow-400 transition-colors flex items-center gap-1"
          >
            Vapes
            <ChevronDown className="w-3 h-3" />
          </button>

          {openDropdown === "vapes" && (
            <div
              className="absolute top-full left-0 mt-1 w-64 rounded-lg shadow-lg border border-gray-700 z-[50] bg-black"
              onMouseEnter={() => handleMouseEnter("dropdown", "vapes")}
              onMouseLeave={() => handleMouseLeaveWithDelay("main")}
            >
              <div className="py-2">
                <Link href="/vapes" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors font-medium">
                  ⭐ All Vapes & Carts
                </Link>
                <div className="border-t border-gray-700 my-1" />

                {/* Vapes by Type */}
                <Link href="/vapes?type=cartridge" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                  Cartridges
                </Link>
                <Link href="/vapes?type=disposable" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                  Disposables
                </Link>
                <Link href="/vapes?type=vaporizer" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                  Vaporizers
                </Link>

                <div className="border-t border-gray-700 my-1" />

                {/* Equipment - Temporarily disabled */}
                {/* <Link href="/dabsntools" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                  E-Rigs & Tools
                </Link>
                <Link href="/dabsntools" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                  E-Rigs
                </Link> */}
                <Link href="/products?q=cartridge" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                  Cartridges
                </Link>
                <Link href="/products?q=battery" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                  Batteries
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Simple links matching GlobalMasthead */}
        <Link href="/pre-rolls" className="text-white text-sm font-bold hover:text-yellow-400 transition-colors whitespace-nowrap">
          Pre-Rolls
        </Link>
        
        {/* Edibles Dropdown */}
        <div className="relative">
          <button
            onMouseEnter={() => handleMouseEnter("dropdown", "edibles")}
            onMouseLeave={() => handleMouseLeaveWithDelay("main")}
            className="text-white text-sm font-bold hover:text-yellow-400 transition-colors flex items-center gap-1"
          >
            Edibles
            <ChevronDown className="w-3 h-3" />
          </button>

          {openDropdown === "edibles" && (
            <div
              className="absolute top-full left-0 mt-1 w-48 rounded-lg shadow-lg border border-gray-700 z-[50] bg-black"
              onMouseEnter={() => handleMouseEnter("dropdown", "edibles")}
              onMouseLeave={() => handleMouseLeaveWithDelay("main")}
            >
              <div className="py-2">
                <Link href="/edibles" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors font-medium">
                  All Edibles
                </Link>

              </div>
            </div>
          )}
        </div>
        
        <Link href="/nitrous-oxide" className="text-white text-sm font-bold hover:text-yellow-400 transition-colors whitespace-nowrap">
          N2O
        </Link>
        <Link href="/mushrooms" className="text-white text-sm font-bold hover:text-yellow-400 transition-colors">
          Mushrooms
        </Link>
        <Link href="/accessories" className="text-white text-sm font-bold hover:text-yellow-400 transition-colors">
          Accessories
        </Link>
        <Link href="/blog" className="text-white text-sm font-bold hover:text-yellow-400 transition-colors">
          Blog
        </Link>
      </div>
    </nav>
  );
}
