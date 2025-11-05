import { Suspense } from 'react';
import ThcaPageContent from './ThcaPageContent';
import AgeVerification from '../components/AgeVerification';
import GlobalMasthead from '../components/GlobalMasthead';

export const metadata = {
  title: 'THCA Products | Premium Cannabinoid Collection | Highway 420',
  description: 'Explore our complete THCA product collection including flower, prerolls, cartridges, concentrates, edibles, and more. Vector-powered search with advanced filtering. Free shipping over $75.',
  keywords: 'THCA, THCA flower, THCA prerolls, THCA cartridges, THCA concentrates, cannabinoid products, hemp products, premium cannabis',
  openGraph: {
    title: 'THCA Products | Premium Cannabinoid Collection | Highway 420',
    description: 'Complete THCA & cannabinoid collection with vector search and advanced filtering. Free shipping $75+.',
    type: 'website',
    url: 'https://highway420store.com/thca',
    images: [
      {
        url: '/images/thca/thca-collection-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Highway 420 THCA Product Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'THCA Products | Highway 420',
    description: 'Premium THCA & cannabinoid collection with advanced search. Free shipping $75+.',
    images: ['/images/thca/thca-collection-twitter.jpg'],
  },
  alternates: {
    canonical: 'https://highway420store.com/thca',
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

export default function ThcaPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "THCA Products Collection",
    "description": "Complete collection of THCA and cannabinoid products at Highway 420",
    "url": "https://highway420store.com/thca",
    "mainEntity": {
      "@type": "ItemList",
      "name": "THCA & Cannabinoid Products",
      "description": "Comprehensive collection of THCA flower, prerolls, cartridges, concentrates, edibles, and cannabinoid products",
      "numberOfItems": "500+",
      "itemListElement": [
        {
          "@type": "Product",
          "name": "THCA Flower Collection",
          "category": "THCA Flower"
        },
        {
          "@type": "Product",
          "name": "THCA Prerolls & Vapes",
          "category": "THCA Prerolls"
        },
        {
          "@type": "Product",
          "name": "THCA Concentrates",
          "category": "THCA Concentrates"
        },
        {
          "@type": "Product",
          "name": "THCA Cartridges",
          "category": "THCA Cartridges"
        },
        {
          "@type": "Product",
          "name": "THCA Edibles",
          "category": "THCA Edibles"
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
          "name": "THCA Collection",
          "item": "https://highway420store.com/thca"
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
        <ThcaPageContent />
      </Suspense>
    </div>
  );
}
