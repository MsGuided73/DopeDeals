import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Pipes API Route
 *
 * Returns products with category_slug = "pipes"
 * Filters: Active products only, valid images, no batteries
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    // NO LIMIT: Return all products
    const limit = 5000;

    // Get pipes products with comprehensive filtering
    const { data: rawProducts, error } = await supabase
      .from('main_site_products')
      .select(`
        id, name, description, short_description, our_price, sale_price,
        image_url, image_urls, sku, stock_quantity, is_active, featured,
        brand_name, category_id, category_slug, created_at, updated_at
      `)
      .eq('is_active', true) // Only active products
      .not('image_url', 'is', null) // Must have image_url
      .neq('image_url', '') // Must not be empty string
      .not('name', 'ilike', '%battery%') // No batteries
      // Removed Supabase description filter because it silently drops products with NULL descriptions
      // ── Strict slug-based filter ──────────────────────────────────────────
      // Only products explicitly tagged category_slug = 'pipes' appear here.
      // Water pipes (bongs) are excluded because they carry category_slug = 'bongs'.
      // If this returns 0 results, it means no hand-pipe products have been
      // ingested / tagged yet — the catalog needs to be updated, not the query.
      .eq('category_slug', 'pipes')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching pipes products:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

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

    // Transform products to match expected interface and filter batteries in description safely
    const transformedProducts = (rawProducts || [])
      .filter((product: any) => {
        // Filter out batteries from description (handling nulls safely)
        if (product.description && product.description.toLowerCase().includes('battery')) {
          return false;
        }
        return true;
      })
      .map((product: any) => {
      const normalizedImages = Array.from(new Set([
        ...parseImageUrls(product.image_urls),
        ...parseImageUrls(product.image_url)
      ]));

      return {
        id: product.id,
        name: product.name,
        price: (product.sale_price && product.sale_price < product.our_price) ? product.sale_price : product.our_price,
        compare_at_price: (product.sale_price && product.sale_price < product.our_price) ? product.our_price : undefined,
        our_price: product.our_price,
        sale_price: product.sale_price,
        image_url: normalizedImages[0] || product.image_url,
        image_urls: normalizedImages,
        description: product.description,
        short_description: product.short_description,
        sku: product.sku,
        stock_quantity: product.stock_quantity || 0,
        is_active: product.is_active,
        featured: product.featured || false,
        brand_name: product.brand_name,
        category_id: product.category_id,
        category_slug: product.category_slug,
        created_at: product.created_at,
        updated_at: product.updated_at
      };
    });

    return NextResponse.json({
      products: transformedProducts,
      total: transformedProducts.length,
      message: 'Pipes products retrieved successfully'
    });

  } catch (error) {
    console.error('Error in pipes API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
