import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
    // Direct Supabase connection
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase credentials not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse query parameters
    const url = new URL(req.url);
    const rawOffset = url.searchParams.get('offset');

    // NO LIMIT: Return all products for the category
    // Setting a high limit to effectively return all matching products
    const limit = 5000; 

    // Parse and validate offset: default 0, ensure non-negative
    const parsedOffset = rawOffset ? parseInt(rawOffset, 10) : 0;
    const offset = isNaN(parsedOffset) ? 0 : Math.max(0, Math.floor(parsedOffset));

    const effectiveLimit = limit;

    // Query nitrous oxide products from main_site_products table
    const { data: rawProducts, error } = await supabase
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
        category_slug,
        subcategory_slug,
        nicotine_product,
        tobacco_product,
        created_at,
        updated_at
      `)
      .eq('is_active', true)
      // STRICT: No Kratom or related substances

      .or('category_slug.ilike.%n2o%,category_slug.ilike.%nitrous%')
      .order('created_at', { ascending: false })
      .limit(effectiveLimit)
      .range(offset, offset + effectiveLimit - 1);

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: 'Failed to fetch nitrous oxide products', details: error.message }, { status: 500 });
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

    // Map products to include consistent pricing fields
    const products = (rawProducts || []).map((product: any) => {
      const normalizedImages = Array.from(new Set([
        ...parseImageUrls(product.image_urls),
        ...parseImageUrls(product.image_url)
      ]));

      return {
        ...product,
        price: parseFloat(product.our_price || 0),
        our_price: parseFloat(product.our_price || 0),
        vip_price: product.fire_price ? parseFloat(product.fire_price) : undefined,
        sale_price: product.sale_price ? parseFloat(product.sale_price) : undefined,
        compare_at_price: product.sale_price ? parseFloat(product.sale_price) : undefined,
        image_url: normalizedImages[0] || product.image_url,
        image_urls: normalizedImages
      };
    });

    // Get total count for pagination info
    const { count } = await supabase
      .from('main_site_products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

      .or('category_slug.ilike.%n2o%,category_slug.ilike.%nitrous%')

    return NextResponse.json({
      products: products,
      totalCount: count || 0,
      limit,
      offset,
      hasMore: count ? (offset + products.length) < count : false
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch nitrous oxide products', details: String(error) }, { status: 500 });
  }
}
