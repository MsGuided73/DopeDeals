import { Suspense } from 'react';
import CbdTincturesPageContent from './CbdTincturesPageContent';

export const metadata = {
  title: 'CBD Tinctures & Salves | HIGHWAY 420 - Premium CBD Products',
  description: 'Shop premium CBD tinctures and salves at HIGHWAY 420. High-quality wellness products for every need. Free shipping on orders over $75.',
  keywords: 'cbd tinctures, cbd salves, cbd oil, hemp products, wellness products, cbd topical',
};

export default function CbdTincturesPage() {
  return (
     <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dope-orange-500"></div>
        </div>
      }>
        <CbdTincturesPageContent />
      </Suspense>
  );
}