'use client';

import { Suspense } from 'react';
import AccessoriesPageContent from './AccessoriesPageContent';
import PrismaticBurst from '../components/PrismaticBurst';
import GlobalMasthead from '../components/GlobalMasthead';

export default function AccessoriesClientPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Smoking Accessories Collection",
    "description": "Premium smoking accessories collection at Highway 420",
    "url": "https://highway420store.com/accessories",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Smoking Accessories Collection",
      "description": "High-quality smoking accessories including storage containers, rolling papers, and more",
      "numberOfItems": "100+",
      "itemListElement": [
        {
          "@type": "Product",
          "name": "Premium Smoking Accessories",
          "category": "Accessories"
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
          "name": "Products",
          "item": "https://highway420store.com/products"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Accessories",
          "item": "https://highway420store.com/accessories"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <GlobalMasthead />
      <PrismaticBurst
        intensity={3}
        speed={0.7}
        colors={['#10b981', '#059669', '#047857']}
      />


      {/* Universal Layout Components */}
      <GlobalMasthead />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
        </div>
      }>
        <AccessoriesPageContent />
      </Suspense>
    </div>
  );
}
