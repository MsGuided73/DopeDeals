'use client';

import { Suspense } from 'react';
import NitrousOxidePageContent from './NitrousOxidePageContent';

export default function NitrousOxideClientPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Nitrous Oxide Products Collection",
    "description": "Premium nitrous oxide products collection at Highway 420",
    "url": "https://highway420store.com/nitrous-oxide",
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
          "item": "https://highway420store.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Nitrous Oxide",
          "item": "https://highway420store.com/nitrous-oxide"
        }
      ]
    }
  };

  return (
    <>
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
    </>
  );
}
