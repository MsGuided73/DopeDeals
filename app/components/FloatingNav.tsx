"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useNavigation } from "../contexts/NavigationContext";

export default function FloatingNav() {
  const { hasMasthead } = useNavigation();
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
  if (!isScrolled) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black z-[60] border-b border-gray-800">
      <div className="flex items-center justify-center gap-4 py-2 px-4">
        {/* Shop Dropdown */}
        <div className="relative">
          <button
            onMouseEnter={() => handleMouseEnter("dropdown", "shop")}
            onMouseLeave={() => handleMouseLeaveWithDelay("main")}
            className="text-white text-sm font-bold hover:text-yellow-400 transition-colors flex items-center gap-1"
          >
            Shop
            <ChevronDown className="w-3 h-3" />
          </button>

          {openDropdown === "shop" && (
            <div
              className="absolute top-full left-0 mt-1 w-64 rounded-lg shadow-lg border border-gray-700 z-[50] bg-black"
              onMouseEnter={() => handleMouseEnter("dropdown", "shop")}
              onMouseLeave={() => handleMouseLeaveWithDelay("main")}
            >
              <div className="py-2">
                <Link href="/products" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors font-medium">
                  All Products
                </Link>
                <div className="border-t border-gray-700 my-1" />

                {/* Categories */}
                <div className="relative">
                  <button
                    onMouseEnter={() => handleMouseEnter("submenu", "categories")}
                    onMouseLeave={() => handleMouseLeaveWithDelay("submenu")}
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors flex items-center justify-between font-medium"
                  >
                    Shop by Category
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {openSubmenu === "categories" && (
                    <div
                      className="absolute left-full top-0 ml-1 w-56 bg-black rounded-lg shadow-lg border border-gray-700 z-[60]"
                      onMouseEnter={() => handleMouseEnter("submenu", "categories")}
                      onMouseLeave={() => handleMouseLeaveWithDelay("submenu")}
                    >
                      <div className="py-2">
                        {/* THCA & More */}
                        <div className="relative">
                          <button
                            onMouseEnter={() => handleMouseEnter("nested", "thca-nested-categories")}
                            onMouseLeave={() => handleMouseLeaveWithDelay("nested")}
                            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors flex items-center justify-between"
                          >
                            THCA & More
                            <ChevronDown className="w-3 h-3" />
                          </button>

                          {openNestedSubmenu === "thca-nested-categories" && (
                            <div
                              className="absolute left-full top-0 ml-1 w-48 bg-black rounded-lg shadow-lg border border-gray-700 z-[70]"
                              onMouseEnter={() => handleMouseEnter("nested", "thca-nested-categories")}
                              onMouseLeave={() => handleMouseLeaveWithDelay("nested")}
                            >
                              <div className="py-2">
                                <Link href="/thca_flower" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors font-medium">
                                  ⭐ THCA Flower
                                </Link>
                                <Link href="/thca#prerolls" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors font-medium">
                                  ⭐ THCA Pre-Rolls
                                </Link>
                                <div className="border-t border-gray-700 my-1" />
                                <Link href="/thca#concentrates" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                                  THCA Concentrates
                                </Link>
                                <Link href="/thca#cartridges" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                                  THCA Cartridges
                                </Link>
                                <Link href="/thca#cbd" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                                  CBD Products
                                </Link>
                                <Link href="/thca#delta" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                                  Delta Products
                                </Link>
                                <Link href="/thca#edibles" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                                  Edibles
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="border-t border-gray-700 my-1" />
                        <Link href="/bongs" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                          Bongs & Water Pipes
                        </Link>
                        <Link href="/pipes" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                          Hand Pipes
                        </Link>
                        <Link href="/dab-rigs" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                          Dab Rigs
                        </Link>
                        <Link href="/thca_vapes" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                          Vaporizers
                        </Link>
                        <Link href="/accessories" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                          Accessories
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-700 my-1" />

                {/* Brands */}
                <div className="relative">
                  <button
                    onMouseEnter={() => handleMouseEnter("submenu", "brands")}
                    onMouseLeave={() => handleMouseLeaveWithDelay("submenu")}
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors flex items-center justify-between font-medium"
                  >
                    Shop by Brand
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {openSubmenu === "brands" && (
                    <div
                      className="absolute left-full top-0 ml-1 w-48 bg-black rounded-lg shadow-lg border border-gray-700 z-[60]"
                      onMouseEnter={() => handleMouseEnter("submenu", "brands")}
                      onMouseLeave={() => handleMouseLeaveWithDelay("submenu")}
                    >
                      <div className="py-2">
                        <Link href="/brands/raw-papers" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                          RAW
                        </Link>
                        <Link href="/brands/puffco" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                          Puffco
                        </Link>
                        <Link href="/brands/crave" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                          Storz & Bickel
                        </Link>
                        <Link href="/brands/roor" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                          ROOR
                        </Link>
                        <div className="border-t border-gray-700 my-1" />
                        <Link href="/brands" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors font-medium">
                          View All Brands
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* THCA & More */}
        <div className="relative">
          <button
            onMouseEnter={() => handleMouseEnter("dropdown", "thca")}
            onMouseLeave={() => handleMouseLeaveWithDelay("main")}
            className="text-white text-sm font-bold hover:text-yellow-400 transition-colors flex items-center gap-1"
          >
            THCA & More
            <ChevronDown className="w-3 h-3" />
          </button>

          {openDropdown === "thca" && (
            <div
              className="absolute top-full left-0 mt-1 w-64 rounded-lg shadow-lg border border-gray-700 z-[50] bg-black"
              onMouseEnter={() => handleMouseEnter("dropdown", "thca")}
              onMouseLeave={() => handleMouseLeaveWithDelay("main")}
            >
              <div className="py-2">
                <Link href="/thca_flower" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors font-medium">
                  THCA Flower
                </Link>
                <Link href="/thca#prerolls" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors font-medium">
                  THCA Pre-Rolls
                </Link>
                <div className="border-t border-gray-700 my-1" />
                <Link href="/thca#concentrates" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                  THCA Concentrates
                </Link>
                <Link href="/thca#cartridges" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                  THCA Cartridges
                </Link>
                <div className="border-t border-gray-700 my-1" />
                <Link href="/thca#cbd" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                  CBD Products
                </Link>
                <Link href="/thca#delta" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                  Delta Products
                </Link>
                <Link href="/thca#edibles" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                  Edibles
                </Link>
                <div className="border-t border-gray-700 my-1" />
                <Link href="/thca#mushrooms" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                  🍄 Mushrooms
                </Link>
                <Link href="/nitrous-oxide" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                  Nitrous Oxide
                </Link>
                <Link href="/7-hydroxymitragynine" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                  7-Hydroxymitragynine
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Bongs */}
        <div className="relative">
          <button
            onMouseEnter={() => handleMouseEnter("dropdown", "bongs")}
            onMouseLeave={() => handleMouseLeaveWithDelay("main")}
            className="text-white text-sm font-bold hover:text-yellow-400 transition-colors flex items-center gap-1"
          >
            Bongs
            <ChevronDown className="w-3 h-3" />
          </button>

          {openDropdown === "bongs" && (
            <div
              className="absolute top-full left-0 mt-1 w-48 rounded-lg shadow-lg border border-gray-700 z-[50] bg-black"
              onMouseEnter={() => handleMouseEnter("dropdown", "bongs")}
              onMouseLeave={() => handleMouseLeaveWithDelay("main")}
            >
              <div className="py-2">
                <Link href="/bongs" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                  All Bongs
                </Link>
                <Link href="/bubblers" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                  Bubblers
                </Link>
                <Link href="/products?q=glass+bong" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                  Glass Bongs
                </Link>
                <Link href="/products?q=beaker+bong" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                  Beaker Bongs
                </Link>
                <Link href="/products?q=straight+tube" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                  Straight Tube
                </Link>
                <Link href="/products?q=percolator" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                  Percolator Bongs
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Pipes */}
        <div className="relative">
          <button
            onMouseEnter={() => handleMouseEnter("dropdown", "pipes")}
            onMouseLeave={() => handleMouseLeaveWithDelay("main")}
            className="text-white text-sm font-bold hover:text-yellow-400 transition-colors flex items-center gap-1"
          >
            Pipes
            <ChevronDown className="w-3 h-3" />
          </button>

          {openDropdown === "pipes" && (
            <div
              className="absolute top-full left-0 mt-1 w-48 rounded-lg shadow-lg border border-gray-700 z-[50] bg-black"
              onMouseEnter={() => handleMouseEnter("dropdown", "pipes")}
              onMouseLeave={() => handleMouseLeaveWithDelay("main")}
            >
              <div className="py-2">
                <Link href="/pipes" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                  All Pipes
                </Link>
                <Link href="/products?q=spoon+pipe" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                  Spoon Pipes
                </Link>
                <Link href="/products?q=sherlock+pipe" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                  Sherlock Pipes
                </Link>
                <Link href="/products?q=chillum" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                  Chillums
                </Link>
                <Link href="/products?q=one+hitter" onClick={handleDropdownLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                  One Hitters
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Simple links */}
        <Link href="/dabsntools" className="text-white text-sm font-bold hover:text-yellow-400 transition-colors">
          Dab Rigs
        </Link>
        <Link href="/products?category=accessories" className="text-white text-sm font-bold hover:text-yellow-400 transition-colors">
          Accessories
        </Link>
        <Link href="/products?category=edibles" className="text-white text-sm font-bold hover:text-yellow-400 transition-colors">
          Munchies
        </Link>
      </div>
    </nav>
  );
}
