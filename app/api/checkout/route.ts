import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../../server/storage';
import { getSessionUser } from '@/lib/supabase-server-ssr';
import { z } from 'zod';

const CheckoutSchema = z.object({
  items: z.array(z.object({ productId: z.string().uuid(), quantity: z.number().int().positive() })).min(1),
  shippingAddress: z.object({}).passthrough().optional(),
  billingAddress: z.object({}).passthrough().optional(),
});

export async function POST(req: NextRequest) {
  // Require auth
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parse = CheckoutSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid payload', issues: parse.error.issues }, { status: 400 });
  }

  const { items, shippingAddress, billingAddress } = parse.data;

  // Validate inventory locally (Phase A)
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

  // Create order; we don't yet persist orderItems in storage abstraction, so we store order with totals
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
  } as any);

  // TODO: persist order_items when storage layer supports it explicitly

  // Optional: clear cart
  await storage.clearCart(user.id);

  return NextResponse.json({
    order,
    summary: {
      items,
      totals: { subtotal, tax, shipping, total },
    },
  }, { status: 201 });
}

