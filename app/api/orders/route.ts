import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth, requirePermission } from '../../lib/requireAuth';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Schema for order filtering and pagination
const OrdersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'returned']).optional(),
  paymentStatus: z.enum(['pending', 'processing', 'paid', 'failed', 'refunded', 'partially_refunded', 'voided']).optional(),
  fulfillmentStatus: z.enum(['unfulfilled', 'partial', 'fulfilled', 'shipped', 'delivered', 'returned']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['created_at', 'updated_at', 'total_amount', 'order_number']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
});

// Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerInfo, shippingAddress, billingAddress, paymentMethod, sessionId, userId } = body;

    // Validate required fields
    if (!customerInfo?.firstName || !customerInfo?.lastName || !customerInfo?.email) {
      return NextResponse.json(
        { error: 'Customer information is required' },
        { status: 400 }
      );
    }

    if (!shippingAddress?.address1 || !shippingAddress?.city || !shippingAddress?.state || !shippingAddress?.zipcode) {
      return NextResponse.json(
        { error: 'Complete shipping address is required' },
        { status: 400 }
      );
    }

    if (!sessionId && !userId) {
      return NextResponse.json(
        { error: 'Session ID or User ID required' },
        { status: 400 }
      );
    }

    // Get cart items
    let cartQuery = supabase
      .from('shopping_cart')
      .select(`
        id,
        product_id,
        quantity,
        price_at_time,
        products (
          id,
          name,
          sku,
          image_url,
          stock_quantity,
          is_active
        )
      `);

    if (userId) {
      cartQuery = cartQuery.eq('user_id', userId);
    } else {
      cartQuery = cartQuery.eq('session_id', sessionId);
    }

    const { data: cartItems, error: cartError } = await cartQuery;

    if (cartError || !cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    // Validate stock availability
    for (const item of cartItems) {
      if (!item.products?.is_active) {
        return NextResponse.json(
          { error: `Product ${item.products?.name || 'Unknown'} is no longer available` },
          { status: 400 }
        );
      }

      if ((item.products?.stock_quantity || 0) < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.products?.name || 'Unknown'}` },
          { status: 400 }
        );
      }
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price_at_time) * item.quantity), 0);
    const taxRate = 0.08; // 8% tax
    const taxAmount = subtotal * taxRate;
    const shippingAmount = subtotal >= 75 ? 0 : 9.99; // Free shipping over $75
    const total = subtotal + taxAmount + shippingAmount;

    // Create order
    const orderData = {
      user_id: userId || null,
      customer_email: customerInfo.email,
      customer_first_name: customerInfo.firstName,
      customer_last_name: customerInfo.lastName,
      customer_phone: customerInfo.phone || null,
      status: 'pending',
      payment_status: 'pending',
      fulfillment_status: 'unfulfilled',
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax_amount: parseFloat(taxAmount.toFixed(2)),
      shipping_amount: parseFloat(shippingAmount.toFixed(2)),
      total_amount: parseFloat(total.toFixed(2)),
      shipping_address: shippingAddress,
      billing_address: billingAddress,
      customer_notes: null,
      admin_notes: null
    };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.products?.name || 'Unknown Product',
      product_sku: item.products?.sku || 'N/A',
      product_image_url: item.products?.image_url || null,
      unit_price: parseFloat(item.price_at_time),
      quantity: item.quantity,
      total_price: parseFloat((parseFloat(item.price_at_time) * item.quantity).toFixed(2)),
      fulfillment_status: 'unfulfilled'
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Try to rollback the order
      await supabase.from('orders').delete().eq('id', order.id);
      return NextResponse.json(
        { error: 'Failed to create order items' },
        { status: 500 }
      );
    }

    // Update product stock quantities
    for (const item of cartItems) {
      if (item.products) {
        const newStock = (item.products.stock_quantity || 0) - item.quantity;
        await supabase
          .from('products')
          .update({ stock_quantity: Math.max(0, newStock) })
          .eq('id', item.product_id);
      }
    }

    // Clear the cart
    let clearCartQuery = supabase.from('shopping_cart').delete();
    if (userId) {
      clearCartQuery = clearCartQuery.eq('user_id', userId);
    } else {
      clearCartQuery = clearCartQuery.eq('session_id', sessionId);
    }
    await clearCartQuery;

    // Create initial payment record
    const paymentData = {
      order_id: order.id,
      payment_method: paymentMethod,
      amount: parseFloat(total.toFixed(2)),
      currency: 'USD',
      status: 'pending'
    };

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert(paymentData)
      .select()
      .single();

    if (paymentError) {
      console.error('Error creating payment record:', paymentError);
      // Don't fail the order creation for this
    }

    // Create order status history
    await supabase
      .from('order_status_history')
      .insert({
        order_id: order.id,
        from_status: null,
        to_status: 'pending',
        notes: 'Order created'
      });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
      total: order.total_amount,
      paymentId: payment?.id || null,
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/orders - Get user's orders with pagination and filtering
 */
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const parse = OrdersQuerySchema.safeParse(queryParams);
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
      endDate
    } = parse.data;

    const offset = (page - 1) * limit;

    // Check if user has permission to view all orders (admin/support)
    const canViewAllOrders = user.role === 'admin' || user.role === 'moderator' || user.role === 'support';

    // Build base query
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
        order_items (
          id,
          product_id,
          product_name,
          product_sku,
          product_image_url,
          unit_price,
          quantity,
          total_price,
          fulfillment_status,
          created_at
        )
      `, { count: 'exact' });

    // Apply user filter (unless admin viewing all orders)
    if (!canViewAllOrders) {
      query = query.eq('user_id', user.id);
    }

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

    if (search) {
      query = query.or(`order_number.ilike.%${search}%,customer_email.ilike.%${search}%,customer_first_name.ilike.%${search}%,customer_last_name.ilike.%${search}%`);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: orders, error, count } = await query;

    if (error) {
      console.error('[Orders API] Error fetching orders:', error);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    // Calculate summary statistics
    const summary = {
      totalOrders: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page,
      ordersPerPage: limit
    };

    return NextResponse.json({
      orders: orders || [],
      pagination: summary,
      filters: {
        status,
        paymentStatus,
        fulfillmentStatus,
        search,
        startDate,
        endDate
      }
    });

  } catch (error) {
    console.error('[Orders API] Error in GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
