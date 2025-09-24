import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '../../../../lib/storage';
import { requireAuth } from '../../../lib/requireAuth';
import { z } from 'zod';

// Import KajaPay client and types
import { kajaPayClient } from '../../../../server/kajapay/client';

const VoidSchema = z.object({
  orderId: z.string().uuid(),
  reason: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    // Require authentication (admin only for voids)
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    // TODO: Add admin role check when role system is implemented
    // For now, allow order owner to void their own orders within a short timeframe

    // Parse and validate request body
    const body = await req.json().catch(() => ({}));
    const parse = VoidSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ 
        error: 'Invalid void data', 
        issues: parse.error.issues 
      }, { status: 400 });
    }

    const { orderId, reason } = parse.data;

    // Get storage instance
    const storage = await getStorage();

    // Fetch the order to void
    const order = await storage.getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Verify order belongs to authenticated user (unless admin)
    if (order.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if order is paid
    if (order.paymentStatus !== 'paid') {
      return NextResponse.json({ error: 'Order not paid, cannot void' }, { status: 409 });
    }

    // Check if order already voided or refunded
    if (order.paymentStatus === 'voided' || order.paymentStatus === 'refunded') {
      return NextResponse.json({ error: 'Order already voided or refunded' }, { status: 409 });
    }

    // Check if order is recent enough to void (typically within 24 hours)
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    const hoursSinceOrder = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceOrder > 24) {
      return NextResponse.json({ 
        error: 'Order too old to void, please request a refund instead' 
      }, { status: 409 });
    }

    // Get the original payment transaction
    const originalTransactions = await storage.getOrderTransactions(orderId);
    const chargeTransaction = originalTransactions.find(t => t.transactionType === 'charge' && t.status === 'approved');
    
    if (!chargeTransaction || !chargeTransaction.kajaPayTransactionId) {
      return NextResponse.json({ error: 'Original payment transaction not found' }, { status: 404 });
    }

    // Create void transaction record (pending)
    const voidTransaction = await storage.createTransaction({
      orderId: order.id,
      transactionType: 'void',
      amount: order.totalAmount,
      currency: 'USD',
      status: 'pending',
      paymentMethodData: {
        originalTransactionId: chargeTransaction.kajaPayTransactionId,
        reason: reason || 'Order cancellation'
      }
    });

    // Process void with KajaPay
    const voidResult = await kajaPayClient.voidTransaction(chargeTransaction.kajaPayTransactionId);

    // Update void transaction with result
    await storage.updateTransaction(voidTransaction.id, {
      kajaPayTransactionId: voidResult.transactionId,
      kajaPayReferenceNumber: voidResult.referenceNumber,
      status: voidResult.success ? 'approved' : 'declined',
      kajaPayStatusCode: voidResult.responseCode,
      errorMessage: voidResult.errorMessage
    });

    if (voidResult.success) {
      // Update order status
      await storage.updateOrder(order.id, {
        paymentStatus: 'voided',
        status: 'cancelled'
      });

      return NextResponse.json({
        success: true,
        transactionId: voidResult.transactionId,
        referenceNumber: voidResult.referenceNumber,
        order: {
          id: order.id,
          paymentStatus: 'voided',
          status: 'cancelled'
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: voidResult.responseText || 'Void failed',
        responseCode: voidResult.responseCode
      }, { status: 402 });
    }

  } catch (error) {
    console.error('[Void] Processing error:', error);
    return NextResponse.json({
      success: false,
      error: 'Void processing failed'
    }, { status: 500 });
  }
}
