import { createSupabaseClient } from "./supabase-client-factory";

/**
 * Server-side fetcher for Higher Learning article recommendations.
 *
 * Pulls editor-curated picks from `article_recommended_products`, joined to
 * `main_site_products` for the product card data plus the supersession
 * pointer + note. Returns one ordered list per slot.
 *
 * Per DATABASE_POLICY.md, queries `main_site_products` only and does NOT
 * filter by `is_active` (Zoho stock is disconnected; that filter would hide
 * live SKUs).
 *
 * Editorial fallback: if the DB has no rows for a slot but the caller passes
 * `fallbackProductSlugs[slot]`, the helper looks those up by `slug` and
 * returns them in the order given. Lets a brand-new article render correctly
 * before any DB rows exist; DB rows take precedence as soon as they're added.
 */

export type ArticleSlot = "rail" | "inline";

export interface SupersessionInfo {
  /** Successor product (newer model). Null when no successor is set. */
  successor: ArticleProductCard | null;
  /** Optional editorial note (e.g., "2025 model with 30% larger chamber"). */
  note: string | null;
}

export interface ArticleProductCard {
  id: string;
  slug: string | null;
  name: string;
  imageUrl: string | null;
  price: number | null;
  salePrice: number | null;
  stockQuantity: number | null;
  /** Avg star rating, 0–5; null when unknown. */
  averageRating: number | null;
  /** Total reviews count; null when unknown. */
  reviewCount: number | null;
  supersession: SupersessionInfo | null;
}

const PRODUCT_COLUMNS = `
  id,
  slug,
  name,
  image_url,
  our_price,
  sale_price,
  stock_quantity,
  superseded_by_product_id,
  supersession_note
`;

interface RawProductRow {
  id: string;
  slug: string | null;
  name: string;
  image_url: string | null;
  our_price: number | string | null;
  sale_price: number | string | null;
  stock_quantity: number | null;
  superseded_by_product_id: string | null;
  supersession_note: string | null;
}

const toNumber = (v: number | string | null | undefined): number | null => {
  if (v === null || v === undefined) return null;
  const n = typeof v === "number" ? v : parseFloat(v);
  return Number.isFinite(n) ? n : null;
};

const toCard = (
  row: RawProductRow,
  ratings: Map<string, { avg: number; count: number }>,
  successorMap: Map<string, ArticleProductCard>,
): ArticleProductCard => {
  const rating = ratings.get(row.id);
  const successor = row.superseded_by_product_id
    ? successorMap.get(row.superseded_by_product_id) ?? null
    : null;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    imageUrl: row.image_url,
    price: toNumber(row.our_price),
    salePrice: toNumber(row.sale_price),
    stockQuantity: row.stock_quantity,
    averageRating: rating ? rating.avg : null,
    reviewCount: rating ? rating.count : null,
    supersession: row.superseded_by_product_id
      ? { successor, note: row.supersession_note }
      : null,
  };
};

export interface FetchArticleRecommendationsOptions {
  articleSlug: string;
  fallbackProductSlugs?: Partial<Record<ArticleSlot, string[]>>;
}

export interface ArticleRecommendations {
  rail: ArticleProductCard[];
  inline: ArticleProductCard[];
}

