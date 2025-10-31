import { Suspense } from 'react';
import DabsntoolsPageContent from './DabsntoolsPageContent';
import AgeVerification from '../components/AgeVerification';
import GlobalMasthead from '../components/GlobalMasthead';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dab Rigs & Concentrate Tools | DOPE CITY - Premium Concentrate Equipment',
  description: 'Shop premium dab rigs, e-rigs, glass concentrate equipment, and concentrate tools at DOPE CITY. Electric rigs, glass rigs, portable devices, bangers, and more. Free shipping $50+.',
  keywords: 'dab rigs, concentrate rigs, electric dab rigs, glass rigs, e-rigs, portable dab rigs, concentrate tools, bangers, dab nails, domeless nails, dab accessories',
  openGraph: {
    title: 'Dab Rigs & Concentrate Tools | DOPE CITY',
    description: 'Discover premium concentrate equipment and tools. Glass rigs, e-rigs, portable devices, and concentrate accessories with free shipping.',
    type: 'website',
    url: 'https://highway420store.com/dabsntools',
    images: [
      {
        url: '/images/collections/dab-rigs-collection.jpg',
        width: 1200,
        height: 630,
        alt: 'DOPE CITY Premium Dab Rigs & Concentrate Tools Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dab Rigs & Concentrate Tools | DOPE CITY',
    description: 'Shop premium dab rigs and concentrate tools. Free shipping $50+.',
    images: ['/images/collections/dab-rigs-collection-twitter.jpg'],
  },
  alternates: {
    canonical: 'https://highway420store.com/dabsntools',
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

export default function DabsntoolsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Dab Rigs & Concentrate Tools Collection",
    "description": "Premium dab rigs, e-rigs, glass concentrate equipment, and concentrate tools at DOPE CITY",
    "url": "https://highway420store.com/dabsntools",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Dab Rigs & Concentrate Tools Collection",
      "description": "High-quality concentrate equipment and dabbing accessories",
      "numberOfItems": "150+",
      "itemListElement": [
        {
          "@type": "Product",
          "name": "Premium Glass Dab Rigs",
          "category": "Glass Dab Rigs"
        },
        {
          "@type": "Product",
          "name": "Electric Dab Rigs",
          "category": "E-Rigs"
        },
        {
          "@type": "Product",
          "name": "Portable Dab Devices",
          "category": "Portable Rigs"
        },
        {
          "@type": "Product",
          "name": "Concentrate Tools",
          "category": "Dab Tools"
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
          "name": "Dab Rigs & Tools",
          "item": "https://highway420store.com/dabsntools"
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
        <DabsntoolsPageContent />
      </Suspense>
    </div>
  );
}
