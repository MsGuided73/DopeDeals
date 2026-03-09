import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '../../../../lib/storage';
import { requireAuth } from '../../../lib/requireAuth';
import { UserRole } from '../../../types/auth';
import { z } from 'zod';

// Import KajaPay client and types
import { kajaPayClient } from '../../../../lib/services/kajapay/client';
import { RefundResult } from '../../../../lib/services/kajapay/types';

const RefundSchema = z.object({
  orderId: z.string().uuid(),
  amount: z.number().positive().optional(), // If not provided, refund full amount
  reason: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    // Require authentication (admin or customer for their own orders)
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    // Parse and validate request body
    const body = await req.json().catch(() => ({}));
    const parse = RefundSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ 
        error: 'Invalid refund data', 
        issues: parse.error.issues 
      }, { status: 400 });
    }

    const { orderId, amount, reason } = parse.data;

    // Get storage instance
    const storage = await getStorage();

    // Fetch the order to refund
    const order = await storage.getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Verify order belongs to authenticated user, or user is an admin
    const isAdmin = user.role && (user.role === UserRole.ADMIN || user.role === UserRole.MODERATOR);
    if (!isAdmin && order.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if order is paid
    if (order.paymentStatus !== 'paid') {
      return NextResponse.json({ error: 'Order not paid, cannot refund' }, { status: 409 });
    }

    // Check if order already refunded
    if (order.paymentStatus === 'refunded') {
      return NextResponse.json({ error: 'Order already refunded' }, { status: 409 });
    }

    // Get the original payment transaction
    const originalTransaction = await storage.getOrderTransactions(orderId);
    const chargeTransaction = originalTransaction.find((t: any) => t.transactionType === 'charge' && t.status === 'approved');
    
    if (!chargeTransaction || !chargeTransaction.kajaPayTransactionId) {
      return NextResponse.json({ error: 'Original payment transaction not found' }, { status: 404 });
    }

    // Determine refund amount
    const refundAmount = amount || Number(order.totalAmount);
    
    // Validate refund amount doesn't exceed original charge
    if (refundAmount > Number(order.totalAmount)) {
      return NextResponse.json({ error: 'Refund amount exceeds original charge' }, { status: 400 });
    }

    // Create refund transaction record (pending)
    const refundTransaction = await (storage as any).createTransaction({
      orderId: order.id,
      transactionType: 'refund',
      amount: refundAmount.toString(),
      currency: 'USD',
      status: 'pending',
      paymentMethodData: {
        originalTransactionId: chargeTransaction.kajaPayTransactionId,
        reason: reason || 'Customer refund request'
      }
    });

    // Process refund with KajaPay
    const refundResult: RefundResult = await kajaPayClient.refundTransaction(
      chargeTransaction.kajaPayTransactionId,
      refundAmount
    );

    // Update refund transaction with result
    await (storage as any).updateTransaction(refundTransaction.id, {
      kajaPayTransactionId: refundResult.transactionId,
      kajaPayReferenceNumber: refundResult.referenceNumber,
      status: refundResult.success ? 'approved' : 'declined',
      kajaPayStatusCode: refundResult.responseCode,
      errorMessage: refundResult.errorMessage
    });

    if (refundResult.success) {
      // Update order status
      const isFullRefund = refundAmount >= Number(order.totalAmount);
      await (storage as any).updateOrder(order.id, {
        paymentStatus: isFullRefund ? 'refunded' : 'partially_refunded',
        status: isFullRefund ? 'refunded' : order.status
      });

      return NextResponse.json({
        success: true,
        transactionId: refundResult.transactionId,
        referenceNumber: refundResult.referenceNumber,
        amount: refundAmount,
        order: {
          id: order.id,
          paymentStatus: isFullRefund ? 'refunded' : 'partially_refunded'
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: refundResult.responseText || 'Refund failed',
        responseCode: refundResult.responseCode
      }, { status: 402 });
    }

  } catch (error) {
    console.error('[Refund] Processing error:', error);
    return NextResponse.json({
      success: false,
      error: 'Refund processing failed'
    }, { status: 500 });
  }
}
