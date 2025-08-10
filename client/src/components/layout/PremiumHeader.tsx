/**
 * Premium E-Commerce Header Component
 * Modern design with mega menus, search, and VIP features
 */

import { useState, useEffect } from 'react';
import { Search, User, Heart, ShoppingCart, Menu, Crown, ChevronDown, Shield, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

const PremiumHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Cart count query
  const { data: cartItems = [] } = useQuery({
    queryKey: ['/api/cart'],
  });

  const cartCount = cartItems.length;

  const megaMenus = {
    'SHOP BY': {
      categories: [
        {
          title: 'Featured Collections',
          items: [
            { name: 'On Sale', href: '/products?sale=true', badge: 'Hot' },
            { name: 'New Products', href: '/products?new=true', badge: 'New' },
            { name: 'Shop by Brand', href: '/brands' },
            { name: 'Made in the USA', href: '/products?origin=usa', badge: 'USA' },
            { name: 'VIP Exclusive', href: '/vip-products', badge: 'VIP' },
          ]
        }
      ]
    },
    'GLASS BONGS': {
      categories: [
        {
          title: 'By Type',
          items: [
            { name: 'Beaker Bongs', href: '/category/beaker-bongs' },
            { name: 'Straight Tube', href: '/category/straight-tube' },
            { name: 'Recycler Bongs', href: '/category/recycler' },
            { name: 'Percolator Bongs', href: '/category/percolator' },
          ]
        },
        {
          title: 'By Size',
          items: [
            { name: 'Mini Bongs (Under 8")', href: '/products?size=mini' },
            { name: 'Medium (8"-12")', href: '/products?size=medium' },
            { name: 'Large (12"+)', href: '/products?size=large' },
          ]
        }
      ]
    },
    'PARTS & ACCESSORIES': {
      categories: [
        {
          title: 'Pipe Parts & Accessories',
          items: [
            { name: 'Adapters & Converters', href: '/category/adapters' },
            { name: 'Ash Catchers', href: '/category/ash-catchers' },
            { name: 'Bangers & Nails', href: '/category/bangers' },
            { name: 'Bong Bowls & Slides', href: '/category/bowls' },
            { name: 'Cleaners', href: '/category/cleaners' },
            { name: 'Downstems', href: '/category/downstems' },
          ]
        },
        {
          title: 'Tools',
          items: [
            { name: 'Carb Caps', href: '/category/carb-caps' },
            { name: 'Dab Inserts', href: '/category/dab-inserts' },
            { name: 'Dab Tools', href: '/category/dab-tools' },
            { name: 'Extractors', href: '/category/extractors' },
            { name: 'Hemp Wicks', href: '/category/hemp-wicks' },
          ]
        },
        {
          title: 'Smoking Gear',
          items: [
            { name: 'Ashtrays', href: '/category/ashtrays' },
            { name: 'Dugouts', href: '/category/dugouts' },
            { name: 'Grinders & Presses', href: '/category/grinders' },
            { name: 'Lighters', href: '/category/lighters' },
            { name: 'Scales', href: '/category/scales' },
          ]
        },
        {
          title: 'Storage',
          items: [
            { name: 'Baggies', href: '/category/baggies' },
            { name: 'Boxes', href: '/category/boxes' },
            { name: 'Jars & Containers', href: '/category/jars' },
          ]
        }
      ]
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-900 text-white text-sm py-2 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>1-800-VIP-SMOKE</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>support@vipsmoke.com</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span>Free shipping on orders over $75</span>
            <Badge variant="secondary" className="bg-yellow-500 text-black">
              VIP Members save 15%
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="nav-premium">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Crown className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold">VIP Smoke</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {Object.entries(megaMenus).map(([menuName, menuData]) => (
                <div
                  key={menuName}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(menuName)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="nav-link flex items-center space-x-1">
                    <span>{menuName}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Mega Menu Dropdown */}
                  {activeDropdown === menuName && (
                    <div className="absolute top-full left-0 w-screen max-w-4xl bg-white shadow-xl border rounded-lg p-6 z-50 mt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {menuData.categories.map((category, idx) => (
                          <div key={idx} className="space-y-4">
                            <h3 className="font-semibold text-gray-900 border-b pb-2">
                              {category.title}
                            </h3>
                            <ul className="space-y-2">
                              {category.items.map((item, itemIdx) => (
                                <li key={itemIdx}>
                                  <Link 
                                    href={item.href}
                                    className="flex items-center justify-between text-gray-600 hover:text-primary transition-colors"
                                  >
                                    <span>{item.name}</span>
                                    {item.badge && (
                                      <Badge 
                                        variant="secondary" 
                                        className={`text-xs ${
                                          item.badge === 'VIP' ? 'bg-yellow-100 text-yellow-800' :
                                          item.badge === 'New' ? 'bg-blue-100 text-blue-800' :
                                          item.badge === 'Hot' ? 'bg-red-100 text-red-800' :
                                          'bg-gray-100 text-gray-800'
                                        }`}
                                      >
                                        {item.badge}
                                      </Badge>
                                    )}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              <Link href="/vaporizers" className="nav-link">VAPORIZERS</Link>
              <Link href="/rolling" className="nav-link">ROLL YOUR OWN</Link>
              <Link href="/exotic-snacks" className="nav-link">EXOTIC SNACKS</Link>
            </nav>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-premium pl-10 pr-4"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <Link href="/compliance">
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <Shield className="w-5 h-5" />
                </Button>
              </Link>

              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <User className="w-5 h-5" />
              </Button>

              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Heart className="w-5 h-5" />
              </Button>

              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </Badge>
                )}
              </Button>

              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-premium pl-10 pr-4"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </form>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t bg-white">
            <div className="container mx-auto px-4 py-4 space-y-4">
              {Object.keys(megaMenus).map((menuName) => (
                <Link key={menuName} href="/products" className="block py-2 nav-link">
                  {menuName}
                </Link>
              ))}
              <Link href="/vaporizers" className="block py-2 nav-link">VAPORIZERS</Link>
              <Link href="/rolling" className="block py-2 nav-link">ROLL YOUR OWN</Link>
              <Link href="/exotic-snacks" className="block py-2 nav-link">EXOTIC SNACKS</Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default PremiumHeader;