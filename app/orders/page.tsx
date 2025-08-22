import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { storage } from '@/../server/storage';

export default async function OrdersPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  );
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Orders</h1>
        <p className="text-sm text-muted-foreground">Please sign in to view your orders.</p>
      </div>
    );
  }

  const orders = await storage.getUserOrders(user.id);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Your Orders</h1>
      <ul className="space-y-3">
        {orders.map((o) => (
          <li key={o.id} className="border rounded p-3">
            <div className="font-medium">Order {o.id}</div>
            <div className="text-sm text-muted-foreground">Status: {o.status}</div>
            <div className="text-sm">Total: ${o.totalAmount}</div>
          </li>
        ))}
        {orders.length === 0 && (
          <li className="text-sm text-muted-foreground">No orders yet.</li>
        )}
      </ul>
    </div>
  );
}

