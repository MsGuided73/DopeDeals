/**
 * Single source of truth for which product categories are treated as
 * consumables — i.e. ingestible/inhalable items that legally require the
 * THC / FDA disclaimer (per Dana, compliance — see ThcDisclaimer component).
 *
 * Hardware (bongs, pipes, dab rigs, accessories, bundles) is NOT consumable
 * and must NOT carry the disclaimer.
 *
 * Slugs are stored in main_site_products.category_slug. Both kebab and
 * underscore variants are accepted because import sources have drifted
 * (see app/api/products/dab-rigs-and-tools/route.ts for prior precedent).
 */
export const CONSUMABLE_CATEGORY_SLUGS = [
  'flower',
  'thca-flower',
  'thca_flower',
  'pre-rolls',
  'pre_rolls',
  'thca-pre-rolls',
  'thca_pre_rolls',
  'vapes',
  'vape',
  'carts',
  'cartridges',
  'edibles',
  'edible',
  'mushrooms',
  'mushroom',
  'shrooms',
  'thca',
  'concentrates',
  'concentrate',
  'nitrous-oxide',
  'nitrous_oxide',
  'tinctures',
  'tincture',
] as const;

const CONSUMABLE_SET = new Set<string>(CONSUMABLE_CATEGORY_SLUGS);

export function isConsumableCategorySlug(slug: string | null | undefined): boolean {
  if (!slug) return false;
  return CONSUMABLE_SET.has(slug.toLowerCase());
}
