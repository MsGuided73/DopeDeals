import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/requireAuth';
import * as db from '@/lib/storage';
import { ShipstationService } from '@/lib/services/shipstation';
import { z } from 'zod';

const CheckoutSchema = z.object({
  items: z.array(z.object({ productId: z.string().uuid(), quantity: z.number().int().positive() })).min(1),
  shippingAddress: z.object({}).passthrough().optional(),
  billingAddress: z.object({}).passthrough().optional(),
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

  const { items, shippingAddress, billingAddress } = parse.data;

  // Validate inventory locally (Phase A)
  for (const line of items) {
    const product = await db.getProduct(line.productId);
    if (!product) return NextResponse.json({ error: `Product not found: ${line.productId}` }, { status: 404 });
    if (product.inStock === false) {
      return NextResponse.json({ error: `Product out of stock: ${product.name}` }, { status: 409 });
    }
  }

  // Compute totals (basic)
  let subtotal = 0;
  for (const line of items) {
    const product = await db.getProduct(line.productId)!;
    subtotal += Number(product!.price) * line.quantity;
  }
  const tax = 0;
  const shipping = 0;
  const total = subtotal + tax + shipping;

  // Prefer atomic checkout when available
  if (typeof (db as any).checkoutAtomic === 'function') {
    const { order, items: createdItems } = await (db as any).checkoutAtomic({
      userId: user.id,
      items,
      shippingAddress,
      billingAddress,
    });

    // Fire-and-forget: create ShipStation order after paid (placeholder)
    try {
      const apiKey = process.env.SHIPSTATION_API_KEY;
      const apiSecret = process.env.SHIPSTATION_API_SECRET;
      if (apiKey && apiSecret) {
        const svc = new ShipstationService({ apiKey, apiSecret, webhookUrl: process.env.SHIPSTATION_WEBHOOK_URL });
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

    await db.clearCart(user.id);

    return NextResponse.json({
      order,
      items: createdItems,
      summary: { items, totals: { subtotal, tax, shipping, total } },
    }, { status: 201 });
  }

  // Fallback: create order and items separately
  const order = await db.createOrder({
    userId: user.id,
    subtotalAmount: subtotal.toString(),
    taxAmount: tax.toString(),
    shippingAmount: shipping.toString(),
    totalAmount: total.toString(),
    paymentStatus: 'pending',
    paymentMethod: 'card',
    shippingAddress: shippingAddress || null,
    billingAddress: billingAddress || null,
    status: 'processing',
  } as Parameters<typeof db.createOrder>[0]);

  const createdItems = [] as Array<{ id: string; productId: string; quantity: number; priceAtPurchase: string }>;
  for (const line of items) {
    const product = await db.getProduct(line.productId);
    if (!product) continue;
    const oi = await db.createOrderItem({
      orderId: order.id,
      productId: product.id,
      quantity: line.quantity,
      priceAtPurchase: product.price,
    } as Parameters<typeof db.createOrderItem>[0]);
    const oiAny: any = oi as any;
    createdItems.push({ id: oiAny.id as string, productId: oiAny.productId as string, quantity: oiAny.quantity as number, priceAtPurchase: oiAny.priceAtPurchase as string });
  }

  await db.clearCart(user.id);

  return NextResponse.json({
    order,
    items: createdItems,
    summary: { items, totals: { subtotal, tax, shipping, total } },
  }, { status: 201 });
}

