import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '../../../lib/storage';
import { requireAuth } from '../../lib/requireAuth';
import { z } from 'zod';

// Generate order number in format: DC-YYYYMMDD-XXXX
function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');

  return `DC-${year}${month}${day}-${random}`;
}

// Calculate tax based on shipping address
function calculateTax(subtotal: number, shippingState: string): number {
  const taxRates: Record<string, number> = {
    'CA': 0.0875, 'NY': 0.08, 'TX': 0.0625, 'FL': 0.06, 'WA': 0.065
  };
  const rate = taxRates[shippingState] || 0;
  return subtotal * rate;
}

// Calculate shipping based on order total and location
function calculateShipping(subtotal: number, shippingState: string): number {
  if (subtotal >= 100) return 0; // Free shipping over $100
  const shippingRates: Record<string, number> = {
    'CA': 8.99, 'NY': 9.99, 'TX': 7.99, 'FL': 8.99, 'WA': 9.99
  };
  return shippingRates[shippingState] || 12.99;
}

const CheckoutSchema = z.object({
  items: z.array(z.object({ productId: z.string().uuid(), quantity: z.number().int().positive() })).min(1),
  shippingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    address1: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string().default('US'),
    phone: z.string().optional()
  }).optional(),
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
  }).optional(),
  paymentMethod: z.object({
    type: z.enum(['card', 'ach', 'saved_card']),
    cardNumber: z.string().optional(),
    expiryMonth: z.string().optional(),
    expiryYear: z.string().optional(),
    cvv: z.string().optional(),
    customerToken: z.string().optional(),
    paymentAccountDataToken: z.string().optional()
  }).optional(),
  processPayment: z.boolean().default(false),
  savePaymentMethod: z.boolean().default(false)
});

