import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Verify KajaPay webhook signature
// In sandbox mode KAJAPAY_WEBHOOK_SECRET won't be set — we allow and warn.
// In production, a mismatch returns 401.
function verifyWebhookSignature(signature: string, _payload: string): boolean {
  const secret = process.env.KAJAPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.warn('[KajaPay Webhook] KAJAPAY_WEBHOOK_SECRET not set — skipping signature check (sandbox mode).');
    return true;
  }
  if (signature !== secret) {
    console.error('[KajaPay Webhook] Signature mismatch — rejecting.');
    return false;
  }
  return true;
}

// Log every raw event for audit trail
async function logWebhookEvent(eventType: string, transactionId: number | undefined, orderId: string | undefined, payload: any) {
  try {
    await supabase.from('kajapay_webhook_events').insert({
      event_type: eventType,
      kajapay_transaction_id: transactionId ?? null,
      order_id: orderId ?? null,
      payload,
      processed: false,
    });
  } catch (e) {
    console.error('[KajaPay Webhook] Failed to log event:', e);
  }
}

// Mark webhook event processed
async function markProcessed(kajaPayTransactionId: number | undefined, success: boolean, errorMsg?: string) {
  if (!kajaPayTransactionId) return;
  try {
    await supabase
      .from('kajapay_webhook_events')
      .update({
        processed: true,
        processed_at: new Date().toISOString(),
        error_message: errorMsg ?? null,
      })
      .eq('kajapay_transaction_id', kajaPayTransactionId)
      .eq('processed', false);
  } catch (e) {
    console.error('[KajaPay Webhook] Failed to mark processed:', e);
  }
}

