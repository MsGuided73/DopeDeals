import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '../../../../lib/storage';
import { requireAuth } from '../../../lib/requireAuth';
import { z } from 'zod';

// Import KajaPay client and types
import { kajaPayClient } from '../../../../server/kajapay/client';
import { ProcessPaymentRequest, PaymentResult } from '../../../../server/kajapay/types';

const PaymentSchema = z.object({
  orderId: z.string().uuid(),
  paymentMethod: z.object({
    type: z.enum(['card', 'ach', 'saved_card']),
    cardNumber: z.string().optional(),
    expiryMonth: z.string().optional(),
    expiryYear: z.string().optional(),
    cvv: z.string().optional(),
    customerToken: z.string().optional(),
    paymentAccountDataToken: z.string().optional()
  }),
  billingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    address1: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string().default('US'),
    email: z.string().email().optional(),
    phone: z.string().optional()
  }),
  savePaymentMethod: z.boolean().default(false)
});

export async function POST(req: NextRequest) {
  try {
    // Require authentication
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    // Parse and validate request body
    const body = await req.json().catch(() => ({}));
    const parse = PaymentSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ 
        error: 'Invalid payment data', 
        issues: parse.error.issues 
      }, { status: 400 });
    }

    const { orderId, paymentMethod, billingAddress, savePaymentMethod } = parse.data;

    // Get storage instance
    const storage = await getStorage();

    // Fetch the order to process
    const order = await storage.getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Verify order belongs to authenticated user
    if (order.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if order is already paid
    if (order.paymentStatus === 'paid') {
      return NextResponse.json({ error: 'Order already paid' }, { status: 409 });
    }

    // Get order items for payment description
    const orderItems = await storage.getOrderItemsByOrder(orderId);
    const itemDescriptions = orderItems.map(item => `${item.quantity}x ${item.productName || 'Item'}`).join(', ');

    // Prepare KajaPay payment request
    const paymentRequest: ProcessPaymentRequest = {
      amount: Number(order.totalAmount),
      currency: 'USD',
      paymentMethod: {
        type: paymentMethod.type,
        cardNumber: paymentMethod.cardNumber,
        expiryMonth: paymentMethod.expiryMonth,
        expiryYear: paymentMethod.expiryYear,
        cvv: paymentMethod.cvv,
        customerToken: paymentMethod.customerToken,
        paymentAccountDataToken: paymentMethod.paymentAccountDataToken
      },
      billingAddress,
      orderData: {
        orderNumber: order.orderNumber || order.id,
        orderDescription: `DOPE CITY Order: ${itemDescriptions}`,
        lineItems: orderItems.map(item => ({
          name: item.productName || 'Item',
          description: item.productDescription || '',
          quantity: item.quantity,
          unitPrice: Number(item.priceAtPurchase),
          totalPrice: Number(item.priceAtPurchase) * item.quantity
        }))
      },
      taxAmount: Number(order.taxAmount || 0),
      shippingAmount: Number(order.shippingAmount || 0)
    };

    // Create payment transaction record (pending)
    const transaction = await storage.createTransaction({
      orderId: order.id,
      transactionType: 'charge',
      amount: order.totalAmount,
      currency: 'USD',
      status: 'pending',
      paymentMethodData: {
        type: paymentMethod.type,
        maskedCardNumber: paymentMethod.cardNumber ? `****${paymentMethod.cardNumber.slice(-4)}` : undefined
      }
    });

    // Process payment with KajaPay
    const paymentResult: PaymentResult = await kajaPayClient.processPayment(paymentRequest);

    // Update transaction with result
    await storage.updateTransaction(transaction.id, {
      kajaPayTransactionId: paymentResult.transactionId,
      kajaPayReferenceNumber: paymentResult.referenceNumber,
      status: paymentResult.success ? 'approved' : 'declined',
      kajaPayStatusCode: paymentResult.responseCode,
      authCode: paymentResult.authCode,
      errorMessage: paymentResult.errorMessage,
      paymentMethodData: {
        ...transaction.paymentMethodData,
        maskedCardNumber: paymentResult.maskedCardNumber,
        cardType: paymentResult.cardType,
        customerToken: paymentResult.customerToken,
        paymentAccountDataToken: paymentResult.paymentAccountDataToken
      }
    });

    if (paymentResult.success) {
      // Update order status to paid
      await storage.updateOrder(order.id, {
        paymentStatus: 'paid',
        transactionId: paymentResult.transactionId?.toString(),
        status: 'processing'
      });

      // Save payment method if requested and we got tokens
      if (savePaymentMethod && paymentResult.customerToken && paymentResult.paymentAccountDataToken) {
        try {
          await storage.createPaymentMethod({
            userId: user.id,
            kajaPayToken: paymentResult.paymentAccountDataToken,
            cardLast4: paymentResult.maskedCardNumber?.slice(-4),
            cardType: paymentResult.cardType,
            billingName: `${billingAddress.firstName} ${billingAddress.lastName}`,
            billingAddress: billingAddress,
            isDefault: false
          });
        } catch (error) {
          console.error('[Payment] Failed to save payment method:', error);
          // Don't fail the payment if saving payment method fails
        }
      }

      // Fire-and-forget: Create ShipStation order for fulfillment
      try {
        const { ShipstationService } = await import('../../../../server/shipstation/service');
        const { storage: serverStorage } = await import('../../../../server/storage');
        const apiKey = process.env.SHIPSTATION_API_KEY;
        const apiSecret = process.env.SHIPSTATION_API_SECRET;
        
        if (apiKey && apiSecret) {
          const svc = new ShipstationService({ 
            apiKey, 
            apiSecret, 
            webhookUrl: process.env.SHIPSTATION_WEBHOOK_URL 
          }, serverStorage);
          
          const shipstationOrder = {
            orderNumber: order.orderNumber || order.id,
            orderDate: new Date().toISOString(),
            orderStatus: 'awaiting_shipment',
            billTo: billingAddress,
            shipTo: order.shippingAddress || billingAddress,
            items: orderItems.map(item => ({
              name: item.productName || 'Item',
              sku: item.productSku || item.productId,
              quantity: item.quantity,
              unitPrice: Number(item.priceAtPurchase)
            })),
            orderTotal: Number(order.totalAmount),
            amountPaid: Number(order.totalAmount)
          };
          
          svc.createShipstationOrder(shipstationOrder).catch(error => {
            console.error('[Payment] Failed to create ShipStation order:', error);
          });
        }
      } catch (error) {
        console.error('[Payment] ShipStation integration error:', error);
      }

      return NextResponse.json({
        success: true,
        transactionId: paymentResult.transactionId,
        referenceNumber: paymentResult.referenceNumber,
        authCode: paymentResult.authCode,
        order: {
          id: order.id,
          status: 'processing',
          paymentStatus: 'paid'
        }
      });
    } else {
      // Payment failed - update order status
      await storage.updateOrder(order.id, {
        paymentStatus: 'failed',
        status: 'payment_failed'
      });

      return NextResponse.json({
        success: false,
        error: paymentResult.responseText || 'Payment failed',
        responseCode: paymentResult.responseCode
      }, { status: 402 });
    }

  } catch (error) {
    console.error('[Payment] Processing error:', error);
    return NextResponse.json({
      success: false,
      error: 'Payment processing failed'
    }, { status: 500 });
  }
}
