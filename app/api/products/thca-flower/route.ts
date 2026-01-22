import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase credentials not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { searchParams } = new URL(req.url);
    // NO LIMIT: Return all products
    const limit = 5000;

    // Get THCA flower products
    const { data: rawProducts, error } = await supabase
      .from('main_site_products')
      .select(`
        id, name, description, short_description, our_price, sale_price,
        image_url, image_urls, sku, stock_quantity, is_active, featured,
        brand_name, category_id, category_slug, created_at, updated_at
      `)
      .eq('is_active', true)
      .not('image_url', 'is', null)
      .neq('image_url', '')
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
      .eq('category_slug', 'flower')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching THCA flower products:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const transformedProducts = (rawProducts || []).map((product: any) => ({
      ...product,
      price: product.our_price,
      image: product.image_url
    }));

    return NextResponse.json({
      products: transformedProducts,
      total: transformedProducts.length
    });

  } catch (error) {
    console.error('Error in thca-flower API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
