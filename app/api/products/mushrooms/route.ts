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

    const mushroomSlugs = [
      'mushrooms',
      'mushroom',
      'mush-gummies',
      'mush-chocolate',
      'mushroom-chocolate',
      'mushroom-gummies',
      'mush',
      'shrooms'
    ];

    const { data: rawProducts, error } = await supabase
      .from('main_site_products')
      .select(`
        id, name, description, short_description, our_price, sale_price,
        image_url, image_urls, sku, stock_quantity, is_active, featured,
        brand_name, category_id, category_slug, created_at, updated_at,
        specs, meta_data
      `)
      .eq('is_active', true)
      .or('variants_enabled.eq.false,source_parent.is.null') // Hide variant children of enabled groups
      .in('category_slug', mushroomSlugs)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching mushroom products:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Helper to parse image URLs that might be comma-separated strings
    const parseImageUrls = (value?: string[] | string | null) => {
      if (!value) return [] as string[];
      
      let urls: string[] = [];
      if (Array.isArray(value)) {
        urls = value
          .flatMap((entry) => (typeof entry === 'string' ? entry.split(',') : [String(entry)]));
      } else if (typeof value === 'string') {
        urls = value.split(',');
      } else {
        urls = [String(value)];
      }

      return urls
        .map((entry) => entry.trim())
        // Ensure it's a valid URL or path and not "null", "undefined", etc.
        .filter(url => 
          url && 
          url !== '' && 
          url !== 'null' && 
          url !== 'undefined' && 
          url !== '[object Object]' &&
          (url.startsWith('http') || url.startsWith('/') || url.startsWith('./'))
        );
    };

    const transformedProducts = (rawProducts || []).map((p: any) => {
      const normalizedImages = Array.from(new Set([
        ...parseImageUrls(p.image_urls),
        ...parseImageUrls(p.image_url)
      ]));

      const finalImageUrl = normalizedImages[0] || null;

      // Determine if product is "new" (created in the last 30 days)
      const isNew = p.created_at 
        ? (new Date().getTime() - new Date(p.created_at).getTime()) < (30 * 24 * 60 * 60 * 1000)
        : false;

      return {
        ...p,
        price: (p.sale_price && p.sale_price < p.our_price) ? p.sale_price : p.our_price,
        compare_at_price: (p.sale_price && p.sale_price < p.our_price) ? p.our_price : undefined,
        brand: p.brand_name,
        image: finalImageUrl,
        image_url: finalImageUrl,
        image_urls: normalizedImages,
        isNew,
        // Ensure specs object exists for frontend filtering
        specs: p.specs || {},
        inStock: (p.stock_quantity || 0) > 0
      };
    });

    return NextResponse.json({
      products: transformedProducts,
      totalCount: transformedProducts.length
    });

  } catch (error) {
    console.error('Error in mushrooms API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
