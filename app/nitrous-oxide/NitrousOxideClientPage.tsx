'use client';

import { Suspense } from 'react';
import GlobalMasthead from '../components/GlobalMasthead';
import AgeVerification from '../components/AgeVerification';
import NitrousOxidePageContent from './NitrousOxidePageContent';
import PrismaticBurst from '../components/PrismaticBurst';

export default function NitrousOxideClientPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Nitrous Oxide Products Collection",
    "description": "Premium nitrous oxide products collection at DOPE CITY",
    "url": "https://dopecity.com/nitrous-oxide",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Nitrous Oxide Products Collection",
      "description": "High-quality nitrous oxide products and accessories",
      "numberOfItems": "15+",
      "itemListElement": [
        {
          "@type": "Product",
          "name": "Premium Nitrous Oxide Products",
          "category": "Nitrous Oxide"
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
          "name": "Nitrous Oxide",
          "item": "https://dopecity.com/nitrous-oxide"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen relative">
      <PrismaticBurst
        intensity={4}
        speed={0.8}
        colors={['#ff007a', '#4d3dff', '#ffffff']}
      />

      {/* Age Verification Popup */}
      <AgeVerification />

      {/* Universal Layout Components */}
      <GlobalMasthead />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dope-orange-500"></div>
        </div>
      }>
        <NitrousOxidePageContent />
      </Suspense>
    </div>
  );
}
