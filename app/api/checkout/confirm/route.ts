import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '../../../lib/requireAuth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/checkout/confirm
 *
 * Called by the confirmation page after KajaPay redirects back.
 * Marks the order as paid and records the payment transaction.
 * Idempotent — safe to call multiple times for the same order.
 */
export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  const { user } = auth;

  const body = await req.json().catch(() => ({}));
  const { orderId, transactionId, referenceNumber, responseCode, status } = body;

  if (!orderId) {
    return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
  }

  // Verify the order belongs to this user (security check)
  const { data: order, error: orderFetchError } = await supabase
    .from('orders')
    .select('id, user_id, payment_status, total_amount, order_number, customer_email, customer_phone')
    .eq('id', orderId)
    .single();

  if (orderFetchError || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  if (order.user_id !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Idempotency — if already paid, just return success
  if (order.payment_status === 'paid') {
    return NextResponse.json({ 
      success: true, 
      alreadyPaid: true, 
      orderId,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone
    });
  }

  if (status !== 'approved') {
    return NextResponse.json({ error: 'Payment not approved' }, { status: 400 });
  }

  // Update order to paid
  const { error: updateError } = await supabase
    .from('orders')
    .update({
      payment_status: 'paid',
      status: 'processing',
      transaction_id: transactionId ? String(transactionId) : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  if (updateError) {
    console.error('[Confirm] Order update error:', updateError.message);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }

  // Insert payment transaction record (if payment_transactions table exists)
  try {
    await supabase.from('payment_transactions').insert({
      order_id: orderId,
      user_id: user.id,
      kajapay_transaction_id: transactionId ? Number(transactionId) : null,
      kajapay_reference_number: referenceNumber ? Number(referenceNumber) : null,
      kajapay_order_number: order.order_number,
      transaction_type: 'charge',
      amount: Number(order.total_amount),
      currency: 'USD',
      status: 'approved',
      kajapay_status_code: responseCode ?? '00',
      kajapay_response_text: 'APPROVED',
      age_verified: true,
      redirect_params: body,
      settled_at: new Date().toISOString(),
    });
  } catch (ptError: any) {
    // Non-fatal — order is already updated
    console.warn('[Confirm] payment_transactions insert failed (table may not exist yet):', ptError.message);
  }

  // Record status history
  try {
    await supabase.from('order_status_history').insert({
      order_id: orderId,
      from_status: 'pending',
      to_status: 'processing',
      notes: `Payment confirmed via redirect — KajaPay transactionId: ${transactionId}`,
    });
  } catch {}

  console.log(`[Confirm] ✅ Order ${order.order_number} confirmed — transactionId: ${transactionId}`);

  return NextResponse.json({ 
    success: true, 
    orderId, 
    orderNumber: order.order_number,
    customerEmail: order.customer_email,
    customerPhone: order.customer_phone
  });
}
