import { useState, useEffect } from "react";
import { Crown, Search, User, Heart, ShoppingCart, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Category } from "@shared/schema";

interface HeaderProps {
  onCartToggle: () => void;
}

export default function Header({ onCartToggle }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [showShopByDropdown, setShowShopByDropdown] = useState(false);
  const [showThcDropdown, setShowThcDropdown] = useState(false);
  const [showPipesDropdown, setShowPipesDropdown] = useState(false);
  const [showVaporizersDropdown, setShowVaporizersDropdown] = useState(false);
  const [showRollYourOwnDropdown, setShowRollYourOwnDropdown] = useState(false);
  const [showPartsDropdown, setShowPartsDropdown] = useState(false);
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header-container sticky top-0 z-40 transition-all duration-300 header-overflow-fix ${
      scrolled 
        ? 'glass-morphism shadow-2xl shadow-black/20' 
        : 'glass-morphism-light'
    }`}>
      <div className="container mx-auto px-4 header-overflow-fix">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer">
              <div className="w-8 h-8 sm:w-10 sm:h-10 gold-gradient rounded-full flex items-center justify-center">
                <Crown className="w-4 h-4 sm:w-6 sm:h-6 text-steel-900" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-yellow-400">VIP Smoke</h1>
                <p className="text-xs text-steel-400 hidden sm:block">Premium Accessories</p>
              </div>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 sm:mx-8 hidden md:block">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search premium accessories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-steel-700/70 backdrop-blur-sm text-white px-4 py-3 pl-12 border-steel-600/50 focus:border-yellow-400 focus:bg-steel-700/90 transition-all duration-200"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-steel-400" />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="ghost" size="icon" className="text-steel-300 hover:text-yellow-400 hidden sm:flex">
              <User className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
            <Button variant="ghost" size="icon" className="relative text-steel-300 hover:text-yellow-400 hidden sm:flex">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                3
              </span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-steel-300 hover:text-yellow-400"
              onClick={onCartToggle}
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                2
              </span>
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="pb-4 nav-container">
          <ul className="flex space-x-4 sm:space-x-6 justify-center">
            <li 
              className="relative"
              onMouseEnter={() => setShowShopByDropdown(true)}
              onMouseLeave={() => setShowShopByDropdown(false)}
            >
              <a href="#" className="text-steel-300 hover:text-yellow-400 transition-colors pb-2 font-medium flex items-center text-sm sm:text-base">
                SHOP BY
                <ChevronDown className="ml-1 w-3 h-3 sm:w-4 sm:h-4" />
              </a>
              {showShopByDropdown && (
                <div className="dropdown-menu absolute top-full left-0 mt-2 w-48 bg-steel-800 rounded-lg shadow-xl border border-steel-700 z-[9999]">
                  <div className="py-2">
                    <a href="#" className="block px-4 py-2 text-steel-300 hover:text-yellow-400 hover:bg-steel-700">On Sale</a>
                    <a href="#" className="block px-4 py-2 text-steel-300 hover:text-yellow-400 hover:bg-steel-700">New Products</a>
                    <a href="#" className="block px-4 py-2 text-steel-300 hover:text-yellow-400 hover:bg-steel-700">Shop by Brand</a>
                    <a href="#" className="block px-4 py-2 text-steel-300 hover:text-yellow-400 hover:bg-steel-700">Made in the USA</a>
                    <a href="#" className="block px-4 py-2 text-steel-300 hover:text-yellow-400 hover:bg-steel-700">Wholesale (Businesses Only)</a>
                  </div>
                </div>
              )}
            </li>
            <li>
              <Link href="/products" className="text-steel-300 hover:text-yellow-400 transition-colors pb-2 font-medium text-sm sm:text-base">
                ALL PRODUCTS
              </Link>
            </li>
            <li 
              className="dropdown-parent relative"
              onMouseEnter={() => setShowThcDropdown(true)}
              onMouseLeave={() => setShowThcDropdown(false)}
            >
              <a href="#" className="text-steel-300 hover:text-yellow-400 transition-colors pb-2 font-medium flex items-center text-sm sm:text-base">
                THC & MORE
                <ChevronDown className="ml-1 w-3 h-3 sm:w-4 sm:h-4" />
              </a>
              {showThcDropdown && (
                <div className="dropdown-menu absolute top-full left-0 mt-2 w-screen max-w-4xl bg-steel-800 rounded-lg shadow-xl border border-steel-700 z-[9999] p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div>
                      <h3 className="text-yellow-400 font-bold mb-3 text-sm">THC & CBD</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Cartridges</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Disposable Vapes</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Pod Vapes</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Edibles</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Flower</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Pre-Rolls</a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-yellow-400 font-bold mb-3 text-sm">CANNABINOID</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Delta 8</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Delta 9</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Delta 10</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">HHC</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">CBG</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">THCP</a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-yellow-400 font-bold mb-3 text-sm">KRATOM</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Liquid</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Capsules</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Powder</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Gummies</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Extracts</a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-yellow-400 font-bold mb-3 text-sm">MUSHROOMS</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Mushroom Vapes</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Mushroom Gummies</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Mushroom Tinctures</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Mushroom Drinks</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </li>
            <li 
              className="dropdown-parent relative"
              onMouseEnter={() => setShowPipesDropdown(true)}
              onMouseLeave={() => setShowPipesDropdown(false)}
            >
              <a href="#" className="text-steel-300 hover:text-yellow-400 transition-colors pb-2 font-medium flex items-center text-sm sm:text-base">
                PIPES
                <ChevronDown className="ml-1 w-3 h-3 sm:w-4 sm:h-4" />
              </a>
              {showPipesDropdown && (
                <div className="dropdown-menu absolute top-full left-0 mt-2 w-screen max-w-3xl bg-steel-800 rounded-lg shadow-xl border border-steel-700 z-[9999] p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-yellow-400 font-bold mb-3 text-sm">DRY PIPES</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Chillums</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Glass Blunts</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">One Hitters</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Spoons</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Steamrollers</a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-yellow-400 font-bold mb-3 text-sm">WATER PIPES</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Bongs</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Bubblers</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Dab Rigs</a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-yellow-400 font-bold mb-3 text-sm">BY MATERIAL</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Glass Pipes</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Metal Pipes</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Silicone Pipes</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Wood Pipes</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </li>
            <li 
              className="dropdown-parent relative"
              onMouseEnter={() => setShowVaporizersDropdown(true)}
              onMouseLeave={() => setShowVaporizersDropdown(false)}
            >
              <a href="#" className="text-steel-300 hover:text-yellow-400 transition-colors pb-2 font-medium flex items-center text-sm sm:text-base">
                VAPORIZERS
                <ChevronDown className="ml-1 w-3 h-3 sm:w-4 sm:h-4" />
              </a>
              {showVaporizersDropdown && (
                <div className="dropdown-menu absolute top-full left-0 mt-2 w-screen max-w-2xl bg-steel-800 rounded-lg shadow-xl border border-steel-700 z-[9999] p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-yellow-400 font-bold mb-3 text-sm">BY TYPE</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Desktop Vaporizers</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Portable Vaporizers</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Vape Pen Batteries</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Vaporizer Parts</a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-yellow-400 font-bold mb-3 text-sm">COMPATIBILITY</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Dry Herbs</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Extracts</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Oils & Liquids</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </li>
            <li 
              className="dropdown-parent relative"
              onMouseEnter={() => setShowRollYourOwnDropdown(true)}
              onMouseLeave={() => setShowRollYourOwnDropdown(false)}
            >
              <a href="#" className="text-steel-300 hover:text-yellow-400 transition-colors pb-2 font-medium flex items-center text-sm sm:text-base">
                ROLL YOUR OWN
                <ChevronDown className="ml-1 w-3 h-3 sm:w-4 sm:h-4" />
              </a>
              {showRollYourOwnDropdown && (
                <div className="dropdown-menu absolute top-full left-0 mt-2 w-48 bg-steel-800 rounded-lg shadow-xl border border-steel-700 z-[9999]">
                  <div className="py-2">
                    <a href="#" className="block px-4 py-2 text-steel-300 hover:text-yellow-400 hover:bg-steel-700">Rolling Papers</a>
                    <a href="#" className="block px-4 py-2 text-steel-300 hover:text-yellow-400 hover:bg-steel-700">Blunt Wraps</a>
                    <a href="#" className="block px-4 py-2 text-steel-300 hover:text-yellow-400 hover:bg-steel-700">Rolling Machines</a>
                    <a href="#" className="block px-4 py-2 text-steel-300 hover:text-yellow-400 hover:bg-steel-700">Grinders</a>
                    <a href="#" className="block px-4 py-2 text-steel-300 hover:text-yellow-400 hover:bg-steel-700">Tips & Filters</a>
                  </div>
                </div>
              )}
            </li>
            <li 
              className="dropdown-parent relative"
              onMouseEnter={() => setShowPartsDropdown(true)}
              onMouseLeave={() => setShowPartsDropdown(false)}
            >
              <a href="#" className="text-steel-300 hover:text-yellow-400 transition-colors pb-2 font-medium flex items-center text-sm sm:text-base">
                PARTS & ACCESSORIES
                <ChevronDown className="ml-1 w-3 h-3 sm:w-4 sm:h-4" />
              </a>
              {showPartsDropdown && (
                <div className="dropdown-menu absolute top-full left-0 mt-2 w-screen max-w-4xl bg-steel-800 rounded-lg shadow-xl border border-steel-700 z-[9999] p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div>
                      <h3 className="text-yellow-400 font-bold mb-3 text-sm">PIPE PARTS</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Adapters</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Ash Catchers</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Bong Bowls</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Downstems</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Screens</a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-yellow-400 font-bold mb-3 text-sm">TOOLS</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Carb Caps</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Dab Tools</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Extractors</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Hemp Wicks</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Pokers</a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-yellow-400 font-bold mb-3 text-sm">SMOKING GEAR</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Ashtrays</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Dugouts</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Grinders</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Lighters</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Scales</a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-yellow-400 font-bold mb-3 text-sm">STORAGE</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Baggies</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Boxes</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Jars</a></li>
                        <li><a href="#" className="text-steel-300 hover:text-yellow-400 text-sm">Containers</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </li>

          </ul>
          

        </nav>
      </div>
    </header>
  );
}