// Handle approved transaction
async function handleTransactionApproved(body: any): Promise<NextResponse> {
  try {
    // KajaPay sends orderId (our internal order id) in the postback
    const orderId: string | undefined = body.orderId || body.order_id;
    const kajaPayTransactionId: number | undefined = body.transactionId ?? body.transaction_id;
    const authCode: string | undefined = body.authCode ?? body.auth_code;
    const referenceNumber: number | undefined = body.referenceNumber ?? body.reference_number;
    const amount: number | undefined = body.amount;
    const responseCode: string | undefined = body.responseCode ?? body.response_code;
    const maskedCard: string | undefined = body.maskedCardNumber ?? body.masked_card_number;
    const cardType: string | undefined = body.cardType ?? body.card_type;

    if (!orderId) {
      console.error('[KajaPay Webhook] Missing orderId in approved payload');
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    // 1. Update order to paid with payment confirmation timestamp
    const now = new Date().toISOString();
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        status: 'processing',
        transaction_id: String(kajaPayTransactionId),
        kajapay_transaction_id: String(kajaPayTransactionId),
        payment_confirmed_at: now,
        updated_at: now,
      })
      .eq('id', orderId)
      .select()
      .single();

    if (orderError || !order) {
      console.error('[KajaPay Webhook] Failed to update order:', orderError?.message, 'orderId:', orderId);
      return NextResponse.json({ error: 'Order update failed' }, { status: 500 });
    }

    // 2. Insert into payment_transactions
    await supabase.from('payment_transactions').insert({
      order_id: orderId,
      user_id: order.user_id,
      kajapay_transaction_id: kajaPayTransactionId,
      kajapay_reference_number: referenceNumber,
      kajapay_order_number: order.order_number,
      transaction_type: 'charge',
      amount: amount ?? Number(order.total_amount),
      currency: 'USD',
      status: 'approved',
      kajapay_status_code: responseCode,
      kajapay_response_text: 'APPROVED',
      auth_code: authCode,
      masked_card_number: maskedCard,
      card_type: cardType,
      gateway_response: body,
      settled_at: new Date().toISOString(),
    });

    // 3. Status history
    await supabase.from('order_status_history').insert({
      order_id: orderId,
      from_status: 'pending',
      to_status: 'processing',
      notes: `KajaPay payment approved — transactionId: ${kajaPayTransactionId}`,
    });

    // 4. Send order confirmation email to customer
    try {
      const { sendOrderConfirmationEmail } = await import('../../../../lib/email-orders');
      // Fetch order items for email
      const { data: orderItems } = await supabase
        .from('order_items')
        .select('product_name, quantity, unit_price')
        .eq('order_id', orderId);

      await sendOrderConfirmationEmail({
        orderId,
        orderNumber: order.order_number || orderId,
        customerEmail: order.customer_email,
        customerFirstName: order.customer_first_name || 'Customer',
        totalAmount: Number(order.total_amount),
        items: (orderItems || []).map((i: any) => ({
          name: i.product_name || 'Item',
          quantity: i.quantity,
          price: Number(i.unit_price || 0),
        })),
      });
    } catch (emailError) {
      // Email failure should never block the webhook response
      console.error('[KajaPay Webhook] Email send failed (non-blocking):', emailError);
    }

    await markProcessed(kajaPayTransactionId, true);

    return NextResponse.json({ success: true, orderId, transactionId: kajaPayTransactionId });
  } catch (error: any) {
    console.error('[KajaPay Webhook] handleTransactionApproved error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Handle declined transaction
async function handleTransactionDeclined(body: any): Promise<NextResponse> {
  try {
    const orderId: string | undefined = body.orderId || body.order_id;
    const kajaPayTransactionId: number | undefined = body.transactionId ?? body.transaction_id;
    const responseCode: string | undefined = body.responseCode ?? body.response_code;
    const responseText: string | undefined = body.responseText ?? body.response_text;
    const amount: number | undefined = body.amount;

    if (!orderId) {
      console.error('[KajaPay Webhook] Missing orderId in declined payload');
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    // Insert declined transaction record
    const { data: order } = await supabase
      .from('orders')
      .select('user_id, order_number, total_amount')
      .eq('id', orderId)
      .single();

    await supabase.from('payment_transactions').insert({
      order_id: orderId,
      user_id: order?.user_id,
      kajapay_transaction_id: kajaPayTransactionId,
      kajapay_order_number: order?.order_number,
      transaction_type: 'charge',
      amount: amount ?? Number(order?.total_amount ?? 0),
      currency: 'USD',
      status: 'declined',
      kajapay_status_code: responseCode,
      kajapay_response_text: responseText ?? 'DECLINED',
      error_message: `Declined with code: ${responseCode}`,
      gateway_response: body,
    });

    // Add status history
    await supabase.from('order_status_history').insert({
      order_id: orderId,
      from_status: 'pending',
      to_status: 'cancelled',
      notes: `KajaPay payment declined — code: ${responseCode}, transactionId: ${kajaPayTransactionId}`,
    });

    console.log(`[KajaPay Webhook] ❌ Payment declined — orderId: ${orderId}, code: ${responseCode}`);
    await markProcessed(kajaPayTransactionId, false, `Declined: ${responseCode}`);

    return NextResponse.json({ success: true, message: 'Decline recorded' });
  } catch (error: any) {
    console.error('[KajaPay Webhook] handleTransactionDeclined error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Main webhook handler
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-kajapay-signature') || '';

    // Parse body
    let body: any;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    console.log('[KajaPay Webhook] Received event:', body.event_type || body.eventType, body);

    // Verify signature (skipped in sandbox when secret not set)
    if (!verifyWebhookSignature(signature, rawBody)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Normalize event type (KajaPay may use camelCase or dot-notation)
    const eventType: string = body.event_type || body.eventType || '';
    const transactionId: number | undefined = body.transactionId ?? body.transaction_id;
    const orderId: string | undefined = body.orderId || body.order_id;

    // Log event for audit
    await logWebhookEvent(eventType, transactionId, orderId, body);

    // Route by event type — KajaPay uses transaction.approved / transaction.declined
    switch (eventType) {
      case 'transaction.approved':
      case 'payment.completed': // legacy alias
        return await handleTransactionApproved(body);

      case 'transaction.declined':
      case 'payment.failed': // legacy alias
        return await handleTransactionDeclined(body);

      default:
        console.log('[KajaPay Webhook] Unhandled event type:', eventType);
        return NextResponse.json({ success: true, message: 'Event type not handled' });
    }
  } catch (error: any) {
    console.error('[KajaPay Webhook] Top-level error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Health check for KajaPay dashboard
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'KajaPay webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}
