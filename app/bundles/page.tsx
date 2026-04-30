import { Suspense } from 'react';
import BundlesPageContent from './BundlesPageContent';
import GlobalMasthead from '../components/GlobalMasthead';

export const metadata = {
  title: 'Bundles | Highway 420 — Save More, Smoke Better',
  description:
    'Shop curated bundles at Highway 420. Get more for less with hand-picked combinations of glass, flower, vapes, and edibles. Free shipping over $75.',
  keywords: 'bundles, combo deals, glass bundles, vape bundles, cannabis bundles, smoking bundles, highway 420 bundles',
  openGraph: {
    title: 'Highway 420 Bundles — Save More, Smoke Better',
    description: 'Curated combos of our best products. More product, better price.',
    type: 'website',
    url: 'https://highway420store.com/bundles',
    images: [
      {
        url: '/images/bundles/bundles-collection-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Highway 420 Bundle Deals',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Highway 420 Bundles — Save More, Smoke Better',
    description: 'Curated combos of our best products with free shipping over $75.',
    images: ['/images/bundles/bundles-collection-twitter.jpg'],
  },
  alternates: {
    canonical: 'https://highway420store.com/bundles',
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

export default function BundlesPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Highway 420 Bundles',
    description: 'Curated bundles of premium cannabis products — glass, flower, vapes, and edibles at a better price.',
    url: 'https://highway420store.com/bundles',
    mainEntity: {
      '@type': 'ItemList',
      name: 'Highway 420 Bundle Collection',
      description: 'Hand-picked product combos for every kind of session.',
      numberOfItems: '50+',
      itemListElement: [
        { '@type': 'Product', name: 'Starter Bundle', category: 'Bundles' },
        { '@type': 'Product', name: 'Glass Bundle', category: 'Bundles' },
        { '@type': 'Product', name: 'Vape Bundle', category: 'Bundles' },
        { '@type': 'Product', name: 'Edibles Bundle', category: 'Bundles' },
      ],
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://highway420store.com' },
        { '@type': 'ListItem', position: 2, name: 'Bundles', item: 'https://highway420store.com/bundles' },
      ],
    },
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
        <BundlesPageContent />
      </Suspense>
    </div>
  );
}
