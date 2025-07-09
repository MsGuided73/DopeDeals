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
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      scrolled 
        ? 'glass-morphism shadow-2xl shadow-black/20' 
        : 'glass-morphism-light'
    }`}>
      <div className="container mx-auto px-4">
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
        <nav className="pb-4">
          <ul className="flex space-x-4 sm:space-x-8 overflow-x-auto">
            <li 
              className="relative flex-shrink-0"
              onMouseEnter={() => setShowShopByDropdown(true)}
              onMouseLeave={() => setShowShopByDropdown(false)}
            >
              <a href="#" className="text-steel-300 hover:text-yellow-400 transition-colors pb-2 font-medium flex items-center text-sm sm:text-base">
                SHOP BY
                <ChevronDown className="ml-1 w-3 h-3 sm:w-4 sm:h-4" />
              </a>
              {showShopByDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-steel-800 rounded-lg shadow-xl border border-steel-700 z-50">
                  <div className="py-2">
                    {categories?.map((category) => (
                      <Link 
                        key={category.id} 
                        href={`/category/${category.id}`} 
                        className="block px-4 py-2 text-steel-300 hover:text-yellow-400 hover:bg-steel-700"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>
            <li className="flex-shrink-0">
              <Link href="/products" className="text-steel-300 hover:text-yellow-400 transition-colors pb-2 font-medium text-sm sm:text-base">
                ALL PRODUCTS
              </Link>
            </li>
            <li className="flex-shrink-0">
              <Link href="/membership" className="text-steel-300 hover:text-yellow-400 transition-colors pb-2 font-medium text-sm sm:text-base">
                VIP MEMBERSHIP
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}