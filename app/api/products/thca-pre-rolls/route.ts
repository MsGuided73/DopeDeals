import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { applyRestrictedProductFilter } from '../../../../lib/compliance-filters';

export async function GET(req: NextRequest) {
  try {
    console.log('THCA API: Starting request processing');

    // Ensure environment variables are loaded in development
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        message: 'Supabase credentials not configured'
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // NO LIMIT: Return all products
    const limit = 5000;

    // Call the search function
    const result = await performRegularSearch(supabase, {
      limit: limit
    });

    console.log('THCA API: Search completed, products:', result.products?.length, 'total:', result.totalCount);

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

    // Transform products to match the expected format
    const transformedProducts = result.products.map((product: any) => {
      const normalizedImages = Array.from(new Set([
        ...parseImageUrls(product.image_urls),
        ...parseImageUrls(product.image_url)
      ]));

      return {
        id: product.id,
        name: product.name,
        price: (product.sale_price && parseFloat(product.sale_price) < parseFloat(product.our_price || 0)) ? parseFloat(product.sale_price) : parseFloat(product.our_price || 0),
        our_price: parseFloat(product.our_price || 0),
        vip_price: product.fire_price ? parseFloat(product.fire_price) : undefined,
        sale_price: product.sale_price ? parseFloat(product.sale_price) : undefined,
        compare_at_price: (product.sale_price && parseFloat(product.sale_price) < parseFloat(product.our_price || 0)) ? parseFloat(product.our_price || 0) : undefined,
        image_url: normalizedImages[0] || product.image_url,
        image_urls: normalizedImages,
        category: 'THCA Prerolls & Vapes',
        type: 'Preroll', // Default type
        inStock: true,
        isNew: false,
        isSale: false
      };
    });

    return NextResponse.json({
      message: 'THCA preroll/vape products loaded successfully',
      totalCount: result.totalCount,
      products: transformedProducts
    });

  } catch (error) {
    console.error('Error fetching THCA preroll/vape products:', error);
    return NextResponse.json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Fallback regular search function for THCA prerolls, cartridges, and vapes
async function performRegularSearch(supabase: any, options: any) {
  console.log('THCA API: Starting simplified search');

  let thcaPrerollQuery = supabase
    .from('main_site_products')
    .select('id, name, our_price, sale_price, fire_price, image_url, image_urls, category_slug')
    .eq('is_active', true)
    .or('variants_enabled.eq.false,source_parent.is.null'); // Hide variant children of enabled groups

  // Apply centralized compliance filters
  thcaPrerollQuery = applyRestrictedProductFilter(thcaPrerollQuery);

  const { data, error } = await thcaPrerollQuery
    .or('name.ilike.%preroll%,name.ilike.%cartridge%,name.ilike.%vape%,name.ilike.%thca%,name.ilike.%thc-a%,name.ilike.%THC-A%,name.ilike.%THC-a%')
    .limit(options.limit || 5000);

  if (error) {
    console.log('THCA API: Search error:', error);
    throw error;
  }

  console.log('THCA API: Found products:', data?.length);

  return {
    products: data || [],
    totalCount: data?.length || 0
  };
}
