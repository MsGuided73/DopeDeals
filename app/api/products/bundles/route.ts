import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import * as path from 'path';

if (process.env.NODE_ENV === 'development') {
  const envPath = path.resolve(process.cwd(), '.env.local');
  config({ path: envPath });
}

export async function GET() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase credentials not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: products, error } = await supabase
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
        brand_name,
        category_slug,
        subcategory_slug
      `)
      .eq('is_active', true)
      .or('variants_enabled.eq.false,source_parent.is.null') // Hide variant children of enabled groups
      .or(
        'category_slug.eq.bundles,' +
        'subcategory_slug.eq.bundles,' +
        'name.ilike.%bundle%'
      )
      .order('featured', { ascending: false })
      .order('name', { ascending: true })
      .limit(5000);

    if (error) {
      console.error('Error fetching bundle products:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const transformedProducts = (products || []).map((product: any) => {
      const parsedOurPrice = product.our_price ? parseFloat(product.our_price) : 0;
      const parsedSalePrice = product.sale_price ? parseFloat(product.sale_price) : undefined;
      
      return {
        ...product,
        price: (parsedSalePrice && parsedSalePrice < parsedOurPrice) ? parsedSalePrice : parsedOurPrice,
        compare_at_price: (parsedSalePrice && parsedSalePrice < parsedOurPrice) ? parsedOurPrice : undefined,
        inStock: (product.stock_quantity || 0) > 0
      };
    });

    return NextResponse.json({ products: transformedProducts });
  } catch (err) {
    console.error('Unexpected error in /api/products/bundles:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
