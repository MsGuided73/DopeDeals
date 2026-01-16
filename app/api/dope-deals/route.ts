import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Dope Deals API Route
 *
 * Returns products that have active discount flags (DD10 or DD15)
 * Filters: Active products only, no batteries, no duplicates
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get products that have active dope deal flags and images
    // Fetch extra to account for duplicates and battery filtering
    const { data: rawProducts, error } = await supabase
      .from('main_site_products')
      .select(`
        id, name, description, short_description, our_price, sale_price,
        image_url, image_urls, sku, stock_quantity, is_active, featured, featured_product,
        brand_name, category_id, created_at, updated_at, DD10, DD15
      `)
      .or('DD10.eq.true,DD15.eq.true') // Products with either DD10 or DD15 flag
      .eq('is_active', true) // Only active products
      .not('image_url', 'is', null) // Must have image_url
      .neq('image_url', '') // Must not be empty string
      .or('name.not.ilike.%battery%,description.not.ilike.%battery%,short_description.not.ilike.%battery%') // No batteries
      .order('created_at', { ascending: false })
      .limit(limit * 2); // Fetch extra to ensure we have enough after deduplication

    if (error) {
      console.error('Error fetching dope deals:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Remove duplicates by ID, name, and SKU (ensure unique products only)
    const seenIds = new Set<number>();
    const seenNames = new Set<string>();
    const seenSkus = new Set<string>();
    const uniqueProducts = (rawProducts || []).filter(product => {
      // Check ID duplicates
      if (seenIds.has(product.id)) {
        return false;
      }
      
      // Check name duplicates (normalize by trimming and lowercasing)
      const normalizedName = product.name?.trim().toLowerCase();
      if (normalizedName && seenNames.has(normalizedName)) {
        return false;
      }
      
      // Check SKU duplicates (if SKU exists)
      if (product.sku && seenSkus.has(product.sku)) {
        return false;
      }
      
      // Add to tracking sets
      seenIds.add(product.id);
      if (normalizedName) seenNames.add(normalizedName);
      if (product.sku) seenSkus.add(product.sku);
      
      return true;
    });

    // Take only the requested limit
    const products = uniqueProducts.slice(0, limit);

    console.log(`🎯 Dope Deals API: Retrieved ${products.length} unique active deal products (no batteries, no duplicates)`);

    return NextResponse.json({
      products: products,
      total: products.length,
      message: 'Dope deals retrieved successfully'
    });

  } catch (error) {
    console.error('Error in dope deals API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
