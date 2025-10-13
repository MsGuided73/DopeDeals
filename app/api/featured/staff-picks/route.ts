import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper function to get image URL from either field name
function getImageUrl(product: any): string | null {
  return product.imageUrl || product.image_url || null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '2');

    // Get featured products with higher prices for staff picks
    const { data: products, error } = await supabase
      .from('main_site_products')
      .select(`
        id, name, description, short_description, our_price, fire_price,
        image_url, sku, stock_quantity, brand_name, materials,
        featured, created_at
      `)
      // Note: Removed .eq('is_active', true) filter for current manual inventory phase
      // Add back when connecting to Zoho Inventory for automated product management
      .eq('nicotine_product', false)
      .eq('tobacco_product', false)
      .eq('featured', true)
      .gt('stock_quantity', 0)
      .gte('our_price', 50) // Higher priced items for staff picks
      .order('our_price', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching staff picks:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If no featured products, get high-value products
    if (!products || products.length < limit) {
      const { data: fallbackProducts, error: fallbackError } = await supabase
        .from('main_site_products')
        .select(`
          id, name, description, short_description, our_price, fire_price,
          image_url, sku, stock_quantity, brand_name, materials,
          featured, created_at
        `)
        // Note: Removed .eq('is_active', true) filter for current manual inventory phase
        // Add back when connecting to Zoho Inventory for automated product management
        .eq('nicotine_product', false)
        .eq('tobacco_product', false)
        .gt('stock_quantity', 0)
        .gte('our_price', 30)
        .order('our_price', { ascending: false })
        .limit(limit);

      if (fallbackError) {
        console.error('Error fetching fallback staff picks:', fallbackError);
        return NextResponse.json({ error: fallbackError.message }, { status: 500 });
      }

      // Add discount calculations for staff picks
      const staffPicks = (fallbackProducts || []).map(product => ({
        ...product,
        image_url: product.image_url, // Add snake_case version for legacy compatibility
        original_price: product.our_price * 1.5, // Simulate original price
        discount_percentage: Math.floor(Math.random() * 30) + 20, // 20-50% off
        is_staff_pick: true
      }));

      return NextResponse.json({
        products: staffPicks,
        message: 'Staff picks with simulated discounts',
        total: staffPicks.length
      });
    }

    // Add discount calculations for featured products
    const staffPicks = products.map(product => ({
      ...product,
      image_url: product.image_url, // Add snake_case version for legacy compatibility
      original_price: product.our_price * 1.4,
      discount_percentage: Math.floor(Math.random() * 25) + 25, // 25-50% off
      is_staff_pick: true
    }));

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
