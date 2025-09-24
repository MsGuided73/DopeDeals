import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '../../../../../lib/storage';
import { requireAuth } from '../../../../lib/requireAuth';
import { z } from 'zod';

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
  { params }: { params: OrderStatusParams }
) {
  try {
    // Require authentication
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    const { orderId } = params;

    // Get storage instance
    const storage = await getStorage();

    // Get the order
    const order = await storage.getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Verify order belongs to user (unless admin)
    // TODO: Add admin role check when role system is implemented
    if (order.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get order status history if available
    let statusHistory = [];
    try {
      if (typeof storage.getOrderStatusHistory === 'function') {
        statusHistory = await storage.getOrderStatusHistory(orderId);
      }
    } catch (error) {
      console.warn('[Order Status] Could not fetch status history:', error);
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      fulfillmentStatus: order.fulfillmentStatus,
      trackingNumber: order.trackingNumber,
      carrier: order.carrier,
      statusHistory,
      updatedAt: order.updatedAt,
      createdAt: order.createdAt
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
  { params }: { params: OrderStatusParams }
) {
  try {
    // Require authentication
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    const { orderId } = params;

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

    // Get storage instance
    const storage = await getStorage();

    // Get the order
    const order = await storage.getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Verify order belongs to user (unless admin)
    // TODO: Add admin role check when role system is implemented
    if (order.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Validate status transitions
    const validTransitions = getValidStatusTransitions(order.status);
    if (!validTransitions.includes(status)) {
      return NextResponse.json({ 
        error: `Invalid status transition from ${order.status} to ${status}` 
      }, { status: 400 });
    }

    // Prepare update data
    const updateData: any = {
      status,
      updatedAt: new Date()
    };

    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (fulfillmentStatus) updateData.fulfillmentStatus = fulfillmentStatus;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (carrier) updateData.carrier = carrier;
    if (notes) updateData.adminNotes = notes;

    // Update the order
    const updatedOrder = await storage.updateOrder(orderId, updateData);
    if (!updatedOrder) {
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    // Create status history entry
    try {
      if (typeof storage.createOrderStatusHistory === 'function') {
        await storage.createOrderStatusHistory({
          orderId,
          fromStatus: order.status,
          toStatus: status,
          notes: notes || `Status updated to ${status}`,
          updatedBy: user.id,
          createdAt: new Date()
        });
      }
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
      const { storage: serverStorage } = await import('../../../../../server/storage');
      
      const svc = new ShipstationService({
        apiKey: process.env.SHIPSTATION_API_KEY!,
        apiSecret: process.env.SHIPSTATION_API_SECRET!,
        webhookUrl: process.env.SHIPSTATION_WEBHOOK_URL
      }, serverStorage);

      // Update ShipStation order status
      // Implementation depends on ShipStation API
    }
  } catch (error) {
    console.error('[Order Status] ShipStation sync error:', error);
  }

  // Sync to Zoho
  try {
    if (process.env.ZOHO_CLIENT_ID) {
      const { ZohoClient } = await import('../../../../../server/zoho/client');
      
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
      }
    }
  } catch (error) {
    console.error('[Order Status] Zoho sync error:', error);
  }
}
