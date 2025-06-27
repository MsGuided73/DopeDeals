import { useState } from "react";
import { Crown, Search, User, Heart, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onCartToggle: () => void;
}

export default function Header({ onCartToggle }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-steel-800 border-b border-steel-700 sticky top-0 z-40">
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
                className="w-full bg-steel-700 text-white px-4 py-3 pl-12 border-steel-600 focus:border-yellow-400"
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
            <li>
              <a href="#" className="text-yellow-400 font-medium border-b-2 border-yellow-400 pb-2">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="text-steel-300 hover:text-yellow-400 transition-colors pb-2">
                Glass Pipes
              </a>
            </li>
            <li>
              <a href="#" className="text-steel-300 hover:text-yellow-400 transition-colors pb-2">
                Water Pipes
              </a>
            </li>
            <li>
              <a href="#" className="text-steel-300 hover:text-yellow-400 transition-colors pb-2">
                Vaporizers
              </a>
            </li>
            <li>
              <a href="#" className="text-steel-300 hover:text-yellow-400 transition-colors pb-2">
                Accessories
              </a>
            </li>
            <li>
              <a href="#" className="text-steel-300 hover:text-yellow-400 transition-colors pb-2">
                Brands
              </a>
            </li>
            <li>
              <a href="#" className="text-steel-300 hover:text-yellow-400 transition-colors pb-2">
                VIP Membership
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
