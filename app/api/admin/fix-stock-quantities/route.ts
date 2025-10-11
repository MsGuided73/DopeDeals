import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    // Direct Supabase connection
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ message: 'Supabase credentials not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update all active products to have stock_quantity 5-10
    const { data: result, error } = await supabase
      .from('main_site_products')
      .update({
        stock_quantity: Math.floor(Math.random() * 6) + 5 // Random 5-10
      })
      .eq('is_active', true)
      .select('id');

    if (error) {
      console.error('Error fixing stock quantities:', error);
      return NextResponse.json({
        message: 'Failed to fix stock quantities',
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Stock quantities fixed successfully',
      updatedCount: result.length,
      products: result
    });

  } catch (error) {
    console.error('Error in fix-stock-quantities API:', error);
    return NextResponse.json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
