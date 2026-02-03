'use client';

import { Suspense } from 'react';
import MushroomsPageContent from './MushroomsPageContent';

export default function MushroomsClientPage() {
    const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Shrooms & Stuff Collection",
    "description": "Premium vapes, prerolls, THC-A flower, edibles, gummies and concentrates at Highway 420",
    "url": "https://highway420store.com/mushrooms",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Shrooms & Stuff Collection",
      "description": "High-quality vapes, prerolls, edibles, concentrates and smoking accessories",
      "numberOfItems": "100+",
      "itemListElement": [
        {
          "@type": "Product",
          "name": "Premium Vapes & Cartridges",
          "category": "Vapes"
        },
        {
          "@type": "Product",
          "name": "THC-A Flower & Prerolls",
          "category": "Flower"
        },
        {
          "@type": "Product",
          "name": "Edibles & Gummies",
          "category": "Edibles"
        },
        {
          "@type": "Product",
          "name": "Concentrates",
          "category": "Concentrates"
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
          "name": "Shrooms & Stuff",
          "item": "https://highway420store.com/mushrooms"
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
        <MushroomsPageContent />
      </Suspense>
    </>
  );
}
