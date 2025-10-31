import HydroxymitragynineClientPage from './HydroxymitragynineClientPage';

export const metadata = {
  title: '7-Hydroxymitragynine Products | Highway 420 - Premium Collection',
  description: 'Shop premium 7-Hydroxymitragynine products at Highway 420. High-quality, lab-tested 7-OH products with discreet shipping and competitive prices.',
  keywords: '7-hydroxymitragynine, 7-oh, 7-oh-mitragynine, kratom products, premium extracts',
  openGraph: {
    title: 'Premium 7-Hydroxymitragynine Products | Highway 420',
    description: 'Discover our curated collection of high-quality 7-Hydroxymitragynine products.',
    type: 'website',
    url: 'https://highway420store.com/7-hydroxymitragynine',
    images: [
      {
        url: '/images/7-hydroxymitragynine/7oh-collection-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Highway 420 Premium 7-Hydroxymitragynine Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium 7-Hydroxymitragynine Products | Highway 420',
    description: 'Shop premium 7-Hydroxymitragynine products with discreet shipping.',
    images: ['/images/7-hydroxymitragynine/7oh-collection-twitter.jpg'],
  },
  alternates: {
    canonical: 'https://highway420store.com/7-hydroxymitragynine',
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
  return <HydroxymitragynineClientPage />;
}
