import { useState, useEffect } from "react";
import { Crown, Search, User, Heart, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Category } from "@shared/schema";

interface ModernHeaderProps {
  onCartToggle: () => void;
}

export default function ModernHeader({ onCartToggle }: ModernHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
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

  const navigationItems = [
    { 
      name: "Shop All", 
      href: "/products",
      hasDropdown: false
    },
    { 
      name: "Glass Pipes", 
      href: "/products?category=glass-pipes",
      hasDropdown: true,
      items: [
        { name: "Spoon Pipes", href: "/products?category=glass-pipes&type=spoon" },
        { name: "Sherlock Pipes", href: "/products?category=glass-pipes&type=sherlock" },
        { name: "Bubbler Pipes", href: "/products?category=glass-pipes&type=bubbler" },
        { name: "Chillums", href: "/products?category=glass-pipes&type=chillum" }
      ]
    },
    { 
      name: "Water Pipes", 
      href: "/products?category=glass-bongs",
      hasDropdown: true,
      items: [
        { name: "Beaker Bongs", href: "/products?category=glass-bongs&type=beaker" },
        { name: "Straight Tube", href: "/products?category=glass-bongs&type=straight" },
        { name: "Percolator Bongs", href: "/products?category=glass-bongs&type=percolator" },
        { name: "Mini Bongs", href: "/products?category=glass-bongs&type=mini" }
      ]
    },
    { 
      name: "Dab Rigs", 
      href: "/products?category=dab-rigs",
      hasDropdown: true,
      items: [
        { name: "Glass Rigs", href: "/products?category=dab-rigs&material=glass" },
        { name: "Silicone Rigs", href: "/products?category=dab-rigs&material=silicone" },
        { name: "Electric Rigs", href: "/products?category=dab-rigs&type=electric" },
        { name: "Mini Rigs", href: "/products?category=dab-rigs&type=mini" }
      ]
    },
    { 
      name: "Accessories", 
      href: "/products?category=accessories",
      hasDropdown: true,
      items: [
        { name: "Grinders", href: "/products?category=accessories&type=grinder" },
        { name: "Rolling Papers", href: "/products?category=accessories&type=papers" },
        { name: "Storage", href: "/products?category=accessories&type=storage" },
        { name: "Cleaning", href: "/products?category=accessories&type=cleaning" }
      ]
    }
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-slate-900/95 backdrop-blur-xl shadow-2xl border-b border-white/10' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer group">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Crown className="w-7 h-7 text-slate-900" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    VIP Smoke
                  </h1>
                  <p className="text-sm text-gray-400 hidden sm:block">Premium Collection</p>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link href={item.href}>
                    <button className="flex items-center space-x-1 text-white hover:text-yellow-400 transition-colors duration-200 font-medium">
                      <span>{item.name}</span>
                      {item.hasDropdown && (
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                          activeDropdown === item.name ? 'rotate-180' : ''
                        }`} />
                      )}
                    </button>
                  </Link>

                  {/* Dropdown Menu */}
                  {item.hasDropdown && activeDropdown === item.name && item.items && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 py-2 z-50">
                      {item.items.map((subItem) => (
                        <Link key={subItem.name} href={subItem.href}>
                          <div className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer">
                            {subItem.name}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search premium accessories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800/50 backdrop-blur-sm text-white px-4 py-3 pl-12 border-slate-600/50 focus:border-yellow-400 focus:bg-slate-800/80 transition-all duration-200 rounded-full"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-300 hover:text-yellow-400 hover:bg-white/10 rounded-full hidden sm:flex"
              >
                <User className="w-6 h-6" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-300 hover:text-yellow-400 hover:bg-white/10 rounded-full hidden sm:flex"
              >
                <Heart className="w-6 h-6" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onCartToggle}
                className="text-gray-300 hover:text-yellow-400 hover:bg-white/10 rounded-full relative"
              >
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-slate-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-gray-300 hover:text-yellow-400 hover:bg-white/10 rounded-full"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-20 left-0 right-0 bg-slate-900/98 backdrop-blur-xl border-b border-white/10 shadow-2xl">
            <div className="container mx-auto px-4 py-6">
              {/* Mobile Search */}
              <div className="mb-6">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-800/50 text-white px-4 py-3 pl-12 border-slate-600/50 rounded-full"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-4">
                {navigationItems.map((item) => (
                  <div key={item.name}>
                    <Link href={item.href}>
                      <div 
                        className="text-white hover:text-yellow-400 transition-colors duration-200 font-medium py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </div>
                    </Link>
                    {item.hasDropdown && item.items && (
                      <div className="ml-4 mt-2 space-y-2">
                        {item.items.map((subItem) => (
                          <Link key={subItem.name} href={subItem.href}>
                            <div 
                              className="text-gray-400 hover:text-white transition-colors duration-200 py-1"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subItem.name}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}