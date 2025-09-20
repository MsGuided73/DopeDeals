/**
 * DOPE CITY Universal Page Template
 * 
 * This template imports all global components and provides a standardized
 * structure for creating new pages on the DOPE CITY website.
 * 
 * Usage:
 * 1. Copy this template to your new page location
 * 2. Rename the component and file
 * 3. Update the metadata
 * 4. Add your page-specific content
 * 5. Remove unused imports
 */

'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next';

// === GLOBAL LAYOUT COMPONENTS ===
import GlobalMasthead from '../app/components/GlobalMasthead';
import DopeCityHeader from '../components/DopeCityHeader';
import DopeCityFooter from '../components/DopeCityFooter';

// === NAVIGATION & SEARCH ===
import EnhancedSearchBar from '../app/components/EnhancedSearchBar';
import BrandDropdown from '../components/BrandDropdown';

// === USER INTERACTION COMPONENTS ===
import AgeVerification from '../app/components/AgeVerification';
import PersonalizedGreeting from '../components/PersonalizedGreeting';
import DopeClubSignup from '../components/DopeClubSignup';

// === PRODUCT COMPONENTS ===
import AddToCartButton from '../app/components/AddToCartButton';
import QuickAddToCartButton from '../app/components/QuickAddToCartButton';
import ProductDetailsPage from '../components/ProductDetailsPage';
import SimpleProductPage from '../components/SimpleProductPage';
import ProductRecommendations from '../components/ProductRecommendations';

// === AI & CHAT COMPONENTS ===
import AIProductChat from '../components/AIProductChat';

// === UI COMPONENTS ===
import { Button } from '../app/components/ui/button';
import { Input } from '../app/components/ui/input';
import { Label } from '../app/components/ui/label';
import { Switch } from '../app/components/ui/switch';
import { Toast } from '../app/components/ui/toast';
import { Toaster } from '../app/components/ui/toaster';
import { Tooltip } from '../app/components/ui/tooltip';

// === DESIGN COMPONENTS ===
import NikeIndustrial from '../app/components/design/NikeIndustrial';

// === TOAST PROVIDER ===
import { ToastProvider } from '../app/components/ToastProvider';

// === UTILITIES & HOOKS ===
import { supabaseBrowser } from '../app/lib/supabase-browser';

// === ICONS (Lucide React) ===
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Star, 
  Heart, 
  Share2,
  Filter,
  Grid,
  List,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Eye,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Check,
  AlertCircle,
  Info,
  Loader2
} from 'lucide-react';

// === TYPES ===
interface PageTemplateProps {
  // Add your page-specific props here
  title?: string;
  showAgeVerification?: boolean;
  showSearch?: boolean;
  showChat?: boolean;
  className?: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  brand_name?: string;
  category_id?: string;
  featured?: boolean;
  stock_quantity?: number;
}

// === METADATA (Update for your page) ===
export const metadata: Metadata = {
  title: 'Page Title | DOPE CITY',
  description: 'Page description for SEO',
  keywords: 'keywords, separated, by, commas',
  openGraph: {
    title: 'Page Title | DOPE CITY',
    description: 'Page description for social sharing',
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DOPE CITY'
      }
    ]
  }
};

// === MAIN COMPONENT ===
export default function PageTemplate({ 
  title = "Page Title",
  showAgeVerification = false,
  showSearch = true,
  showChat = false,
  className = ""
}: PageTemplateProps) {
  
  // === STATE MANAGEMENT ===
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // === EFFECTS ===
  useEffect(() => {
    // Initialize page data
    initializePage();
  }, []);

  // === FUNCTIONS ===
  const initializePage = async () => {
    try {
      setLoading(true);
      // Add your initialization logic here
      // Example: fetch products, user data, etc.
      
    } catch (error) {
      console.error('Error initializing page:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (productId: string) => {
    // Add to cart logic
    console.log('Adding to cart:', productId);
  };

  const handleSearch = (query: string) => {
    // Search logic
    console.log('Searching for:', query);
  };

  // === LOADING STATE ===
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <GlobalMasthead />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-dope-orange-500" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
        <DopeCityFooter />
      </div>
    );
  }

  // === RENDER ===
  return (
    <ToastProvider>
      <div className={`min-h-screen bg-white ${className}`}>
        
        {/* Age Verification Modal */}
        {showAgeVerification && <AgeVerification />}
        
        {/* Global Masthead with Search */}
        <GlobalMasthead />
        
        {/* Alternative Header (choose one) */}
        {/* <DopeCityHeader /> */}
        
        {/* Enhanced Search Bar (if needed separately) */}
        {showSearch && (
          <div className="bg-gray-50 py-4">
            <div className="max-w-6xl mx-auto px-6">
              <EnhancedSearchBar />
            </div>
          </div>
        )}

        {/* Personalized Greeting */}
        <PersonalizedGreeting />

        {/* Main Content Area */}
        <main className="flex-1">
          
          {/* Hero Section */}
          <section className="relative bg-gradient-to-r from-gray-900 to-black text-white py-20">
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative max-w-6xl mx-auto px-6 text-center">
              <h1 className="dope-city-title text-6xl mb-6">
                {title}
              </h1>
              <p className="text-xl mb-8 max-w-3xl mx-auto">
                Your page description goes here. Update this with relevant content.
              </p>
              
              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-8 py-3"
                >
                  Primary Action
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-black px-8 py-3"
                >
                  Secondary Action
                </Button>
              </div>
            </div>
          </section>

          {/* Content Sections */}
          <section className="py-16">
            <div className="max-w-6xl mx-auto px-6">
              
              {/* Section Title */}
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Section Title</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Section description goes here. Add your content.
                </p>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Add your content cards/items here */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-3">Content Item</h3>
                  <p className="text-gray-600 mb-4">
                    Content description goes here.
                  </p>
                  <Button className="w-full">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Product Recommendations (if applicable) */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6">
              <ProductRecommendations 
                title="Recommended Products"
                limit={4}
              />
            </div>
          </section>

          {/* Newsletter Signup */}
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-6">
              <DopeClubSignup />
            </div>
          </section>

        </main>

        {/* AI Chat (if enabled) */}
        {showChat && (
          <div className="fixed bottom-6 right-6 z-50">
            <AIProductChat />
          </div>
        )}

        {/* Global Footer */}
        <DopeCityFooter />

        {/* Toast Notifications */}
        <Toaster />
        
      </div>
    </ToastProvider>
  );
}

// === EXPORT TYPES (for reuse) ===
export type { PageTemplateProps, Product };
