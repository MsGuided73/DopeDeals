import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface OrderConfirmationEmail {
  to: string;
  orderNumber: string;
  customerName: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
    imageUrl?: string;
  }>;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  shippingAddress: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipcode: string;
  };
}

// Email template for order confirmation
function generateOrderConfirmationHTML(data: OrderConfirmationEmail): string {
  const itemsHTML = data.orderItems.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <div style="display: flex; align-items: center; gap: 12px;">
          ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">` : '<div style="width: 60px; height: 60px; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #6b7280; font-size: 12px;">No Image</div>'}
          <div>
            <h4 style="margin: 0; font-size: 14px; font-weight: 600; color: #111827;">${item.name}</h4>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">Quantity: ${item.quantity}</p>
          </div>
        </div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        <p style="margin: 0; font-size: 14px; font-weight: 600; color: #111827;">$${(item.price * item.quantity).toFixed(2)}</p>
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - Highway 420</title>
    </head>
    <body style="font-family: 'Inter', system-ui, sans-serif; margin: 0; padding: 0; background-color: #f9fafb; color: #111827;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #000000 0%, #1f2937 100%); padding: 40px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: 2px;">
            Highway 420
          </h1>
          <p style="margin: 8px 0 0 0; font-size: 16px; color: #f97316; font-weight: 600;">
            Premium Cannabis Culture
          </p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 20px;">
          <!-- Success Message -->
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="width: 80px; height: 80px; background-color: #dcfce7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
            </div>
            <h2 style="margin: 0; font-size: 28px; font-weight: 700; color: #111827;">
              Order Confirmed!
            </h2>
            <p style="margin: 8px 0 0 0; font-size: 16px; color: #6b7280;">
              Thank you for your order, ${data.customerName}!
            </p>
          </div>

          <!-- Order Details -->
          <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
            <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #111827;">
              Order #${data.orderNumber}
            </h3>

            <!-- Items Table -->
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="text-align: left; padding: 12px; font-size: 14px; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">
                    Item
                  </th>
                  <th style="text-align: right; padding: 12px; font-size: 14px; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>

            <!-- Order Summary -->
            <div style="margin-top: 24px; padding-top: 24px; border-top: 2px solid #e5e7eb;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-size: 14px; color: #6b7280;">Subtotal:</span>
                <span style="font-size: 14px; font-weight: 500; color: #111827;">$${data.subtotal.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-size: 14px; color: #6b7280;">Tax:</span>
                <span style="font-size: 14px; font-weight: 500; color: #111827;">$${data.taxAmount.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-size: 14px; color: #6b7280;">Shipping:</span>
                <span style="font-size: 14px; font-weight: 500; color: #111827;">$${data.shippingAmount.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding-top: 12px; border-top: 1px solid #e5e7eb;">
                <span style="font-size: 16px; font-weight: 600; color: #111827;">Total:</span>
                <span style="font-size: 16px; font-weight: 600; color: #f97316;">$${data.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <!-- Shipping Information -->
          <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
            <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #111827;">
              Shipping Address
            </h3>
            <div style="font-size: 14px; color: #374151; line-height: 1.5;">
              <p style="margin: 0 0 4px 0;">${data.customerName}</p>
              <p style="margin: 0 0 4px 0;">${data.shippingAddress.address1}</p>
              ${data.shippingAddress.address2 ? `<p style="margin: 0 0 4px 0;">${data.shippingAddress.address2}</p>` : ''}
              <p style="margin: 0;">${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipcode}</p>
            </div>
          </div>

          <!-- What's Next -->
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); border-radius: 12px; padding: 24px; margin-bottom: 32px; color: white;">
            <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">
              What's Next?
            </h3>
            <div style="font-size: 14px; line-height: 1.6;">
              <p style="margin: 0 0 12px 0;">✅ Your payment has been processed successfully</p>
              <p style="margin: 0 0 12px 0;">📦 We're preparing your items for shipment</p>
              <p style="margin: 0;">🚚 You'll receive tracking information once your order ships</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding-top: 32px; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">
              Questions about your order?
            </p>
            <p style="margin: 0; font-size: 14px; color: #374151;">
              Contact us at <a href="mailto:support@dopecity.com" style="color: #f97316; text-decoration: none; font-weight: 600;">support@dopecity.com</a>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Send order confirmation email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, to } = body;

    if (!orderId || !to) {
      return NextResponse.json(
        { error: 'Order ID and recipient email are required' },
        { status: 400 }
      );
    }

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        customer_email,
        customer_first_name,
        customer_last_name,
        subtotal,
        tax_amount,
        shipping_amount,
        total_amount,
        shipping_address,
        order_items (
          product_name,
          product_sku,
          product_image_url,
          unit_price,
          quantity,
          total_price
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Prepare email data
    const emailData: OrderConfirmationEmail = {
      to: to || order.customer_email,
      orderNumber: order.order_number,
      customerName: `${order.customer_first_name} ${order.customer_last_name}`,
      orderItems: order.order_items.map((item: any) => ({
        name: item.product_name,
        quantity: item.quantity,
        price: item.unit_price,
        imageUrl: item.product_image_url
      })),
      subtotal: order.subtotal,
      taxAmount: order.tax_amount,
      shippingAmount: order.shipping_amount,
      total: order.total_amount,
      shippingAddress: order.shipping_address
    };

    // Generate HTML email
    const htmlContent = generateOrderConfirmationHTML(emailData);

    // In a real implementation, you would integrate with an email service
    // For now, we'll simulate sending and log the email content
    console.log('📧 SENDING ORDER CONFIRMATION EMAIL:');
    console.log('To:', emailData.to);
    console.log('Subject: Order Confirmation - Highway 420 #' + order.order_number);
    console.log('Order Total:', emailData.total);
    console.log('Items:', emailData.orderItems.length);

    // Here you would integrate with services like:
    // - SendGrid
    // - AWS SES
    // - Resend
    // - Nodemailer with SMTP

    // Example with SendGrid (commented out):
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: emailData.to,
      from: 'orders@dopecity.com',
      subject: `Order Confirmation - Highway 420 #${order.order_number}`,
      html: htmlContent,
    };

    await sgMail.send(msg);
    */

    // For testing purposes, save email to a log file or database
    await supabase
      .from('email_logs')
      .insert({
        order_id: orderId,
        email_type: 'order_confirmation',
        recipient: emailData.to,
        subject: `Order Confirmation - Highway 420 #${order.order_number}`,
        content: htmlContent,
        sent_at: new Date().toISOString(),
        status: 'sent'
      });

    return NextResponse.json({
      success: true,
      message: 'Order confirmation email sent successfully',
      emailId: `email_${Date.now()}`,
      recipient: emailData.to,
      orderNumber: order.order_number
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    );
  }
}
