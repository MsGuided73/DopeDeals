import { Suspense } from 'react';
import ProductsPageContent from './ProductsPageContent';
import AgeVerification from '../components/AgeVerification';
import GlobalMasthead from '../components/GlobalMasthead';

export const metadata = {
  title: 'All THCA Products | Highway 420 - Premium THCA Flower, Edibles, Concentrates & More',
  description: 'Shop premium THCA products at Highway 420. THCA flower, edibles, prerolls, concentrates, vapes, and more. Lab-tested, high-quality cannabis products with free shipping.',
  keywords: 'THCA flower, THCA edibles, THCA prerolls, THCA concentrates, THCA vapes, THCA topicals, THCA bundles, premium cannabis, lab tested',
};

export default function ProductsPage() {
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
        <ProductsPageContent />
      </Suspense>
    </div>
  );
}
