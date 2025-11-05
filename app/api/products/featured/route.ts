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

    // Query featured products from main_site_products table
    const { data: products, error } = await supabase
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
        slug,
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
      .order('created_at', { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: 'Failed to fetch featured products', details: error.message }, { status: 500 });
    }

    // Get total count for pagination info
    const { count } = await supabase
      .from('main_site_products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('featured', true);

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
