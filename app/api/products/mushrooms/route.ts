import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Mushrooms API Route
 *
 * Returns products with category_slug in: "mush-gummies", "mush-chocolate", "mushrooms"
 * Filters: Active products only, valid images, no batteries
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get mushrooms products with category_slug filtering
    const { data: rawProducts, error } = await supabase
      .from('main_site_products')
      .select(`
        id, name, description, short_description, our_price, sale_price,
        image_url, image_urls, sku, stock_quantity, is_active, featured,
        brand_name, category_id, category_slug, created_at, updated_at
      `)
      .eq('is_active', true) // Only active products
      .not('image_url', 'is', null) // Must have image_url
      .neq('image_url', '') // Must not be empty string
      .or('category_slug.eq.mush-gummies,category_slug.eq.mush-chocolate,category_slug.eq.mushrooms') // Category slug filtering
      .not('name', 'ilike', '%battery%') // No batteries
      .not('description', 'ilike', '%battery%')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching mushrooms products:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`🎯 Mushrooms API: Retrieved ${rawProducts?.length || 0} active mushrooms products with valid images`);

    // Get total count for pagination info
    const { count } = await supabase
      .from('main_site_products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .not('image_url', 'is', null)
      .neq('image_url', '')
      .or('category_slug.eq.mush-gummies,category_slug.eq.mush-chocolate,category_slug.eq.mushrooms')
      .not('name', 'ilike', '%battery%')
      .not('description', 'ilike', '%battery%');

    // Get brand information for products
    const brandIds = [...new Set(rawProducts?.map((p: any) => p.brand_id).filter(Boolean) || [])];
    let brandsMap: Record<string, string> = {};

    if (brandIds.length > 0) {
      const { data: brands } = await supabase
        .from('brands_new')
        .select('id, name')
        .in('id', brandIds);

      brandsMap = (brands || []).reduce((acc, brand) => {
        acc[brand.id] = brand.name;
        return acc;
      }, {} as Record<string, string>);
    }

    // Transform the data to match expected format
    const transformedProducts = (rawProducts || []).map((product: any) => {
      // Determine mushroom product type
      let productType = 'Mushrooms'; // default
      const nameLower = product.name.toLowerCase();

      if (nameLower.includes('capsule') || nameLower.includes('pill')) {
        productType = 'Capsules';
      } else if (nameLower.includes('gummi') || nameLower.includes('gummy') ||
                 nameLower.includes('edible') || nameLower.includes('chocolate') ||
                 nameLower.includes('bar')) {
        productType = 'Edibles';
      } else if (nameLower.includes('powder') || nameLower.includes('extract')) {
        productType = 'Extracts';
      } else if (nameLower.includes('dried') || nameLower.includes('whole')) {
        productType = 'Dried Mushrooms';
      }

      return {
        id: product.id,
        name: product.name,
        price: product.our_price || product.price,
        compare_at_price: product.sale_price,
        image_url: product.image_url,
        description: product.description,
        short_description: product.short_description,
        sku: product.sku,
        stock_quantity: product.stock_quantity || 0,
        is_active: product.is_active,
        featured: product.featured || false,
        brand_id: product.brand_id,
        category_id: product.category_id,
        category_slug: product.category_slug,
        created_at: product.created_at,
        updated_at: product.updated_at,
        // Add brand name
        brand: brandsMap[product.brand_id] || 'House Brand',
        // Add additional fields expected by frontend
        specs: {
          type: productType,
          size: product.size || 'Standard',
          material: product.material || 'Premium'
        },
        isNew: product.is_new || false,
        is_sale: !!product.sale_price,
        inStock: (product.stock_quantity || 0) > 0
      };
    });

    return NextResponse.json({
      products: transformedProducts,
      totalCount: count || 0,
      limit,
      offset,
      hasMore: count ? (offset + (rawProducts?.length || 0)) < count : false
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch mushroom products', details: String(error) }, { status: 500 });
  }
}
