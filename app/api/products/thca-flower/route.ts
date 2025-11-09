import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Direct Supabase connection
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase credentials not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');
    const searchQuery = searchParams.get('q') || '';
    const sortBy = searchParams.get('sort') || 'featured';

    // Get filter parameters
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const brands = searchParams.get('brands')?.split(',') || [];
    const sizes = searchParams.get('sizes')?.split(',') || [];
    const styles = searchParams.get('styles')?.split(',') || [];
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

    console.log('THCA Flower API: About to call performRegularSearch');

    // Call the search function
    const result = await performRegularSearch(supabase, {
      page: 1,
      limit: 24,
      searchQuery: '',
      sortBy: 'featured',
      filters: {}
    });

    console.log('THCA Flower API: Search completed, products:', result.products?.length, 'total:', result.totalCount);

    const products = result.products;
    const totalCount = result.totalCount;

    // Transform products to match the expected format
    const transformedProducts = products.map((product: any) => ({
      id: product.id,
      name: product.name,
      price: product.price || 0,
      vip_price: product.vip_price,
      compare_at_price: product.compare_at_price,
      image_url: product.image_url,
      image_urls: product.image_urls || [product.image_url].filter(Boolean),
      brand_id: product.brand_id,
      category_id: product.category_id,
      sku: product.sku,
      stock_quantity: product.stock_quantity || 0,
      materials: product.materials || [],
      vip_exclusive: product.vip_exclusive || false,
      featured: product.featured || false,
      is_active: product.is_active !== false,
      description: product.description,
      short_description: product.short_description,
      specs: product.specs,
      attributes: product.attributes,

      // Computed fields
      brand: product.brand || '',
      category: product.category || 'THCA Flower',
      material: product.material || '',
      style: product.style || (product.name?.toLowerCase().includes('preroll') ? 'preroll' : 'flower'),
      size: product.size || extractSizeFromName(product.name),
      inStock: (product.stock_quantity || 0) > 0,
      isNew: product.is_new || false,
      isSale: product.sale_price && product.sale_price < (product.price || 0),
      features: product.features || [],
      tags: product.tags || []
    }));

    return NextResponse.json({
      products: transformedProducts,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: page * limit < totalCount,
      hasPrevPage: page > 1
    });

  } catch (error) {
    console.error('Error fetching THCA flower products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch THCA flower products' },
      { status: 500 }
    );
  }
}

// Helper function to extract size from product name
function extractSizeFromName(name: string): string {
  if (!name) return '';

  const sizePatterns = [
    /(\d+(?:\.\d+)?)\s*g/i,  // 3.5g, 7g, 14g, etc.
    /(\d+(?:\.\d+)?)\s*gram/i,  // 3.5 gram, 7 gram, etc.
    /half\s*ounce/i,  // half ounce
    /quarter\s*pound/i,  // quarter pound
    /half\s*pound/i,  // half pound
    /single/i,  // single
    /1\s*pack/i,  // 1 pack
    /5\s*pack/i,  // 5 pack
    /10\s*pack/i  // 10 pack
  ];

  for (const pattern of sizePatterns) {
    const match = name.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return '';
}

// Fallback regular search function
async function performRegularSearch(supabase: any, options: any) {
  console.log('THCA Flower API: Starting simplified search');

  // TEMPORARY: Just return a few active products without complex filtering
  const { data, error, count } = await supabase
    .from('main_site_products')
    .select('id, name, our_price, image_url, category_slug')
    .eq('is_active', true)
    .or('name.ilike.%flower%,name.ilike.%thca%,name.ilike.%thc-a%,name.ilike.%THC-A%,name.ilike.%THC-a%,category_slug.ilike.%flower%,category_slug.ilike.%thca%,category_slug.ilike.%thc-a%')
    .limit(10);

  if (error) {
    console.log('THCA Flower API: Search error:', error);
    throw error;
  }

  console.log('THCA Flower API: Found products:', data?.length);

  return {
    products: data || [],
    totalCount: data?.length || 0
  };
}
