import { Metadata } from 'next';
import { Suspense } from 'react';
import SearchResultsContent from './SearchResultsContent';

export const metadata: Metadata = {
  title: 'Search Results | DOPE CITY',
  description: 'Search results for premium vaping products, accessories, and more at DOPE CITY.',
  keywords: 'search, vaping products, accessories, brands, categories',
};

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dope-orange mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading search results...</p>
        </div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
