import { Suspense } from 'react';
import ThcaPnvPageContent from './ThcaPnvPageContent';
import AgeVerification from '../components/AgeVerification';
import GlobalMasthead from '../components/GlobalMasthead';

export const metadata = {
  title: 'THCA Pre-Rolls & Vapes | Premium Cannabinoid Products | Highway 420',
  description: 'Explore our premium THCA pre-rolls and vape cartridges. Vector-powered search with advanced filtering. Free shipping over $75.',
  keywords: 'THCA pre-rolls, THCA vapes, THCA cartridges, cannabinoid vapes, premium cannabis products',
  openGraph: {
    title: 'THCA Pre-Rolls & Vapes | Premium Cannabinoid Products | Highway 420',
    description: 'Premium THCA pre-rolls and vape cartridges with vector search and advanced filtering. Free shipping $75+.',
    type: 'website',
    url: 'https://highway420store.com/thca_pnv',
    images: [
      {
        url: '/images/thca/thca-pnv-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Highway 420 THCA Pre-Rolls & Vapes Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'THCA Pre-Rolls & Vapes | Highway 420',
    description: 'Premium THCA pre-rolls and vape cartridges with advanced search. Free shipping $75+.',
    images: ['/images/thca/thca-pnv-twitter.jpg'],
  },
  alternates: {
    canonical: 'https://highway420store.com/thca_pnv',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function ThcaPnvPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "THCA Pre-Rolls & Vapes Collection",
    "description": "Premium collection of THCA pre-rolls and vape cartridges at Highway 420",
    "url": "https://highway420store.com/thca_pnv",
    "mainEntity": {
      "@type": "ItemList",
      "name": "THCA Pre-Rolls & Vape Products",
      "description": "Premium collection of THCA pre-rolls and vape cartridges",
      "numberOfItems": "100+",
      "itemListElement": [
        {
          "@type": "Product",
          "name": "THCA Pre-Rolls",
          "category": "THCA Pre-Rolls"
        },
        {
          "@type": "Product",
          "name": "THCA Vape Cartridges",
          "category": "THCA Vapes"
        },
        {
          "@type": "Product",
          "name": "THCA Disposable Vapes",
          "category": "THCA Disposables"
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
          "name": "THCA Pre-Rolls & Vapes",
          "item": "https://highway420store.com/thca_pnv"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
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
        <ThcaPnvPageContent />
      </Suspense>
    </div>
  );
}
