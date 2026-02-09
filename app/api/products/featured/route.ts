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

    // NO LIMIT: Return all products
    const limit = 5000;
    const offset = isNaN(parseInt(rawOffset || '0')) ? 0 : Math.max(0, parseInt(rawOffset || '0'));

    const effectiveLimit = limit;

    // Query featured products from main_site_products table
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
        nicotine_product,
        tobacco_product,
        created_at,
        updated_at
      `)
      .eq('is_active', true)
      .eq('featured', true)
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
      .not('name', 'ilike', '%battery%')
      .not('name', 'ilike', '%tincture%')
      .not('name', 'ilike', '%salve%')
      .not('description', 'ilike', '%tincture%')
      .not('description', 'ilike', '%salve%')
      .order('created_at', { ascending: false })
      .limit(effectiveLimit);

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: 'Failed to fetch featured products', details: error.message }, { status: 500 });
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

    // Remove duplicates while normalizing data
    const seenIds = new Set();
    const products = (rawProducts || [])
      .filter(product => {
        if (seenIds.has(product.id)) return false;
        seenIds.add(product.id);
        return true;
      })
      .map((product: any) => {
        const normalizedImages = Array.from(new Set([
          ...parseImageUrls(product.image_urls),
          ...parseImageUrls(product.image_url)
        ]));

        return {
          ...product,
          image_url: normalizedImages[0] || product.image_url,
          image_urls: normalizedImages
        };
      });

    // Get total count
    const { count } = await supabase
      .from('main_site_products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('featured', true)
      .not('name', 'ilike', '%kratom%')
      .not('name', 'ilike', '%7-oh%')
      .not('name', 'ilike', '%7-hydroxy%')
      .not('name', 'ilike', '%mitragynine%')
      .not('name', 'ilike', '%7-ohmz%')
      .not('name', 'ilike', '%battery%')
      .not('name', 'ilike', '%tincture%')
      .not('name', 'ilike', '%salve%');

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
