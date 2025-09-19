import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '../../../lib/storage';
import { requireAuth } from '../../lib/requireAuth';
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
  const tax = 0;
  const shipping = 0;
  const total = subtotal + tax + shipping;

  // Prefer atomic checkout when available (Supabase)
  if (typeof storage.checkoutAtomic === 'function') {
    const { order, items: createdItems } = await storage.checkoutAtomic({
      userId: user.id,
      items,
      shippingAddress,
      billingAddress,
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

    return NextResponse.json({
      order,
      items: createdItems,
      summary: { items, totals: { subtotal, tax, shipping, total } },
    }, { status: 201 });
  }

  // Fallback: create order and items separately (memory or Prisma path)
  const order = await storage.createOrder({
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

