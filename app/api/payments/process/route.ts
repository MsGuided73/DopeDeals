import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Process payment for an order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, paymentMethod, paymentToken, amount } = body;

    if (!orderId || !paymentMethod || !amount) {
      return NextResponse.json(
        { error: 'Order ID, payment method, and amount are required' },
        { status: 400 }
      );
    }

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if payment already exists
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
      .single();

    let paymentId = existingPayment?.id;

    // Simulate payment processing based on method
    let paymentStatus = 'pending';
    let paymentResponse = {};

    switch (paymentMethod) {
      case 'kajapay':
        // Simulate Kajapay processing
        paymentStatus = Math.random() > 0.1 ? 'paid' : 'failed'; // 90% success rate for testing
        paymentResponse = {
          transactionId: `kaja_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          processor: 'kajapay',
          timestamp: new Date().toISOString()
        };
        break;

      case 'card':
        // Simulate credit card processing
        paymentStatus = Math.random() > 0.05 ? 'paid' : 'failed'; // 95% success rate for testing
        paymentResponse = {
          transactionId: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          processor: 'stripe',
          last4: paymentToken ? paymentToken.slice(-4) : '1234',
          cardType: 'visa',
          timestamp: new Date().toISOString()
        };
        break;

      case 'test':
        // Always succeed for testing
        paymentStatus = 'paid';
        paymentResponse = {
          transactionId: `test_${Date.now()}`,
          processor: 'test_mode',
          timestamp: new Date().toISOString()
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Unsupported payment method' },
          { status: 400 }
        );
    }

    // Update or create payment record
    const paymentData = {
      order_id: orderId,
      payment_method: paymentMethod,
      amount: parseFloat(amount),
      currency: 'USD',
      status: paymentStatus,
      payment_metadata: paymentResponse,
      processed_at: paymentStatus === 'paid' ? new Date().toISOString() : null
    };

    if (existingPayment) {
      // Update existing payment
      const { error: updateError } = await supabase
        .from('payments')
        .update(paymentData)
        .eq('id', existingPayment.id);

      if (updateError) {
        console.error('Error updating payment:', updateError);
        return NextResponse.json(
          { error: 'Failed to update payment' },
          { status: 500 }
        );
      }
      paymentId = existingPayment.id;
    } else {
      // Create new payment record
      const { data: newPayment, error: createError } = await supabase
        .from('payments')
        .insert(paymentData)
        .select()
        .single();

      if (createError) {
        console.error('Error creating payment:', createError);
        return NextResponse.json(
          { error: 'Failed to create payment' },
          { status: 500 }
        );
      }
      paymentId = newPayment.id;
    }

    // If payment succeeded, update order status
    if (paymentStatus === 'paid') {
      // Update order payment status
      await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      // Create order status history
      await supabase
        .from('order_status_history')
        .insert({
          order_id: orderId,
          from_status: order.status,
          to_status: 'confirmed',
          notes: `Payment processed successfully via ${paymentMethod}`
        });

      // Send confirmation notification
      await sendOrderConfirmation(order, paymentResponse);
    }

    return NextResponse.json({
      success: true,
      paymentId,
      status: paymentStatus,
      orderId,
      amount: parseFloat(amount),
      paymentMethod,
      transaction: paymentResponse,
      message: paymentStatus === 'paid' ? 'Payment processed successfully' : 'Payment failed'
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Send order confirmation email
async function sendOrderConfirmation(order: any, paymentInfo: any) {
  try {
    console.log('🔔 SENDING ORDER CONFIRMATION EMAIL:', {
      orderId: order.id,
      orderNumber: order.order_number,
      customerEmail: order.customer_email,
      total: order.total_amount,
      paymentMethod: paymentInfo.processor,
      transactionId: paymentInfo.transactionId
    });

    // Call the email API to send confirmation
    const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/send_order_confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!
      },
      body: JSON.stringify({
        order_id: order.id,
        recipient_email: order.customer_email
      })
    });

    if (emailResponse.ok) {
      console.log('✅ Order confirmation email sent successfully');
    } else {
      console.error('❌ Failed to send confirmation email:', await emailResponse.text());
    }

  } catch (error) {
    console.error('Error sending confirmation:', error);
  }
}
