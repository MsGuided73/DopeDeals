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

    // ── Strict category_slug filter ──────────────────────────────────────────
    // Database stores slugs with underscores (confirmed via audit):
    //   'dab_rig'              → 29 products  (all Puffco e-rigs, tools, rigs)
    //   'dab_rig_attachment'   →  1 product   (Puffco Peak Ryan Fitt Recycler)
    //   'dab_rig_accessories'  →  1 product   (Puffco Peak Bowl)
    query = query.or(
      'category_slug.eq.dab_rig,category_slug.eq.dab_rig_attachment,category_slug.eq.dab_rig_accessories'
    );

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


    const { count } = await dabCountQuery.or(
      'category_slug.eq.dab_rig,category_slug.eq.dab_rig_attachment,category_slug.eq.dab_rig_accessories'
    );


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

    // Map DB subcategory_slug → user-facing equipment type. Drives the Hero
    // pills and sidebar filter buckets. Falls back to 'Glass Rigs' for unknown
    // slugs so nothing silently disappears from the grid.
    const SUBCATEGORY_TYPE_MAP: Record<string, string> = {
      e_rig: 'E-Rigs',
      electronic_dab_rig: 'E-Rigs',
      dab_rig_e_rig: 'E-Rigs',
      dab_rig: 'Glass Rigs',
      recyclers: 'Glass Rigs',
      percolator_bongs: 'Glass Rigs',
      proxy_accessories: 'Portable',
      dab_tools: 'Tools',
      replacement_bowl: 'Tools',
    };

    const transformedProducts = (products || []).map((product: any) => {
      const normalizedImages = Array.from(new Set([
        ...parseImageUrls(product.image_url),
        ...parseImageUrls(product.image_urls)
      ]));

      let productType = SUBCATEGORY_TYPE_MAP[product.subcategory_slug] || 'Glass Rigs';

      // Disambiguate handheld e-rigs (Proxy line, travel kits) into Portable.
      if (productType === 'E-Rigs') {
        const nameLower = (product.name || '').toLowerCase();
        if (nameLower.includes('proxy') || nameLower.includes('portable') || nameLower.includes('travel')) {
          productType = 'Portable';
        }
      }

      return {
        ...product,
        price: (product.sale_price && product.sale_price < product.our_price) ? product.sale_price : product.our_price,
        compare_at_price: (product.sale_price && product.sale_price < product.our_price) ? product.our_price : undefined,
        image_url: normalizedImages[0] || product.image_url,
        image_urls: normalizedImages,
        brand: brandsMap[product.brand_id] || 'House Brand',
        type: productType,
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
