import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requirePermission } from '../../../../lib/requireAuth';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Schema for analytics query parameters
const AnalyticsQuerySchema = z.object({
  period: z.enum(['day', 'week', 'month', 'quarter', 'year']).default('month'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  groupBy: z.enum(['day', 'week', 'month', 'status', 'payment_method', 'customer']).default('day'),
  metrics: z.array(z.enum(['revenue', 'orders', 'customers', 'avg_order_value', 'items_sold'])).default(['revenue', 'orders'])
});

/**
 * GET /api/admin/orders/analytics - Get order analytics and insights
 */
export async function GET(req: NextRequest) {
  try {
    // Require view_analytics permission (admin/moderator)
    const auth = await requirePermission('view_analytics');
    if (auth instanceof NextResponse) return auth;

    // Parse and validate query parameters
    const { searchParams } = new URL(req.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    // Handle metrics array parameter
    if (queryParams.metrics) {
const metricsArray = queryParams.metrics.split(',');
              queryParams.metrics = metricsArray;
    const parse = AnalyticsQuerySchema.safeParse(queryParams);
    if (!parse.success) {
      return NextResponse.json({ 
        error: 'Invalid query parameters', 
        issues: parse.error.issues 
      }, { status: 400 });
    }

    const { period, startDate, endDate, groupBy, metrics } = parse.data;

    // Calculate date range if not provided
    const now = new Date();
    const defaultStartDate = startDate || new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const defaultEndDate = endDate || now.toISOString();

    // Get basic order statistics
    const { data: orderStats, error: statsError } = await supabase
      .from('orders')
      .select('id, status, payment_status, fulfillment_status, total_amount, created_at, user_id')
      .gte('created_at', defaultStartDate)
      .lte('created_at', defaultEndDate);

    if (statsError) {
      console.error('[Order Analytics API] Error fetching order stats:', statsError);
      return NextResponse.json({ error: 'Failed to fetch order statistics' }, { status: 500 });
    }

    // Calculate key metrics
    const totalOrders = orderStats?.length || 0;
    const totalRevenue = orderStats?.reduce((sum, order) => sum + parseFloat(order.total_amount || '0'), 0) || 0;
    const uniqueCustomers = new Set(orderStats?.map(order => order.user_id).filter(Boolean)).size;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Status distribution
    const statusDistribution = orderStats?.reduce((acc: any, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {}) || {};

    const paymentStatusDistribution = orderStats?.reduce((acc: any, order) => {
      acc[order.payment_status] = (acc[order.payment_status] || 0) + 1;
      return acc;
    }, {}) || {};

    const fulfillmentStatusDistribution = orderStats?.reduce((acc: any, order) => {
      acc[order.fulfillment_status] = (acc[order.fulfillment_status] || 0) + 1;
      return acc;
    }, {}) || {};

    // Time series data based on groupBy
    let timeSeriesData = [];
    if (groupBy === 'day' || groupBy === 'week' || groupBy === 'month') {
      const groupedData = orderStats?.reduce((acc: any, order) => {
        const date = new Date(order.created_at);
        let key: string;
        
        switch (groupBy) {
          case 'day':
            key = date.toISOString().split('T')[0];
            break;
          case 'week':
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            key = weekStart.toISOString().split('T')[0];
            break;
          case 'month':
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            break;
          default:
            key = date.toISOString().split('T')[0];
        }

        if (!acc[key]) {
          acc[key] = {
            date: key,
            orders: 0,
            revenue: 0,
            customers: new Set()
          };
        }

        acc[key].orders += 1;
        acc[key].revenue += parseFloat(order.total_amount || '0');
        if (order.user_id) {
          acc[key].customers.add(order.user_id);
        }

        return acc;
      }, {}) || {};

      timeSeriesData = Object.values(groupedData).map((item: any) => ({
        ...item,
        customers: item.customers.size,
        avgOrderValue: item.orders > 0 ? item.revenue / item.orders : 0
      }));
    }

    // Get top products
    const { data: topProducts, error: productsError } = await supabase
      .from('order_items')
      .select(`
        product_id,
        product_name,
        product_sku,
        quantity,
        total_price,
        orders!inner (
          created_at
        )
      `)
      .gte('orders.created_at', defaultStartDate)
      .lte('orders.created_at', defaultEndDate);

    const productStats = topProducts?.reduce((acc: any, item) => {
      const key = item.product_id;
      if (!acc[key]) {
        acc[key] = {
          productId: item.product_id,
          productName: item.product_name,
          productSku: item.product_sku,
          totalQuantity: 0,
          totalRevenue: 0,
          orderCount: 0
        };
      }

      acc[key].totalQuantity += item.quantity;
      acc[key].totalRevenue += parseFloat(item.total_price || '0');
      acc[key].orderCount += 1;

      return acc;
    }, {}) || {};

    const topProductsList = Object.values(productStats)
      .sort((a: any, b: any) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10);

    // Get customer insights
    const { data: customerStats, error: customerError } = await supabase
      .from('orders')
      .select(`
        user_id,
        total_amount,
        created_at,
        users (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .gte('created_at', defaultStartDate)
      .lte('created_at', defaultEndDate)
      .not('user_id', 'is', null);

    const customerInsights = customerStats?.reduce((acc: any, order) => {
      const key = order.user_id;
      if (!acc[key]) {
        acc[key] = {
          customerId: order.user_id,
          customerName: order.users ? `${order.users.first_name} ${order.users.last_name}`.trim() : 'Unknown',
          customerEmail: order.users?.email || 'Unknown',
          orderCount: 0,
          totalSpent: 0,
          avgOrderValue: 0,
          firstOrder: order.created_at,
          lastOrder: order.created_at
        };
      }

      acc[key].orderCount += 1;
      acc[key].totalSpent += parseFloat(order.total_amount || '0');
      acc[key].avgOrderValue = acc[key].totalSpent / acc[key].orderCount;
      
      if (new Date(order.created_at) < new Date(acc[key].firstOrder)) {
        acc[key].firstOrder = order.created_at;
      }
      if (new Date(order.created_at) > new Date(acc[key].lastOrder)) {
        acc[key].lastOrder = order.created_at;
      }

      return acc;
    }, {}) || {};

    const topCustomers = Object.values(customerInsights)
      .sort((a: any, b: any) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    // Calculate growth rates (compare with previous period)
    const periodDays = Math.ceil((new Date(defaultEndDate).getTime() - new Date(defaultStartDate).getTime()) / (1000 * 60 * 60 * 24));
    const previousStartDate = new Date(new Date(defaultStartDate).getTime() - (periodDays * 24 * 60 * 60 * 1000)).toISOString();
    const previousEndDate = defaultStartDate;

    const { data: previousPeriodStats } = await supabase
      .from('orders')
      .select('id, total_amount, user_id')
      .gte('created_at', previousStartDate)
      .lte('created_at', previousEndDate);

    const previousRevenue = previousPeriodStats?.reduce((sum, order) => sum + parseFloat(order.total_amount || '0'), 0) || 0;
    const previousOrders = previousPeriodStats?.length || 0;
    const previousCustomers = new Set(previousPeriodStats?.map(order => order.user_id).filter(Boolean)).size;

    const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;
    const orderGrowth = previousOrders > 0 ? ((totalOrders - previousOrders) / previousOrders) * 100 : 0;
    const customerGrowth = previousCustomers > 0 ? ((uniqueCustomers - previousCustomers) / previousCustomers) * 100 : 0;

    return NextResponse.json({
      summary: {
        totalOrders,
        totalRevenue,
        uniqueCustomers,
        avgOrderValue,
        period: {
          startDate: defaultStartDate,
          endDate: defaultEndDate,
          days: periodDays
        }
      },
      growth: {
        revenueGrowth: Math.round(revenueGrowth * 100) / 100,
        orderGrowth: Math.round(orderGrowth * 100) / 100,
        customerGrowth: Math.round(customerGrowth * 100) / 100
      },
      distributions: {
        status: statusDistribution,
        paymentStatus: paymentStatusDistribution,
        fulfillmentStatus: fulfillmentStatusDistribution
      },
      timeSeries: timeSeriesData,
      topProducts: topProductsList,
      topCustomers,
      insights: {
        conversionRate: uniqueCustomers > 0 ? (totalOrders / uniqueCustomers) : 0,
        repeatCustomerRate: Object.values(customerInsights).filter((c: any) => c.orderCount > 1).length / Object.keys(customerInsights).length * 100,
        averageOrdersPerCustomer: uniqueCustomers > 0 ? totalOrders / uniqueCustomers : 0
      }
    });

  } catch (error) {
    console.error('[Order Analytics API] Error in GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
