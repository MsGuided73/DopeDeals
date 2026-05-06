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

// Helper function to get image URL from either field name
function getImageUrl(product: any): string | null {
  const urls = parseImageUrls(product.imageUrl || product.image_url);
  return urls[0] || null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '2');

    // Get featured products with higher prices for staff picks - NO stock filtering
    let staffQuery = supabase
      .from('main_site_products')
      .select(`
        id, name, description, short_description, our_price,
        image_url, sku, stock_quantity, brand_name, materials,
        featured, created_at
      `)
      .eq('is_active', true) // Only show active products on the site
      .eq('nicotine_product', false)
      .eq('tobacco_product', false);

    // Apply centralized compliance filters
    staffQuery = applyRestrictedProductFilter(staffQuery);

    // Hide products without a usable image (mid-import state).
    staffQuery = applyImageRequiredFilter(staffQuery);

    const { data: products, error } = await staffQuery
      .eq('featured', true)
      .gte('our_price', 50) // Higher priced items for staff picks
      .order('our_price', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching staff picks:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If no featured products, get high-value products
    if (!products || products.length < limit) {
      let fallbackQuery = supabase
        .from('main_site_products')
        .select(`
          id, name, description, short_description, our_price,
          image_url, sku, stock_quantity, brand_name, materials,
          featured, created_at
        `)
        .eq('is_active', true) // Only show active products on the site
        .eq('nicotine_product', false)
        .eq('tobacco_product', false);

      // Apply centralized compliance filters
      fallbackQuery = applyRestrictedProductFilter(fallbackQuery);

      // Hide products without a usable image (mid-import state).
      fallbackQuery = applyImageRequiredFilter(fallbackQuery);

      const { data: fallbackProducts, error: fallbackError } = await fallbackQuery
        .gte('our_price', 30)
        .order('our_price', { ascending: false })
        .limit(limit);

      if (fallbackError) {
        console.error('Error fetching fallback staff picks:', fallbackError);
        return NextResponse.json({ error: fallbackError.message }, { status: 500 });
      }

      // Add discount calculations for staff picks
      const staffPicks = (fallbackProducts || []).map(product => {
        const normalizedImages = parseImageUrls(product.image_url);
        return {
          ...product,
          image_url: normalizedImages[0] || product.image_url, // Add snake_case version for legacy compatibility
          image_urls: normalizedImages,
          original_price: product.our_price * 1.5, // Simulate original price
          discount_percentage: Math.floor(Math.random() * 30) + 20, // 20-50% off
          is_staff_pick: true
        };
      });

      return NextResponse.json({
        products: staffPicks,
        message: 'Staff picks with simulated discounts',
        total: staffPicks.length
      });
    }

    // Add discount calculations for featured products
    const staffPicks = products.map(product => {
      const normalizedImages = parseImageUrls(product.image_url);
      return {
        ...product,
        image_url: normalizedImages[0] || product.image_url, // Add snake_case version for legacy compatibility
        image_urls: normalizedImages,
        original_price: product.our_price * 1.4,
        discount_percentage: Math.floor(Math.random() * 25) + 25, // 25-50% off
        is_staff_pick: true
      };
    });

    return NextResponse.json({
      products: staffPicks,
      message: 'Featured staff picks fetched successfully',
      total: staffPicks.length
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
