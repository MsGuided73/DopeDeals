import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth, requirePermission } from '../../../../lib/requireAuth';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const UpdateStatusSchema = z.object({
  status: z.enum([
    'pending',
    'confirmed', 
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
    'returned'
  ]),
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
  notes: z.string().optional(),
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
  notifyCustomer: z.boolean().default(true)
});

interface OrderStatusParams {
  orderId: string;
}

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

    // Get order with status history
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        user_id,
        status,
        payment_status,
        fulfillment_status,
        tracking_number,
        carrier,
        created_at,
        updated_at,
        shipped_at,
        delivered_at,
        order_status_history (
          id,
          from_status,
          to_status,
          changed_by,
          notes,
          created_at,
          users!changed_by (
            id,
            first_name,
            last_name,
            email
          )
        )
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      console.error('[Order Status] Error fetching order:', error);
      return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
    }

    // Check if user can access this order
    const canViewAllOrders = user.role === 'admin' || user.role === 'moderator' || user.role === 'support';

    if (!canViewAllOrders && order.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Format status history
    const statusHistory = order.order_status_history?.map((entry: any) => ({
      id: entry.id,
      fromStatus: entry.from_status,
      toStatus: entry.to_status,
      changedBy: entry.users ? {
        id: entry.users.id,
        name: `${entry.users.first_name} ${entry.users.last_name}`.trim(),
        email: entry.users.email
      } : null,
      notes: entry.notes,
      createdAt: entry.created_at
    })) || [];

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.order_number,
      status: order.status,
      paymentStatus: order.payment_status,
      fulfillmentStatus: order.fulfillment_status,
      trackingNumber: order.tracking_number,
      carrier: order.carrier,
      statusHistory,
      timestamps: {
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        shippedAt: order.shipped_at,
        deliveredAt: order.delivered_at
      }
    });

  } catch (error) {
    console.error('[Order Status] Get error:', error);
    return NextResponse.json({
      error: 'Failed to get order status'
    }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    // Require permission to update order status
    const auth = await requirePermission('update_order_status');
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    const { orderId } = await params;

    // Parse and validate request body
    const body = await req.json().catch(() => ({}));
    const parse = UpdateStatusSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ 
        error: 'Invalid status update data', 
        issues: parse.error.issues 
      }, { status: 400 });
    }

    const { status, paymentStatus, fulfillmentStatus, notes, trackingNumber, carrier, notifyCustomer } = parse.data;

    // Get current order
    const { data: currentOrder, error: fetchError } = await supabase
      .from('orders')
      .select('id, order_number, user_id, status, payment_status, fulfillment_status, tracking_number, carrier')
      .eq('id', orderId)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
    }

    // Validate status transitions
    const validTransitions = getValidStatusTransitions(currentOrder.status);
    if (!validTransitions.includes(status)) {
      return NextResponse.json({
        error: `Invalid status transition from ${currentOrder.status} to ${status}`
      }, { status: 400 });
    }

    // Prepare update data
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (paymentStatus) updateData.payment_status = paymentStatus;
    if (fulfillmentStatus) updateData.fulfillment_status = fulfillmentStatus;
    if (trackingNumber) updateData.tracking_number = trackingNumber;
    if (carrier) updateData.carrier = carrier;
    if (notes) updateData.admin_notes = notes;

    // Update the order
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    if (updateError || !updatedOrder) {
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    // Create status history entry
    try {
      await supabase
        .from('order_status_history')
        .insert({
          order_id: orderId,
          from_status: currentOrder.status,
          to_status: status,
          changed_by: user.id,
          notes: notes || `Status updated to ${status}`
        });
    } catch (error) {
      console.warn('[Order Status] Could not create status history:', error);
    }

    // Send notification to customer if requested
    if (notifyCustomer) {
      try {
        await sendOrderStatusNotification(updatedOrder, status, trackingNumber, carrier);
      } catch (error) {
        console.warn('[Order Status] Could not send notification:', error);
      }
    }

    // Update external systems (ShipStation, Zoho) if needed
    try {
      await syncOrderStatusToExternalSystems(updatedOrder, status);
    } catch (error) {
      console.warn('[Order Status] Could not sync to external systems:', error);
    }

    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        paymentStatus: updatedOrder.paymentStatus,
        fulfillmentStatus: updatedOrder.fulfillmentStatus,
        trackingNumber: updatedOrder.trackingNumber,
        carrier: updatedOrder.carrier,
        updatedAt: updatedOrder.updatedAt
      }
    });

  } catch (error) {
    console.error('[Order Status] Update error:', error);
    return NextResponse.json({
      error: 'Failed to update order status'
    }, { status: 500 });
  }
}

// Helper function to get valid status transitions
function getValidStatusTransitions(currentStatus: string): string[] {
  const transitions: Record<string, string[]> = {
    'pending': ['confirmed', 'cancelled'],
    'confirmed': ['processing', 'cancelled'],
    'processing': ['shipped', 'cancelled'],
    'shipped': ['delivered', 'returned'],
    'delivered': ['returned'],
    'cancelled': [], // Terminal state
    'refunded': [], // Terminal state
    'returned': ['refunded']
  };

  return transitions[currentStatus] || [];
}

// Helper function to send order status notifications
async function sendOrderStatusNotification(
  order: any, 
  status: string, 
  trackingNumber?: string, 
  carrier?: string
): Promise<void> {
  // TODO: Implement email/SMS notification system
  console.log(`[Order Status] Would send notification for order ${order.orderNumber}: ${status}`);
  
  // Example notification logic:
  // - Send email to customer
  // - Send SMS if phone number provided
  // - Create in-app notification
}

// Helper function to sync order status to external systems
async function syncOrderStatusToExternalSystems(order: any, status: string): Promise<void> {
  // Sync to ShipStation
  try {
    if (status === 'shipped' && process.env.SHIPSTATION_API_KEY) {
      const { ShipstationService } = await import('../../../../../server/shipstation/service');
      const { SupabaseStorage } = await import('../../../../../server/supabase-storage');

      const storage = new SupabaseStorage();
      const svc = new ShipstationService({
        apiKey: process.env.SHIPSTATION_API_KEY!,
        apiSecret: process.env.SHIPSTATION_API_SECRET!,
        webhookUrl: process.env.SHIPSTATION_WEBHOOK_URL
      }, storage);

      // Update ShipStation order status
      // Implementation depends on ShipStation API
    }
  } catch (error) {
    console.error('[Order Status] ShipStation sync error:', error);
  }

  // Sync to Zoho - TODO: Implement when Zoho integration is available
  try {
    if (process.env.ZOHO_CLIENT_ID) {
      // Map internal status to Zoho status
      const zohoStatusMap: Record<string, string> = {
        'pending': 'draft',
        'confirmed': 'sent',
        'processing': 'accepted',
        'shipped': 'accepted',
        'delivered': 'closed',
        'cancelled': 'void',
        'refunded': 'void'
      };

      const zohoStatus = zohoStatusMap[status];
      if (zohoStatus && order.zohoOrderId) {
        // Update Zoho order status
        // Implementation depends on Zoho API integration
        console.log(`[Order Status] Would sync to Zoho: ${zohoStatus}`);
      }
    }
  } catch (error) {
    console.error('[Order Status] Zoho sync error:', error);
  }
}
