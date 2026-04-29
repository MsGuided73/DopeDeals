import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { applyRestrictedProductFilter } from '../../../../lib/compliance-filters';

/**
 * GET /api/products/pre-rolls
 *
 * Fetches pre-roll products for the storefront.
 *
 * Response shape:
 * - message: string
 * - totalCount: number
 * - products: Array<pre-roll product>
 */
export async function GET(_req: NextRequest) {
  try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { message: 'Supabase credentials not configured' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const MAX_PRODUCTS = 5000;

    let prerollQuery = supabase
      .from('main_site_products')
      .select(
        `
        id,
        name,
        description,
        short_description,
        our_price,
        sale_price,
        fire_price,
        image_url,
        image_urls,
        sku,
        stock_quantity,
        materials,
        featured,
        is_active,
        specs,
        attributes,
        brand_name,
        category_id,
        categories,
        category_slug,
        subcategory_slug,
        seo_keywords,
        created_at
      `
      )
      .eq('is_active', true)
      .or('variants_enabled.eq.false,source_parent.is.null') // Hide variant children of enabled groups
      .not('name', 'ilike', '%test%')
      .not('name', 'ilike', '%sample%');

    // Apply centralized compliance filters
    prerollQuery = applyRestrictedProductFilter(prerollQuery);

    const { data: allProducts, error: allError } = await prerollQuery
      .limit(MAX_PRODUCTS);

    if (allError) {
      console.error('Error fetching pre-roll products:', allError);
      return NextResponse.json(
        {
          message: 'Failed to fetch products',
          error: allError.message,
        },
        { status: 500 }
      );
    }

    const prerollProducts = (allProducts ?? []).filter((product: any) => {
      const name = String(product.name ?? '').toLowerCase();
      const categorySlug = String(product.category_slug ?? '').toLowerCase();

      if (categorySlug !== 'prerolls') return false;

      const excludedKeywords = ['tray', 'battery', 'glass', 'pipe', 'bong', 'grinder'];
      const isExcluded = excludedKeywords.some(
        (k) => name.includes(k) && !name.includes('infused')
      );

      return !isExcluded;
    });

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

    const transformedProducts = prerollProducts.map((product: any) => {
      const name = String(product.name ?? '').toLowerCase();

      // Derive display fields used by the UI.
      let type = 'Classic Pre-Roll';
      if (name.includes('infused') || name.includes('edible')) type = 'Infused Pre-Roll';
      else if (name.includes('hemp') || name.includes('cbd')) type = 'Hemp/CBD Pre-Roll';
      else if (name.includes('blunt')) type = 'Blunt';
      else if (name.includes('backwood')) type = 'Backwood';
      else if (name.includes('cross') || name.includes('hybrid')) type = 'Hybrid Pre-Roll';
      else if (name.includes('indica')) type = 'Indica Pre-Roll';
      else if (name.includes('sativa')) type = 'Sativa Pre-Roll';

      let size = '0.5g';
      if (name.includes('1g') || name.includes('1 gram')) size = '1g';
      else if (name.includes('0.75g') || name.includes('0.75 gram')) size = '0.75g';
      else if (name.includes('0.25g') || name.includes('0.25 gram')) size = '0.25g';
      else if (name.includes('2g') || name.includes('2 gram')) size = '2g';
      else if (name.includes('mini') || name.includes('small')) size = 'Mini';

      let thc = 'Unknown';
      const thcMatch = name.match(/(\d+(?:\.\d+)?)\s*%/);
      if (thcMatch) {
        thc = `${thcMatch[1]}%`;
      }

      const ourPrice = Number(product.our_price);
      const salePrice = product.sale_price != null ? Number(product.sale_price) : undefined;

      const isSale = salePrice != null && salePrice < ourPrice;

      const isNew =
        product.created_at &&
        new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const normalizedImages = Array.from(
        new Set([
          ...parseImageUrls(product.image_urls),
          ...parseImageUrls(product.image_url),
        ])
      );

      return {
        id: product.id,
        name: product.name,
        price: isSale ? salePrice : ourPrice,
        our_price: ourPrice,
        vip_price: product.fire_price ? Number(product.fire_price) : undefined,
        sale_price: salePrice,
        compare_at_price: isSale ? ourPrice : undefined,
        image_url: normalizedImages[0] || product.image_url,
        image_urls: normalizedImages,
        brand_id: product.brand_name,
        brand: product.brand_name,
        category_id: product.category_id,
        sku: product.sku,
        stock_quantity: product.stock_quantity || 0,
        materials: product.materials || [],
        material: product.materials?.[0] || 'Paper',
        vip_exclusive: false,
        featured: product.featured || false,
        is_active: product.is_active,
        description: product.description,
        short_description: product.short_description,
        specs: product.specs,
        attributes: product.attributes,
        type,
        size,
        thc,
        inStock: (product.stock_quantity || 0) > 0,
        isNew,
        isSale,
        features: ['Premium Flower', 'Expertly Rolled', 'Lab Tested', 'Slow Burning'],
        tags: ['pre-roll', 'joint', 'cannabis', 'smoke', type.toLowerCase().replace(' ', '-')],
        category: 'Pre-Rolls',
      };
    });

    return NextResponse.json({
      message: 'Pre-roll products loaded successfully',
      totalCount: transformedProducts.length,
      products: transformedProducts,
    });
  } catch (error) {
    console.error('Error fetching pre-roll products:', error);
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
