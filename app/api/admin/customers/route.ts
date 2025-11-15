import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const vipStatus = searchParams.get('vip') || 'all';

    // Get all orders to aggregate customer data
    let ordersQuery = supabase
      .from('orders')
      .select(`
        user_id,
        customer_email,
        customer_first_name,
        customer_last_name,
        customer_phone,
        total_amount,
        created_at,
        status
      `)
      .not('user_id', 'is', null)
      .order('created_at', { ascending: false });

    const { data: orders, error: ordersError } = await ordersQuery;

    if (ordersError) throw ordersError;

    // Aggregate customer data
    const customerMap = new Map();

    orders?.forEach(order => {
      const customerId = order.user_id;

      if (!customerMap.has(customerId)) {
        customerMap.set(customerId, {
          id: customerId,
          email: order.customer_email,
          first_name: order.customer_first_name,
          last_name: order.customer_last_name,
          phone: order.customer_phone,
          created_at: order.created_at,
          total_orders: 0,
          total_spent: 0,
          status: 'active',
          vip_status: false,
          last_order_date: order.created_at
        });
      }

      const customer = customerMap.get(customerId);
      customer.total_orders += 1;
      customer.total_spent += parseFloat(order.total_amount || 0);

      // Update last order date if this is more recent
      if (new Date(order.created_at) > new Date(customer.last_order_date)) {
        customer.last_order_date = order.created_at;
      }
    });

    let customers = Array.from(customerMap.values());

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      customers = customers.filter(customer =>
        customer.email?.toLowerCase().includes(searchLower) ||
        customer.first_name?.toLowerCase().includes(searchLower) ||
        customer.last_name?.toLowerCase().includes(searchLower) ||
        `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(searchLower)
      );
    }

    if (status !== 'all') {
      customers = customers.filter(customer => customer.status === status);
    }

    if (vipStatus === 'vip') {
      customers = customers.filter(customer => customer.vip_status);
    } else if (vipStatus === 'regular') {
      customers = customers.filter(customer => !customer.vip_status);
    }

    // Sort by total spent (highest first)
    customers.sort((a, b) => b.total_spent - a.total_spent);

    return NextResponse.json({
      customers,
      total: customers.length
    });

  } catch (error) {
    console.error('Admin customers API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}
