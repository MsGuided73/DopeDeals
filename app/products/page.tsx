import { Suspense } from 'react';
import ProductsPageContent from './ProductsPageContent';

export const metadata = {
  title: 'All Products | DOPE CITY - Premium Cannabis Accessories',
  description: 'Shop premium cannabis accessories at DOPE CITY. Glass pieces, vaporizers, grinders, papers, and more. Free shipping on orders over $50.',
  keywords: 'cannabis accessories, glass pieces, vaporizers, grinders, papers, premium products, CBD, hemp',
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
