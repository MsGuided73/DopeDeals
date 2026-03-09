'use client';

import CollectionPageTemplate from '../components/CollectionPageTemplate';

export interface MushroomProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  type?: string;
  strength?: string;
  form?: string;
  desired_effect?: string[];
  inStock: boolean;
  isNew?: boolean;
  isSale?: boolean;
  featured?: boolean;
}

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
