import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
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

    // Use vector search if we have an embedding, otherwise use regular query
    let products;
    let totalCount = 0;

    if (queryEmbedding) {
      // Use vector search function
      const { data, error } = await supabase.rpc('thca_vector_search', {
        query_embedding: queryEmbedding,
        filters: filters,
        page_size: limit,
        page: page
      });

      if (error) {
        console.error('Vector search error:', error);
        // Fall back to regular search
        const result = await performRegularSearch(supabase, {
          page,
          limit,
          searchQuery,
          sortBy,
          filters: {
            priceMin: priceMin ? parseFloat(priceMin) : undefined,
            priceMax: priceMax ? parseFloat(priceMax) : undefined,
            brands,
            types,
            sizes,
            inStock,
            onSale,
            isNew,
            featured
          }
        });
        products = result.products;
        totalCount = result.totalCount;
      } else {
        products = data || [];
        totalCount = data?.[0]?.total_count || 0;
      }
    } else {
      // Use regular search
      const result = await performRegularSearch(supabase, {
        page,
        limit,
        searchQuery,
        sortBy,
        filters: {
          priceMin: priceMin ? parseFloat(priceMin) : undefined,
          priceMax: priceMax ? parseFloat(priceMax) : undefined,
          brands,
          types,
          sizes,
          inStock,
          onSale,
          isNew,
          featured
        }
      });
      products = result.products;
      totalCount = result.totalCount;
    }

    // Transform products to match the expected format
    const transformedProducts = products.map((product: any) => {
      // Determine product type from name and category
      const name = product.name.toLowerCase();
      let type = 'Preroll';

      if (name.includes('cartridge') || name.includes('cart') || product.category?.toLowerCase().includes('cartridge')) {
        type = 'Cartridge';
      } else if (name.includes('disposable') || name.includes('vape pen') || product.category?.toLowerCase().includes('disposable')) {
        type = 'Disposable';
      } else if (name.includes('vaporizer') || name.includes('vape') || product.category?.toLowerCase().includes('vaporizer')) {
        type = 'Vaporizer';
      } else if (name.includes('preroll') || product.category?.toLowerCase().includes('preroll')) {
        type = 'Preroll';
      }

      // Determine size from name or specs
      let size = '1g';
      if (name.includes('0.5g') || name.includes('0.5 gram')) size = '0.5g';
      else if (name.includes('0.75g') || name.includes('0.75 gram')) size = '0.75g';
      else if (name.includes('2g') || name.includes('2 gram')) size = '2g';
      else if (name.includes('mini') || name.includes('small')) size = 'Mini';
      else if (product.specs?.size) size = product.specs.size;

      // Determine THC content from name or specs
      let thc = 'Unknown';
      const thcMatch = name.match(/(\d+(?:\.\d+)?)\s*%/);
      if (thcMatch) {
        thc = thcMatch[1] + '%';
      }

      // Determine if it's on sale
      const isSale = product.sale_price && product.sale_price > product.price;

      // Determine if it's new (created within last 30 days)
      const isNew = product.created_at &&
        new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      return {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        vip_price: product.vip_price ? parseFloat(product.vip_price) : undefined,
        compare_at_price: product.sale_price ? parseFloat(product.sale_price) : undefined,
        image_url: product.image_url,
        image_urls: product.image_urls || (product.image_url ? [product.image_url] : []),
        brand_id: product.brand_id,
        brand: product.brand || product.brand_id,
        category_id: product.category_id,
        sku: product.sku,
        stock_quantity: product.stock_quantity || 0,
        materials: product.materials || [],
        material: product.materials?.[0] || 'Paper',
        vip_exclusive: false, // Default to false since column doesn't exist
        featured: product.featured || false,

        is_active: product.is_active,
        description: product.description,
        short_description: product.short_description,
        specs: product.specs,
        attributes: product.attributes,

        // Computed fields
        type,
        size,
        thc,
        inStock: (product.stock_quantity || 0) > 0,
        isNew,
        isSale,
        features: [
          'Premium THCA',
          'Lab Tested',
          'High Quality',
          type === 'Preroll' ? 'Expertly Rolled' : 'Premium Extract'
        ],
        tags: ['thca', 'preroll', 'vape', 'cartridge', type.toLowerCase().replace(' ', '-')],
        category: 'THCA Prerolls & Vapes'
      };
    });

    return NextResponse.json({
      message: 'THCA preroll/vape products loaded successfully',
      totalCount,
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
  const { page, limit, searchQuery, sortBy, filters } = options;
  const offset = (page - 1) * limit;

  // Build the base query for THCA products that are prerolls, cartridges, or vapes
  let query = supabase
    .from('main_site_products')
    .select(`
      *,
      brands:brand_id(name),
      categories:category_id(name)
    `, { count: 'exact' })
    .eq('is_active', true)
    .gt('cannabinoid_profile->thc_variants->thca', 0);

  // Filter for prerolls, cartridges, and vapes
  query = query.or(`
    category_slug.ilike.%pre-roll%,
    category_slug.ilike.%preroll%,
    category_slug.ilike.%cartridge%,
    category_slug.ilike.%vape%,
    category_slug.ilike.%vaporizer%,
    category_slug.ilike.%disposable%,
    name.ilike.%preroll%,
    name.ilike.%cartridge%,
    name.ilike.%vape%,
    name.ilike.%disposable%,
    name.ilike.%vaporizer%
  `);

  // Apply search filter
  if (searchQuery.trim()) {
    query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%`);
  }

  // Apply filters
  if (filters.priceMin !== undefined) {
    query = query.gte('our_price', filters.priceMin);
  }
  if (filters.priceMax !== undefined) {
    query = query.lte('our_price', filters.priceMax);
  }
  if (filters.brands.length > 0) {
    query = query.in('brand_id', filters.brands);
  }
  if (filters.types.length > 0) {
    // Filter by product type
    let typeConditions = [];
    for (const type of filters.types) {
      if (type.toLowerCase().includes('preroll')) {
        typeConditions.push('name.ilike.%preroll%');
      }
      if (type.toLowerCase().includes('cartridge')) {
        typeConditions.push('name.ilike.%cartridge%');
      }
      if (type.toLowerCase().includes('disposable') || type.toLowerCase().includes('vape')) {
        typeConditions.push('name.ilike.%disposable%');
        typeConditions.push('name.ilike.%vape%');
      }
    }
    if (typeConditions.length > 0) {
      query = query.or(typeConditions.join(','));
    }
  }
  if (filters.inStock) {
    query = query.gt('stock_quantity', 0);
  }
  if (filters.onSale) {
    query = query.not('sale_price', 'is', null);
  }
  if (filters.isNew) {
    query = query.eq('is_new', true);
  }
  if (filters.featured) {
    query = query.eq('featured', true);
  }

  // Apply sorting
  switch (sortBy) {
    case 'price-low':
      query = query.order('our_price', { ascending: true });
      break;
    case 'price-high':
      query = query.order('our_price', { ascending: false });
      break;
    case 'name':
      query = query.order('name', { ascending: true });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    default: // featured
      query = query.order('featured', { ascending: false }).order('created_at', { ascending: false });
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    throw error;
  }

  return {
    products: data || [],
    totalCount: count || 0
  };
}
