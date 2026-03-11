import MushroomsClientPage from './MushroomsClientPage';

export const metadata = {
  title: 'Mushroom Products | Highway 420 - Premium Mushroom Collection',
  description: 'Shop premium mushroom products at Highway 420. High-quality, lab-tested mushroom products with discreet shipping and competitive prices.',
  keywords: 'mushrooms, mushroom products, premium mushrooms, medicinal mushrooms, psychedelic mushrooms',
  openGraph: {
    title: 'Premium Mushroom Products | Highway 420',
    description: 'Discover our curated collection of high-quality mushroom products. Premium quality with discreet shipping.',
    type: 'website',
    url: 'https://highway420store.com/mushrooms',
    images: [
      {
        url: '/images/mushrooms/mushrooms-collection-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Highway 420 Premium Mushroom Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Mushroom Products | Highway 420',
    description: 'Shop premium mushroom products with discreet shipping.',
    images: ['/images/mushrooms/mushrooms-collection-twitter.jpg'],
  },
  alternates: {
    canonical: 'https://highway420store.com/mushrooms',
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

export default function MushroomsPage() {
  return <MushroomsClientPage />;
}
