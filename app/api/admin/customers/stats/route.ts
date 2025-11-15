import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get current date and date ranges
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Get all orders to calculate customer stats
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('user_id, total_amount, created_at')
      .not('user_id', 'is', null);

    if (ordersError) throw ordersError;

    // Calculate customer metrics
    const customerMap = new Map();
    let totalRevenue = 0;

    orders?.forEach(order => {
      const customerId = order.user_id;
      const orderAmount = parseFloat(order.total_amount || 0);
      totalRevenue += orderAmount;

      if (!customerMap.has(customerId)) {
        customerMap.set(customerId, {
          orders: [],
          totalSpent: 0
        });
      }

      const customer = customerMap.get(customerId);
      customer.orders.push({
        amount: orderAmount,
        date: order.created_at
      });
      customer.totalSpent += orderAmount;
    });

    const customers = Array.from(customerMap.values());

    // Calculate stats
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter((customer: any) =>
      customer.orders.some((order: any) =>
        new Date(order.date) >= lastMonth
      )
    ).length;

    const newCustomersThisMonth = customers.filter((customer: any) =>
      customer.orders.some((order: any) => {
        const orderDate = new Date(order.date);
        return orderDate >= thisMonth && orderDate < now;
      })
    ).length;

    // For now, we'll assume no VIP system is implemented
    const vipCustomers = 0;

    const averageOrderValue = totalCustomers > 0 ? totalRevenue / customers.length : 0;

    return NextResponse.json({
      totalCustomers,
      activeCustomers,
      newCustomersThisMonth,
      vipCustomers,
      averageOrderValue: Math.round(averageOrderValue * 100) / 100
    });

  } catch (error) {
    console.error('Admin customers stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer stats' },
      { status: 500 }
    );
  }
}
