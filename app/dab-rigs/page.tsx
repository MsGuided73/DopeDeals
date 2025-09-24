import { Suspense } from 'react';
import GlobalMasthead from '../components/GlobalMasthead';
import AgeVerification from '../components/AgeVerification';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dab Rigs & Concentrate Tools | DOPE CITY - Premium Glass Collection',
  description: 'Shop premium dab rigs and concentrate tools at DOPE CITY. Electric rigs, glass rigs, bangers, and more. Free shipping on orders over $50.',
  keywords: 'dab rigs, concentrate rigs, electric dab rigs, glass rigs, bangers, dab tools, concentrate tools',
};

export default function DabRigsPage() {
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
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Dab Rigs & Concentrate Tools</h1>
            <p className="text-lg text-gray-600 mb-8">Premium glass rigs and concentrate accessories coming soon!</p>
            <div className="bg-dope-orange/10 border border-dope-orange/20 rounded-lg p-6">
              <p className="text-dope-orange font-medium">This page is under construction. Check back soon for our full dab rig collection!</p>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
