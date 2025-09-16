import { Suspense } from 'react';
import BongsPageContent from './BongsPageContent';

export const metadata = {
  title: 'Bongs & Water Pipes | DOPE CITY - Premium Glass Collection',
  description: 'Shop premium glass bongs and water pipes at DOPE CITY. Beaker bongs, straight tubes, percolator bongs, and more. Free shipping on orders over $50.',
  keywords: 'bongs, water pipes, glass bongs, beaker bongs, straight tube bongs, percolator bongs, premium glass',
};

export default function BongsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dope-orange-500"></div>
      </div>
    }>
      <BongsPageContent />
    </Suspense>
  );
}
