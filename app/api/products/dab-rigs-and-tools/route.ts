import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { applyRestrictedProductFilter } from '../../../../lib/compliance-filters';

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
    // NO LIMIT: Return all products
    const limit = 5000;
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Get dab rig and tool products
    let query = supabase
      .from('main_site_products')
      .select('*')
      .eq('is_active', true);

    // Apply centralized compliance filters
    query = applyRestrictedProductFilter(query);

    const dabKeywords = [
      'dab', 'rig', 'nail', 'banger', 'tool', 'puffco', 'e-rig', 'concentrate',
      'diamond', 'glass', 'recycler', 'portable', 'travel', 'carb cap', 'dart'
    ];

    const keywordConditions = dabKeywords.map(keyword =>
      `name.ilike.%${keyword}%`
    );

    query = query.or(keywordConditions.join(','));

    // Apply pagination
    query = query.limit(limit);
    if (offset > 0) {
      query = query.range(offset, offset + limit - 1);
    }

    // Order by featured and stock quantity
    query = query.order('featured', { ascending: false })
                 .order('stock_quantity', { ascending: false })
                 .order('created_at', { ascending: false });

    const { data: products, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: 'Failed to fetch dab products', details: error.message }, { status: 500 });
    }

    // Get total count
    let dabCountQuery = supabase
      .from('main_site_products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Apply centralized compliance filters
    dabCountQuery = applyRestrictedProductFilter(dabCountQuery);

    const { count } = await dabCountQuery
      .or(dabKeywords.map(keyword => `name.ilike.%${keyword}%`).join(','));

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

    const transformedProducts = (products || []).map((product: any) => {
      const normalizedImages = Array.from(new Set([
        ...parseImageUrls(product.image_urls),
        ...parseImageUrls(product.image_url)
      ]));

      let productType = 'Rigs';
      const nameLower = product.name.toLowerCase();

      if (nameLower.includes('puffco') || nameLower.includes('e-rig') || nameLower.includes('electric')) {
        productType = 'E-Rigs';
      } else if (nameLower.includes('portable') || nameLower.includes('travel')) {
        productType = 'Portable';
      } else if (nameLower.includes('tool') || nameLower.includes('dabber') || nameLower.includes('nail') ||
                 nameLower.includes('banger') || nameLower.includes('carb cap') || nameLower.includes('dart')) {
        productType = 'Tools';
      } else if (nameLower.includes('glass') || nameLower.includes('rig') || nameLower.includes('recycler')) {
        productType = 'Glass Rigs';
      }

      return {
        ...product,
        image_url: normalizedImages[0] || product.image_url,
        image_urls: normalizedImages,
        brand: brandsMap[product.brand_id] || 'House Brand',
        specs: {
          type: productType,
          size: product.size || 'Standard',
          material: product.material || 'Glass'
        },
        inStock: (product.stock_quantity || 0) > 0
      };
    });

    return NextResponse.json({
      products: transformedProducts,
      totalCount: count || 0,
      limit,
      offset,
      hasMore: count ? (offset + (products?.length || 0)) < count : false
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch dab products', details: String(error) }, { status: 500 });
  }
}
