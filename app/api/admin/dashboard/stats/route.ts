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
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());

    // Get total revenue
    const { data: revenueData, error: revenueError } = await supabase
      .from('orders')
      .select('total_amount, created_at')
      .eq('payment_status', 'paid');

    if (revenueError) throw revenueError;

    const totalRevenue = revenueData?.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0) || 0;

    // Get revenue for last month
    const lastMonthRevenue = revenueData
      ?.filter(order => new Date(order.created_at) >= lastMonth && new Date(order.created_at) < today)
      .reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0) || 0;

    // Get revenue for month before last
    const prevMonthRevenue = revenueData
      ?.filter(order => new Date(order.created_at) >= twoMonthsAgo && new Date(order.created_at) < lastMonth)
      .reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0) || 0;

    // Calculate revenue change
    const revenueChange = prevMonthRevenue > 0
      ? ((lastMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100
      : 0;

    // Get total orders
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('id, created_at');

    if (ordersError) throw ordersError;

    const totalOrders = ordersData?.length || 0;

    // Get orders for last month
    const lastMonthOrders = ordersData
      ?.filter(order => new Date(order.created_at) >= lastMonth && new Date(order.created_at) < today)
      .length || 0;

    // Get orders for month before last
    const prevMonthOrders = ordersData
      ?.filter(order => new Date(order.created_at) >= twoMonthsAgo && new Date(order.created_at) < lastMonth)
      .length || 0;

    // Calculate orders change
    const ordersChange = prevMonthOrders > 0
      ? ((lastMonthOrders - prevMonthOrders) / prevMonthOrders) * 100
      : 0;

    // Get active products
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('id, is_active, stock_quantity')
      .eq('is_active', true);

    if (productsError) throw productsError;

    const activeProducts = productsData?.length || 0;

    // Get low stock products (less than 5 units)
    const lowStockProducts = productsData?.filter(product =>
      (product.stock_quantity || 0) < 5
    ).length || 0;

    // Get total customers (unique users with orders)
    const { data: customersData, error: customersError } = await supabase
      .from('orders')
      .select('user_id, created_at')
      .not('user_id', 'is', null);

    if (customersError) throw customersError;

    const uniqueCustomers = new Set(customersData?.map(order => order.user_id) || []);
    const totalCustomers = uniqueCustomers.size;

    // Get customers for last month
    const lastMonthCustomers = new Set(
      customersData
        ?.filter(order =>
          order.user_id &&
          new Date(order.created_at) >= lastMonth &&
          new Date(order.created_at) < today
        )
        .map(order => order.user_id) || []
    );

    // Get customers for month before last
    const prevMonthCustomers = new Set(
      customersData
        ?.filter(order =>
          order.user_id &&
          new Date(order.created_at) >= twoMonthsAgo &&
          new Date(order.created_at) < lastMonth
        )
        .map(order => order.user_id) || []
    );

    // Calculate customers change
    const customersChange = prevMonthCustomers.size > 0
      ? ((lastMonthCustomers.size - prevMonthCustomers.size) / prevMonthCustomers.size) * 100
      : 0;

    // Get pending orders
    const { data: pendingOrdersData, error: pendingOrdersError } = await supabase
      .from('orders')
      .select('id')
      .eq('status', 'pending');

    if (pendingOrdersError) throw pendingOrdersError;

    const pendingOrders = pendingOrdersData?.length || 0;

    // Get products missing images
    const { count: missingImagesCount, error: missingImagesError } = await supabase
      .from('main_site_products')
      .select('*', { count: 'exact', head: true })
      .or('image_url.is.null,image_url.eq.""')
      .eq('is_active', true);

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      activeProducts,
      totalCustomers,
      lowStockProducts,
      pendingOrders,
      missingImagesCount: missingImagesCount || 0,
      revenueChange: Math.round(revenueChange * 100) / 100,
      ordersChange: Math.round(ordersChange * 100) / 100,
      customersChange: Math.round(customersChange * 100) / 100
    });

  } catch (error) {
    console.error('Admin dashboard stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
