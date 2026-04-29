import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/products/vapes
 *
 * Fetches vape and cartridge products for the storefront.
 */
export async function GET(req: NextRequest) {
  try {
    // Keep `req` referenced so Next can tree-shake correctly and to allow future query params.
    void req;

    const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Supabase credentials not configured' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const MAX_PRODUCTS = 5000;

    const { data: rawProducts, error } = await supabase
      .from('main_site_products')
      .select(
        `
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
        category_id,
        category_slug,
        created_at,
        updated_at
      `
      )
      .eq('is_active', true)
      .or('variants_enabled.eq.false,source_parent.is.null') // Hide variant children of enabled groups
      .not('image_url', 'is', null)
      .neq('image_url', '')
      .not('name', 'ilike', '%battery%')
      .not('description', 'ilike', '%battery%')
      .in('category_slug', ['vapes', 'disposables', 'carts', 'cartridges'])
      .order('category_slug', { ascending: true })
      .order('brand_name', { ascending: true })
      .order('name', { ascending: true })
      .limit(MAX_PRODUCTS);

    if (error) {
      console.error('Error fetching vapes products:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

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
      const normalizedImages = Array.from(
        new Set([
          ...parseImageUrls(product.image_urls),
          ...parseImageUrls(product.image_url),
        ])
      );

      const parsedOurPrice =
        product.our_price !== null && product.our_price !== undefined
          ? Number(product.our_price)
          : null;
      const parsedSalePrice =
        product.sale_price !== null && product.sale_price !== undefined
          ? Number(product.sale_price)
          : null;

      return {
        id: product.id,
        name: product.name,
        our_price: parsedOurPrice,
        sale_price: parsedSalePrice,
        price: (parsedSalePrice && parsedOurPrice && parsedSalePrice < parsedOurPrice) ? parsedSalePrice : parsedOurPrice,
        compare_at_price: (parsedSalePrice && parsedOurPrice && parsedSalePrice < parsedOurPrice) ? parsedOurPrice : undefined,
        image_url: normalizedImages[0] || product.image_url,
        image_urls: normalizedImages,
        description: product.description,
        short_description: product.short_description,
        sku: product.sku,
        stock_quantity: product.stock_quantity || 0,
        is_active: product.is_active,
        featured: product.featured || false,
        brand_name: product.brand_name,
        brand: product.brand_name,
        category_id: product.category_id,
        category_slug: product.category_slug,
        created_at: product.created_at,
        updated_at: product.updated_at,
        inStock: (product.stock_quantity || 0) > 0,
      };
    });

    return NextResponse.json({
      products: transformedProducts,
      total: transformedProducts.length,
      message: 'Vapes products retrieved successfully',
    });
  } catch (error) {
    console.error('Error in vapes API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
