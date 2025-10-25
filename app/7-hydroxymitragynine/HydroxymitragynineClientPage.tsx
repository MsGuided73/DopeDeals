'use client';

import { Suspense } from 'react';
import GlobalMasthead from '../components/GlobalMasthead';
import AgeVerification from '../components/AgeVerification';
import HydroxymitragyninePageContent from './HydroxymitragyninePageContent';
import PrismaticBurst from '../components/PrismaticBurst';

export default function HydroxymitragynineClientPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "7-Hydroxymitragynine Products Collection",
    "description": "Premium 7-Hydroxymitragynine products collection at DOPE CITY",
    "url": "https://dopecity.com/7-hydroxymitragynine",
    "mainEntity": {
      "@type": "ItemList",
      "name": "7-Hydroxymitragynine Products Collection",
      "description": "High-quality 7-Hydroxymitragynine products and accessories",
      "numberOfItems": "20+",
      "itemListElement": [
        {
          "@type": "Product",
          "name": "Premium 7-Hydroxymitragynine Products",
          "category": "7-Hydroxymitragynine"
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
          "name": "7-Hydroxymitragynine",
          "item": "https://dopecity.com/7-hydroxymitragynine"
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
        <HydroxymitragyninePageContent />
      </Suspense>
    </div>
  );
}