export async function POST(req: NextRequest) {
  // Require auth
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  const { user } = auth;

  const body = await req.json().catch(() => ({}));
  const parse = CheckoutSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid payload', issues: parse.error.issues }, { status: 400 });
  }

  const { items, shippingAddress, billingAddress, paymentMethod, processPayment, savePaymentMethod } = parse.data;

  // Validate inventory locally (Phase A)
  const storage = await getStorage();
  for (const line of items) {
    const product = await storage.getProduct(line.productId);
    if (!product) return NextResponse.json({ error: `Product not found: ${line.productId}` }, { status: 404 });
    if (product.inStock === false) {
      return NextResponse.json({ error: `Product out of stock: ${product.name}` }, { status: 409 });
    }
  }

  // Compute totals (basic)
  let subtotal = 0;
  for (const line of items) {
    const product = await storage.getProduct(line.productId)!;
    subtotal += Number(product!.price) * line.quantity;
  }
  // Calculate tax and shipping
  const tax = calculateTax(subtotal, shippingAddress?.state || 'CA');
  const shipping = calculateShipping(subtotal, shippingAddress?.state || 'CA');
  const total = subtotal + tax + shipping;

  // Generate order number
  const orderNumber = generateOrderNumber();

  // Prefer atomic checkout when available (Supabase)
  if (typeof storage.checkoutAtomic === 'function') {
    const { order, items: createdItems } = await storage.checkoutAtomic({
      userId: user.id,
      items,
      shippingAddress,
      billingAddress,
      orderNumber,
      subtotal: subtotal.toString(),
      taxAmount: tax.toString(),
      shippingAmount: shipping.toString(),
      totalAmount: total.toString()
    });

    // Fire-and-forget: create ShipStation order after paid (placeholder until payment integration)
    try {
      const { ShipstationService } = await import('../../../server/shipstation/service');
      const { storage: serverStorage } = await import('../../../server/storage');
      const apiKey = process.env.SHIPSTATION_API_KEY;
      const apiSecret = process.env.SHIPSTATION_API_SECRET;
      if (apiKey && apiSecret) {
        const svc = new ShipstationService({ apiKey, apiSecret, webhookUrl: process.env.SHIPSTATION_WEBHOOK_URL }, serverStorage);
        const map = {
          orderNumber: order.id,
          orderDate: new Date().toISOString(),
          orderStatus: 'awaiting_shipment',
          billTo: (billingAddress || shippingAddress || {}) as any,
          shipTo: (shippingAddress || billingAddress || {}) as any,
          items: createdItems.map((ci: any) => ({
            name: ci.name || 'Item',
            sku: ci.sku,
            quantity: ci.quantity,
            unitPrice: Number(ci.priceAtPurchase || 0),
          })),
          orderTotal: Number(total),
          amountPaid: Number(total),
        } as any;
        svc.createShipstationOrder(map).catch(() => void 0);
      }
    } catch {}

    await storage.clearCart(user.id);

    // Process payment if requested and payment method provided
    if (processPayment && paymentMethod && billingAddress) {
      try {
        // Import payment processing
        const { kajaPayClient } = await import('../../../server/kajapay/client');
        const { ProcessPaymentRequest } = await import('../../../server/kajapay/types');

        // Prepare payment request
        const paymentRequest = {
          amount: Number(total),
          currency: 'USD',
          paymentMethod,
          billingAddress,
          orderData: {
            orderNumber: order.orderNumber || order.id,
            orderDescription: `DOPE CITY Order: ${createdItems.length} items`,
            lineItems: createdItems.map((item: any) => ({
              name: item.productName || 'Item',
              description: item.productDescription || '',
              quantity: item.quantity,
              unitPrice: Number(item.priceAtPurchase),
              totalPrice: Number(item.priceAtPurchase) * item.quantity
            }))
          },
          taxAmount: Number(tax),
          shippingAmount: Number(shipping)
        };

        // Create payment transaction record
        const transaction = await storage.createTransaction({
          orderId: order.id,
          transactionType: 'charge',
          amount: total.toString(),
          currency: 'USD',
          status: 'pending',
          paymentMethodData: {
            type: paymentMethod.type,
            maskedCardNumber: paymentMethod.cardNumber ? `****${paymentMethod.cardNumber.slice(-4)}` : undefined
          }
        });

        // Process payment
        const paymentResult = await kajaPayClient.processPayment(paymentRequest);

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
          // Update order to paid
          await storage.updateOrder(order.id, {
            paymentStatus: 'paid',
            transactionId: paymentResult.transactionId?.toString(),
            status: 'processing'
          });

          // Save payment method if requested
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
              console.error('[Checkout] Failed to save payment method:', error);
            }
          }

          return NextResponse.json({
            order: { ...order, paymentStatus: 'paid', status: 'processing' },
            items: createdItems,
            summary: { items, totals: { subtotal, tax, shipping, total } },
            payment: {
              success: true,
              transactionId: paymentResult.transactionId,
              authCode: paymentResult.authCode
            }
          }, { status: 201 });
        } else {
          // Payment failed
          await storage.updateOrder(order.id, {
            paymentStatus: 'failed',
            status: 'payment_failed'
          });

          return NextResponse.json({
            order: { ...order, paymentStatus: 'failed', status: 'payment_failed' },
            items: createdItems,
            summary: { items, totals: { subtotal, tax, shipping, total } },
            payment: {
              success: false,
              error: paymentResult.responseText || 'Payment failed',
              responseCode: paymentResult.responseCode
            }
          }, { status: 402 });
        }
      } catch (error) {
        console.error('[Checkout] Payment processing error:', error);

        // Update order to failed
        await storage.updateOrder(order.id, {
          paymentStatus: 'failed',
          status: 'payment_failed'
        });

        return NextResponse.json({
          order: { ...order, paymentStatus: 'failed', status: 'payment_failed' },
          items: createdItems,
          summary: { items, totals: { subtotal, tax, shipping, total } },
          payment: {
            success: false,
            error: 'Payment processing failed'
          }
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      order,
      items: createdItems,
      summary: { items, totals: { subtotal, tax, shipping, total } },
    }, { status: 201 });
  }

  // Fallback: create order and items separately (memory or Prisma path)
  const order = await storage.createOrder({
    userId: user.id,
    orderNumber,
    subtotalAmount: subtotal.toString(),
    taxAmount: tax.toString(),
    shippingAmount: shipping.toString(),
    totalAmount: total.toString(),
    paymentStatus: 'pending',
    paymentMethod: 'card',
    shippingAddress: shippingAddress || null,
    billingAddress: billingAddress || null,
    status: 'pending',
  } as Parameters<typeof storage.createOrder>[0]);

  const createdItems = [] as Array<{ id: string; productId: string; quantity: number; priceAtPurchase: string }>;
  for (const line of items) {
    const product = await storage.getProduct(line.productId);
    if (!product) continue;
    const oi = await storage.createOrderItem({
      orderId: order.id,
      productId: product.id,
      quantity: line.quantity,
      priceAtPurchase: product.price,
    } as Parameters<typeof storage.createOrderItem>[0]);
    createdItems.push({ id: oi.id, productId: oi.productId as string, quantity: oi.quantity as number, priceAtPurchase: oi.priceAtPurchase as string });
  }

  await storage.clearCart(user.id);

  return NextResponse.json({
    order,
    items: createdItems,
    summary: { items, totals: { subtotal, tax, shipping, total } },
  }, { status: 201 });
}

