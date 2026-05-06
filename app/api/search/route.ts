import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { normalizeProductImages } from "../../../lib/utils/image-utils";
import { applyRestrictedProductFilter } from "../../../lib/compliance-filters";
import { applyImageRequiredFilter } from "../../../lib/product-display-filters";

const Body = z.object({
  q: z.string().trim().max(200).optional().nullable(),
  category: z.string().trim().optional().nullable(),
  filters: z
    .object({
      brand_slug: z.array(z.string().trim()).optional(),
      price_min: z.number().nonnegative().optional(),
      price_max: z.number().nonnegative().optional(),
      in_stock_only: z.boolean().optional(),
      inventory_status: z
        .array(z.enum(["in_stock", "low_stock", "out_of_stock", "preorder"]))
        .optional(),
      materials: z.array(z.string().trim()).optional(),
      tags: z.array(z.string().trim()).optional(),
    })
    .optional(),
  sort: z
    .enum(["relevance", "price_asc", "price_desc", "newest", "popularity"])
    .optional()
    .default("relevance"),
  page: z.number().int().min(1).optional().default(1),
  page_size: z.number().int().min(1).max(1000).optional().default(48),
});

const PRICE_EXPR = "coalesce(sale_price, our_price)";
export const dynamic = "force-dynamic";

// Category-slug aliases. The DB has historically used multiple slug spellings
// for the same merchandising category (hyphen vs underscore, singular vs plural).
// When a user's free-text query or explicit category filter implies one of these
// groups, we want every variant returned, not just the literal match.
const CATEGORY_ALIASES: Array<{ test: RegExp; slugs: string[] }> = [
  {
    test: /\bdab[\s_-]*rigs?\b/i,
    slugs: ["dab-rig", "dab_rig", "dab-rigs", "dab_rigs"],
  },
];

