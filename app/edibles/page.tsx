import { Suspense } from 'react';
import EdiblesPageContent from './EdiblesPageContent';
import AgeVerification from '../components/AgeVerification';
import GlobalMasthead from '../components/GlobalMasthead';

export const metadata = {
  title: 'Edibles, Salves & Tinctures | HIGHWAY 420 - Premium CBD Products',
  description: 'Shop premium CBD edibles, salves, and tinctures at HIGHWAY 420. High-quality wellness products for every need. Free shipping on orders over $75.',
  keywords: 'cbd edibles, cbd tinctures, cbd salves, hemp products, wellness products, cbd oil',
};

export default function EdiblesPage() {
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
        <EdiblesPageContent />
      </Suspense>
    </div>
  );
}
