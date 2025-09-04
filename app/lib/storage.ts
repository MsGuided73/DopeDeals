import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use a singleton admin client
let _admin: ReturnType<typeof createClient> | null = null;
function admin() {
  if (!_admin) {
    _admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  }
  return _admin;
}

export async function getProduct(productId: string) {
  const { data, error } = await admin().from('products').select('*').eq('id', productId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function clearCart(userId: string) {
  const { error } = await admin().from('cart_items').delete().eq('userId', userId);
  if (error) throw error;
}

export async function createOrder(order: { userId: string; subtotalAmount?: string; taxAmount?: string; shippingAmount?: string; totalAmount?: string; paymentStatus: string; paymentMethod: string; shippingAddress?: any; billingAddress?: any; status: string; }) {
  const { data, error } = await admin().from('orders').insert(order as any).select('*').single();
  if (error) throw error;
  return data;
}

export async function createOrderItem(item: { orderId: string; productId: string; quantity: number; priceAtPurchase: string; }) {
  const { data, error } = await admin().from('order_items').insert(item as any).select('*').single();
  if (error) throw error;
  return data;
}

export async function checkoutAtomic(input: { userId: string; items: Array<{ productId: string; quantity: number }>; shippingAddress?: any; billingAddress?: any; }) {
  // This should call a Postgres function or do multi-step with RLS-safe logic; placeholder minimal implementation
  // Create order
  const { data: order, error: orderErr } = await admin().from('orders').insert({
    userId: input.userId,
    status: 'processing',
    paymentStatus: 'paid',
  }).select('*').single();
  if (orderErr) throw orderErr;

  const createdItems: any[] = [];
  for (const line of input.items) {
    const { data: prod, error: pe } = await admin().from('products').select('*').eq('id', line.productId).maybeSingle();
    if (pe || !prod) continue;
    const { data: oi, error: oie } = await admin().from('order_items').insert({
      orderId: order.id,
      productId: prod.id,
      quantity: line.quantity,
      priceAtPurchase: prod.price,
    }).select('*').single();
    if (!oie && oi) createdItems.push(oi);
  }

  return { order, items: createdItems };
}

