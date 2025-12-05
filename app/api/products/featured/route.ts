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

    // Parse query parameters with validation
    const url = new URL(req.url);
    const rawLimit = url.searchParams.get('limit');
    const rawOffset = url.searchParams.get('offset');

    // Parse and validate limit: default 12, clamp to 1-100
    const parsedLimit = rawLimit ? parseInt(rawLimit, 10) : 12;
    const limit = isNaN(parsedLimit) ? 12 : Math.max(1, Math.min(100, parsedLimit));

    // Parse and validate offset: default 0, ensure non-negative
    const parsedOffset = rawOffset ? parseInt(rawOffset, 10) : 0;
    const offset = isNaN(parsedOffset) ? 0 : Math.max(0, Math.floor(parsedOffset));

    // Use the requested limit (no artificial cap for featured products)
    const effectiveLimit = limit;

    // Query featured products from main_site_products table
    // Filter for products with valid image URLs (either image_url or image_urls array)
    // Exclude battery products as they are not exciting
    const { data: rawProducts, error } = await supabase
      .from('main_site_products')
      .select(`
        id,
        name,
        description,
        short_description,
        our_price,
        sale_price,
        image_url,
        image_urls,
        sku,
        stock_quantity,
        is_active,
        featured,
        brand_id,
        brand_name,
        category_id,
        created_at,
        updated_at
      `)
      .eq('is_active', true)
      .eq('featured', true)
      .or('name.not.ilike.%battery%,description.not.ilike.%battery%,short_description.not.ilike.%battery%')
      .order('created_at', { ascending: false })
      .limit(effectiveLimit)
      .range(offset, offset + effectiveLimit - 1);

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: 'Failed to fetch featured products', details: error.message }, { status: 500 });
    }

    // Apply post-query filter for image validation (OR logic: valid image_url OR non-empty image_urls)
    const products = (rawProducts || []).filter(product => {
      const hasValidImageUrl = product.image_url &&
        product.image_url !== '' &&
        product.image_url !== 'null' &&
        product.image_url !== 'undefined' &&
        product.image_url.trim() !== '';

      const hasValidImageUrls = Array.isArray(product.image_urls) &&
        product.image_urls.length > 0;

      return hasValidImageUrl || hasValidImageUrls;
    });

    // Get total count for pagination info (excluding batteries)
    const { count } = await supabase
      .from('main_site_products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('featured', true)
      .or('name.not.ilike.%battery%,description.not.ilike.%battery%,short_description.not.ilike.%battery%');

    return NextResponse.json({
      products: products || [],
      totalCount: count || 0,
      limit,
      offset,
      hasMore: count ? (offset + (products?.length || 0)) < count : false
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch featured products', details: String(error) }, { status: 500 });
  }
}
