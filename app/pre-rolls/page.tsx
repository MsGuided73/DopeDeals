import { Suspense } from 'react';
import PreRollsPageContent from './PreRollsPageContent';

export const metadata = {
  title: 'Premium Pre-Rolls | Highway 420',
  description: 'Shop our premium selection of ready-to-smoke pre-rolls. High quality flower, professionally rolled for your convenience.',
  keywords: 'pre-rolls, joints, marijuana pre-rolls, cannabis rolls, ready to smoke',
};

export default function PreRollsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dope-orange-500"></div>
      </div>
    }>
      <PreRollsPageContent />
    </Suspense>
  );
}
