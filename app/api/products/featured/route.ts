import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { normalizeProductImages } from '../../../../lib/utils/image-utils';
import { applyRestrictedProductFilter } from '../../../../lib/compliance-filters';

// Module-level singleton — uses NEXT_PUBLIC_ vars baked in at build time (same pattern as /api/newest/products)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const rawOffset = url.searchParams.get('offset');

    const limitParam = url.searchParams.get('limit');
    let limit = limitParam ? parseInt(limitParam) : 20; // Default to 20 instead of 5000
    if (limit > 100) limit = 100; // Hard cap to prevent OOM
    const offset = isNaN(parseInt(rawOffset || '0')) ? 0 : Math.max(0, parseInt(rawOffset || '0'));

    const effectiveLimit = limit;

    // Query featured products from main_site_products table
    let featuredQuery = supabase
      .from('main_site_products')
      .select(`
        id,
        name,
        description,
        short_description,
        our_price,
        sale_price,
        fire_price,
        image_url,
        image_urls,
        sku,
        stock_quantity,
        is_active,
        featured,
        brand_id,
        brand_name,
        category_id,
        nicotine_product,
        tobacco_product,
        created_at,
        updated_at
      `)
      .eq('is_active', true)
      .eq('featured', true)
      .not('name', 'ilike', '%battery%');

    // Apply centralized compliance filters
    featuredQuery = applyRestrictedProductFilter(featuredQuery);

    const { data: rawProducts, error } = await featuredQuery
      .order('created_at', { ascending: false })
      .limit(effectiveLimit);

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: 'Failed to fetch featured products', details: error.message }, { status: 500 });
    }

    const products = (rawProducts || [])
      .map((product: any) => {
        const { image_url, image_urls } = normalizeProductImages(product);

        return {
          ...product,
          image_url,
          image_urls
        };
      });

    // Get total count
    let countQuery = supabase
      .from('main_site_products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('featured', true)
      .not('name', 'ilike', '%battery%');

    // Apply centralized compliance filters
    countQuery = applyRestrictedProductFilter(countQuery);

    const { count } = await countQuery;

    return NextResponse.json({
      products: products,
      totalCount: count || 0,
      limit: products.length,
      offset,
      hasMore: false
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch featured products', details: String(error) }, { status: 500 });
  }
}
