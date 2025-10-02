import GlobalMasthead from '../components/GlobalMasthead';
import AgeVerification from '../components/AgeVerification';

export const metadata = {
  title: 'Mushroom Products | DOPE CITY - Premium Mushroom Collection',
  description: 'Shop premium mushroom products at DOPE CITY. High-quality, lab-tested mushroom products with discreet shipping and competitive prices.',
  keywords: 'mushrooms, mushroom products, premium mushrooms, medicinal mushrooms, psychedelic mushrooms',
  openGraph: {
    title: 'Premium Mushroom Products | DOPE CITY',
    description: 'Discover our curated collection of high-quality mushroom products. Premium quality with discreet shipping.',
    type: 'website',
    url: 'https://dopecity.com/mushrooms',
    images: [
      {
        url: '/images/mushrooms/mushrooms-collection-og.jpg',
        width: 1200,
        height: 630,
        alt: 'DOPE CITY Premium Mushroom Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Mushroom Products | DOPE CITY',
    description: 'Shop premium mushroom products with discreet shipping.',
    images: ['/images/mushrooms/mushrooms-collection-twitter.jpg'],
  },
  alternates: {
    canonical: 'https://dopecity.com/mushrooms',
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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Mushroom Products Collection",
    "description": "Premium mushroom products collection at DOPE CITY",
    "url": "https://dopecity.com/mushrooms",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Mushroom Products Collection",
      "description": "High-quality mushroom products and accessories",
      "numberOfItems": "25+",
      "itemListElement": [
        {
          "@type": "Product",
          "name": "Premium Mushroom Products",
          "category": "Mushrooms"
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
          "item": "https://dopecity.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Products",
          "item": "https://dopecity.com/products"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Mushrooms",
          "item": "https://dopecity.com/mushrooms"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Center-Originating Prismatic Burst Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            conic-gradient(from 0deg at 50% 50%, #000000 0deg, #ff0000 60deg, #ffa500 120deg, #000000 180deg, #ffffff 240deg, #808080 300deg, #000000 360deg),
            radial-gradient(circle at 50% 50%, rgba(255, 0, 0, 0.9) 0%, rgba(255, 0, 0, 0.3) 25%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255, 165, 0, 0.8) 0%, rgba(255, 165, 0, 0.2) 35%, transparent 60%),
            radial-gradient(circle at 50% 50%, rgba(0, 0, 255, 0.7) 0%, rgba(0, 0, 255, 0.15) 45%, transparent 70%),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 0, 0.6) 0%, rgba(255, 255, 0, 0.1) 55%, transparent 80%),
            radial-gradient(circle at 50% 50%, rgba(128, 128, 128, 0.5) 0%, rgba(128, 128, 128, 0.05) 65%, transparent 90%),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.02) 75%, transparent 95%)
          `
        }}
      />

      {/* Center-Originating Animated overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 via-orange-400/15 to-blue-400/20 animate-pulse" />

      {/* Center-Originating Shimmer effect */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.5) 10%, transparent 30%),
            radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.8) 0%, transparent 20%)
          `,
          animation: 'pulse 4s ease-in-out infinite'
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Age Verification Popup */}
        <AgeVerification />

        {/* Universal Layout Components */}
        <GlobalMasthead />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Mushroom Products Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              🍄 Premium Mushrooms
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-white drop-shadow-md">
              Discover our curated collection of high-quality mushroom products
            </p>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 max-w-2xl mx-auto">
              <p className="text-lg text-white">
                Coming Soon - Our curated selection of premium mushroom products will be available here.
                <br /><br />
                We're working hard to bring you the highest quality products with discreet shipping and competitive prices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
