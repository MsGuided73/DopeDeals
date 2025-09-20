import { Metadata } from 'next';
import SearchResultsContent from './SearchResultsContent';

export const metadata: Metadata = {
  title: 'Search Results | DOPE CITY',
  description: 'Search results for premium vaping products, accessories, and more at DOPE CITY.',
  keywords: 'search, vaping products, accessories, brands, categories',
};

export default function SearchPage() {
  return <SearchResultsContent />;
}
