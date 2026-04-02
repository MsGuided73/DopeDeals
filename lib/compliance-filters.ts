/**
 * Centralized compliance filtering for restricted product terms.
 *
 * Used by:
 * - middleware.ts (URL path blocking)
 * - API routes (Supabase query filtering)
 *
 * Any changes to restricted terms should be made HERE ONLY.
 */

/** Terms blocked from URL paths (substance-related) */
export const RESTRICTED_PATH_TERMS = ['kratom', '7-oh', '7-hydroxy', 'mitragynine', '7-ohmz'] as const;

/** Terms filtered from product queries (substances + product types we don't sell) */
export const RESTRICTED_PRODUCT_TERMS = ['kratom', '7-oh', '7-hydroxy', 'mitragynine', '7-ohmz', 'tincture', 'salve'] as const;

/** Check if a URL path contains restricted terms */
export function isRestrictedPath(pathname: string): boolean {
  const lower = pathname.toLowerCase();
  return RESTRICTED_PATH_TERMS.some(term => lower.includes(term));
}

/**
 * Apply restricted product filters to a Supabase query.
 * Filters out products whose name or description contain restricted terms.
 *
 * @param query - A Supabase query builder (e.g. supabase.from('products').select('*'))
 * @param columns - Columns to filter on (defaults to name + description)
 * @returns The same query with .not() filters applied
 */
export function applyRestrictedProductFilter<T>(
  query: T,
  columns: string[] = ['name', 'description']
): T {
  let filtered = query;
  for (const col of columns) {
    for (const term of RESTRICTED_PRODUCT_TERMS) {
      filtered = (filtered as any).not(col, 'ilike', `%${term}%`);
    }
  }
  return filtered;
}
