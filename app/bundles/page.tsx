import { Suspense } from 'react';
import BundlesClientPage from './BundlesClientPage';

export const metadata = {
  title: 'Bundles — Coming Soon | Highway 420',
  description:
    'Premium product bundles coming soon to Highway 420. Curated combos of glass, flower, vapes, and edibles. Join the list for early access.',
  keywords: 'bundles, combo deals, glass bundles, vape bundles, cannabis bundles, smoking bundles, highway 420 bundles, coming soon',
  openGraph: {
    title: 'Highway 420 Bundles — Coming Soon',
    description: 'Curated bundles dropping soon. Be first to know.',
    type: 'website',
    url: 'https://highway420store.com/bundles',
    images: [
      {
        url: '/images/bundles/bundles-collection-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Highway 420 Bundle Deals — Coming Soon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Highway 420 Bundles — Coming Soon',
    description: 'Curated bundles dropping soon. Join the list for early access.',
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
  // Suspense wrapper is required because BundlesClientPage reads ?kit=
  // via useSearchParams; Next.js 15 throws during prerender otherwise.
  return (
    <Suspense fallback={null}>
      <BundlesClientPage />
    </Suspense>
  );
}
