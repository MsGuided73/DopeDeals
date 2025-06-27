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

  useEffect(() => {
    const ageVerified = localStorage.getItem('ageVerified');
    if (ageVerified === 'true') {
      setShowAgeModal(false);
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
