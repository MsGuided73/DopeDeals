import { Suspense } from 'react';
import PreRollsPageContent from './PreRollsPageContent';
import GlobalMasthead from '../components/GlobalMasthead';

export const metadata = {
  title: 'Premium Pre-Rolls | Highway 420',
  description:
    'Shop premium pre-rolls at Highway 420 — singles, multi-packs, infused, and strain-specific joints. Lab-tested, expertly rolled, and ready to smoke.',
  keywords:
    'pre-rolls, joints, infused pre-rolls, indica pre-rolls, sativa pre-rolls, hybrid pre-rolls, ready to smoke, cannabis pre-rolls',
  openGraph: {
    title: 'Premium Pre-Rolls | Highway 420',
    description:
      'Singles, multi-packs, and infused pre-rolls. Lab-tested cannabis joints rolled and ready.',
    type: 'website',
    url: 'https://highway420store.com/pre-rolls',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Pre-Rolls | Highway 420',
    description:
      'Singles, multi-packs, and infused pre-rolls. Lab-tested cannabis joints rolled and ready.',
  },
  alternates: {
    canonical: 'https://highway420store.com/pre-rolls',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PreRollsPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Pre-Rolls Collection',
    description:
      'Premium pre-rolls — singles, multi-packs, and infused joints — at Highway 420',
    url: 'https://highway420store.com/pre-rolls',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://highway420store.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Products',
          item: 'https://highway420store.com/products',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Pre-Rolls',
          item: 'https://highway420store.com/pre-rolls',
        },
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
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dope-orange-500"></div>
          </div>
        }
      >
        <PreRollsPageContent />
      </Suspense>
    </div>
  );
}
