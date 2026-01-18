import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import * as path from 'path';

// Load .env.local explicitly in development
if (process.env.NODE_ENV === 'development') {
  const envPath = path.resolve(process.cwd(), '.env.local');
  config({ path: envPath });
}

export async function GET(req: NextRequest) {
  try {
    // Ensure environment variables are loaded in development
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        message: 'Supabase credentials not configured'
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // NO LIMIT: Return all products
    const limit = 5000;

    // Search active products first
    const { data: rawProducts, error: allError } = await supabase
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
        materials,
        featured,
        is_active,
        specs,
        attributes,
        brand_name,
        category_id,
        categories,
        category_slug,
        subcategory_slug,
        seo_keywords,
        created_at
      `)
      .eq('is_active', true)
      .not('name', 'ilike', '%test%')
      .not('name', 'ilike', '%sample%')
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
      .or(
        `category_slug.eq.bubblers,` +
        `subcategory_slug.ilike.%bubbler%,` +
        `name.ilike.%bubbler%,` +
        `name.ilike.%bubbl%,` +
        `category_slug.ilike.%bubbler%,` +
        `category_slug.ilike.%bubbl%`
      )
      .order('created_at', { ascending: false })
      .limit(limit);

    if (allError) {
      console.error('Error fetching bubbler products:', allError);
      return NextResponse.json({
        message: 'Failed to fetch products',
        error: allError.message
      }, { status: 500 });
    }

    // Transform products to match our interface
    const transformedProducts = (rawProducts || []).map((product: any) => {
      // Determine bubbler style from name
      const name = product.name.toLowerCase();
      let style = 'Classic Bubbler';

      if (name.includes('mini') || name.includes('small')) style = 'Mini Bubbler';
      else if (name.includes('large') || name.includes('big')) style = 'Large Bubbler';
      else if (name.includes('scientific') || name.includes('beaker')) style = 'Scientific Bubbler';
      else if (name.includes('hammer')) style = 'Hammer Bubbler';
      else if (name.includes('sidecar')) style = 'Sidecar Bubbler';
      else if (name.includes('showerhead')) style = 'Showerhead Bubbler';

      // Determine size from name or specs
      let size = 'Medium';
      if (name.includes('mini') || name.includes('small')) size = 'Small';
      else if (name.includes('large') || name.includes('big')) size = 'Large';
      else if (name.includes('xl') || name.includes('extra large')) size = 'XL';

      return {
        ...product,
        price: parseFloat(product.our_price),
        our_price: parseFloat(product.our_price),
        vip_price: product.fire_price ? parseFloat(product.fire_price) : undefined,
        sale_price: product.sale_price ? parseFloat(product.sale_price) : undefined,
        compare_at_price: product.sale_price ? parseFloat(product.sale_price) : undefined,
        brand: product.brand_name,
        material: product.materials?.[0] || 'Glass',
        style,
        size,
        inStock: (product.stock_quantity || 0) > 0,
        category: 'Bubblers'
      };
    });

    return NextResponse.json({
      message: 'Bubbler products loaded successfully',
      totalCount: transformedProducts.length,
      products: transformedProducts
    });

  } catch (error) {
    console.error('Error fetching bubbler products:', error);
    return NextResponse.json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
