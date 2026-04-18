import BundlesClientPage from './BundlesClientPage';

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
  return <BundlesClientPage />;
}
