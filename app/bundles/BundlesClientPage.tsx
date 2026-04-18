'use client';

import { Suspense } from 'react';
import BundlesPageContent from './BundlesPageContent';

export default function BundlesClientPage() {
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dope-orange-500" />
          </div>
        }
      >
        <BundlesPageContent />
      </Suspense>
    </>
  );
}
