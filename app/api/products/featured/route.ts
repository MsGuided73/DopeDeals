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
    // Fetch extra to account for duplicates
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
        nicotine_product,
        tobacco_product,
        created_at,
        updated_at
      `)
      .eq('is_active', true)
      .eq('featured', true)
      .or('name.not.ilike.%battery%,description.not.ilike.%battery%,short_description.not.ilike.%battery%') // No batteries
      .order('created_at', { ascending: false })
      .limit(effectiveLimit * 2) // Fetch extra to ensure we have enough after deduplication
      .range(offset, offset + (effectiveLimit * 2) - 1);

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: 'Failed to fetch featured products', details: error.message }, { status: 500 });
    }

    // Remove duplicates by ID, name, and SKU (ensure unique products only)
    const seenIds = new Set<number>();
    const seenNames = new Set<string>();
    const seenSkus = new Set<string>();
    const uniqueProducts = (rawProducts || []).filter(product => {
      // Check ID duplicates
      if (seenIds.has(product.id)) {
        return false;
      }
      
      // Check name duplicates (normalize by trimming and lowercasing)
      const normalizedName = product.name?.trim().toLowerCase();
      if (normalizedName && seenNames.has(normalizedName)) {
        return false;
      }
      
      // Check SKU duplicates (if SKU exists)
      if (product.sku && seenSkus.has(product.sku)) {
        return false;
      }
      
      // Add to tracking sets
      seenIds.add(product.id);
      if (normalizedName) seenNames.add(normalizedName);
      if (product.sku) seenSkus.add(product.sku);
      
      return true;
    });

    // Take only the requested limit
    const products = uniqueProducts.slice(0, effectiveLimit);

    // Get total count for pagination info (excluding batteries)
    const { count } = await supabase
      .from('main_site_products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('featured', true)
      .or('name.not.ilike.%battery%,description.not.ilike.%battery%,short_description.not.ilike.%battery%');

    console.log(`🎯 Featured Products API: Retrieved ${products.length} unique featured products (no batteries, no duplicates)`);

    return NextResponse.json({
      products: products,
      totalCount: count || 0,
      limit,
      offset,
      hasMore: count ? (offset + products.length) < count : false
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch featured products', details: String(error) }, { status: 500 });
  }
}
