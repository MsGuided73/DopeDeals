import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only
);

// Shared function to transform product data
interface ProductInput {
  id: any;
  name: any;
  price: any;
  sale_price: any;
  image_url: any;
  brand: any;
  category: any;
  subcategory: any;
  stock_quantity: any;
  inventory_status: any;
  is_active: any;
  featured: any;
  cannabinoid_type: any;
  search_rank: any;
}

interface TransformedProduct {
  id: number;
  name: string;
  price: number;
  sale_price: number | null;
  image_url: string;
  brand: string;
  category: string;
  subcategory: string;
  stock_quantity: number;
  inventory_status: string;
  is_active: boolean;
  featured: boolean;
  cannabinoid_type: string;
  search_rank: number;
}

function transformProduct(product: ProductInput): TransformedProduct {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    sale_price: product.sale_price,
    image_url: product.image_url,
    brand: product.brand,
    category: product.category,
    subcategory: product.subcategory,
    stock_quantity: product.stock_quantity,
    inventory_status: product.inventory_status,
    is_active: product.is_active,
    featured: product.featured,
    cannabinoid_type: product.cannabinoid_type,
    search_rank: product.search_rank
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      query_embedding,
      filters = {},
      page_size = 24,
      page = 1
    } = body;

    // Validate required parameters
    if (!Array.isArray(query_embedding) || query_embedding.length === 0) {
      return NextResponse.json(
        { error: 'query_embedding must be a non-empty array' },
        { status: 400 }
      );
    }

    // Convert embedding array to PostgreSQL vector format
    const embeddingVector = `[${query_embedding.join(',')}]`;

    const { data, error } = await supabase.rpc('thca_vector_search', {
      query_embedding: embeddingVector,
      filters: filters,
      page_size: Math.min(page_size, 100), // Limit max page size
      page: Math.max(page, 1)
    });

    if (error) {
      console.error('[thca_vector_search] error:', error);
      return NextResponse.json({ products: [], error: error.message }, { status: 500 });
    }

    // Transform the results to match the expected format
    const products = (data || []).map(transformProduct);

    // Get total count from the first result (all results have the same total_count)
    const totalCount = data?.[0]?.total_count || 0;

    return NextResponse.json({
      products,
      total_count: totalCount,
      page,
      page_size,
      total_pages: Math.ceil(totalCount / page_size)
    });
  } catch (err: any) {
    console.error('THCA search API error:', err);
    return NextResponse.json(
      { products: [], error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Also support GET for simple requests (optional)
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const filters = JSON.parse(url.searchParams.get('filters') || '{}');
    const page_size = Number(url.searchParams.get('page_size') || 24);
    const page = Number(url.searchParams.get('page') || 1);

    // For GET requests, we'll do a basic search without vector embedding
    // This is useful for initial loads or when no search query is provided
    const { data, error } = await supabase.rpc('thca_vector_search', {
      query_embedding: null,
      filters: filters,
      page_size: Math.min(page_size, 100),
      page: Math.max(page, 1)
    });

    if (error) {
      console.error('[thca_vector_search] error:', error);
      return NextResponse.json({ products: [], error: error.message }, { status: 500 });
    }

    const products = (data || []).map(transformProduct);

    const totalCount = data?.[0]?.total_count || 0;

    return NextResponse.json({
      products,
      total_count: totalCount,
      page,
      page_size,
      total_pages: Math.ceil(totalCount / page_size)
    });
  } catch (err: any) {
    console.error('THCA search GET API error:', err);
    return NextResponse.json(
      { products: [], error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
