import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requirePermission } from '../../../lib/requireAuth';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Schema for admin order filtering and pagination
const AdminOrdersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'returned']).optional(),
  paymentStatus: z.enum(['pending', 'processing', 'paid', 'failed', 'refunded', 'partially_refunded', 'voided']).optional(),
  fulfillmentStatus: z.enum(['unfulfilled', 'partial', 'fulfilled', 'shipped', 'delivered', 'returned']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['created_at', 'updated_at', 'total_amount', 'order_number', 'customer_email']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  customerId: z.string().uuid().optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional()
});

// Schema for bulk order operations
const BulkOrderOperationSchema = z.object({
  orderIds: z.array(z.string().uuid()).min(1),
  operation: z.enum(['update_status', 'update_fulfillment', 'export', 'delete']),
  data: z.object({
    status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'returned']).optional(),
    fulfillmentStatus: z.enum(['unfulfilled', 'partial', 'fulfilled', 'shipped', 'delivered', 'returned']).optional(),
    notes: z.string().optional(),
    notifyCustomers: z.boolean().default(false)
  }).optional()
});

/**
 * GET /api/admin/orders - Get all orders with advanced filtering (admin only)
 */
export async function GET(req: NextRequest) {
  try {
    // Require view_all_orders permission (admin/support/moderator)
    const auth = await requirePermission('view_all_orders');
    if (auth instanceof NextResponse) return auth;

    // Parse and validate query parameters
    const { searchParams } = new URL(req.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    const parse = AdminOrdersQuerySchema.safeParse(queryParams);
    if (!parse.success) {
      return NextResponse.json({ 
        error: 'Invalid query parameters', 
        issues: parse.error.issues 
      }, { status: 400 });
    }

    const { 
      page, 
      limit, 
      status, 
      paymentStatus, 
      fulfillmentStatus, 
      search, 
      sortBy, 
      sortOrder,
      startDate,
      endDate,
      customerId,
      minAmount,
      maxAmount
    } = parse.data;

    const offset = (page - 1) * limit;

    // Build comprehensive query
    let query = supabase
      .from('orders')
      .select(`
        id,
        order_number,
        user_id,
        customer_email,
        customer_first_name,
        customer_last_name,
        customer_phone,
        status,
        payment_status,
        fulfillment_status,
        subtotal,
        tax_amount,
        shipping_amount,
        discount_amount,
        total_amount,
        shipping_address,
        billing_address,
        customer_notes,
        admin_notes,
        gift_message,
        is_gift,
        tracking_number,
        carrier,
        created_at,
        updated_at,
        shipped_at,
        delivered_at,
        users (
          id,
          first_name,
          last_name,
          email,
          membership_tier_id
        ),
        order_items (
          id,
          product_id,
          product_name,
          product_sku,
          quantity,
          unit_price,
          total_price,
          fulfillment_status
        ),
        payments (
          id,
          payment_method,
          amount,
          status,
          transaction_id,
          created_at
        )
      `, { count: 'exact' });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (paymentStatus) {
      query = query.eq('payment_status', paymentStatus);
    }

    if (fulfillmentStatus) {
      query = query.eq('fulfillment_status', fulfillmentStatus);
    }

    if (customerId) {
      query = query.eq('user_id', customerId);
    }

    if (search) {
      query = query.or(`order_number.ilike.%${search}%,customer_email.ilike.%${search}%,customer_first_name.ilike.%${search}%,customer_last_name.ilike.%${search}%`);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    if (minAmount) {
      query = query.gte('total_amount', minAmount);
    }

    if (maxAmount) {
      query = query.lte('total_amount', maxAmount);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: orders, error, count } = await query;

    if (error) {
      console.error('[Admin Orders API] Error fetching orders:', error);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    // Calculate summary statistics
    const { data: stats } = await supabase
      .from('orders')
      .select('status, payment_status, fulfillment_status, total_amount')
      .then(({ data }) => {
        if (!data) return { data: null };
        
        const summary = {
          totalOrders: data.length,
          totalRevenue: data.reduce((sum, order) => sum + parseFloat(order.total_amount || '0'), 0),
          statusCounts: data.reduce((acc: any, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
          }, {}),
          paymentStatusCounts: data.reduce((acc: any, order) => {
            acc[order.payment_status] = (acc[order.payment_status] || 0) + 1;
            return acc;
          }, {}),
          fulfillmentStatusCounts: data.reduce((acc: any, order) => {
            acc[order.fulfillment_status] = (acc[order.fulfillment_status] || 0) + 1;
            return acc;
          }, {})
        };
        
        return { data: summary };
      });

    return NextResponse.json({
      orders: orders || [],
      pagination: {
        totalOrders: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        currentPage: page,
        ordersPerPage: limit
      },
      summary: stats || {},
      filters: {
        status,
        paymentStatus,
        fulfillmentStatus,
        search,
        startDate,
        endDate,
        customerId,
        minAmount,
        maxAmount
      }
    });

  } catch (error) {
    console.error('[Admin Orders API] Error in GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/orders - Bulk operations on orders (admin only)
 */
export async function POST(req: NextRequest) {
  try {
    // Require manage_orders permission (admin/moderator)
    const auth = await requirePermission('update_order_status');
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    // Parse and validate request body
    const body = await req.json().catch(() => ({}));
    const parse = BulkOrderOperationSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ 
        error: 'Invalid bulk operation data', 
        issues: parse.error.issues 
      }, { status: 400 });
    }

    const { orderIds, operation, data } = parse.data;

    const results = [];

    switch (operation) {
      case 'update_status':
        if (!data?.status) {
          return NextResponse.json({ error: 'Status is required for update_status operation' }, { status: 400 });
        }

        for (const orderId of orderIds) {
          try {
            const { error } = await supabase
              .from('orders')
              .update({ 
                status: data.status,
                updated_at: new Date().toISOString()
              })
              .eq('id', orderId);

            if (error) {
              results.push({ orderId, success: false, error: error.message });
            } else {
              // Create status history entry
              await supabase
                .from('order_status_history')
                .insert({
                  order_id: orderId,
                  to_status: data.status,
                  changed_by: user.id,
                  notes: data.notes || `Bulk status update to ${data.status}`
                });

              results.push({ orderId, success: true });
            }
          } catch (error) {
            results.push({ orderId, success: false, error: 'Unexpected error' });
          }
        }
        break;

      case 'update_fulfillment':
        if (!data?.fulfillmentStatus) {
          return NextResponse.json({ error: 'Fulfillment status is required for update_fulfillment operation' }, { status: 400 });
        }

        for (const orderId of orderIds) {
          try {
            const { error } = await supabase
              .from('orders')
              .update({ 
                fulfillment_status: data.fulfillmentStatus,
                updated_at: new Date().toISOString()
              })
              .eq('id', orderId);

            if (error) {
              results.push({ orderId, success: false, error: error.message });
            } else {
              results.push({ orderId, success: true });
            }
          } catch (error) {
            results.push({ orderId, success: false, error: 'Unexpected error' });
          }
        }
        break;

      case 'export':
        // TODO: Implement order export functionality
        return NextResponse.json({ error: 'Export functionality not yet implemented' }, { status: 501 });

      case 'delete':
        // Soft delete orders (mark as cancelled)
        for (const orderId of orderIds) {
          try {
            const { error } = await supabase
              .from('orders')
              .update({ 
                status: 'cancelled',
                admin_notes: 'Order cancelled via bulk operation',
                updated_at: new Date().toISOString()
              })
              .eq('id', orderId);

            if (error) {
              results.push({ orderId, success: false, error: error.message });
            } else {
              results.push({ orderId, success: true });
            }
          } catch (error) {
            results.push({ orderId, success: false, error: 'Unexpected error' });
          }
        }
        break;

      default:
        return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
    }

    return NextResponse.json({
      message: `Bulk ${operation} operation completed`,
      results,
      summary: {
        total: orderIds.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    });

  } catch (error) {
    console.error('[Admin Orders API] Error in POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
