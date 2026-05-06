/**
 * Build an href that, when followed, runs a sitewide search for `query`.
 *
 * Used by category-style CTAs ("Shop All Bongs", "Shop RooR Bongs", etc.)
 * so each link surfaces real products from the catalog instead of jumping
 * to a hand-built category page that may not exist or may not be exhaustive.
 *
 * Pairs with the search route at `/search?q=…` (see app/search/SearchResultsContent.tsx),
 * which reads the `q` param via useSearchParams and runs the query.
 */
export function searchHref(query: string): string {
  return `/search?q=${encodeURIComponent(query.trim())}`;
}
