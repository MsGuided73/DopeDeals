import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { applyRestrictedProductFilter } from '../../../../lib/compliance-filters';
import { applyImageRequiredFilter } from '../../../../lib/product-display-filters';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

const normalizeProducts = (productList: any[]) => {
  return productList.map((product) => {
    // image_url is primary; image_urls is the legacy gallery (often dead sigdistro.com URLs).
    const normalizedImages = Array.from(new Set([
      ...parseImageUrls(product.image_url),
      ...parseImageUrls(product.image_urls)
    ]));

    return {
      ...product,
      image_url: normalizedImages[0] || product.image_url,
      image_urls: normalizedImages
    };
  });
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '4');

    // Get newest products with images
    let arrivalsQuery = supabase
      .from('main_site_products')
      .select(`
        id, name, description, short_description, our_price,
        image_url, image_urls, sku, stock_quantity, brand_name, materials,
        featured, created_at
      `)
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false);

    // Apply centralized compliance filters
    arrivalsQuery = applyRestrictedProductFilter(arrivalsQuery);

    // Hide products without a usable image (mid-import state).
    arrivalsQuery = applyImageRequiredFilter(arrivalsQuery);

    const { data: products, error } = await arrivalsQuery
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching new arrivals:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If we don't have enough products with images, get some without images as fallback
    if (!products || products.length < limit) {
      let fallbackArrivalsQuery = supabase
        .from('main_site_products')
        .select(`
          id, name, description, short_description, our_price,
          image_url, image_urls, sku, stock_quantity, brand_name, materials,
          featured, created_at
        `)
        .eq('is_active', true)
        .eq('nicotine_product', false)
        .eq('tobacco_product', false);

      // Apply centralized compliance filters
      fallbackArrivalsQuery = applyRestrictedProductFilter(fallbackArrivalsQuery);

      // Hide products without a usable image (mid-import state).
      fallbackArrivalsQuery = applyImageRequiredFilter(fallbackArrivalsQuery);

      const { data: fallbackProducts, error: fallbackError } = await fallbackArrivalsQuery
        .order('created_at', { ascending: false })
        .limit(limit);

      if (fallbackError) {
        console.error('Error fetching fallback products:', fallbackError);
        return NextResponse.json({ error: fallbackError.message }, { status: 500 });
      }

      const normalizedFallback = normalizeProducts(fallbackProducts || []);

      return NextResponse.json({
        products: normalizedFallback,
        message: 'Using fallback products (some may not have images)',
        total: normalizedFallback.length
      });
    }

    const normalizedArrivals = normalizeProducts(products || []);

    return NextResponse.json({
      products: normalizedArrivals,
      message: 'New arrivals fetched successfully',
      total: normalizedArrivals.length
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
