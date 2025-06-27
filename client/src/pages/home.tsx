import { useState, useEffect } from "react";
import AgeVerificationModal from "@/components/AgeVerificationModal";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedCategories from "@/components/FeaturedCategories";
import ProductCatalog from "@/components/ProductCatalog";
import VIPMembership from "@/components/VIPMembership";
import Footer from "@/components/Footer";
import ShoppingCartSidebar from "@/components/ShoppingCartSidebar";

export default function Home() {
  const [showAgeModal, setShowAgeModal] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

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

  return (
    <>
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
