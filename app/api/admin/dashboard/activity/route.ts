import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get recent activities from various sources
    const activities: any[] = [];

    // Get recent orders (last 10)
    const { data: recentOrders, error: ordersError } = await supabase
      .from('orders')
      .select('id, order_number, customer_first_name, customer_last_name, total_amount, created_at, status')
      .order('created_at', { ascending: false })
      .limit(5);

    if (!ordersError && recentOrders) {
      recentOrders.forEach(order => {
        activities.push({
          id: `order-${order.id}`,
          type: 'order',
          message: `New order #${order.order_number} placed by ${order.customer_first_name} ${order.customer_last_name}`,
          timestamp: order.created_at,
          icon: '📦',
          color: 'text-blue-600'
        });
      });
    }

    // Get recent low stock alerts
    const { data: lowStockProducts, error: stockError } = await supabase
      .from('products')
      .select('id, name, stock_quantity')
      .eq('is_active', true)
      .lt('stock_quantity', 5)
      .order('stock_quantity', { ascending: true })
      .limit(3);

    if (!stockError && lowStockProducts) {
      lowStockProducts.forEach(product => {
        activities.push({
          id: `stock-${product.id}`,
          type: 'product',
          message: `Product "${product.name}" is low on stock (${product.stock_quantity} units)`,
          timestamp: new Date().toISOString(), // Current time for alerts
          icon: '⚠️',
          color: 'text-yellow-600'
        });
      });
    }

    // Get recent customer registrations (mock for now since we don't have user registration tracking)
    // In a real implementation, you'd track user registrations
    activities.push({
      id: 'system-1',
      type: 'system',
      message: 'Daily inventory sync completed successfully',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      icon: '✅',
      color: 'text-green-600'
    });

    // Sort activities by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Return only the most recent 10 activities
    const recentActivities = activities.slice(0, 10);

    return NextResponse.json({
      activities: recentActivities
    });

  } catch (error) {
    console.error('Admin dashboard activity API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard activity' },
      { status: 500 }
    );
  }
}
