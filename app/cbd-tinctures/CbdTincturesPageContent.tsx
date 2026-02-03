'use client';

import CollectionPageTemplate from '../components/CollectionPageTemplate';

export default function CbdTincturesPageContent() {
  return (
    <CollectionPageTemplate
      title="CBD TINCTURES & SALVES"
      subtitle="Premium CBD wellness products for daily balance and targeted relief"
      apiEndpoint="/api/products/cbd-tinctures"
      breadcrumbName="CBD & Tinctures"
      icon="💧"
      emptyMessage="Our CBD tinctures and salves collection is being curated. Check back soon!"
    />
  );
}