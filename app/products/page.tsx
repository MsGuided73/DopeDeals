import { Suspense } from 'react';
import ProductsPageContent from './ProductsPageContent';

export const metadata = {
  title: 'All Products | DOPE CITY - Water Bongs, Pipes, THCA Flower & More',
  description: 'Shop premium cannabis accessories at DOPE CITY. Water bongs, pipes, THCA flower, and more premium products. Free shipping on orders over $50.',
  keywords: 'water bongs, pipes, THCA flower, cannabis accessories, premium products, CBD, hemp, glass pieces',
};

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dope-orange-500"></div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
