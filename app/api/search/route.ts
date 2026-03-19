import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

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
      .not("image_url", "is", null)
      .neq("image_url", "")
      // STRICT: No Kratom or related substances
      .not('name', 'ilike', '%kratom%')
      .not('name', 'ilike', '%7-oh%')
      .not('name', 'ilike', '%7-hydroxy%')
      .not('name', 'ilike', '%mitragynine%')
      .not('name', 'ilike', '%7-ohmz%')
      .not('description', 'ilike', '%kratom%')
      .not('description', 'ilike', '%7-oh%')
      .not('description', 'ilike', '%7-hydroxy%')
      .not('description', 'ilike', '%mitragynine%')
      .not('description', 'ilike', '%7-ohmz%')
      .not('name', 'ilike', '%tincture%')
      .not('name', 'ilike', '%salve%')
      .not('description', 'ilike', '%tincture%')
      .not('description', 'ilike', '%salve%')
      .eq('is_active', true);

    if (category) q1 = q1.eq("category_slug", category);

    // Temporarily disable FTS until search_vec column is properly configured
    if (queryText) {
      const like = `%${queryText}%`;
      q1 = q1.or([
        `name.ilike.${like}`,
        `description.ilike.${like}`,
        `short_description.ilike.${like}`,
      ].join(","));
    }

    if (filters?.brand_slug?.length) q1 = q1.in("brand_name", filters.brand_slug);
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
      // Helper to parse image URLs that might be comma-separated strings
      const parseImageUrls = (value?: string[] | string | null) => {
        if (!value) return [] as string[];
        if (Array.isArray(value)) {
          return value
            .flatMap((entry) => (typeof entry === 'string' ? entry.split(',') : [entry]))
            .map((entry) => (typeof entry === 'string' ? entry.trim() : entry))
            .filter(Boolean);
        }
        if (typeof value !== 'string') return [value].filter(Boolean);
        return value
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean);
      };

      const normalizedImages = parseImageUrls(r.image_url);

      return {
        id: r.id,
        name: r.name,
        brand_name: r.brand_name ?? null,
        brand_slug: r.brand_slug ?? null,
        image_url: normalizedImages[0] || r.image_url || null,
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
