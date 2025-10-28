import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';

    // Build the query
    let ordersQuery = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          total_price,
          unit_price,
          products (
            id,
            name,
            sku,
            image_url
          )
        )
      `)
      .order('created_at', { ascending: false });

    // Filter by status if specified
    if (status !== 'all') {
      ordersQuery = ordersQuery.eq('status', status);
    }

    const { data: orders, error } = await ordersQuery;

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    // Transform the data for easier frontend consumption
    const transformedOrders = (orders || []).map(order => ({
      ...order,
      // Ensure all required fields are present
      order_number: order.order_number || `#${order.id.slice(-8)}`,
      total_amount: parseFloat(order.total_amount) || 0,
      order_items: order.order_items || []
    }));

    // Calculate summary statistics
    const totalOrders = transformedOrders.length;
    const totalRevenue = transformedOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    const pendingOrders = transformedOrders.filter(order => order.status === 'pending').length;
    const paidOrders = transformedOrders.filter(order => order.payment_status === 'paid').length;

    return NextResponse.json({
      success: true,
      orders: transformedOrders,
      summary: {
        total: totalOrders,
        revenue: totalRevenue,
        pending: pendingOrders,
        paid: paidOrders
      }
    });

  } catch (error) {
    console.error('Admin orders API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
