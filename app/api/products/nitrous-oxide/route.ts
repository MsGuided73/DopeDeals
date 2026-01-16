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

    // Use the requested limit (no artificial cap for nitrous products)
    const effectiveLimit = limit;

    // Query nitrous oxide products from main_site_products table
    // Filter by nitrous-related keywords in product names only
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
      .or('name.ilike.%whip%,name.ilike.%n2o%,name.ilike.%nitrous%,name.ilike.%nos%,name.ilike.%laughing%,brand_name.ilike.%whip%,brand_name.ilike.%n2o%,brand_name.ilike.%nitrous%,brand_name.ilike.%nos%,brand_name.ilike.%laughing%,category_slug.ilike.%nitrous%,category_slug.ilike.%n2o%,subcategory_slug.ilike.%nitrous%,subcategory_slug.ilike.%n2o%,categories.cs.["nitrous"]')
      .order('created_at', { ascending: false })
      .limit(effectiveLimit * 2) // Fetch extra to account for duplicates
      .range(offset, offset + (effectiveLimit * 2) - 1);

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: 'Failed to fetch nitrous oxide products', details: error.message }, { status: 500 });
    }

    console.log('DEBUG - Raw Nitrous Products Count:', rawProducts?.length || 0);
    if (rawProducts && rawProducts.length > 0) {
      console.log('DEBUG - Sample Nitrous Names:', rawProducts.slice(0, 5).map(p => p.name));
    }

    // Map products to include consistent pricing fields
    const products = (rawProducts || []).map((product: any) => ({
      ...product,
      price: parseFloat(product.our_price || 0),
      our_price: parseFloat(product.our_price || 0),
      vip_price: product.fire_price ? parseFloat(product.fire_price) : undefined,
      sale_price: product.sale_price ? parseFloat(product.sale_price) : undefined,
      compare_at_price: product.sale_price ? parseFloat(product.sale_price) : undefined
    }));

    // Get total count for pagination info
    const { count } = await supabase
      .from('main_site_products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
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
      .or('name.ilike.%whip%,name.ilike.%n2o%,name.ilike.%nitrous%,name.ilike.%nos%,name.ilike.%laughing%,brand_name.ilike.%whip%,brand_name.ilike.%n2o%,brand_name.ilike.%nitrous%,brand_name.ilike.%nos%,brand_name.ilike.%laughing%,category_slug.ilike.%nitrous%,category_slug.ilike.%n2o%,subcategory_slug.ilike.%nitrous%,subcategory_slug.ilike.%n2o%,categories.cs.{"nitrous"}');

    console.log(`🌀 Nitrous Oxide API: Retrieved ${products.length} unique nitrous oxide products (no duplicates)`);

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