function findAliasForQuery(text: string) {
  return CATEGORY_ALIASES.find((a) => a.test.test(text));
}
function findAliasForSlug(slug: string) {
  return CATEGORY_ALIASES.find((a) => a.slugs.includes(slug));
}

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { q, category, filters, sort, page, page_size } = parsed.data;
  const queryText = (q ?? "").trim();
  const useFts = queryText.length >= 2;
  const limit = page_size;
  const offset = (page - 1) * limit;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return NextResponse.json(
      { error: "Server misconfigured: missing Supabase env" },
      { status: 500 }
    );
  }
  const supabase = createClient(url, anon);

  try {
    let q1 = supabase
      .from("main_site_products")
      .select(
        [
          "id",
          "name",
          "brand_name",
          "brand_slug",
          "image_url",
          "sale_price",
          "our_price",
          "their_price",
          "inventory_status",
          "stock_quantity",
          "is_active",
          "nicotine_product",
          "tobacco_product",
          "created_at",
        ].join(","),
        { count: "exact" }
      )
      .eq("is_active", true);
    // Apply centralized compliance filters
    q1 = applyRestrictedProductFilter(q1);

    // Hide products without a usable image (mid-import state).
    // Note: previously, this endpoint intentionally surfaced imageless products
    // for the merch team. That decision was reversed — customer-facing search
    // should not show imageless SKUs. Use admin tooling to find them.
    q1 = applyImageRequiredFilter(q1);

    if (category) {
      const slugAlias = findAliasForSlug(category);
      if (slugAlias) {
        q1 = q1.in("category_slug", slugAlias.slugs);
      } else {
        q1 = q1.eq("category_slug", category);
      }
    }

    // Temporarily disable FTS until search_vec column is properly configured.
    // Description is intentionally excluded — it's a long text column with no
    // trigram index, and ILIKE %q% over it forces a full scan per row.
    //
    // category_slug is included so a free-text query like "bongs" matches
    // products by category, not just by literal text in name/short_description.
    // (Most Crave bongs, for example, have "Crave 8000" in the name and
    // category_slug='bongs' but never spell out the word "bong".)
    //
    // Multi-word queries ("crave bongs") are tokenized so each word must
    // match SOMEWHERE — in any of the 4 columns. This finds products where
    // one column has "crave" and another has "bongs", which a single
    // literal-substring search would miss.
    if (queryText) {
      const queryAlias = findAliasForQuery(queryText);
      const tokens = queryText
        .split(/\s+/)
        .map((t) => t.replace(/,/g, "")) // commas separate PostgREST or-clauses
        .filter((t) => t.length >= 2);
      for (const token of tokens) {
        const like = `%${token}%`;
        const conditions = [
          `name.ilike.${like}`,
          `brand_name.ilike.${like}`,
          `short_description.ilike.${like}`,
          `category_slug.ilike.${like}`,
        ];
        // If the overall query matches a category alias (e.g. "dab rigs"),
        // every slug variant satisfies this token — without this, plural
        // queries miss the singular slugs (`%rigs%` does not match `dab-rig`).
        if (queryAlias) {
          for (const slug of queryAlias.slugs) {
            conditions.push(`category_slug.eq.${slug}`);
          }
        }
        q1 = q1.or(conditions.join(","));
      }
    }

    if (filters?.brand_slug?.length) {
      // Case-insensitive: DB stores brands like "CRAVE" / "RooR" but the
      // bulletin links pass display-cased values ("Crave"). Build an OR
      // of `brand_name.ilike.<value>` per brand so we match regardless
      // of stored casing.
      const brandConds = filters.brand_slug
        .map((b) => `brand_name.ilike.${b.replace(/,/g, "")}`)
        .join(",");
      q1 = q1.or(brandConds);
    }
    if (typeof filters?.price_min === "number")
      q1 = q1.gte(PRICE_EXPR as any, filters.price_min as any);
    if (typeof filters?.price_max === "number")
      q1 = q1.lte(PRICE_EXPR as any, filters.price_max as any);
    if (filters?.in_stock_only)
      q1 = q1.in("inventory_status", ["in_stock", "low_stock"]);
    if (filters?.inventory_status?.length)
      q1 = q1.in("inventory_status", filters.inventory_status);

    if (filters?.materials?.length)
      (q1 as any) = (q1 as any).overlaps?.("materials", filters.materials) ?? q1;
    if (filters?.tags?.length)
      (q1 as any) = (q1 as any).overlaps?.("tags", filters.tags) ?? q1;

    switch (sort) {
      case "price_asc":
        q1 = q1
          .order(PRICE_EXPR as any, { ascending: true } as any)
          .order("image_url", { ascending: false, nullsFirst: false });
        break;
      case "price_desc":
        q1 = q1
          .order(PRICE_EXPR as any, { ascending: false } as any)
          .order("image_url", { ascending: false, nullsFirst: false });
        break;
      case "newest":
        q1 = q1
          .order("created_at", { ascending: false })
          .order("image_url", { ascending: false, nullsFirst: false });
        break;
      case "popularity":
        q1 = q1
          .order("is_bestseller", { ascending: false })
          .order("created_at", { ascending: false })
          .order("image_url", { ascending: false, nullsFirst: false });
        break;
      case "relevance":
      default:
        q1 = q1
          .order("featured", { ascending: false })
          .order("image_url", { ascending: false, nullsFirst: false })
          .order("created_at", { ascending: false });
    }

    q1 = q1.range(offset, offset + limit - 1);

    const { data, error, count } = await q1;
    if (error) throw error;

    const items = (data ?? []).map((r: any) => {
      // Normalize image data
      const { image_url, image_urls } = normalizeProductImages(r);

      return {
        id: r.id,
        name: r.name,
        brand_name: r.brand_name ?? null,
        brand_slug: r.brand_slug ?? null,
        image_url,
        image_urls,
        price: r.sale_price ?? r.our_price ?? null,
        inventory_status: r.inventory_status ?? null,
        stock_quantity: r.stock_quantity ?? null,
        is_active: !!r.is_active,
        created_at: r.created_at ?? null,
      };
    });

    // Calculate min and max prices from the current result set
    const prices = items
      .map(item => item.price)
      .filter(price => price !== null && typeof price === 'number' && !isNaN(price));

    const min_price = prices.length > 0 ? Math.min(...prices) : null;
    const max_price = prices.length > 0 ? Math.max(...prices) : null;

    return NextResponse.json({
      items,
      total: count ?? items.length,
      page,
      page_size: limit,
      min_price,
      max_price,
    });
  } catch (e: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[search] error:", e?.message ?? e);
    }
    return NextResponse.json(
      { error: "Search failed. Please try again." },
      { status: 500 }
    );
  }
}
