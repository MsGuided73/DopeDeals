/**
 * Centralized display-layer filters for product queries.
 *
 * Distinct from lib/compliance-filters.ts (which removes products that *cannot*
 * be sold). These filters remove products that *should not be shown* in any
 * customer-facing surface even though they're sellable in principle — most
 * commonly because the product has no usable image yet (mid-import state).
 *
 * Admin tooling should NOT use these — admins need to see incomplete products
 * to fix them.
 *
 * Used by:
 * - lib/product-service.ts
 * - lib/storage.ts (customer-facing read paths only)
 * - app/api/products/* customer-facing routes
 * - Featured / new arrivals / dope-deals / search endpoints
 */

/**
 * Apply image-required filter to a Supabase query against main_site_products.
 * Excludes rows where image_url is NULL, empty, the literal string 'null',
 * or a placeholder URL. Use this on every customer-facing read.
 *
 * @param query A Supabase query builder mid-construction
 * @param column The column name to check (defaults to 'image_url')
 * @returns The same query with image-required filters chained on
 */
export function applyImageRequiredFilter(query: any, column: string = 'image_url'): any {
  return query
    .not(column, 'is', null)
    .neq(column, '')
    .neq(column, 'null')
    .not(column, 'ilike', '%placeholder%')
    .ilike(column, 'http%');
}

/**
 * Predicate version for in-memory arrays — useful when products were already
 * fetched and need to be filtered post-hoc.
 */
export function hasUsableImage(product: { image_url?: string | null; imageUrl?: string | null }): boolean {
  const url = product.image_url ?? product.imageUrl ?? '';
  if (!url || url === 'null') return false;
  if (!/^https?:\/\//i.test(url)) return false;
  if (/placeholder/i.test(url)) return false;
  return true;
}
