'use client';

import CollectionPageTemplate from '../components/CollectionPageTemplate';

export default function PreRollsPageContent() {
  return (
    <CollectionPageTemplate
      title="PREMIUM PRE-ROLLS"
      subtitle="Ready-to-smoke joints in various strains and potencies"
      apiEndpoint="/api/products/pre-rolls?limit=50"
      breadcrumbName="Pre-Rolls"
      icon="🚬"
      emptyMessage="Our premium pre-rolls collection is being curated. Check back soon!"
    />
  );
}
