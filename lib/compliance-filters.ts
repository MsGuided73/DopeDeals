/**
 * Centralized compliance filtering for restricted product terms and state-level restrictions.
 *
 * Used by:
 * - middleware.ts (URL path blocking)
 * - API routes (Supabase query filtering)
 * - Checkout compliance checks (state restrictions)
 * - Zoho/ShipStation compliance sync
 *
 * Any changes to restricted terms or state lists should be made HERE ONLY.
 */

// ─── Restricted Terms ───────────────────────────────────────────────

/** Terms blocked from URL paths (substance-related) */
export const RESTRICTED_PATH_TERMS = ['kratom', '7-oh', '7-hydroxy', 'mitragynine', '7-ohmz'] as const;

// ─── State-Level Restrictions ───────────────────────────────────────
// These are fallbacks when compliance_rules table data is unavailable.
// Primary source of truth is the compliance_rules table in Supabase.

/** States where THCA products cannot be shipped (fallback if no DB rule exists) */
export const THCA_RESTRICTED_STATES = ['HI', 'ID', 'MN', 'OR', 'RI', 'UT', 'VT', 'AR', 'CA'] as const;

/** States with PACT Act tobacco/nicotine shipping restrictions */
export const PACT_ACT_RESTRICTED_STATES = ['UT', 'AL', 'AK', 'CT', 'HI', 'ME', 'NY', 'VT', 'WA'] as const;

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
export function applyReshtrictedProductFilter(
  query: any,
  columns: string[] = ['name', 'description']
): any {
  let filtered = query;
  for (const col of columns) {
    for (const term of RESTRICTED_PRODUCT_TERMS) {
      filtered = (filtered as any).not(col, 'ilike', `%${term}%`);
    }
  }
  return filtered;
}
