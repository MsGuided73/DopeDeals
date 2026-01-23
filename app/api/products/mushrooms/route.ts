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

    // Get mushroom products with strict category_slug + brand filtering
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
      .in('category_slug', ['mushrooms', 'mush-gummies', 'mush-chocolate'])
      .in('brand_name', ['mMelt', 'Zoomers'])
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching mushroom products:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
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

    const transformedProducts = (rawProducts || []).map((product: any) => {
      const normalizedImages = Array.from(new Set([
        ...parseImageUrls(product.image_urls),
        ...parseImageUrls(product.image_url)
      ]));

      return {
        ...product,
        price: product.our_price,
        image: normalizedImages[0] || product.image_url,
        image_url: normalizedImages[0] || product.image_url,
        image_urls: normalizedImages
      };
    });

    return NextResponse.json({
      products: transformedProducts,
      total: transformedProducts.length
    });

  } catch (error) {
    console.error('Error in mushrooms API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
