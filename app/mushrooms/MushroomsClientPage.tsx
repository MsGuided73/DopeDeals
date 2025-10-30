'use client';

import AgeVerification from '../components/AgeVerification';
import PrismaticBurst from '../components/PrismaticBurst';

export default function MushroomsClientPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Mushroom Products Collection",
    "description": "Premium mushroom products collection at DOPE CITY",
    "url": "https://dopecity.com/mushrooms",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Mushroom Products Collection",
      "description": "High-quality mushroom products and accessories",
      "numberOfItems": "25+",
      "itemListElement": [
        {
          "@type": "Product",
          "name": "Premium Mushroom Products",
          "category": "Mushrooms"
        }
      ]
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://dopecity.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Products",
          "item": "https://dopecity.com/products"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Mushrooms",
          "item": "https://dopecity.com/mushrooms"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen relative">
      <PrismaticBurst
        animationType="hover"
        intensity={4}
        speed={0.3}
        distort={1.2}
        rayCount={32}
        mixBlendMode="screen"
        colors={['#ff007a', '#4d3dff', '#00ffff', '#ff1493', '#8a2be2', '#00ced1']}
      />
      {/* Age Verification Popup */}
      <AgeVerification />

      {/* Universal Layout Components */}
      <GlobalMasthead />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Mushroom Products Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
            🍄 Premium Mushrooms
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-white drop-shadow-md">
            Discover our curated collection of high-quality mushroom products
          </p>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 max-w-2xl mx-auto">
            <p className="text-lg text-white">
              Coming Soon - Our curated selection of premium mushroom products will be available here.
              <br /><br />
              We're working hard to bring you the highest quality products with discreet shipping and competitive prices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
