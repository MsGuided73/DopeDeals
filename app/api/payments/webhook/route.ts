import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '../../../../lib/storage';
import { kajaPayClient } from '../../../../server/kajapay/client';
import { WebhookEventData } from '../../../../server/kajapay/types';

export async function POST(req: NextRequest) {
  try {
    // Get the raw body and signature
    const body = await req.text();
    const signature = req.headers.get('x-kajapay-signature') || '';

    // Parse the JSON payload
    let payload: WebhookEventData;
    try {
      payload = JSON.parse(body);
    } catch (error) {
      console.error('[Webhook] Invalid JSON payload:', error);
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // Verify webhook signature
    const isValid = await kajaPayClient.verifyWebhook(payload, signature);
    if (!isValid) {
      console.error('[Webhook] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    console.log('[Webhook] Received KajaPay webhook:', payload.eventType, payload.transactionId);

    // Get storage instance
    const storage = await getStorage();

    // Find the transaction by KajaPay transaction ID
    // Note: This is a simplified lookup - in production you'd want a proper index
    const allTransactions = await storage.getUserTransactions(''); // Get all transactions
    const transaction = allTransactions.find(t => t.kajaPayTransactionId === payload.transactionId);
    if (!transaction) {
      console.warn('[Webhook] Transaction not found:', payload.transactionId);
      // Still return 200 to acknowledge receipt
      return NextResponse.json({ received: true });
    }

    // Process different webhook events
    switch (payload.eventType) {
      case 'transaction.approved':
        await handleTransactionApproved(storage, transaction, payload);
        break;
      
      case 'transaction.declined':
        await handleTransactionDeclined(storage, transaction, payload);
        break;
      
      case 'transaction.refunded':
        await handleTransactionRefunded(storage, transaction, payload);
        break;
      
      case 'transaction.voided':
        await handleTransactionVoided(storage, transaction, payload);
        break;
      
      case 'transaction.settled':
        await handleTransactionSettled(storage, transaction, payload);
        break;
      
      case 'batch.closed':
        // Handle batch closure if needed
        console.log('[Webhook] Batch closed event received');
        break;
      
      default:
        console.warn('[Webhook] Unknown event type:', payload.eventType);
    }

    // Store webhook event for audit trail
    try {
      await storage.createWebhookEvent({
        eventType: payload.eventType,
        kajaPayTransactionId: payload.transactionId,
        payload: payload,
        processed: true,
        processedAt: new Date()
      });
    } catch (error) {
      console.error('[Webhook] Failed to store webhook event:', error);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('[Webhook] Processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleTransactionApproved(storage: any, transaction: any, payload: WebhookEventData) {
  try {
    // Update transaction status
    await storage.updateTransaction(transaction.id, {
      status: 'approved',
      kajaPayStatusCode: payload.responseCode
    });

    // Update order status if this is a charge transaction
    if (transaction.transactionType === 'charge') {
      await storage.updateOrder(transaction.orderId, {
        paymentStatus: 'paid',
        status: 'processing'
      });

      console.log('[Webhook] Order payment approved:', transaction.orderId);
    }
  } catch (error) {
    console.error('[Webhook] Error handling transaction approved:', error);
  }
}

async function handleTransactionDeclined(storage: any, transaction: any, payload: WebhookEventData) {
  try {
    // Update transaction status
    await storage.updateTransaction(transaction.id, {
      status: 'declined',
      kajaPayStatusCode: payload.responseCode,
      errorMessage: payload.responseText
    });

    // Update order status if this is a charge transaction
    if (transaction.transactionType === 'charge') {
      await storage.updateOrder(transaction.orderId, {
        paymentStatus: 'failed',
        status: 'payment_failed'
      });

      console.log('[Webhook] Order payment declined:', transaction.orderId);
    }
  } catch (error) {
    console.error('[Webhook] Error handling transaction declined:', error);
  }
}

async function handleTransactionRefunded(storage: any, transaction: any, payload: WebhookEventData) {
  try {
    // Update transaction status
    await storage.updateTransaction(transaction.id, {
      status: 'approved', // Refund was successful
      kajaPayStatusCode: payload.responseCode
    });

    // Update order status
    const order = await storage.getOrder(transaction.orderId);
    if (order) {
      const refundAmount = payload.amount || 0;
      const isFullRefund = refundAmount >= Number(order.totalAmount);
      
      await storage.updateOrder(transaction.orderId, {
        paymentStatus: isFullRefund ? 'refunded' : 'partially_refunded',
        status: isFullRefund ? 'refunded' : order.status
      });

      console.log('[Webhook] Order refunded:', transaction.orderId, `$${refundAmount}`);
    }
  } catch (error) {
    console.error('[Webhook] Error handling transaction refunded:', error);
  }
}

async function handleTransactionVoided(storage: any, transaction: any, payload: WebhookEventData) {
  try {
    // Update transaction status
    await storage.updateTransaction(transaction.id, {
      status: 'approved', // Void was successful
      kajaPayStatusCode: payload.responseCode
    });

    // Update order status
    await storage.updateOrder(transaction.orderId, {
      paymentStatus: 'voided',
      status: 'cancelled'
    });

    console.log('[Webhook] Order voided:', transaction.orderId);
  } catch (error) {
    console.error('[Webhook] Error handling transaction voided:', error);
  }
}

async function handleTransactionSettled(storage: any, transaction: any, payload: WebhookEventData) {
  try {
    // Update transaction with settlement info
    await storage.updateTransaction(transaction.id, {
      kajaPayStatusCode: payload.responseCode,
      paymentMethodData: {
        ...transaction.paymentMethodData,
        settled: true,
        settledAt: payload.timestamp
      }
    });

    console.log('[Webhook] Transaction settled:', payload.transactionId);
  } catch (error) {
    console.error('[Webhook] Error handling transaction settled:', error);
  }
}
