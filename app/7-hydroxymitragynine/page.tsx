import { Suspense } from 'react';
import GlobalMasthead from '../components/GlobalMasthead';
import AgeVerification from '../components/AgeVerification';
import HydroxymitragyninePageContent from './HydroxymitragyninePageContent';

export const metadata = {
  title: '7-Hydroxymitragynine Products | DOPE CITY - Premium Collection',
  description: 'Shop premium 7-Hydroxymitragynine products at DOPE CITY. High-quality, lab-tested 7-OH products with discreet shipping and competitive prices.',
  keywords: '7-hydroxymitragynine, 7-oh, 7-oh-mitragynine, kratom products, premium extracts',
  openGraph: {
    title: 'Premium 7-Hydroxymitragynine Products | DOPE CITY',
    description: 'Discover our curated collection of high-quality 7-Hydroxymitragynine products.',
    type: 'website',
    url: 'https://dopecity.com/7-hydroxymitragynine',
    images: [
      {
        url: '/images/7-hydroxymitragynine/7oh-collection-og.jpg',
        width: 1200,
        height: 630,
        alt: 'DOPE CITY Premium 7-Hydroxymitragynine Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium 7-Hydroxymitragynine Products | DOPE CITY',
    description: 'Shop premium 7-Hydroxymitragynine products with discreet shipping.',
    images: ['/images/7-hydroxymitragynine/7oh-collection-twitter.jpg'],
  },
  alternates: {
    canonical: 'https://dopecity.com/7-hydroxymitragynine',
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

export default function HydroxymitragyninePage() {
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Center-Originating Prismatic Burst Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            conic-gradient(from 0deg at 50% 50%, #000000 0deg, #ff0000 60deg, #ffa500 120deg, #000000 180deg, #ffffff 240deg, #808080 300deg, #000000 360deg),
            radial-gradient(circle at 50% 50%, rgba(255, 0, 0, 0.9) 0%, rgba(255, 0, 0, 0.3) 25%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255, 165, 0, 0.8) 0%, rgba(255, 165, 0, 0.2) 35%, transparent 60%),
            radial-gradient(circle at 50% 50%, rgba(0, 0, 255, 0.7) 0%, rgba(0, 0, 255, 0.15) 45%, transparent 70%),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 0, 0.6) 0%, rgba(255, 255, 0, 0.1) 55%, transparent 80%),
            radial-gradient(circle at 50% 50%, rgba(128, 128, 128, 0.5) 0%, rgba(128, 128, 128, 0.05) 65%, transparent 90%),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.02) 75%, transparent 95%)
          `
        }}
      />

      {/* Center-Originating Animated overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 via-orange-400/15 to-blue-400/20 animate-pulse" />

      {/* Center-Originating Shimmer effect */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.5) 10%, transparent 30%),
            radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.8) 0%, transparent 20%)
          `,
          animation: 'pulse 4s ease-in-out infinite'
        }}
      />

      {/* Content */}
      <div className="relative z-10">
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
    </div>
  );
}
