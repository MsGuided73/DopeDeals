import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth, requirePermission } from '../../../lib/requireAuth';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Schema for order updates
const UpdateOrderSchema = z.object({
  status: z.enum([
    'pending',
    'confirmed', 
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
    'returned'
  ]).optional(),
  paymentStatus: z.enum([
    'pending',
    'processing',
    'paid',
    'failed',
    'refunded',
    'partially_refunded',
    'voided'
  ]).optional(),
  fulfillmentStatus: z.enum([
    'unfulfilled',
    'partial',
    'fulfilled',
    'shipped',
    'delivered',
    'returned'
  ]).optional(),
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
  customerNotes: z.string().optional(),
  adminNotes: z.string().optional(),
  notifyCustomer: z.boolean().default(true)
});

interface OrderParams {
  orderId: string;
}

/**
 * GET /api/orders/[orderId] - Get detailed order information
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    // Require authentication
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    const { orderId } = await params;

    // Get order with all related data
    const { data: order, error } = await supabase
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
          created_at,
          products (
            id,
            name,
            slug,
            image_url,
            is_active
          )
        ),
        payments (
          id,
          payment_method,
          amount,
          currency,
          status,
          transaction_id,
          processor_response,
          created_at,
          updated_at
        ),
        order_status_history (
          id,
          from_status,
          to_status,
          changed_by,
          notes,
          created_at
        )
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      console.error('[Order Details API] Error fetching order:', error);
      return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
    }

    // Check if user can access this order
    const canViewAllOrders = user.role === 'admin' || user.role === 'moderator' || user.role === 'support';
    
    if (!canViewAllOrders && order.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Helper to parse image URLs that might be comma-separated strings
    const parseImageUrls = (value?: string[] | string | null) => {
      if (!value) return [] as string[];
      if (Array.isArray(value)) {
        return value
          .flatMap((entry) => (typeof entry === 'string' ? entry.split(',') : [entry]))
          .map((entry) => (typeof entry === 'string' ? entry.trim() : entry))
          .filter(Boolean);
      }
      if (typeof value !== 'string') return [value].filter(Boolean);
      return value
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean);
    };

    // Calculate order summary and normalize product images
    const orderSummary = {
      itemCount: order.order_items?.length || 0,
      totalQuantity: order.order_items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0,
      paymentCount: order.payments?.length || 0,
      statusChangeCount: order.order_status_history?.length || 0
    };

    const normalizedOrderItems = (order.order_items || []).map((item: any) => {
      const itemImages = parseImageUrls(item.product_image_url);
      const productImages = parseImageUrls(item.products?.image_url);

      return {
        ...item,
        product_image_url: itemImages[0] || item.product_image_url,
        products: item.products ? {
          ...item.products,
          image_url: productImages[0] || item.products.image_url
        } : null
      };
    });

    return NextResponse.json({
      order: {
        ...order,
        order_items: normalizedOrderItems,
        summary: orderSummary
      }
    });

  } catch (error) {
    console.error('[Order Details API] Error in GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/orders/[orderId] - Update order details (admin only)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    // Require permission to update orders
    const auth = await requirePermission('update_order_status');
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    const { orderId } = await params;
    const body = await req.json().catch(() => ({}));
    
    const parse = UpdateOrderSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ 
        error: 'Invalid update data', 
        issues: parse.error.issues 
      }, { status: 400 });
    }

    const updates = parse.data;

    // Get current order to track changes
    const { data: currentOrder, error: fetchError } = await supabase
      .from('orders')
      .select('id, status, payment_status, fulfillment_status, user_id')
      .eq('id', orderId)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    // Add fields that are being updated
    if (updates.status) updateData.status = updates.status;
    if (updates.paymentStatus) updateData.payment_status = updates.paymentStatus;
    if (updates.fulfillmentStatus) updateData.fulfillment_status = updates.fulfillmentStatus;
    if (updates.trackingNumber) updateData.tracking_number = updates.trackingNumber;
    if (updates.carrier) updateData.carrier = updates.carrier;
    if (updates.customerNotes) updateData.customer_notes = updates.customerNotes;
    if (updates.adminNotes) updateData.admin_notes = updates.adminNotes;

    // Set shipped_at timestamp when status changes to shipped
    if (updates.status === 'shipped' && currentOrder.status !== 'shipped') {
      updateData.shipped_at = new Date().toISOString();
    }

    // Set delivered_at timestamp when status changes to delivered
    if (updates.status === 'delivered' && currentOrder.status !== 'delivered') {
      updateData.delivered_at = new Date().toISOString();
    }

    // Update the order
    const { error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId);

    if (updateError) {
      console.error('[Order Details API] Error updating order:', updateError);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    // Create status history entries for changed fields
    const statusHistoryEntries = [];

    if (updates.status && updates.status !== currentOrder.status) {
      statusHistoryEntries.push({
        order_id: orderId,
        from_status: currentOrder.status,
        to_status: updates.status,
        changed_by: user.id,
        notes: `Status changed from ${currentOrder.status} to ${updates.status}`
      });
    }

    if (updates.paymentStatus && updates.paymentStatus !== currentOrder.payment_status) {
      statusHistoryEntries.push({
        order_id: orderId,
        from_status: currentOrder.payment_status,
        to_status: updates.paymentStatus,
        changed_by: user.id,
        notes: `Payment status changed from ${currentOrder.payment_status} to ${updates.paymentStatus}`
      });
    }

    if (updates.fulfillmentStatus && updates.fulfillmentStatus !== currentOrder.fulfillment_status) {
      statusHistoryEntries.push({
        order_id: orderId,
        from_status: currentOrder.fulfillment_status,
        to_status: updates.fulfillmentStatus,
        changed_by: user.id,
        notes: `Fulfillment status changed from ${currentOrder.fulfillment_status} to ${updates.fulfillmentStatus}`
      });
    }

    // Insert status history entries
    if (statusHistoryEntries.length > 0) {
      const { error: historyError } = await supabase
        .from('order_status_history')
        .insert(statusHistoryEntries);

      if (historyError) {
        console.error('[Order Details API] Error creating status history:', historyError);
        // Don't fail the update for this
      }
    }

    // TODO: Send customer notification if notifyCustomer is true
    if (updates.notifyCustomer && statusHistoryEntries.length > 0) {
      // Implement email notification logic here
      console.log(`[Order Details API] Should notify customer for order ${orderId}`);
    }

    return NextResponse.json({ 
      message: 'Order updated successfully',
      changes: statusHistoryEntries.length,
      updates: Object.keys(updateData).filter(key => key !== 'updated_at')
    });

  } catch (error) {
    console.error('[Order Details API] Error in PATCH:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
