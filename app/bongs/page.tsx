import { Suspense } from 'react';
import GlobalMasthead from '../components/GlobalMasthead';
import BongsPageContent from './BongsPageContent';
import AgeVerification from '../components/AgeVerification';

export const metadata = {
  title: 'Bongs & Water Pipes | DOPE CITY - Premium Glass Collection',
  description: 'Shop premium glass bongs and water pipes at DOPE CITY. Beaker bongs, straight tubes, percolator bongs, and more. Free shipping on orders over $50.',
  keywords: 'bongs, water pipes, glass bongs, beaker bongs, straight tube bongs, percolator bongs, premium glass',
};

export default function BongsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Age Verification Popup */}
      <AgeVerification />

      {/* Universal Layout Components */}
      <GlobalMasthead />

      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dope-orange-500"></div>
        </div>
      }>
        <BongsPageContent />
      </Suspense>
    </div>
  );
}
