import { Suspense } from 'react';
import AgeVerification from '../components/AgeVerification';
import DabRigsHero from './components/DabRigsHero';
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

      {/* Compact Hero Section */}
      <DabRigsHero />

      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dope-orange-500"></div>
        </div>
      }>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="bg-dope-orange/10 border border-dope-orange/20 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-dope-orange font-medium">
                Our premium dab rig collection is being curated. Check back soon for the finest glass rigs, electric rigs, bangers, and concentrate accessories!
              </p>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
