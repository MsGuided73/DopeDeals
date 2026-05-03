import { Suspense } from 'react';
import BongsPageContent from '../bongs/BongsPageContent';
import GlobalMasthead from '../components/GlobalMasthead';

export const metadata = {
  title: 'Percolator Bongs | HIGHWAY 420 - Smoother Hits, Cooler Smoke',
  description:
    'Shop premium percolator bongs at HIGHWAY 420 — tree percs, honeycomb, showerhead, inline, matrix, and more. Smoother hits, cooler smoke, better filtration. Free shipping on orders over $50.',
  keywords:
    'percolator bongs, perc bongs, tree perc, honeycomb perc, showerhead perc, inline perc, matrix perc, water pipes, glass bongs',
  alternates: { canonical: 'https://highway420store.com/percolator-bongs' },
  openGraph: {
    title: 'Percolator Bongs | HIGHWAY 420',
    description:
      'Premium percolator bongs — tree percs, honeycomb, showerhead, inline, matrix and more. Smoother, cooler hits.',
    url: 'https://highway420store.com/percolator-bongs',
    type: 'website',
  },
};

// Dedicated landing page for percolator-equipped bongs. Reuses the bongs
// listing component with the percolator-bongs pill pre-active, which routes
// every keyword in PERC_KEYWORDS (tree perc, honeycomb, showerhead, inline,
// matrix, turbine, spiral, diffuser, etc.) plus any product whose specs
// expose a `percolator` field. Customers can still broaden via the pill bar.
export default function PercolatorBongsPage() {
  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <GlobalMasthead />

      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dope-orange-500"></div>
          </div>
        }
      >
        <BongsPageContent initialCategory="percolator-bongs" />
      </Suspense>
    </div>
  );
}
