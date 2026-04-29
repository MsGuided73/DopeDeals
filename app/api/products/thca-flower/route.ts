import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { applyRestrictedProductFilter } from '../../../../lib/compliance-filters';

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
    let flowerQuery = supabase
      .from('main_site_products')
      .select(`
        id, name, description, short_description, our_price, sale_price,
        image_url, image_urls, sku, stock_quantity, is_active, featured,
        brand_name, category_id, category_slug, created_at, updated_at
      `)
      .eq('is_active', true)
      .or('variants_enabled.eq.false,source_parent.is.null') // Hide variant children of enabled groups
      .not('image_url', 'is', null)
      .neq('image_url', '');

    // Apply centralized compliance filters
    flowerQuery = applyRestrictedProductFilter(flowerQuery);

    const { data: rawProducts, error } = await flowerQuery
      .eq('category_slug', 'flower')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching THCA flower products:', error);
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
        price: (product.sale_price && product.sale_price < product.our_price) ? product.sale_price : product.our_price,
        compare_at_price: (product.sale_price && product.sale_price < product.our_price) ? product.our_price : undefined,
        image: normalizedImages[0] || product.image_url,
        image_url: normalizedImages[0] || product.image_url,
        image_urls: normalizedImages,
        inStock: (product.stock_quantity || 0) > 0
      };
    });

    return NextResponse.json({
      products: transformedProducts,
      total: transformedProducts.length
    });

  } catch (error) {
    console.error('Error in thca-flower API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