export async function fetchArticleRecommendations(
  opts: FetchArticleRecommendationsOptions,
): Promise<ArticleRecommendations> {
  const supabase = await createSupabaseClient();

  // 1. Pull editor picks for this article, both slots in one query.
  const { data: picks } = await supabase
    .from("article_recommended_products")
    .select("product_id, slot, position")
    .eq("article_slug", opts.articleSlug)
    .order("position", { ascending: true });

  const pickIdsBySlot: Record<ArticleSlot, string[]> = { rail: [], inline: [] };
  for (const row of (picks ?? []) as Array<{ product_id: string; slot: ArticleSlot; position: number }>) {
    if (row.slot === "rail" || row.slot === "inline") {
      pickIdsBySlot[row.slot].push(row.product_id);
    }
  }

  // 2. Apply fallback slugs per slot when the DB has nothing for that slot.
  const fallbackSlugsBySlot: Record<ArticleSlot, string[]> = {
    rail: pickIdsBySlot.rail.length === 0 ? opts.fallbackProductSlugs?.rail ?? [] : [],
    inline: pickIdsBySlot.inline.length === 0 ? opts.fallbackProductSlugs?.inline ?? [] : [],
  };

  // 3. Resolve fallback slugs to ids in a single query.
  const allFallbackSlugs = Array.from(
    new Set([...fallbackSlugsBySlot.rail, ...fallbackSlugsBySlot.inline]),
  );
  let slugToId = new Map<string, string>();
  if (allFallbackSlugs.length > 0) {
    const { data: slugRows } = await supabase
      .from("main_site_products")
      .select("id, slug")
      .in("slug", allFallbackSlugs);
    for (const r of (slugRows ?? []) as Array<{ id: string; slug: string }>) {
      slugToId.set(r.slug, r.id);
    }
  }

  const fallbackIdsBySlot: Record<ArticleSlot, string[]> = {
    rail: fallbackSlugsBySlot.rail.map((s) => slugToId.get(s)).filter(Boolean) as string[],
    inline: fallbackSlugsBySlot.inline.map((s) => slugToId.get(s)).filter(Boolean) as string[],
  };

  const idsBySlot: Record<ArticleSlot, string[]> = {
    rail: pickIdsBySlot.rail.length > 0 ? pickIdsBySlot.rail : fallbackIdsBySlot.rail,
    inline: pickIdsBySlot.inline.length > 0 ? pickIdsBySlot.inline : fallbackIdsBySlot.inline,
  };

  const allIds = Array.from(new Set([...idsBySlot.rail, ...idsBySlot.inline]));
  if (allIds.length === 0) {
    return { rail: [], inline: [] };
  }

  // 4. Fetch product rows + their potential successors in one round-trip each.
  const { data: productRows } = await supabase
    .from("main_site_products")
    .select(PRODUCT_COLUMNS)
    .in("id", allIds);

  const rows = (productRows ?? []) as RawProductRow[];
  const successorIds = Array.from(
    new Set(rows.map((r) => r.superseded_by_product_id).filter(Boolean) as string[]),
  );

  let successorRows: RawProductRow[] = [];
  if (successorIds.length > 0) {
    const { data } = await supabase
      .from("main_site_products")
      .select(PRODUCT_COLUMNS)
      .in("id", successorIds);
    successorRows = (data ?? []) as RawProductRow[];
  }

  // 5. Pull review aggregates for everything we're rendering (primaries + successors).
  const ratingTargetIds = Array.from(new Set([...allIds, ...successorIds]));
  const ratings = new Map<string, { avg: number; count: number }>();
  if (ratingTargetIds.length > 0) {
    const { data: ratingRows } = await supabase
      .from("product_review_summary")
      .select("product_id, average_rating, review_count")
      .in("product_id", ratingTargetIds);
    for (const r of (ratingRows ?? []) as Array<{
      product_id: string;
      average_rating: number | string | null;
      review_count: number | null;
    }>) {
      const avg = toNumber(r.average_rating);
      if (avg !== null) {
        ratings.set(r.product_id, { avg, count: r.review_count ?? 0 });
      }
    }
  }

  // 6. Build successor cards first (no nested supersession — one level only).
  const successorMap = new Map<string, ArticleProductCard>();
  for (const sRow of successorRows) {
    successorMap.set(sRow.id, {
      id: sRow.id,
      slug: sRow.slug,
      name: sRow.name,
      imageUrl: sRow.image_url,
      price: toNumber(sRow.our_price),
      salePrice: toNumber(sRow.sale_price),
      stockQuantity: sRow.stock_quantity,
      averageRating: ratings.get(sRow.id)?.avg ?? null,
      reviewCount: ratings.get(sRow.id)?.count ?? null,
      supersession: null,
    });
  }

  // 7. Build primary cards keyed by id, preserving the editor's order per slot.
  const cardById = new Map<string, ArticleProductCard>();
  for (const r of rows) {
    cardById.set(r.id, toCard(r, ratings, successorMap));
  }

  return {
    rail: idsBySlot.rail.map((id) => cardById.get(id)).filter(Boolean) as ArticleProductCard[],
    inline: idsBySlot.inline.map((id) => cardById.get(id)).filter(Boolean) as ArticleProductCard[],
  };
}
