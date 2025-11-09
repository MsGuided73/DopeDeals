import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
    // Direct Supabase connection for testing
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase credentials not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse query parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Get mushroom-related products - vapes, prerolls, THC-A flower, edibles, gummies, etc.
    let query = supabase
      .from('main_site_products')
      .select('*')
      .eq('is_active', true);

    // Keywords for mushroom-related products (vapes, prerolls, edibles, gummies, THC-A flower, etc.)
    const mushroomKeywords = [
      'vape', 'preroll', 'pre-roll', 'thc-a', 'thca', 'edible', 'gummi', 'gummy',
      'flower', 'bud', 'cart', 'cartridge', 'disposable', 'pen', 'joint', 'blunt',
      'capsule', 'tincture', 'oil', 'concentrate', 'extract', 'moonrock', 'caviar',
      'diamond', 'sauce', 'rosin', 'shatter', 'wax', 'crumble', 'live resin'
    ];

    // Build a simple OR condition for keywords
    const keywordConditions = mushroomKeywords.map(keyword =>
      `name.ilike.%${keyword}%`
    );

    query = query.or(keywordConditions.join(','));

    // Apply pagination
    if (limit > 0) {
      query = query.limit(limit);
    }
    if (offset > 0) {
      query = query.range(offset, offset + (limit || 50) - 1);
    }

    // Order by featured and stock quantity
    query = query.order('featured', { ascending: false })
                 .order('stock_quantity', { ascending: false })
                 .order('created_at', { ascending: false });

    const { data: products, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: 'Failed to fetch mushroom products', details: error.message }, { status: 500 });
    }

    // Get total count for pagination info
    const { count } = await supabase
      .from('main_site_products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .or(mushroomKeywords.map(keyword => `name.ilike.%${keyword}%`).join(','));

    // Get brand information for products
    const brandIds = [...new Set(products?.map((p: any) => p.brand_id).filter(Boolean) || [])];
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
    const transformedProducts = (products || []).map((product: any) => {
      // Determine product type based on name
      let productType = 'Flower'; // default
      const nameLower = product.name.toLowerCase();

      if (nameLower.includes('vape') || nameLower.includes('cart') || nameLower.includes('cartridge') ||
          nameLower.includes('pen') || nameLower.includes('disposable')) {
        productType = 'Vapes';
      } else if (nameLower.includes('preroll') || nameLower.includes('pre-roll') ||
                 nameLower.includes('joint') || nameLower.includes('blunt')) {
        productType = 'Prerolls';
      } else if (nameLower.includes('edible') || nameLower.includes('gummi') || nameLower.includes('gummy') ||
                 nameLower.includes('capsule') || nameLower.includes('tincture')) {
        productType = 'Edibles';
      } else if (nameLower.includes('thc-a') || nameLower.includes('thca') || nameLower.includes('flower') ||
                 nameLower.includes('bud')) {
        productType = 'THC-A Flower';
      } else if (nameLower.includes('concentrate') || nameLower.includes('extract') ||
                 nameLower.includes('moonrock') || nameLower.includes('caviar') ||
                 nameLower.includes('diamond') || nameLower.includes('sauce') ||
                 nameLower.includes('rosin') || nameLower.includes('shatter') ||
                 nameLower.includes('wax') || nameLower.includes('crumble') ||
                 nameLower.includes('live resin')) {
        productType = 'Concentrates';
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
      hasMore: count ? (offset + (products?.length || 0)) < count : false
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
