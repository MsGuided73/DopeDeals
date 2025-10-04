import NitrousOxideClientPage from './NitrousOxideClientPage';

export const metadata = {
  title: 'Nitrous Oxide Products | DOPE CITY - Premium Collection',
  description: 'Shop premium nitrous oxide products at DOPE CITY. High-quality, lab-tested products with discreet shipping and competitive prices.',
  keywords: 'nitrous oxide, nos, laughing gas, premium nitrous, n2o products',
  openGraph: {
    title: 'Premium Nitrous Oxide Products | DOPE CITY',
    description: 'Discover our curated collection of high-quality nitrous oxide products.',
    type: 'website',
    url: 'https://dopecity.com/nitrous-oxide',
    images: [
      {
        url: '/images/nitrous-oxide/nitrous-collection-og.jpg',
        width: 1200,
        height: 630,
        alt: 'DOPE CITY Premium Nitrous Oxide Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Nitrous Oxide Products | DOPE CITY',
    description: 'Shop premium nitrous oxide products with discreet shipping.',
    images: ['/images/nitrous-oxide/nitrous-collection-twitter.jpg'],
  },
  alternates: {
    canonical: 'https://dopecity.com/nitrous-oxide',
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

export default function NitrousOxidePage() {
  return <NitrousOxideClientPage />;
}
