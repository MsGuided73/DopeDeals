import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
    console.log('THCA Vector Pre-rolls API: Starting request processing');

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('THCA Vector Pre-rolls API - Missing credentials');
      return NextResponse.json({
        message: 'Supabase credentials not configured'
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { searchParams } = new URL(req.url);

    // Generate embedding if search query exists
    let queryEmbedding = null;
    const searchQuery = searchParams.get('q');

    if (searchQuery?.trim()) {
      try {
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
          const { embedding } = await embeddingResponse.json();
          queryEmbedding = embedding;
        }
      } catch (embeddingError) {
        console.warn('Failed to generate embedding for THCA vector search:', embeddingError);
      }
    }

    // Build filters for thca_vector_search function
    const filters = {
      brands: searchParams.get('brands')?.split(',') || [],
      categories: searchParams.get('categories')?.split(',') || [],
      minPrice: searchParams.get('priceMin'),
      maxPrice: searchParams.get('priceMax'),
      inStock: searchParams.get('inStock') === 'true',
      onSale: searchParams.get('onSale') === 'true',
      featured: searchParams.get('featured') === 'true'
    };

    // NO LIMIT: Return all products
    const limit = 5000;

    // Use the thca_vector_search RPC function
    const { data, error } = await supabase.rpc('thca_vector_search', {
      query_embedding: queryEmbedding,
      filters: filters,
      page_size: limit,
      page: parseInt(searchParams.get('page') || '1')
    });

    if (error) {
      console.error('THCA Vector Search Error:', error);
      return NextResponse.json({
        message: 'Vector search failed',
        error: error.message
      }, { status: 500 });
    }

    console.log(`THCA Vector API: Found ${data?.length || 0} products`);

    // Transform products to match the expected format
    const transformedProducts = (data || []).map((product: any) => ({
      ...product,
      id: product.id,
      name: product.name,
      price: parseFloat(product.price || 0),
      vip_price: product.fire_price ? parseFloat(product.fire_price) : undefined,
      compare_at_price: product.sale_price ? parseFloat(product.sale_price) : undefined,
      image_url: product.image_url,
      image_urls: product.image_urls || [product.image_url].filter(Boolean),
      brand_id: product.brand,
      category_id: product.category,
      sku: product.sku,
      stock_quantity: product.stock_quantity || 0,
      materials: product.materials || [],
      vip_exclusive: false,
      featured: product.featured || false,
      is_active: product.is_active,
      description: product.description,
      short_description: product.short_description,
      specs: product.specs,
      attributes: product.attributes,

      // Computed fields
      brand: product.brand || '',
      category: product.category || 'THCA Prerolls & Vapes',
      material: product.material || '',
      style: product.style || 'preroll',
      size: product.size || '',
      inStock: (product.stock_quantity || 0) > 0,
      isNew: product.is_new || false,
      isSale: product.sale_price && product.sale_price < (product.price || 0),
      features: product.features || [],
      tags: product.tags || [],
      type: 'Preroll'
    }));

    const totalCount = data?.[0]?.total_count || 0;

    return NextResponse.json({
      message: 'THCA preroll/vape products loaded successfully with vector search',
      totalCount,
      products: transformedProducts,
      searchType: 'vector'
    });

  } catch (error) {
    console.error('Error in THCA Vector Pre-rolls API:', error);
    return NextResponse.json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
