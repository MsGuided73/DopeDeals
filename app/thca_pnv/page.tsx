import { Suspense } from 'react';
import ThcaPnvPageContent from './ThcaPnvPageContent';
import AgeVerification from '../components/AgeVerification';
import GlobalMasthead from '../components/GlobalMasthead';

export const metadata = {
  title: 'THCA Prerolls, Cartridges & Vapes | Highway 420 - Premium Cannabis Products',
  description: 'Shop premium THCA prerolls, cartridges, and vaporizer products at Highway 420. High-quality cannabis prerolls, THCA cartridges, disposable vapes, and vape products. Free shipping $50+.',
  keywords: 'THCA prerolls, THCA cartridges, vape products, cannabis prerolls, premium prerolls, THCA flower prerolls, cannabis vaporizers, THCA disposables, THCA vapes, cartridge, preroll, vape pen',
  openGraph: {
    title: 'THCA Prerolls, Cartridges & Vapes | Highway 420',
    description: 'Discover premium THCA prerolls, cartridges, and vape products. Quality cannabis prerolls, cartridges, and vaporizers with free shipping.',
    type: 'website',
    url: 'https://highway420store.com/thca_pnv',
    images: [
      {
        url: '/images/thca_pnv/thca-collection-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Highway 420 Premium THCA Prerolls, Cartridges and Vapes Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'THCA Prerolls, Cartridges & Vapes | Highway 420',
    description: 'Shop premium THCA prerolls, cartridges, and vape products. Free shipping $50+.',
    images: ['/images/thca_pnv/thca-collection-twitter.jpg'],
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
    "name": "THCA Prerolls, Cartridges & Vapes Collection",
    "description": "Premium THCA prerolls, cartridges, and vaporizer products at Highway 420",
    "url": "https://highway420store.com/thca_pnv",
    "mainEntity": {
      "@type": "ItemList",
      "name": "THCA Prerolls, Cartridges & Vapes Collection",
      "description": "High-quality THCA cannabis prerolls, cartridges, and vaporizers",
      "numberOfItems": "100+",
      "itemListElement": [
        {
          "@type": "Product",
          "name": "Premium THCA Prerolls",
          "category": "THCA Prerolls"
        },
        {
          "@type": "Product",
          "name": "THCA Cartridges",
          "category": "THCA Cartridges"
        },
        {
          "@type": "Product",
          "name": "THCA Disposable Vapes",
          "category": "THCA Disposables"
        },
        {
          "@type": "Product",
          "name": "THCA Vaporizers",
          "category": "THCA Vaporizers"
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
          "name": "THCA Prerolls, Cartridges & Vapes",
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
