'use client';

import CollectionPageTemplate from '../components/CollectionPageTemplate';

export default function EdiblesPageContent() {
  return (
    <CollectionPageTemplate
      title="CBD EDIBLES"
      subtitle="Delicious CBD-infused treats crafted for everyday wellness"
      apiEndpoint="/api/products/edibles"
      breadcrumbName="Edibles"
      icon="🍬"
      emptyMessage="Our CBD edibles collection is being curated. Check back soon!"
    />
  );
}
