import AccessoriesClientPage from './AccessoriesClientPage';

// Category landing — refresh every minute so price/stock surface fast.
export const revalidate = 60;

export const metadata = {
  title: 'Smoking Accessories | Highway 420 - Premium Collection',
  description: 'Shop premium smoking accessories at Highway 420. Pipes, bongs, dab rigs, grinders, lighters, and more with discreet shipping and competitive prices.',
  keywords: 'smoking accessories, pipes, bongs, dab rigs, grinders, lighters, bowls, stems, screens, cases, bags',
  openGraph: {
    title: 'Premium Smoking Accessories | Highway 420',
    description: 'Discover our curated collection of high-quality smoking accessories.',
    type: 'website',
    url: 'https://highway420store.com/accessories',
    images: [
      {
        url: '/images/accessories/accessories-collection-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Highway 420 Premium Smoking Accessories Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Smoking Accessories | HIGHWAY 420',
    description: 'Shop premium smoking accessories with discreet shipping.',
    images: ['/images/accessories/accessories-collection-twitter.jpg'],
  },
  alternates: {
    canonical: 'https://highway420store.com/accessories',
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

export default function AccessoriesPage() {
  return <AccessoriesClientPage />;
}
