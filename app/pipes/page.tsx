import { Suspense } from 'react';
import PipesPageContent from './PipesPageContent';
import GlobalMasthead from '../components/GlobalMasthead';

// Category landing — refresh every minute so price/stock surface fast.
export const revalidate = 60;

export const metadata = {
  title: 'Glass Pipes & Hand Pipes | HIGHWAY 420 - Premium Smoking Pipes Collection',
  description: 'Shop premium glass pipes, hand pipes, spoon pipes, and chillums at HIGHWAY 420. Borosilicate glass, unique designs, and free shipping on orders over $50.',
  keywords: 'glass pipes, hand pipes, spoon pipes, chillums, one hitters, sherlock pipes, glass smoking pipes, borosilicate glass pipes, premium pipes',
  openGraph: {
    title: 'Premium Glass Pipes & Hand Pipes | Highway 420',
    description: 'Discover our curated collection of high-quality glass pipes, spoon pipes, chillums, and more. Premium borosilicate glass with free shipping over $50.',
    type: 'website',
    url: 'https://highway420store.com/pipes',
    images: [
      {
        url: '/images/pipes/pipes-collection-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Highway 420 Premium Glass Pipes Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Glass Pipes & Hand Pipes | Highway 420',
    description: 'Shop premium glass pipes, spoon pipes, chillums & more. Free shipping over $50.',
    images: ['/images/pipes/pipes-collection-twitter.jpg'],
  },
  alternates: {
    canonical: 'https://highway420store.com/pipes',
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

export default function PipesPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Glass Pipes & Hand Pipes Collection",
    "description": "Premium glass pipes, hand pipes, spoon pipes, and chillums collection at Highway 420",
    "url": "https://highway420store.com/pipes",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Glass Pipes Collection",
      "description": "High-quality glass pipes and smoking accessories",
      "numberOfItems": "50+",
      "itemListElement": [
        {
          "@type": "Product",
          "name": "Premium Glass Spoon Pipes",
          "category": "Glass Pipes"
        },
        {
          "@type": "Product",
          "name": "Borosilicate Glass Chillums",
          "category": "Glass Pipes"
        },
        {
          "@type": "Product",
          "name": "Sherlock Style Glass Pipes",
          "category": "Glass Pipes"
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
          "name": "Glass Pipes",
          "item": "https://highway420store.com/pipes"
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
        <PipesPageContent />
      </Suspense>
    </div>
  );
}
