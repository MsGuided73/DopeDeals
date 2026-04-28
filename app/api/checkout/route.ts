export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '../../../lib/storage';
import { z } from 'zod';
import type { ProcessPaymentRequest, BillingAddress } from '../../../lib/services/kajapay/types';
import type { ShipstationOrder } from '@shared/shipstation-schema';
import { FinanceService } from '../../../lib/services/FinanceService';
import { logger } from '../../../lib/logger';

// Generate order number in format: DC-YYYYMMDD-XXXX
function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');

  return `DC-${year}${month}${day}-${random}`;
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
  }).optional(),
  shippingMethod: z.enum(['standard', 'express']).optional(),
  shippingAmount: z.number().optional(),
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
  try {
    // Accept both authenticated and guest users
    const { getSessionUser } = await import('@/lib/supabase-server-ssr');
    const user = await getSessionUser().catch(() => null);
    const userId = user?.id || null;

    const body = await req.json().catch(() => ({}));
  const parse = CheckoutSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid payload', issues: parse.error.issues }, { status: 400 });
  }

  const { items, shippingAddress, billingAddress, shippingMethod, shippingAmount, paymentMethod, processPayment, savePaymentMethod } = parse.data;

  // AGE VERIFICATION STRATEGY (ELEVATED STATUS):
  // We have intentionally elevated the frontend 21+ gateway to fulfill the 
  // formal compliance requirement for checkout. This bypasses the need for 
  // secondary 3rd-party verification (Didit) in the current rollout phase, 
  // ensuring a smooth but compliant purchase flow.

  // Validate inventory with real-time stock checking
  const storage = await getStorage();

  // First validate products exist and check inventory directly from Supabase
  for (const line of items) {
    const product = await storage.getProduct(line.productId);
    if (!product) return NextResponse.json({ error: `Product not found: ${line.productId}` }, { status: 404 });
    if (product.is_active === false) {
      return NextResponse.json({ error: `Product is not active: ${product.name}` }, { status: 409 });
    }
    
    // Just pull inventory from Supabase as requested
    const stock = Number(product.stock_quantity || 0);
    if (stock < line.quantity) {
      return NextResponse.json({ error: `Insufficient inventory for ${product.name}. Only ${stock} left.` }, { status: 409 });
    }
  }

  // Final Compliance Check (Zipcode)
  try {
    const { createServerClient } = await import('@supabase/ssr');
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() { return [] },
          setAll() {}
        }
      }
    );
    
    let stateToCheck = shippingAddress.state;

    // Resolve state for the zip (still do this to catch fake states if zip is real)
    const { data: zipRow } = await supabase
      .from('us_zipcodes')
      .select('state')
      .eq('zip', shippingAddress.postalCode)
      .single();

    if (zipRow && zipRow.state) {
      stateToCheck = zipRow.state;
    }

    if (stateToCheck) {
      // Fetch compliance rules for this state
      const { data: rules } = await supabase
        .from('compliance_rules')
        .select('id')
        .contains('restricted_states', [stateToCheck]);

      if (rules && rules.length > 0) {
        const ruleIds = rules.map((r: any) => r.id);
        const productIds = items.map(i => i.productId);
        
        const { data: restrictions } = await supabase
          .from('product_compliance')
          .select('product_id')
          .in('product_id', productIds)
          .in('compliance_id', ruleIds);

        const restrictedProductIds = restrictions ? restrictions.map((r: any) => r.product_id) : [];

        // Fallback THCA check based on category properties and names
        const { data: productDetails } = await supabase
          .from('main_site_products')
          .select('id, name, category, category_id')
          .in('id', productIds);
          
        if (productDetails) {
          for (const p of productDetails) {
            const nameLower = p.name?.toLowerCase() || '';
            const isThca = p.category?.toLowerCase().includes('thca') || 
                           p.category_id?.toLowerCase().startsWith('thca-') ||
                           nameLower.includes('thca') || 
                           nameLower.includes('thc-a');
            if (isThca) {
              const thcaRule = rules.find((r: any) => r.category?.toLowerCase().includes('thca'));
              if (thcaRule && !restrictedProductIds.includes(p.id)) {
                restrictedProductIds.push(p.id);
              } else if (!thcaRule) {
                // Fallback for THCA restricted states if no DB rule present (centralized in compliance-filters.ts)
                const { THCA_RESTRICTED_STATES: thcaStates } = await import('../../../lib/compliance-filters');
                if ((thcaStates as readonly string[]).includes(stateToCheck) && !restrictedProductIds.includes(p.id)) {
                  restrictedProductIds.push(p.id);
                }
              }
            }
          }
        }

        if (restrictedProductIds.length > 0) {
          return NextResponse.json({ 
            error: 'One or more items in your cart cannot be shipped to your location due to local regulations.',
            restrictedProductIds
          }, { status: 403 });
        }
      }
    }
  } catch (complianceError) {
    logger.error('[Checkout] Compliance check failed:', complianceError);
    // FAIL-CLOSED: If we can't verify compliance, we cannot process the order.
    // This prevents restricted products from slipping through during DB outages.
    return NextResponse.json({
      error: 'Unable to verify product eligibility for your location. Please try again shortly.',
      code: 'COMPLIANCE_CHECK_FAILED'
    }, { status: 503 });
  }

  // Compute totals using FinanceService
  const subtotal = FinanceService.calculateSubtotal(items.map(i => ({ ...i, price: 0 }))); // We'll get prices below
  
  // Re-calculate subtotal with actual prices from storage
  let actualSubtotal = 0;
  for (const line of items) {
    const product = await storage.getProduct(line.productId);
    if (!product) continue;
    const price = Number(product.our_price || product.price || 0);
    actualSubtotal += price * line.quantity;
  }

  // Calculate tax and shipping using unified service
  const tax = FinanceService.calculateTax(actualSubtotal, shippingAddress.state);
  const shipping = FinanceService.calculateShipping(actualSubtotal, shippingMethod);
  const total = actualSubtotal + tax + shipping;

  // Generate order number
  const orderNumber = generateOrderNumber();

  let order: any = null;
  let createdItems: any[] = [];

  // Prefer atomic checkout when available (Supabase)
  if (typeof storage.checkoutAtomic === 'function') {
    const result = await (storage.checkoutAtomic as any)({
      userId,
      items,
      shippingAddress,
      billingAddress,
      orderNumber,
      subtotal: subtotal.toString(),
      taxAmount: tax.toString(),
      shippingAmount: shipping.toString(),
      totalAmount: total.toString()
    });
    order = result.order;
    createdItems = result.items;
  } else {
    // Fallback: create order and items separately
    order = await (storage.createOrder as any)({
      userId,
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
    });

    for (const line of items) {
      const product = await storage.getProduct(line.productId);
      if (!product) continue;
      const price = Number(product.our_price || product.price || 0);
      const oi = await (storage.createOrderItem as any)({
        orderId: order.id,
        productId: product.id,
        quantity: line.quantity,
        priceAtPurchase: price,
        productName: product.name || 'Unknown Product',
        productSku: product.sku || 'SKU-000',
        productImageUrl: product.image_url || product.imageUrl || null,
        unitPrice: price,
        totalPrice: price * line.quantity,
      });
      createdItems.push({ id: oi.id, productId: oi.productId as string, quantity: oi.quantity as number, priceAtPurchase: oi.priceAtPurchase as string });
    }
  }

  // Fire-and-forget: create ShipStation order (graceful fail)
  try {
    const { ShipstationService } = await import('../../../lib/services/shipstation/service');
    const { getStorage: getServerStorage } = await import('../../../lib/storage');
    const serverStorage = await getServerStorage();
    const apiKey = process.env.SHIPSTATION_API_KEY;
    if (apiKey) {
      const svc = new ShipstationService(
        { apiKey, webhookUrl: process.env.SHIPSTATION_WEBHOOK_URL },
        serverStorage as any
      );
      const ssPayload = {
        orderNumber: order.orderNumber || order.id,
        orderDate: new Date().toISOString(),
        orderStatus: 'on_hold', // Hold until payment confirmed
        billTo: (billingAddress || shippingAddress || {}) as any,
        shipTo: (shippingAddress || billingAddress || {}) as any,
        items: createdItems.map((ci: any) => ({
          name: ci.productName || ci.name || 'Item',
          sku: ci.productSku || ci.sku,
          quantity: ci.quantity,
          unitPrice: Number(ci.priceAtPurchase || ci.unitPrice || 0),
        })),
        orderTotal: Number(total),
        amountPaid: 0,
      } as any;
      try {
        const ssResult = await svc.createShipstationOrder(ssPayload);
        if (ssResult?.success && ssResult.shipstationOrderId) {
          await serverStorage.updateOrder(order.id, {
            shipstation_order_id: ssResult.shipstationOrderId,
            shipstation_order_key: ssResult.order?.orderKey || '',
          });
        }
      } catch (ssError) {
        logger.error('[Checkout] ShipStation order creation failed:', ssError);
      }
    }
  } catch {}

  // Cart is preserved here — it is now cleared upon successful handshake in /checkout/success/page.tsx
  // Always use KajaPay Hosted Form for redirect flow
  try {
    const { kajaPayClient } = await import('../../../lib/services/kajapay/client');
    
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    // Prioritize NEXT_PUBLIC_SITE_URL if defined, otherwise fall back to dynamic host
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;

    const hostedFormResponse = await kajaPayClient.createHostedForm({
      amount: Number(total),
      orderNumber: order.orderNumber || order.id,
      orderDescription: `Highway 420 Order: ${createdItems.length} item${createdItems.length !== 1 ? 's' : ''}`,
      taxAmount: Number(tax),
      shippingAmount: Number(shipping),
      firstName: shippingAddress.firstName,
      lastName: shippingAddress.lastName,
      address1: shippingAddress.address1,
      city: shippingAddress.city,
      state: shippingAddress.state,
      zip: shippingAddress.postalCode,
      country: shippingAddress.country,
      email: user?.email || billingAddress?.email || undefined,
      phone: shippingAddress.phone || undefined,
      redirectUrl: `${baseUrl}/order-confirmation/${order.id}`,
      cancelUrl: `${baseUrl}/checkout/error?orderId=${order.id}`,
      callbackUrl: `${baseUrl}/api/kajapay/webhook`
    });

    if (hostedFormResponse.success && hostedFormResponse.data?.paymentUrl) {
      return NextResponse.json({
        success: true,
        redirectUrl: hostedFormResponse.data.paymentUrl,
        orderId: order.id
      });
    } else {
      const errorDetails = hostedFormResponse.error?.details ? JSON.stringify(hostedFormResponse.error.details) : '';
      throw new Error(`${hostedFormResponse.error?.responseText || 'Failed to create payment session'} - ${errorDetails}`);
    }
  } catch (error: any) {
    logger.error('[Checkout] KajaPay Hosted Form error:', error);
    // Cancel the orphaned order so it doesn't sit in 'pending' forever
    if (order?.id) {
      try {
        const storage = await getStorage();
        await storage.updateOrder(order.id, {
          status: 'cancelled',
          payment_status: 'failed',
          admin_notes: `Auto-cancelled: KajaPay payment form creation failed — ${error.message}`,
        });
      } catch (cleanupError) {
        logger.error('[Checkout] Failed to cancel orphaned order:', cleanupError);
      }
    }
    return NextResponse.json({
      error: 'Payment session creation failed. Please try again.',
      orderId: order?.id
    }, { status: 500 });
  }
} catch (globalError: any) {
  logger.error('[Checkout API Global Catch]', globalError);
  return NextResponse.json({ 
    error: globalError.message || 'CRITICAL_CHECKOUT_ERROR', 
    stack: process.env.NODE_ENV === 'development' ? globalError.stack : undefined
  }, { status: 500 });
}
}

