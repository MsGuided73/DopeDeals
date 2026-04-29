import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Accessories API Route
 *
 * Returns products with category_slug in: "ashtrays", "torch", "storage", "lighters"
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

    // Get accessories products with category_slug filtering
    const { data: rawProducts, error } = await supabase
      .from('main_site_products')
      .select(`
        id, name, description, short_description, our_price, sale_price,
        image_url, image_urls, sku, stock_quantity, is_active, featured,
        brand_name, category_id, category_slug, nicotine_product, tobacco_product,
        created_at, updated_at
      `)
      .eq('is_active', true) // Only active products
      .or('variants_enabled.eq.false,source_parent.is.null') // Hide variant children of enabled groups
      .not('image_url', 'is', null) // Must have image_url
      .neq('image_url', '') // Must not be empty string
      .or('category_slug.eq.ashtrays,category_slug.eq.torch,category_slug.eq.storage,category_slug.eq.lighters,category_slug.eq.accessories,category_slug.eq.accessory') // Category slug filtering
      .not('name', 'ilike', '%battery%') // No batteries
      .not('description', 'ilike', '%battery%')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching accessories products:', error);
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

    // Transform products to match expected interface
    const transformedProducts = (rawProducts || []).map((product: any) => {
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
        nicotine_product: product.nicotine_product,
        tobacco_product: product.tobacco_product,
        created_at: product.created_at,
        updated_at: product.updated_at
      };
    });

    return NextResponse.json({
      products: transformedProducts,
      total: transformedProducts.length,
      message: 'Accessories products retrieved successfully'
    });

  } catch (error) {
    console.error('Error in accessories API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
