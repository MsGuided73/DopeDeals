'use client';

import CollectionPageTemplate from '../components/CollectionPageTemplate';

export default function NitrousOxidePageContent() {
  return (
    <CollectionPageTemplate
      title="NITROUS OXIDE"
      subtitle="Premium N2O products and accessories for your culinary needs."
      apiEndpoint="/api/products/nitrous-oxide"
      breadcrumbName="Nitrous Oxide"
      icon="💨"
      emptyMessage="Restocking our N2O supply. Check back soon!"
    />
  );
}
