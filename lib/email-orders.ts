import nodemailer from 'nodemailer';
import { logger } from './logger';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const FROM = process.env.EMAIL_USER || 'noreply@highway420.com';
const STORE_NAME = 'Highway 420';

interface OrderEmailData {
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  customerFirstName: string;
  totalAmount: number;
  items?: { name: string; quantity: number; price: number }[];
}

interface StatusEmailData {
  orderNumber: string;
  customerEmail: string;
  customerFirstName: string;
  newStatus: string;
  trackingNumber?: string;
  carrier?: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

/**
 * Send order confirmation email when payment is approved by KajaPay.
 */
export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<void> {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    logger.warn('[Email] Skipping order confirmation — EMAIL_USER or EMAIL_APP_PASSWORD not set');
    return;
  }

  const itemRows = (data.items || []).map(item =>
    `<tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.price * item.quantity)}</td>
    </tr>`
  ).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
      <div style="background: #000; color: #fff; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; letter-spacing: 0.1em;">${STORE_NAME}</h1>
        <p style="margin: 8px 0 0; color: #5EB499; font-size: 14px;">Order Confirmed</p>
      </div>

      <div style="padding: 24px;">
        <p>Hey ${data.customerFirstName},</p>
        <p>Your payment has been received and your order is being processed.</p>

        <div style="background: #f8f8f8; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 0;"><strong>Order Number:</strong> ${data.orderNumber}</p>
          <p style="margin: 8px 0 0;"><strong>Total:</strong> ${formatCurrency(data.totalAmount)}</p>
        </div>

        ${data.items && data.items.length > 0 ? `
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <thead>
            <tr style="border-bottom: 2px solid #333;">
              <th style="text-align: left; padding: 8px 0;">Item</th>
              <th style="text-align: center; padding: 8px 0;">Qty</th>
              <th style="text-align: right; padding: 8px 0;">Total</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
        ` : ''}

        <p>We'll send you another email when your order ships with tracking info.</p>

        <p style="color: #666; font-size: 12px; margin-top: 32px; border-top: 1px solid #eee; padding-top: 16px;">
          Questions? Reply to this email or visit highway420.com/help<br>
          ${STORE_NAME} — Life is a Highway, Ride With Us
        </p>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: FROM,
      to: data.customerEmail,
      subject: `Order Confirmed — ${data.orderNumber} | ${STORE_NAME}`,
      html,
    });
    logger.info('[Email] Order confirmation sent', { orderNumber: data.orderNumber });
  } catch (error) {
    logger.error('[Email] Failed to send order confirmation:', error);
  }
}

/**
 * Send order status update email (shipped, delivered, cancelled).
 */
export async function sendOrderStatusEmail(data: StatusEmailData): Promise<void> {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    logger.warn('[Email] Skipping status email — EMAIL_USER or EMAIL_APP_PASSWORD not set');
    return;
  }

  const statusMessages: Record<string, { subject: string; heading: string; body: string }> = {
    shipped: {
      subject: `Your Order Has Shipped — ${data.orderNumber}`,
      heading: 'Your Order Is On Its Way!',
      body: data.trackingNumber
        ? `Your order has been shipped${data.carrier ? ` via ${data.carrier}` : ''}. Track your package with tracking number: <strong>${data.trackingNumber}</strong>`
        : 'Your order has been shipped! Tracking info will be updated shortly.',
    },
    delivered: {
      subject: `Order Delivered — ${data.orderNumber}`,
      heading: 'Your Order Has Been Delivered!',
      body: 'Your package has arrived. We hope you enjoy your products!',
    },
    cancelled: {
      subject: `Order Cancelled — ${data.orderNumber}`,
      heading: 'Your Order Has Been Cancelled',
      body: 'Your order has been cancelled. If you were charged, a refund will be processed within 5-7 business days.',
    },
  };

  const msg = statusMessages[data.newStatus];
  if (!msg) return; // Only send for known status changes

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
      <div style="background: #000; color: #fff; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; letter-spacing: 0.1em;">${STORE_NAME}</h1>
      </div>
      <div style="padding: 24px;">
        <p>Hey ${data.customerFirstName},</p>
        <h2 style="color: #5EB499;">${msg.heading}</h2>
        <p>${msg.body}</p>
        <div style="background: #f8f8f8; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 0;"><strong>Order Number:</strong> ${data.orderNumber}</p>
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 32px; border-top: 1px solid #eee; padding-top: 16px;">
          Questions? Reply to this email or visit highway420.com/help<br>
          ${STORE_NAME} — Life is a Highway, Ride With Us
        </p>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: FROM,
      to: data.customerEmail,
      subject: `${msg.subject} | ${STORE_NAME}`,
      html,
    });
    logger.info('[Email] Status email sent', { orderNumber: data.orderNumber, status: data.newStatus });
  } catch (error) {
    logger.error('[Email] Failed to send status email:', error);
  }
}
