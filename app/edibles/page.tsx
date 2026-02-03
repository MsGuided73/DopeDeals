import { Suspense } from 'react';
import EdiblesPageContent from './EdiblesPageContent';

export const metadata = {
  title: 'CBD Edibles | HIGHWAY 420 - Premium CBD Products',
  description: 'Shop premium CBD edibles at HIGHWAY 420. High-quality wellness products for every need. Free shipping on orders over $75.',
  keywords: 'cbd edibles, cbd gummies, hemp products, wellness products, cbd snacks',
};

export default function EdiblesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dope-orange-500"></div>
      </div>
    }>
      <EdiblesPageContent />
    </Suspense>
  );
}
