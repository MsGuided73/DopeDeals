export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6"><p className="text-sm text-gray-600">Total Revenue</p><p className="text-2xl font-bold text-gray-900">$125,430</p><p className="text-sm text-green-600">+12.5% from last month</p></div>
        <div className="bg-white rounded-lg shadow p-6"><p className="text-sm text-gray-600">Orders</p><p className="text-2xl font-bold text-gray-900">1,247</p><p className="text-sm text-green-600">+8.2% from last month</p></div>
        <div className="bg-white rounded-lg shadow p-6"><p className="text-sm text-gray-600">Active Products</p><p className="text-2xl font-bold text-gray-900">342</p><p className="text-sm text-red-600">3 out of stock</p></div>
        <div className="bg-white rounded-lg shadow p-6"><p className="text-sm text-gray-600">Avg. Order Value</p><p className="text-2xl font-bold text-gray-900">$72.95</p><p className="text-sm text-green-600">+3.4% from last month</p></div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <ul className="space-y-3">
          <li className="flex items-center gap-3"><span className="text-blue-600">📦</span><span className="text-sm text-gray-700">New order #ORD-001 placed</span></li>
          <li className="flex items-center gap-3"><span className="text-green-600">✅</span><span className="text-sm text-gray-700">Inventory sync complete</span></li>
          <li className="flex items-center gap-3"><span className="text-yellow-600">⚠️</span><span className="text-sm text-gray-700">2 products low on stock</span></li>
        </ul>
      </div>
    </div>
  );
}

