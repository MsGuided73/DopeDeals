import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { applyRestrictedProductFilter } from '../../../lib/compliance-filters';

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
    const category = url.searchParams.get('category');

    // Build query - Use main_site_products table
    // Only show active products and exclude restricted products (batteries, kratom, etc.)
    let query = supabase
      .from('main_site_products')
      .select('*')
      .eq('is_active', true)
      .not('name', 'ilike', '%battery%')
      .not('description', 'ilike', '%battery%')
      .not('short_description', 'ilike', '%battery%');

    // Apply centralized compliance filters
    query = applyRestrictedProductFilter(query, ['name', 'description', 'short_description']);

    // Apply category filter if provided
    if (category) {
      query = query.eq('category_id', category);
    }

    // Apply pagination
    if (limit > 0) {
      query = query.limit(limit);
    }
    if (offset > 0) {
      query = query.range(offset, offset + (limit || 50) - 1);
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: 'Failed to fetch products', details: error.message }, { status: 500 });
    }

    // Get total count for pagination info (only active products, excluding restricted products)
    let countQuery = supabase
      .from('main_site_products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .not('name', 'ilike', '%battery%')
      .not('description', 'ilike', '%battery%')
      .not('short_description', 'ilike', '%battery%');

    // Apply centralized compliance filters
    countQuery = applyRestrictedProductFilter(countQuery, ['name', 'description', 'short_description']);

    // Apply category filter to count query if provided
    if (category) {
      countQuery = countQuery.eq('category_id', category);
    }

    const { count } = await countQuery;

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

    // Normalize products data
    const transformedProducts = (products || []).map((product: any) => {
      const normalizedImages = Array.from(new Set([
        ...parseImageUrls(product.image_urls),
        ...parseImageUrls(product.image_url)
      ]));

      return {
        ...product,
        image_url: normalizedImages[0] || product.image_url,
        image_urls: normalizedImages
      };
    });

    return NextResponse.json({
      products: transformedProducts,
      totalCount: count || 0,
      limit,
      offset,
      hasMore: count ? (offset + (transformedProducts.length)) < count : false
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch products', details: String(error) }, { status: 500 });
  }
}
