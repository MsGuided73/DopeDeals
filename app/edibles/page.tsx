import { Suspense } from 'react';
import EdiblesPageContent from './EdiblesPageContent';
import GlobalMasthead from '../components/GlobalMasthead';

export const metadata = {
  title: 'Edibles | HIGHWAY 420 - Premium Hemp-Derived Edibles',
  description: 'Shop premium edibles at HIGHWAY 420 — gummies, chocolates, beverages, and tinctures. Lab-tested, precisely dosed, and federally compliant. Free shipping on orders over $75.',
  keywords: 'edibles, cbd edibles, thc edibles, delta-8 gummies, hemp gummies, cbd chocolate, cbd beverages, tinctures, hemp products, wellness products',
  openGraph: {
    title: 'Premium Edibles | Highway 420',
    description: 'Discover our curated collection of lab-tested edibles — gummies, chocolates, beverages, and tinctures. Free shipping over $75.',
    type: 'website',
    url: 'https://highway420store.com/edibles',
    images: [
      {
        url: '/images/edibles/edibles-collection-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Highway 420 Premium Edibles Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Edibles | Highway 420',
    description: 'Shop premium edibles — gummies, chocolates, beverages & more. Free shipping over $75.',
    images: ['/images/edibles/edibles-collection-twitter.jpg'],
  },
  alternates: {
    canonical: 'https://highway420store.com/edibles',
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

export default function EdiblesPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Edibles Collection",
    "description": "Premium hemp-derived edibles including gummies, chocolates, beverages, and tinctures at Highway 420",
    "url": "https://highway420store.com/edibles",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Edibles Collection",
      "description": "Lab-tested edibles and wellness products",
      "numberOfItems": "50+",
      "itemListElement": [
        {
          "@type": "Product",
          "name": "Premium CBD Gummies",
          "category": "Edibles"
        },
        {
          "@type": "Product",
          "name": "Hemp-Derived Chocolates",
          "category": "Edibles"
        },
        {
          "@type": "Product",
          "name": "CBD Beverages",
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
          "name": "Edibles",
          "item": "https://highway420store.com/edibles"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
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
        <EdiblesPageContent />
      </Suspense>
    </div>
  );
}
