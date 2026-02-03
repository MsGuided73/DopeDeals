'use client';

import CollectionPageTemplate from '../components/CollectionPageTemplate';

export default function MushroomsPageContent() {
  return (
    <CollectionPageTemplate
      title="SHROOMS & STUFF"
      subtitle="Elevate your experience with our curated collection of premium mushrooms and more."
      apiEndpoint="/api/products/mushrooms"
      breadcrumbName="Mushrooms"
      icon="🍄"
      emptyMessage="Our mushroom collection is growing. Check back soon!"
    />
  );
}
