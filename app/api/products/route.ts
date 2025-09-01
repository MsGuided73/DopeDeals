import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
    // Direct Supabase connection for testing
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ message: 'Supabase credentials not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test query to get products count first
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Supabase count error:', countError);
      return NextResponse.json({ message: 'Database connection failed', error: countError.message }, { status: 500 });
    }

    // Get first 10 products for testing
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .limit(10);

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ message: 'Failed to fetch products', error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Products API working!',
      totalCount: count,
      sampleProducts: products?.length || 0,
      products: products
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ message: 'Failed to fetch products', error: String(error) }, { status: 500 });
  }
}

