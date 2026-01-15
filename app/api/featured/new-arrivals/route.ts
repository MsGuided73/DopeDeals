import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '4');

    // Get newest products with images - NO stock filtering during manual phase
    const { data: products, error } = await supabase
      .from('main_site_products')
      .select(`
        id, name, description, short_description, our_price,
        image_url, sku, stock_quantity, brand_name, materials,
        featured, created_at
      `)
      .eq('is_active', true) // Only show active products on the site
      .eq('nicotine_product', false)
      .eq('tobacco_product', false)
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
      .not('image_url', 'is', null)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching new arrivals:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If we don't have enough products with images, get some without images as fallback
    if (!products || products.length < limit) {
      const { data: fallbackProducts, error: fallbackError } = await supabase
        .from('main_site_products')
        .select(`
          id, name, description, short_description, our_price,
          image_url, sku, stock_quantity, brand_name, materials,
          featured, created_at
        `)
        .eq('is_active', true) // Only show active products on the site
        .eq('nicotine_product', false)
        .eq('tobacco_product', false)
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
        .order('created_at', { ascending: false })
        .limit(limit);

      if (fallbackError) {
        console.error('Error fetching fallback products:', fallbackError);
        return NextResponse.json({ error: fallbackError.message }, { status: 500 });
      }

      return NextResponse.json({
        products: fallbackProducts || [],
        message: 'Using fallback products (some may not have images)',
        total: fallbackProducts?.length || 0
      });
    }

    return NextResponse.json({
      products: products || [],
      message: 'New arrivals fetched successfully',
      total: products?.length || 0
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
