import { Suspense } from 'react';
import ThcaMasterPageContent from './ThcaMasterPageContent';
import AgeVerification from '../components/AgeVerification';
import GlobalMasthead from '../components/GlobalMasthead';

export const metadata = {
  title: 'THCA Master Collection | Highway 420 - All Cannabinoid Products',
  description: 'Explore the complete THCA & cannabinoid collection at Highway 420. THCA Flower, Prerolls, Cartridges, Concentrates, Edibles, CBD, Delta products, and more. Free shipping on orders over $75.',
  keywords: 'THCA flower, THCA prerolls, THCA cartridges, THCA concentrates, CBD products, Delta products, edibles, cannabinoid products, premium cannabis',
  openGraph: {
    title: 'THCA Master Collection | Highway 420',
    description: 'Complete collection of THCA & cannabinoid products including flower, prerolls, cartridges, concentrates, edibles, and more.',
    type: 'website',
    url: 'https://highway420store.com/thca-master',
    images: [
      {
        url: '/images/thca-master/thca-master-collection-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Highway 420 THCA Master Collection - All Cannabinoid Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'THCA Master Collection | Highway 420',
    description: 'Complete THCA & cannabinoid collection. Free shipping $75+.',
    images: ['/images/thca-master/thca-master-collection-twitter.jpg'],
  },
  alternates: {
    canonical: 'https://highway420store.com/thca-master',
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

export default function ThcaMasterPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "THCA Master Collection",
    "description": "Complete collection of THCA and cannabinoid products at Highway 420",
    "url": "https://highway420store.com/thca-master",
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
          "name": "CBD & Wellness Products",
          "category": "CBD Products"
        },
        {
          "@type": "Product",
          "name": "Delta Products",
          "category": "Delta Products"
        },
        {
          "@type": "Product",
          "name": "Cannabinoid Edibles",
          "category": "Edibles"
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
          "name": "THCA Master Collection",
          "item": "https://highway420store.com/thca-master"
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
        <ThcaMasterPageContent />
      </Suspense>
    </div>
  );
}
