import { Suspense } from 'react';
import ThcaFlowerPageContent from './ThcaFlowerPageContent';
import GlobalMasthead from '../components/GlobalMasthead';

// Category landing — refresh every minute so price/stock surface fast.
export const revalidate = 60;

export const metadata = {
  title: 'THCA Flower | Premium Hemp Flower Products | Highway 420',
  description: 'Shop premium THCA flower products including 3.5g, 7g, 14g, and 28g options. High-quality hemp flower with infused prerolls. Free shipping on orders over $50.',
  keywords: 'THCA flower, hemp flower, THCA prerolls, infused prerolls, hemp products, premium flower, THCA concentrates',
  openGraph: {
    title: 'Premium THCA Flower | Highway 420',
    description: 'Discover our premium THCA flower collection with various sizes and infused prerolls. Free shipping over $50.',
    type: 'website',
    url: 'https://highway420store.com/thca_flower',
    images: [
      {
        url: '/images/thca-flower/thca-flower-collection-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Highway 420 Premium THCA Flower Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium THCA Flower | Highway 420',
    description: 'Shop premium THCA flower and prerolls. Free shipping over $50.',
    images: ['/images/thca-flower/thca-flower-collection-twitter.jpg'],
  },
  alternates: {
    canonical: 'https://highway420store.com/thca_flower',
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

export default function ThcaFlowerPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "THCA Flower Collection",
    "description": "Premium THCA flower products including various sizes and infused prerolls",
    "url": "https://highway420store.com/thca_flower",
    "mainEntity": {
      "@type": "ItemList",
      "name": "THCA Flower Products",
      "description": "High-quality THCA hemp flower and preroll products",
      "numberOfItems": "50+",
      "itemListElement": [
        {
          "@type": "Product",
          "name": "Premium THCA Flower 3.5g",
          "category": "THCA Flower"
        },
        {
          "@type": "Product",
          "name": "THCA Infused Prerolls",
          "category": "THCA Prerolls"
        },
        {
          "@type": "Product",
          "name": "THCA Flower 7g Bundle",
          "category": "THCA Flower"
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
          "name": "THCA & More",
          "item": "https://highway420store.com/thca"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "THCA Flower",
          "item": "https://highway420store.com/thca_flower"
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
        <ThcaFlowerPageContent />
      </Suspense>
    </div>
  );
}
