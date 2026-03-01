import { Suspense } from 'react';
import VapesPageContent from './VapesPageContent';
import GlobalMasthead from '../components/GlobalMasthead';

export const metadata = {
  title: 'Vapes & Cartridges | Highway 420 - Premium THC & CBD Vapes',
  description: 'Shop premium cartridges, disposable vapes, and vaporizer hardware at Highway 420. High-quality THCA, Delta 8, and specialty vape products. Free shipping over $75.',
  keywords: 'vape products, cartridges, disposable vapes, cannabis vaporizers, THCA disposables, THCA vapes, delta 8 vapes, vape pen, 510 thread battery',
  openGraph: {
    title: 'Vapes & Cartridges | Highway 420',
    description: 'Discover premium cartridges and vape products. Quality disposable vapes and vaporizers with free shipping.',
    type: 'website',
    url: 'https://highway420store.com/vapes',
    images: [
      {
        url: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/RUNTZ-3.5G-SINGLES.webp',
        width: 1200,
        height: 630,
        alt: 'Highway 420 Premium Vapes and Cartridges Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vapes & Cartridges | Highway 420',
    description: 'Shop premium cartridges and vape products. Free shipping over $75.',
    images: ['https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/RUNTZ-3.5G-SINGLES.webp'],
  },
  alternates: {
    canonical: 'https://highway420store.com/vapes',
  },
};

export default function VapesPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Vapes & Cartridges Collection",
    "description": "Premium cartridges and vaporizer products at Highway 420",
    "url": "https://highway420store.com/vapes",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Vapes & Cartridges Collection",
      "description": "High-quality cannabis cartridges, disposables, and vaporizers",
      "numberOfItems": "50+",
      "itemListElement": [
        {
          "@type": "Product",
          "name": "THCA Cartridges",
          "category": "Vapes"
        },
        {
          "@type": "Product",
          "name": "Disposable Vapes",
          "category": "Vapes"
        },
        {
          "@type": "Product",
          "name": "Vaporizers",
          "category": "Hardware"
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
          "name": "Vapes & Cartridges",
          "item": "https://highway420store.com/vapes"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
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
        <VapesPageContent />
      </Suspense>
    </div>
  );
}
