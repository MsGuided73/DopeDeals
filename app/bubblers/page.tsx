import { Suspense } from 'react';
import BubblersPageContent from './BubblersPageContent';
import GlobalMasthead from '../components/GlobalMasthead';

// Category landing — refresh every minute so price/stock surface fast.
export const revalidate = 60;

export const metadata = {
  title: 'Bubblers | Highway 420 - Premium Glass Bubblers Collection',
  description: 'Shop premium glass bubblers at Highway 420. Compact water pipes, mini bubblers, sherlock bubblers, and more. Free shipping on orders over $75.',
  keywords: 'bubblers, glass bubblers, mini bubblers, sherlock bubblers, compact water pipes, premium glass',
};

export default function BubblersPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Universal Layout Components */}
      <GlobalMasthead />

      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dope-orange-500"></div>
        </div>
      }>
        <BubblersPageContent />
      </Suspense>
    </div>
  );
}
