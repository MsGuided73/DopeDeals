 
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const Body = z.object({
  q: z.string().trim().max(200).optional().nullable(),
  category: z.string().trim().optional().nullable(), // e.g., "pipes" | "bongs" | "dab-rigs"
  filters: z.object({
    brand_slug: z.array(z.string().trim()).optional(),
    price_min: z.number().nonnegative().optional(),
    price_max: z.number().nonnegative().optional(),
    in_stock_only: z.boolean().optional(),
    inventory_status: z
      .array(z.enum(["in_stock", "low_stock", "out_of_stock", "preorder"]))
      .optional(),
    materials: z.array(z.string().trim()).optional(), // text[]
    tags: z.array(z.string().trim()).optional(),      // text[]
  }).optional(),
  sort: z
    .enum(["relevance","price_asc","price_desc","newest","popularity"])
    .optional().default("relevance"),
  page: z.number().int().min(1).optional().default(1),
  page_size: z.number().int().min(1).max(100).optional().default(24),
});

const PRICE_EXPR = "coalesce(sale_price, our_price, their_price, fire_price)";
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
    // Base projection
    let q1 = supabase
      .from("main_site_products")
      .select(
        [
          "id","name","brand_name","brand_slug","image_url",
          "sale_price","our_price","their_price","fire_price",
          "inventory_status","stock_quantity","is_active","created_at",
        ].join(","),
        { count: "exact" }
      );

    // Optional category scoping
    if (category) q1 = q1.eq("category_slug", category);

    // Search
    if (useFts) {
      // FTS (tsvector index)
      // @ts-expect-error: textSearch exists at runtime
      q1 = (q1 as any).textSearch("search_vec", queryText, {
        type: "websearch",
        config: "english"
      });
    } else if (queryText) {
      // ILIKE fallback for short/fuzzy queries
      const like = `%${queryText}%`;
      q1 = q1.or([
        `name.ilike.${like}`,
        `description.ilike.${like}`,
        `short_description.ilike.${like}`,
      ].join(","));
    }

    // Filters
    if (filters?.brand_slug?.length) q1 = q1.in("brand_slug", filters.brand_slug);
    if (typeof filters?.price_min === "number") q1 = q1.gte(PRICE_EXPR as any, filters.price_min as any);
    if (typeof filters?.price_max === "number") q1 = q1.lte(PRICE_EXPR as any, filters.price_max as any);
    if (filters?.in_stock_only) q1 = q1.in("inventory_status", ["in_stock","low_stock"]);
    if (filters?.inventory_status?.length) q1 = q1.in("inventory_status", filters.inventory_status);

    // Array overlaps (materials/tags as text[])
    if (filters?.materials?.length) (q1 as any) = (q1 as any).overlaps?.("materials", filters.materials) ?? q1;
    if (filters?.tags?.length) (q1 as any) = (q1 as any).overlaps?.("tags", filters.tags) ?? q1;

    // Sorting
    switch (sort) {
      case "price_asc":  q1 = q1.order(PRICE_EXPR as any, { ascending: true } as any).order("image_url", { ascending: false, nullsFirst: false }); break;
      case "price_desc": q1 = q1.order(PRICE_EXPR as any, { ascending: false } as any).order("image_url", { ascending: false, nullsFirst: false }); break;
      case "newest":     q1 = q1.order("created_at", { ascending: false }).order("image_url", { ascending: false, nullsFirst: false }); break;
      case "popularity": q1 = q1.order("is_bestseller", { ascending: false }).order("created_at", { ascending: false }).order("image_url", { ascending: false, nullsFirst: false }); break;
      case "relevance":
      default:
        q1 = q1.order("featured_product", { ascending: false }).order("image_url", { ascending: false, nullsFirst: false }).order("created_at", { ascending: false });
    }

    q1 = q1.range(offset, offset + limit - 1);

    const { data, error, count } = await q1;
    if (error) throw error;

    const items = (data ?? []).map((r: any) => ({
      id: r.id,
      name: r.name,
      brand_name: r.brand_name ?? null,
      brand_slug: r.brand_slug ?? null,
      image_url: r.image_url ?? null,
      price: (r.sale_price ?? r.our_price ?? r.their_price ?? r.fire_price) ?? null,
      inventory_status: r.inventory_status ?? null,
      stock_quantity: r.stock_quantity ?? null,
      is_active: !!r.is_active,
      created_at: r.created_at ?? null,
    }));

    return NextResponse.json({
      items,
      total: count ?? items.length,
      page,
      page_size: limit,
    });
  } catch (e: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[search] error:", e?.message ?? e);
    }
    return NextResponse.json({ error: "Search failed. Please try again." }, { status: 500 });
  }
}
