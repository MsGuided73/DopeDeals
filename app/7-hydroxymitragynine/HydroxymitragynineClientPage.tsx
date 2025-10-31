'use client';

import { Suspense } from 'react';
import HydroxymitragyninePageContent from './HydroxymitragyninePageContent';
import GlobalMasthead from '../components/GlobalMasthead';
// 👉 if the build later fails due to GlobalMasthead, replace the import above with:
// import dynamic from 'next/dynamic';
// const GlobalMasthead = dynamic(() => import('../components/GlobalMasthead'), { ssr: false });

export default function HydroxymitragynineClientPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "7-Hydroxymitragynine Products Collection",
    "description": "Premium 7-Hydroxymitragynine products collection at DOPE CITY",
    "url": "https://highway420store.com/7-hydroxymitragynine",
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
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://highway420store.com" },
        { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://highway420store.com/products" },
        { "@type": "ListItem", "position": 3, "name": "7-Hydroxymitragynine", "item": "https://highway420store.com/7-hydroxymitragynine" }
      ]
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Universal Layout Components */}
      <GlobalMasthead />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dope-orange-500"></div>
          </div>
        }
      >
        <HydroxymitragyninePageContent />
      </Suspense>
    </div>
  );
}