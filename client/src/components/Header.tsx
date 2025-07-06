import { useState, useEffect } from "react";
import { Crown, Search, User, Heart, ShoppingCart, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onCartToggle: () => void;
}

export default function Header({ onCartToggle }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [showPartsDropdown, setShowPartsDropdown] = useState(false);
  const [showShopByDropdown, setShowShopByDropdown] = useState(false);

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
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-steel-900" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-yellow-400">VIP Smoke</h1>
              <p className="text-xs text-steel-400">Premium Accessories</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
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
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-steel-300 hover:text-yellow-400">
              <User className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="icon" className="relative text-steel-300 hover:text-yellow-400">
              <Heart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-steel-300 hover:text-yellow-400"
              onClick={onCartToggle}
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="pb-4">
          <ul className="flex space-x-8">
            <li 
              className="relative"
              onMouseEnter={() => setShowShopByDropdown(true)}
              onMouseLeave={() => setShowShopByDropdown(false)}
            >
              <a 
                href="#" 
                className="text-steel-300 hover:text-yellow-400 transition-colors pb-2 font-medium flex items-center gap-1"
              >
                SHOP BY
                <ChevronDown className="w-4 h-4" />
              </a>
              
              {/* Shop By Dropdown Menu */}
              {showShopByDropdown && (
                <div className="absolute top-full left-0 mt-2 w-64 glass-morphism rounded-lg shadow-2xl z-50 p-4">
                  <ul className="space-y-3">
                    <li>
                      <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors block">
                        On Sale
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors block">
                        New Products
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors block">
                        Shop by Brand
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors block">
                        Made in the USA
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors block">
                        Wholesale (Businesses Only)
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </li>
            <li>
              <a href="#" className="text-steel-300 hover:text-yellow-400 transition-colors pb-2 font-medium">
                THC & MORE
              </a>
            </li>
            <li>
              <a href="#" className="text-steel-300 hover:text-yellow-400 transition-colors pb-2 font-medium">
                PIPES
              </a>
            </li>
            <li>
              <a href="#" className="text-steel-300 hover:text-yellow-400 transition-colors pb-2 font-medium">
                VAPORIZERS
              </a>
            </li>
            <li>
              <a href="#" className="text-steel-300 hover:text-yellow-400 transition-colors pb-2 font-medium">
                ROLL YOUR OWN
              </a>
            </li>
            <li 
              className="relative"
              onMouseEnter={() => setShowPartsDropdown(true)}
              onMouseLeave={() => setShowPartsDropdown(false)}
            >
              <a 
                href="#" 
                className="text-steel-300 hover:text-yellow-400 transition-colors pb-2 font-medium flex items-center gap-1"
              >
                PARTS & ACCESSORIES
                <ChevronDown className="w-4 h-4" />
              </a>
              
              {/* Dropdown Menu */}
              {showPartsDropdown && (
                <div className="absolute top-full left-0 mt-2 w-screen max-w-5xl glass-morphism rounded-lg shadow-2xl z-50 p-6">
                  <div className="grid grid-cols-4 gap-8">
                    {/* Pipe Parts & Accessories */}
                    <div>
                      <h3 className="text-steel-200 font-bold mb-4 text-sm">PIPE PARTS & ACCESSORIES</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Adapters & Converters</a></li>
                        <li><a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Ash Catchers</a></li>
                        <li><a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Bangers & Nails</a></li>
                        <li><a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Bong Bowls & Slides</a></li>
                        <li><a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Cleaners</a></li>
                        <li><a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Downstems</a></li>
                        <li><a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Pack & Protect</a></li>
                        <li><a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Parts & Pieces</a></li>
                        <li><a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Reclaimers</a></li>
                        <li><a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Screens</a></li>
                      </ul>
                    </div>

                    {/* Tools */}
                    <div>
                      <h3 className="text-steel-200 font-bold mb-4 text-sm">TOOLS</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Carb Caps</a></li>
                        <li><a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Dab Inserts</a></li>
                        <li><a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Dab Tools</a></li>
                        <li><a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Extractors</a></li>
                        <li><a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Hemp Wicks</a></li>
                        <li><a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Pokers & Scrapers</a></li>
                        <li><a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Multi-Tools & More</a></li>
                      </ul>
                    </div>

                    {/* Smoking Gear */}
                    <div>
                      <h3 className="text-steel-200 font-bold mb-4 text-sm">SMOKING GEAR</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Ashtrays</a></li>
                        <li><a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Dugouts</a></li>
                        <li><a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Grinders & Presses</a></li>
                        <li><a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Lighters</a></li>
                        <li><a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Scales</a></li>
                      </ul>
                    </div>

                    {/* Storage */}
                    <div>
                      <h3 className="text-steel-200 font-bold mb-4 text-sm">STORAGE</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Baggies</a></li>
                        <li><a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Boxes</a></li>
                        <li><a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Jars & Containers</a></li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Lifestyle Section */}
                  <div className="mt-8 border-t border-steel-700/50 pt-6">
                    <h3 className="text-steel-200 font-bold mb-4 text-sm">LIFESTYLE</h3>
                    <div className="flex space-x-8">
                      <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Apparel</a>
                      <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Incense & Burners</a>
                      <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Everything Else</a>
                      <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">SMOKEA® Merch</a>
                      <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">SMOKEA® Mystery Box</a>
                      <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Gift Cards</a>
                    </div>
                  </div>
                </div>
              )}
            </li>
            <li>
              <a href="#" className="text-steel-300 hover:text-yellow-400 transition-colors pb-2 font-medium">
                EXOTIC SNACKS
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
