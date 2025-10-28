import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Verify Kajapay webhook signature
function verifyWebhookSignature(signature: string, payload: string): boolean {
  // KAJAPAY_WEBHOOK_SECRET should be set in environment variables
  const expectedSignature = process.env.KAJAPAY_WEBHOOK_SECRET;

  if (!expectedSignature) {
    console.error('KAJAPAY_WEBHOOK_SECRET not configured');
    return false;
  }

  // Basic signature verification (implement proper HMAC verification for production)
  return signature === expectedSignature;
}

// Send admin notification email (disabled until Resend is configured)
async function sendAdminNotification(order: any, eventType: string) {
  try {
    // For now, just log the notification - implement email when Resend is configured
    console.log(`🔔 ${eventType}: Order ${order.id} - ${order.customer_first_name} ${order.customer_last_name} - $${order.total_amount.toFixed(2)}`);

    // TODO: Re-enable when Resend API is configured
    // const { data: adminUser } = await supabase
    //   .from('profiles')
    //   .select('email')
    //   .eq('role', 'admin')
    //   .single();
    //
    // if (!adminUser?.email) {
    //   console.warn('No admin email found for notifications');
    //   return;
    // }
    //
    // const adminEmail = adminUser.email;
    //
    // await resend.emails.send({ ... });
  } catch (error) {
    console.error('Failed to send admin notification:', error);
  }
}

// Handle payment completed
async function handlePaymentCompleted(paymentIntent: any) {
  try {
    console.log('Processing payment completed for:', paymentIntent);

    // Find payment record by payment intent ID
    const { data: payment, error: paymentQueryError } = await supabase
      .from('payments')
      .select('id, order_id')
      .eq('payment_intent_id', paymentIntent.id)
      .single();

    if (paymentQueryError || !payment?.order_id) {
      console.error('Payment not found for payment intent:', paymentIntent.id);
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Update order status to paid
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        status: 'processing', // Move to processing after payment
        paid_at: new Date().toISOString()
      })
      .eq('id', payment.order_id)
      .select()
      .single();

    if (orderError) {
      console.error('Error updating order payment status:', orderError);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    // Update payment record
    await supabase
      .from('payments')
      .update({
        status: 'completed',
        transaction_id: paymentIntent.transaction_id,
        completed_at: new Date().toISOString()
      })
      .eq('id', payment.id);

    // Add status history
    await supabase
      .from('order_status_history')
      .insert({
        order_id: order.id,
        from_status: 'pending',
        to_status: 'processing',
        notes: 'Payment completed - moved to processing'
      });

    // Send admin notification
    await sendAdminNotification(order, 'Payment Completed');

    console.log('Payment completed successfully for order:', order.id);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: 'Payment processed successfully'
    });

  } catch (error) {
    console.error('Payment completion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Handle payment failed
async function handlePaymentFailed(paymentIntent: any) {
  try {
    console.log('Processing payment failed for:', paymentIntent);

    // Find payment record by payment intent ID
    const { data: payment, error: paymentQueryError } = await supabase
      .from('payments')
      .select('id, order_id')
      .eq('payment_intent_id', paymentIntent.id)
      .single();

    if (paymentQueryError || !payment?.order_id) {
      console.error('Payment not found for failed payment intent:', paymentIntent.id);
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Update payment status to failed
    await supabase
      .from('payments')
      .update({
        status: 'failed',
        failed_at: new Date().toISOString()
      })
      .eq('id', payment.id);

    // Add status history for failure
    await supabase
      .from('order_status_history')
      .insert({
        order_id: payment.order_id,
        from_status: 'pending',
        to_status: 'cancelled',
        notes: 'Payment failed - order cancelled'
      });

    // Get order details for notification
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', payment.order_id)
      .single();

    if (order) {
      await sendAdminNotification(order, 'Payment Failed');
    }

    console.log('Payment failure handled for order:', payment.order_id);

    return NextResponse.json({
      success: true,
      message: 'Payment failure handled'
    });

  } catch (error) {
    console.error('Payment failure error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Main webhook handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get('x-kajapay-signature') || '';

    console.log('Received Kajapay webhook:', body);

    // Verify webhook signature (implement proper verification)
    // if (!verifyWebhookSignature(signature, JSON.stringify(body))) {
    //   console.error('Invalid webhook signature');
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    // Process different event types
    switch (body.event_type) {
      case 'payment.completed':
        return await handlePaymentCompleted(body.data);
      case 'payment.failed':
        return await handlePaymentFailed(body.data);
      default:
        console.log('Unhandled webhook event type:', body.event_type);
        return NextResponse.json({ success: true, message: 'Event type not handled' });
    }

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Verify webhook endpoint for Kajapay dashboard
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Kajapay webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}
