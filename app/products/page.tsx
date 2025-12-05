import { Suspense } from 'react';
import ProductsPageContent from './ProductsPageContent';
import AgeVerification from '../components/AgeVerification';
import GlobalMasthead from '../components/GlobalMasthead';

export const metadata = {
  title: 'Smoking Accessories | Highway 420 - Premium Pipes, Papers, Grinders & More',
  description: 'Shop premium smoking accessories at Highway 420. Rolling papers, grinders, lighters, pipes, storage solutions, and more. Quality accessories for every smoker.',
  keywords: 'smoking accessories, rolling papers, grinders, lighters, pipes, storage, ashtrays, cleaning supplies, smoking essentials',
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
