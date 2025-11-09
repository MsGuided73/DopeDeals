import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
    console.log('THCA API: Starting request processing');

    // Ensure environment variables are loaded in development
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('THCA Pre-rolls/Vapes API - Environment check:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
        urlPrefix: supabaseUrl?.substring(0, 20) + '...',
        keyPrefix: supabaseKey?.substring(0, 20) + '...'
      });
    }

    if (!supabaseUrl || !supabaseKey) {
      console.error('THCA Pre-rolls/Vapes API - Missing credentials:', {
        supabaseUrl: !!supabaseUrl,
        supabaseKey: !!supabaseKey
      });
      return NextResponse.json({
        message: 'Supabase credentials not configured',
        debug: process.env.NODE_ENV === 'development' ? {
          supabaseUrl: !!supabaseUrl,
          supabaseKey: !!supabaseKey
        } : undefined
      }, { status: 500 });
    }

    console.log('THCA API: Creating Supabase client');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get query parameters for vector search
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');
    const searchQuery = searchParams.get('q') || '';
    const sortBy = searchParams.get('sort') || 'featured';

    // Get filter parameters
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const brands = searchParams.get('brands')?.split(',') || [];
    const types = searchParams.get('types')?.split(',') || [];
    const sizes = searchParams.get('sizes')?.split(',') || [];
    const inStock = searchParams.get('inStock') === 'true';
    const onSale = searchParams.get('onSale') === 'true';
    const isNew = searchParams.get('isNew') === 'true';
    const featured = searchParams.get('featured') === 'true';

    // Build filters object for vector search
    const filters: any = {};

    if (priceMin || priceMax) {
      if (priceMin) filters.minPrice = parseFloat(priceMin);
      if (priceMax) filters.maxPrice = parseFloat(priceMax);
    }

    if (brands.length > 0) filters.brands = brands;
    if (inStock) filters.inStock = true;
    if (onSale) filters.onSale = true;
    if (isNew) filters.isNew = true;
    if (featured) filters.featured = true;

    let queryEmbedding = null;

    // If there's a search query, generate embeddings for semantic search
    if (searchQuery.trim()) {
      try {
        // Generate embedding for the search query
        const embeddingResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/embeddings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: searchQuery,
            type: 'search'
          }),
        });

        if (embeddingResponse.ok) {
          const embeddingData = await embeddingResponse.json();
          queryEmbedding = embeddingData.embedding;
        }
      } catch (embeddingError) {
        console.warn('Failed to generate embedding for search:', embeddingError);
        // Continue without vector search if embedding fails
      }
    }

    console.log('THCA API: About to call performRegularSearch');

    // Call the search function
    const result = await performRegularSearch(supabase, {
      page: 1,
      limit: 24,
      searchQuery: '',
      sortBy: 'featured',
      filters: {}
    });

    console.log('THCA API: Search completed, products:', result.products?.length, 'total:', result.totalCount);

    // Transform products to match the expected format
    const transformedProducts = result.products.map((product: any) => ({
      id: product.id,
      name: product.name,
      price: parseFloat(product.our_price || 0),
      image_url: product.image_url,
      category: 'THCA Prerolls & Vapes',
      type: 'Preroll', // Default type
      inStock: true,
      isNew: false,
      isSale: false
    }));

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

  // TEMPORARY: Just return a few active products without complex filtering
  const { data, error, count } = await supabase
    .from('main_site_products')
    .select('id, name, our_price, image_url, category_slug')
    .eq('is_active', true)
    .or('name.ilike.%preroll%,name.ilike.%cartridge%,name.ilike.%vape%,name.ilike.%thca%,name.ilike.%thc-a%,name.ilike.%THC-A%,name.ilike.%THC-a%')
    .limit(10);

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
