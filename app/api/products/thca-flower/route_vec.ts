import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase credentials not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { searchParams } = new URL(request.url);

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
        console.warn('Failed to generate embedding for vector search:', embeddingError);
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

    // Use the thca_vector_search RPC function
    const { data, error } = await supabase.rpc('thca_vector_search', {
      query_embedding: queryEmbedding,
      filters: filters,
      page_size: parseInt(searchParams.get('limit') || '24'),
      page: parseInt(searchParams.get('page') || '1')
    });

    if (error) {
      console.error('THCA Vector Search Error:', error);
      return NextResponse.json({ error: 'Vector search failed', details: error.message }, { status: 500 });
    }

    // Transform the data to match expected format
    const transformedProducts = (data || []).map((product: any) => ({
      id: product.id,
      name: product.name,
      price: product.price || 0,
      vip_price: product.fire_price,
      compare_at_price: product.sale_price,
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
      category: product.category || 'THCA Flower',
      material: product.material || '',
      style: product.style || 'flower',
      size: product.size || '',
      inStock: (product.stock_quantity || 0) > 0,
      isNew: product.is_new || false,
      isSale: product.sale_price && product.sale_price < (product.price || 0),
      features: product.features || [],
      tags: product.tags || []
    }));

    const totalCount = data?.[0]?.total_count || 0;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');

    return NextResponse.json({
      products: transformedProducts,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: page * limit < totalCount,
      hasPrevPage: page > 1,
      searchType: 'vector'
    });

  } catch (error) {
    console.error('Error in THCA Vector Flower API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch THCA flower products with vector search' },
      { status: 500 }
    );
  }
}
