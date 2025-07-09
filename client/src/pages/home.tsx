import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AgeVerificationModal from "@/components/AgeVerificationModal";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedCategories from "@/components/FeaturedCategories";
import ProductCatalog from "@/components/ProductCatalog";
import VIPMembership from "@/components/VIPMembership";
import Footer from "@/components/Footer";
import ShoppingCartSidebar from "@/components/ShoppingCartSidebar";
import SEOHead from "@/components/SEOHead";
import { 
  createOrganizationSchema, 
  createWebsiteSchema, 
  createBreadcrumbSchema,
  createOfferCatalogSchema 
} from "@/utils/structuredData";
import type { Product } from "@shared/schema";

export default function Home() {
  const [showAgeModal, setShowAgeModal] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  // Fetch products for SEO structured data
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: !showAgeModal // Only fetch after age verification
  });

  useEffect(() => {
    const ageVerified = localStorage.getItem('ageVerified');
    const isDemoMode = new URLSearchParams(window.location.search).get('demo') === 'true';
    
    if (ageVerified === 'true' || isDemoMode) {
      setShowAgeModal(false);
      setDemoMode(isDemoMode);
    }
  }, []);

  const handleAgeVerification = (verified: boolean) => {
    if (verified) {
      setShowAgeModal(false);
      localStorage.setItem('ageVerified', 'true');
    } else {
      window.location.href = 'https://www.google.com';
    }
  };

  // Create structured data for homepage
  const structuredData = [
    createOrganizationSchema(),
    createWebsiteSchema(),
    createBreadcrumbSchema([
      { name: "Home", url: "/" }
    ])
  ];

  // Add product catalog structured data if products are available
  if (products && products.length > 0) {
    structuredData.push(createOfferCatalogSchema(products.slice(0, 10))); // Top 10 products for performance
  }

  return (
    <>
      <SEOHead
        title="VIP Smoke - Premium Smoking Accessories & Paraphernalia | 21+ Only"
        description="Discover our curated collection of luxury smoking accessories, glass pipes, water pipes, vaporizers, and premium paraphernalia. Handcrafted for the discerning connoisseur. Age verification required - 21+ only."
        keywords="premium smoking accessories, glass pipes, water pipes, vaporizers, paraphernalia, CBD accessories, luxury smoking, VIP smoke, smoking supplies, bongs, dab rigs, grinders, age restricted, 21+"
        structuredData={structuredData}
        noIndex={showAgeModal} // Don't index until age verification
      />
      
      {showAgeModal && (
        <AgeVerificationModal onVerification={handleAgeVerification} />
      )}
      
      <div className="bg-steel-900 text-white">
        {demoMode && (
          <div className="bg-yellow-400 text-steel-900 px-4 py-2 text-center font-semibold">
            🏗️ DEMO MODE - Preview the VIP Smoke store design (Age verification bypassed for preview)
          </div>
        )}
        <Header onCartToggle={() => setCartOpen(!cartOpen)} />
        <HeroSection />
        <FeaturedCategories />
        <ProductCatalog />
        <VIPMembership />
        <Footer />
        <ShoppingCartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      </div>
    </>
  );
}
