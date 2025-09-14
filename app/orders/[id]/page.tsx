import Link from 'next/link';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  // Mock order data for now - wire to real orders API later
  const order = {
    id,
    status: 'processing',
    total: 134.16,
    items: [
      { id: '1', name: 'Premium Glass Bong', qty: 1, price: 89.99 },
      { id: '2', name: 'THCA Pre-Roll Pack', qty: 2, price: 24.99 },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <nav className="text-sm text-gray-600">
          <Link href="/orders" className="underline">Orders</Link>
          <span className="mx-1">/</span>
          <span>Order {order.id}</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>Status: <span className="font-semibold capitalize">{order.status}</span></div>
            <div className="text-lg font-bold">Total: ${order.total.toFixed(2)}</div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Items</h2>
            <ul className="divide-y">
              {order.items.map((it) => (
                <li key={it.id} className="py-3 flex items-center justify-between">
                  <Link href={`/product/${it.id}`} className="hover:underline">{it.name}</Link>
                  <div className="text-sm text-gray-600">x{it.qty}</div>
                  <div className="font-medium">${(it.price * it.qty).toFixed(2)}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2">
            <Link href="/products" className="px-4 py-2 border rounded-md">Continue shopping</Link>
            <Link href="/orders" className="px-4 py-2 border rounded-md">Back to orders</Link>
          </div>
        </div>
      </div>
    </div>
  );
}