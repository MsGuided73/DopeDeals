import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';

const AdminDashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userRole] = useState('admin'); // Could be 'admin', 'manager', 'viewer'

  // Sample data
  const salesData = [
    { name: 'Jan', sales: 12000, orders: 120 },
    { name: 'Feb', sales: 19000, orders: 190 },
    { name: 'Mar', sales: 15000, orders: 150 },
    { name: 'Apr', sales: 22000, orders: 220 },
    { name: 'May', sales: 18000, orders: 180 },
    { name: 'Jun', sales: 25000, orders: 250 }
  ];

  const categoryData = [
    { name: 'Bongs', value: 35, color: '#667eea' },
    { name: 'Dab Rigs', value: 25, color: '#764ba2' },
    { name: 'Pipes', value: 20, color: '#f093fb' },
    { name: 'Accessories', value: 20, color: '#4ecdc4' }
  ];

  const products = [
    { id: 1, name: 'GRAV Helix Beaker Bong 14"', sku: 'GRV-001', price: 129.99, stock: 15, status: 'Active', brand: 'GRAV' },
    { id: 2, name: 'Hemper UFO Vortex Rig 6"', sku: 'HMP-002', price: 89.99, stock: 8, status: 'Active', brand: 'Hemper' },
    { id: 3, name: 'CaliBear Crystal Arch Pipe', sku: 'CLB-003', price: 24.99, stock: 3, status: 'Low Stock', brand: 'CaliBear' },
    { id: 4, name: 'GRAV Octobowl 14mm', sku: 'GRV-004', price: 19.99, stock: 0, status: 'Out of Stock', brand: 'GRAV' }
  ];

  const orders = [
    { id: '#ORD-001', customer: 'John Smith', date: '2024-08-23', total: 159.98, status: 'Processing', items: 2 },
    { id: '#ORD-002', customer: 'Sarah Johnson', date: '2024-08-23', total: 89.99, status: 'Shipped', items: 1 },
    { id: '#ORD-003', customer: 'Mike Wilson', date: '2024-08-22', total: 249.97, status: 'Delivered', items: 3 },
    { id: '#ORD-004', customer: 'Emily Davis', date: '2024-08-22', total: 44.98, status: 'Pending', items: 2 }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', roles: ['admin', 'manager', 'viewer'] },
    { id: 'products', label: 'Products', icon: '📦', roles: ['admin', 'manager'] },
    { id: 'categories', label: 'Categories & Brands', icon: '🏷️', roles: ['admin', 'manager'] },
    { id: 'orders', label: 'Orders', icon: '📋', roles: ['admin', 'manager', 'viewer'] },
    { id: 'inventory', label: 'Inventory', icon: '📊', roles: ['admin', 'manager'] },
    { id: 'customers', label: 'Customers', icon: '👥', roles: ['admin', 'manager'] },
    { id: 'compliance', label: 'Compliance', icon: '🔒', roles: ['admin'] },
    { id: 'shipping', label: 'Shipping', icon: '🚚', roles: ['admin', 'manager'] },
    { id: 'payments', label: 'Payments', icon: '💳', roles: ['admin', 'manager'] },
    { id: 'integrations', label: 'Integrations', icon: '🔗', roles: ['admin'] },
    { id: 'seo', label: 'SEO/Content', icon: '🔍', roles: ['admin', 'manager'] },
    { id: 'ai', label: 'AI Console', icon: '🤖', roles: ['admin'] },
    { id: 'monitoring', label: 'Monitoring', icon: '📈', roles: ['admin'] }
  ];

  const StatusBadge = ({ status, type = 'default' }) => {
    const getStatusColor = () => {
      switch (status.toLowerCase()) {
        case 'active': return 'bg-green-100 text-green-800';
        case 'low stock': return 'bg-yellow-100 text-yellow-800';
        case 'out of stock': return 'bg-red-100 text-red-800';
        case 'processing': return 'bg-blue-100 text-blue-800';
        case 'shipped': return 'bg-purple-100 text-purple-800';
        case 'delivered': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-gray-100 text-gray-800';
        case 'healthy': return 'bg-green-100 text-green-800';
        case 'warning': return 'bg-yellow-100 text-yellow-800';
        case 'error': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
        {status}
      </span>
    );
  };

  const DashboardPage = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$125,430</p>
              <p className="text-sm text-green-600">+12.5% from last month</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Orders</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
              <p className="text-sm text-green-600">+8.2% from last month</p>
            </div>
            <div className="text-3xl">📋</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Products</p>
              <p className="text-2xl font-bold text-gray-900">342</p>
              <p className="text-sm text-red-600">3 out of stock</p>
            </div>
            <div className="text-3xl">📦</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Customers</p>
              <p className="text-2xl font-bold text-gray-900">2,847</p>
              <p className="text-sm text-green-600">+15.3% from last month</p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="sales" stroke="#667eea" fill="#667eea" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {orders.slice(0, 4).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${order.total}</p>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Low Stock Alerts</h3>
          <div className="space-y-3">
            {products.filter(p => p.stock <= 5).map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sku}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{product.stock} left</p>
                  <StatusBadge status={product.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ProductsPage = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            />
            <select className="px-3 py-2 border border-gray-300 rounded-md">
              <option>All Brands</option>
              <option>GRAV</option>
              <option>Hemper</option>
              <option>CaliBear</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-md">
              <option>All Status</option>
              <option>Active</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const OrdersPage = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <div className="flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Export Orders
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">1,247</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">23</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Processing</p>
          <p className="text-2xl font-bold text-blue-600">45</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Shipped</p>
          <p className="text-2xl font-bold text-green-600">1,179</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search orders..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            />
            <select className="px-3 py-2 border border-gray-300 rounded-md">
              <option>All Status</option>
              <option>Pending</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
            </select>
            <input
              type="date"
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${order.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button className="text-green-600 hover:text-green-900">Update</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const CompliancePage = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Compliance</h1>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Age Verifications</p>
              <p className="text-2xl font-bold text-green-600">2,847</p>
              <p className="text-sm text-gray-500">This month</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed Verifications</p>
              <p className="text-2xl font-bold text-red-600">23</p>
              <p className="text-sm text-gray-500">This month</p>
            </div>
            <div className="text-3xl">❌</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Audit Score</p>
              <p className="text-2xl font-bold text-green-600">98.5%</p>
              <p className="text-sm text-gray-500">Last audit</p>
            </div>
            <div className="text-3xl">📋</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Compliance Events</h3>
          <div className="space-y-3">
            <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✅</span>
                <span className="font-medium">Age verification passed</span>
              </div>
              <p className="text-sm text-gray-600 ml-6">Customer ID: C-2847 | Order: #ORD-001</p>
              <p className="text-xs text-gray-500 ml-6">2 hours ago</p>
            </div>

            <div className="p-3 border border-red-200 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-red-600">❌</span>
                <span className="font-medium">Age verification failed</span>
              </div>
              <p className="text-sm text-gray-600 ml-6">IP: 192.168.1.100 | Attempted purchase blocked</p>
              <p className="text-xs text-gray-500 ml-6">4 hours ago</p>
            </div>

            <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-blue-600">📋</span>
                <span className="font-medium">Product compliance check</span>
              </div>
              <p className="text-sm text-gray-600 ml-6">Product: GRAV-001 | Status: Approved</p>
              <p className="text-xs text-gray-500 ml-6">1 day ago</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Compliance Rules</h3>
          <div className="space-y-3">
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Age Verification Required</p>
                  <p className="text-sm text-gray-600">All users must verify 21+ before purchase</p>
                </div>
                <StatusBadge status="Active" />
              </div>
            </div>

            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Location-based Restrictions</p>
                  <p className="text-sm text-gray-600">Block sales to restricted states</p>
                </div>
                <StatusBadge status="Active" />
              </div>
            </div>

            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Product Category Limits</p>
                  <p className="text-sm text-gray-600">Max 2 bongs per order in certain states</p>
                </div>
                <StatusBadge status="Active" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const IntegrationsPage = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add Integration
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold">Z</span>
              </div>
              <div>
                <p className="font-semibold">Zoho CRM</p>
                <p className="text-sm text-gray-600">Customer management</p>
              </div>
            </div>
            <StatusBadge status="Healthy" />
          </div>
          <div className="text-sm text-gray-600">
            <p>Last sync: 2 minutes ago</p>
            <p>Records: 2,847 customers</p>
          </div>
          <button className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200">
            Configure
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">K</span>
              </div>
              <div>
                <p className="font-semibold">KajaPay</p>
                <p className="text-sm text-gray-600">Payment processing</p>
              </div>
            </div>
            <StatusBadge status="Healthy" />
          </div>
          <div className="text-sm text-gray-600">
            <p>Last transaction: 5 minutes ago</p>
            <p>Success rate: 99.2%</p>
          </div>
          <button className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200">
            Configure
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 font-bold">S</span>
              </div>
              <div>
                <p className="font-semibold">ShipStation</p>
                <p className="text-sm text-gray-600">Shipping & fulfillment</p>
              </div>
            </div>
            <StatusBadge status="Warning" />
          </div>
          <div className="text-sm text-gray-600">
            <p>Last sync: 15 minutes ago</p>
            <p>Pending orders: 23</p>
          </div>
          <button className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200">
            Configure
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Integration Logs</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-green-600">✅</span>
              <div>
                <p className="font-medium">Zoho CRM sync completed</p>
                <p className="text-sm text-gray-600">Synchronized 15 new customers</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">2 min ago</span>
          </div>

          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-green-600">✅</span>
              <div>
                <p className="font-medium">KajaPay webhook received</p>
                <p className="text-sm text-gray-600">Payment confirmed for order #ORD-001</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">5 min ago</span>
          </div>

          <div className="flex items-center justify-between p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-yellow-600">⚠️</span>
              <div>
                <p className="font-medium">ShipStation API timeout</p>
                <p className="text-sm text-gray-600">Retrying connection in 5 minutes</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">15 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const AIConsolePage = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">AI Console</h1>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
          Run Classification
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Products Classified</p>
              <p className="text-2xl font-bold text-purple-600">1,247</p>
              <p className="text-sm text-gray-500">This month</p>
            </div>
            <div className="text-3xl">🤖</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Emoji Recommendations</p>
              <p className="text-2xl font-bold text-purple-600">2,845</p>
              <p className="text-sm text-gray-500">Generated</p>
            </div>
            <div className="text-3xl">😊</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Concierge Interactions</p>
              <p className="text-2xl font-bold text-purple-600">523</p>
              <p className="text-sm text-gray-500">This week</p>
            </div>
            <div className="text-3xl">💬</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent AI Jobs</h3>
          <div className="space-y-3">
            <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Product Classification</p>
                  <p className="text-sm text-gray-600">Batch: BATCH-001 | 50 products</p>
                </div>
                <StatusBadge status="Completed" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Completed 5 minutes ago</p>
            </div>

            <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Emoji Generation</p>
                  <p className="text-sm text-gray-600">New product descriptions | 25 items</p>
                </div>
                <StatusBadge status="Processing" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Started 2 minutes ago</p>
            </div>

            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SEO Optimization</p>
                  <p className="text-sm text-gray-600">Meta descriptions | 100 products</p>
                </div>
                <StatusBadge status="Queued" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Scheduled for tonight</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Concierge Analytics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Customer Satisfaction</span>
              <span className="font-semibold">4.8/5.0</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '96%' }}></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Response Time</span>
              <span className="font-semibold">1.2s avg</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Resolution Rate</span>
              <span className="font-semibold">87%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '87%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">AI Model Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={[
            { name: 'Mon', accuracy: 92, speed: 1.1 },
            { name: 'Tue', accuracy: 94, speed: 1.0 },
            { name: 'Wed', accuracy: 91, speed: 1.3 },
            { name: 'Thu', accuracy: 96, speed: 0.9 },
            { name: 'Fri', accuracy: 95, speed: 1.1 },
            { name: 'Sat', accuracy: 97, speed: 0.8 },
            { name: 'Sun', accuracy: 93, speed: 1.2 }
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="accuracy" stroke="#8b5cf6" name="Accuracy %" />
            <Line type="monotone" dataKey="speed" stroke="#06b6d4" name="Response Time (s)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const InventoryPage = () => {
    const [showBulkImport, setShowBulkImport] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showImageManager, setShowImageManager] = useState(null);

    const inventoryItems = [
      {
        id: 1,
        name: 'GRAV Helix Beaker Bong 14"',
        sku: 'GRV-001',
        currentStock: 15,
        reservedStock: 3,
        availableStock: 12,
        reorderPoint: 5,
        cost: 65.00,
        price: 129.99,
        location: 'A1-B3',
        description: 'Premium borosilicate glass beaker bong with helix cooling system. Features thick glass construction and removable downstem.',
        images: ['grav-helix-1.jpg', 'grav-helix-2.jpg'],
        lastUpdated: '2024-08-23',
        status: 'In Stock'
      },
      {
        id: 2,
        name: 'Hemper UFO Vortex Rig 6"',
        sku: 'HMP-002',
        currentStock: 8,
        reservedStock: 2,
        availableStock: 6,
        reorderPoint: 10,
        cost: 45.00,
        price: 89.99,
        location: 'B2-A1',
        description: 'Compact dual-chamber dab rig with inline percolator and venturi inlets for optimal vapor cooling.',
        images: ['hemper-ufo-1.jpg'],
        lastUpdated: '2024-08-22',
        status: 'Low Stock'
      },
      {
        id: 3,
        name: 'CaliBear Crystal Arch Pipe',
        sku: 'CLB-003',
        currentStock: 3,
        reservedStock: 1,
        availableStock: 2,
        reorderPoint: 8,
        cost: 12.50,
        price: 24.99,
        location: 'C1-D2',
        description: 'Handcrafted glass spoon pipe with unique crystal arch design. Colors vary by availability.',
        images: [],
        lastUpdated: '2024-08-21',
        status: 'Critical'
      },
      {
        id: 4,
        name: 'GRAV Octobowl 14mm',
        sku: 'GRV-004',
        currentStock: 0,
        reservedStock: 0,
        availableStock: 0,
        reorderPoint: 15,
        cost: 10.00,
        price: 19.99,
        location: 'A3-C1',
        description: 'Screened bowl with handle for enhanced smoking experience. 14mm male fitting.',
        images: ['grav-octobowl-1.jpg', 'grav-octobowl-2.jpg', 'grav-octobowl-3.jpg'],
        lastUpdated: '2024-08-20',
        status: 'Out of Stock'
      }
    ];

    const getStatusColor = (status) => {
      switch (status) {
        case 'In Stock': return 'bg-green-100 text-green-800';
        case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
        case 'Critical': return 'bg-red-100 text-red-800';
        case 'Out of Stock': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowBulkImport(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              📁 Bulk Import
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              📊 Export Report
            </button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
              🔄 Sync Stock
            </button>
          </div>
        </div>

        {/* Inventory Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">342</p>
                <p className="text-sm text-green-600">+12 this week</p>
              </div>
              <div className="text-3xl">📦</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-yellow-600">23</p>
                <p className="text-sm text-yellow-600">Needs attention</p>
              </div>
              <div className="text-3xl">⚠️</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">8</p>
                <p className="text-sm text-red-600">Reorder needed</p>
              </div>
              <div className="text-3xl">🚫</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                <p className="text-2xl font-bold text-blue-600">$89,432</p>
                <p className="text-sm text-blue-600">Current worth</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search inventory..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              />
              <select className="px-3 py-2 border border-gray-300 rounded-md">
                <option>All Status</option>
                <option>In Stock</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-md">
                <option>All Locations</option>
                <option>Warehouse A</option>
                <option>Warehouse B</option>
                <option>Warehouse C</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Images</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost/Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventoryItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.sku}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-700 truncate">{item.description}</p>
                        <button
                          onClick={() => setEditingProduct(item)}
                          className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                        >
                          ✏️ Edit Description
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {item.images.slice(0, 3).map((img, index) => (
                            <div key={index} className="w-8 h-8 bg-gray-200 rounded border-2 border-white flex items-center justify-center">
                              <span className="text-xs text-gray-500">📷</span>
                            </div>
                          ))}
                          {item.images.length > 3 && (
                            <div className="w-8 h-8 bg-gray-300 rounded border-2 border-white flex items-center justify-center">
                              <span className="text-xs font-medium">+{item.images.length - 3}</span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => setShowImageManager(item)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          🖼️ Manage
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium">Available: {item.availableStock}</div>
                        <div className="text-gray-500">Total: {item.currentStock}</div>
                        <div className="text-gray-500">Reserved: {item.reservedStock}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.location}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-500">Cost: ${item.cost}</div>
                        <div className="font-medium">Price: ${item.price}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Adjust</button>
                      <button className="text-green-600 hover:text-green-900">Reorder</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bulk Import Modal */}
        {showBulkImport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Bulk Inventory Import</h3>
                <button
                  onClick={() => setShowBulkImport(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="text-4xl mb-4">📁</div>
                  <p className="text-lg font-medium mb-2">Drop your CSV file here</p>
                  <p className="text-sm text-gray-600 mb-4">or click to browse files</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Choose File
                  </button>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">📋 CSV Format Requirements:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Required columns: SKU, Quantity, Location</li>
                    <li>• Optional columns: Cost, Reorder_Point, Notes</li>
                    <li>• Use comma-separated values (.csv format)</li>
                    <li>• First row should contain column headers</li>
                  </ul>
                </div>

                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    📥 Download Template
                  </button>
                  <button className="text-green-600 hover:text-green-800 text-sm">
                    📋 View Sample Data
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowBulkImport(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Import Inventory
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Description Edit Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Edit Product Description</h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-900">{editingProduct.name}</p>
                  <p className="text-sm text-gray-600">{editingProduct.sku}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Description</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    defaultValue={editingProduct.description}
                    placeholder="Enter detailed product description..."
                  />
                  <p className="text-xs text-gray-500 mt-1">This will be used for SEO and customer-facing content</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Brief one-line description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Key Features</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="e.g., 14mm, borosilicate, percolator"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save Description
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Manager Modal */}
        {showImageManager && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Manage Product Images</h3>
                <button
                  onClick={() => setShowImageManager(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4">
                <p className="font-medium text-gray-900">{showImageManager.name}</p>
                <p className="text-sm text-gray-600">{showImageManager.sku}</p>
              </div>

              <div className="space-y-6">
                {/* Current Images */}
                <div>
                  <h4 className="font-medium mb-3">Current Images ({showImageManager.images.length})</h4>
                  <div className="grid grid-cols-4 gap-4">
                    {showImageManager.images.map((img, index) => (
                      <div key={index} className="relative">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🖼️</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 truncate">{img}</p>
                        <button className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs">
                          ×
                        </button>
                      </div>
                    ))}
                    {/* Add Image Button */}
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
                      <div className="text-center">
                        <span className="text-2xl text-gray-400">➕</span>
                        <p className="text-xs text-gray-500 mt-1">Add Image</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upload Area */}
                <div>
                  <h4 className="font-medium mb-3">Upload New Images</h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="text-3xl mb-2">📷</div>
                    <p className="text-sm text-gray-600 mb-2">Drag & drop images here or click to browse</p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                      Choose Files
                    </button>
                    <p className="text-xs text-gray-500 mt-2">Supports: JPG, PNG, WebP (max 5MB each)</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowImageManager(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Done
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const SEOContentPage = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedPage, setSelectedPage] = useState(null);

    const seoPages = [
      { id: 1, url: '/bongs/grav-helix-beaker', title: 'GRAV Helix Beaker Bong 14" - Premium Borosilicate', score: 85, status: 'Good', issues: ['Meta description too short'] },
      { id: 2, url: '/dab-rigs/hemper-ufo-vortex', title: 'Hemper UFO Vortex Rig 6" Dual Chamber', score: 92, status: 'Excellent', issues: [] },
      { id: 3, url: '/pipes/calibear-crystal-arch', title: 'CaliBear Crystal Arch Glass Spoon Pipe', score: 67, status: 'Needs Work', issues: ['Missing alt text', 'No H1 tag', 'Thin content'] },
      { id: 4, url: '/category/bongs', title: 'Water Pipes & Bongs - Premium Glass Collection', score: 78, status: 'Good', issues: ['Duplicate H2 tags'] },
      { id: 5, url: '/brands/grav', title: 'GRAV Brand Collection - Scientific Glass Pipes & Bongs', score: 88, status: 'Good', issues: ['Internal linking could improve'] }
    ];

    const redirects = [
      { from: '/old-bongs-category', to: '/category/bongs', status: '301', hits: 1247 },
      { from: '/water-pipes', to: '/category/bongs', status: '301', hits: 892 },
      { from: '/glass-pipes', to: '/category/pipes', status: '301', hits: 567 },
      { from: '/dab-equipment', to: '/category/dab-rigs', status: '301', hits: 423 }
    ];

    const keywords = [
      { keyword: 'glass bongs', position: 3, volume: 8100, difficulty: 65, trend: 'up' },
      { keyword: 'dab rigs', position: 7, volume: 5400, difficulty: 58, trend: 'stable' },
      { keyword: 'water pipes', position: 12, volume: 3600, difficulty: 72, trend: 'down' },
      { keyword: 'smoking accessories', position: 5, volume: 2900, difficulty: 45, trend: 'up' },
      { keyword: 'hand pipes', position: 15, volume: 1800, difficulty: 52, trend: 'stable' }
    ];

    const getSEOScore = (score) => {
      if (score >= 80) return 'text-green-600 bg-green-100';
      if (score >= 60) return 'text-yellow-600 bg-yellow-100';
      return 'text-red-600 bg-red-100';
    };

    const getTrendIcon = (trend) => {
      switch (trend) {
        case 'up': return <span className="text-green-500">📈</span>;
        case 'down': return <span className="text-red-500">📉</span>;
        default: return <span className="text-gray-500">➖</span>;
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">SEO & Content</h1>
          <div className="flex gap-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Generate Sitemap
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Run SEO Audit
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'pages', label: 'Page Optimization', icon: '📄' },
              { id: 'keywords', label: 'Keywords', icon: '🔍' },
              { id: 'redirects', label: 'Redirects', icon: '🔄' },
              { id: 'sitemap', label: 'Sitemap', icon: '🗺️' },
              { id: 'schema', label: 'Schema', icon: '🏷️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pages Indexed</p>
                    <p className="text-2xl font-bold text-blue-600">1,247</p>
                    <p className="text-sm text-green-600">+12 this week</p>
                  </div>
                  <div className="text-3xl">📄</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. SEO Score</p>
                    <p className="text-2xl font-bold text-green-600">82</p>
                    <p className="text-sm text-green-600">+3 points</p>
                  </div>
                  <div className="text-3xl">⭐</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Organic Traffic</p>
                    <p className="text-2xl font-bold text-purple-600">15,432</p>
                    <p className="text-sm text-green-600">+8.2% this month</p>
                  </div>
                  <div className="text-3xl">📈</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Issues Found</p>
                    <p className="text-2xl font-bold text-red-600">23</p>
                    <p className="text-sm text-red-600">5 critical</p>
                  </div>
                  <div className="text-3xl">⚠️</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Critical Issues</h3>
                <div className="space-y-3">
                  <div className="p-3 border border-red-200 bg-red-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-red-600 mt-1">🚨</span>
                      <div>
                        <p className="font-medium text-red-800">5 pages missing H1 tags</p>
                        <p className="text-sm text-red-600">Product pages need proper heading structure</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-yellow-600 mt-1">⚠️</span>
                      <div>
                        <p className="font-medium text-yellow-800">12 images missing alt text</p>
                        <p className="text-sm text-yellow-600">Accessibility and SEO improvement needed</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border border-orange-200 bg-orange-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-orange-600 mt-1">⚡</span>
                      <div>
                        <p className="font-medium text-orange-800">6 pages with slow load times</p>
                        <p className="text-sm text-orange-600">Page speed optimization required</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Improvements</h3>
                <div className="space-y-3">
                  <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-green-600 mt-1">✅</span>
                      <div>
                        <p className="font-medium text-green-800">Updated 25 meta descriptions</p>
                        <p className="text-sm text-green-600">Product pages now have optimized descriptions</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-blue-600 mt-1">🔗</span>
                      <div>
                        <p className="font-medium text-blue-800">Added 15 internal links</p>
                        <p className="text-sm text-blue-600">Improved site structure and crawlability</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border border-purple-200 bg-purple-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-purple-600 mt-1">🏷️</span>
                      <div>
                        <p className="font-medium text-purple-800">Schema markup deployed</p>
                        <p className="text-sm text-purple-600">Product schema added to 100 items</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pages Tab */}
        {activeTab === 'pages' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Page Optimization</h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Bulk Edit Meta Tags
                  </button>
                </div>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Search pages..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <select className="px-3 py-2 border border-gray-300 rounded-md">
                    <option>All Pages</option>
                    <option>Products</option>
                    <option>Categories</option>
                    <option>Brands</option>
                  </select>
                  <select className="px-3 py-2 border border-gray-300 rounded-md">
                    <option>All Scores</option>
                    <option>Excellent (80-100)</option>
                    <option>Good (60-79)</option>
                    <option>Needs Work (0-59)</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SEO Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issues</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {seoPages.map((page) => (
                      <tr key={page.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900 truncate max-w-md">{page.title}</div>
                            <div className="text-sm text-gray-500">{page.url}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSEOScore(page.score)}`}>
                              {page.score}
                            </span>
                            <span className="text-sm text-gray-500">{page.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {page.issues.length > 0 ? (
                              page.issues.map((issue, index) => (
                                <span key={index} className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-1">
                                  {issue}
                                </span>
                              ))
                            ) : (
                              <span className="text-green-600 text-sm">✓ No issues</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <button
                            onClick={() => setSelectedPage(page)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            Audit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Page Edit Modal */}
            {selectedPage && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Edit SEO Settings</h3>
                    <button
                      onClick={() => setSelectedPage(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                      <input
                        type="text"
                        defaultValue={selectedPage.title}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <p className="text-xs text-gray-500 mt-1">60 characters recommended</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Enter meta description..."
                      />
                      <p className="text-xs text-gray-500 mt-1">160 characters recommended</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
                      <input
                        type="text"
                        defaultValue={selectedPage.url}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Focus Keywords</label>
                      <input
                        type="text"
                        placeholder="glass bongs, water pipes, smoking accessories"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      onClick={() => setSelectedPage(null)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Keywords Tab */}
        {activeTab === 'keywords' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Keyword Performance</h3>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Add Keywords
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {keywords.map((keyword, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{keyword.keyword}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                            keyword.position <= 3 ? 'bg-green-100 text-green-800' :
                            keyword.position <= 10 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            #{keyword.position}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{keyword.volume.toLocaleString()}/mo</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  keyword.difficulty <= 30 ? 'bg-green-500' :
                                  keyword.difficulty <= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${keyword.difficulty}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">{keyword.difficulty}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getTrendIcon(keyword.trend)}
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-blue-600 hover:text-blue-900 text-sm">
                            Track
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Redirects Tab */}
        {activeTab === 'redirects' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">URL Redirects</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Add Redirect
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hits</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {redirects.map((redirect, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono text-sm text-gray-900">{redirect.from}</td>
                        <td className="px-6 py-4 font-mono text-sm text-blue-600">{redirect.to}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            {redirect.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{redirect.hits.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs placeholder */}
        {['sitemap', 'schema'].includes(activeTab) && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
            </h3>
            <p className="text-gray-600">This feature is coming soon...</p>
          </div>
        )}
      </div>
    );

  // Categories & Brands
  const CategoriesBrandsPage = () => {
    const categories = [
      { id: 'cat-1', name: 'Glass Bongs', products: 112 },
      { id: 'cat-2', name: 'Dab Rigs', products: 86 },
    ];
    const brands = [
      { id: 'br-1', name: 'GRAV', products: 54 },
      { id: 'br-2', name: 'Hemper', products: 31 },
    ];
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Categories & Brands</h1>
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add Category</button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">Add Brand</button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Categories</h3>
              <input className="px-3 py-2 border border-gray-300 rounded-md" placeholder="Search categories" />
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50"><tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                <th className="px-6 py-3" />
              </tr></thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{c.products}</td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Brands</h3>
              <input className="px-3 py-2 border border-gray-300 rounded-md" placeholder="Search brands" />
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50"><tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                <th className="px-6 py-3" />
              </tr></thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {brands.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{b.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{b.products}</td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const CustomersPage = () => {
    const customers = [
      { id: 'c-001', name: 'John Smith', email: 'john@example.com', orders: 5, total: 429.50, status: 'Active' },
      { id: 'c-002', name: 'Sarah Johnson', email: 'sarah@example.com', orders: 12, total: 1299.00, status: 'VIP' },
    ];
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add Customer</button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Export</button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex gap-4">
            <input className="flex-1 px-3 py-2 border border-gray-300 rounded-md" placeholder="Search customers..." />
            <select className="px-3 py-2 border border-gray-300 rounded-md"><option>All</option><option>Active</option><option>VIP</option></select>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3" />
            </tr></thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.orders}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">${'{'}c.total{'}'}</td>
                  <td className="px-6 py-4 text-right text-sm">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button className="text-green-600 hover:text-green-900">Message</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const ShippingPage = () => {
    const warehouses = [
      { id: 'w-001', name: 'Main Warehouse', address: 'Austin, TX', stock: 1240 },
      { id: 'w-002', name: 'Secondary', address: 'Dallas, TX', stock: 560 },
    ];
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Shipping</h1>
          <div className="flex gap-2">
            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">Sync ShipStation</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add Warehouse</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6"><p className="text-sm text-gray-600">ShipStation</p><p className="text-2xl font-bold text-gray-900">Connected</p></div>
          <div className="bg-white rounded-lg shadow p-6"><p className="text-sm text-gray-600">Pending Orders</p><p className="text-2xl font-bold text-gray-900">23</p></div>
          <div className="bg-white rounded-lg shadow p-6"><p className="text-sm text-gray-600">Avg. Label Cost</p><p className="text-2xl font-bold text-gray-900">$7.42</p></div>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Warehouses</h3>
            <input className="px-3 py-2 border border-gray-300 rounded-md" placeholder="Search warehouses" />
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3" />
            </tr></thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {warehouses.map(w => (
                <tr key={w.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{w.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{w.address}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{w.stock}</td>
                  <td className="px-6 py-4 text-right text-sm">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const PaymentsPage = () => {
    const tx = [
      { id: 'tx-001', order: '#ORD-001', amount: 159.98, status: 'Succeeded', method: 'Card' },
      { id: 'tx-002', order: '#ORD-002', amount: 89.99, status: 'Refunded', method: 'Card' },
    ];
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <div className="flex gap-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Reconcile</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Export</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6"><p className="text-sm text-gray-600">Success Rate</p><p className="text-2xl font-bold text-green-600">99.2%</p></div>
          <div className="bg-white rounded-lg shadow p-6"><p className="text-sm text-gray-600">Refunds (30d)</p><p className="text-2xl font-bold text-yellow-600">8</p></div>
          <div className="bg-white rounded-lg shadow p-6"><p className="text-sm text-gray-600">Disputes</p><p className="text-2xl font-bold text-red-600">1</p></div>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <input className="px-3 py-2 border border-gray-300 rounded-md" placeholder="Search transactions" />
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tx ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3" />
            </tr></thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tx.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm text-gray-900">{t.id}</td>
                  <td className="px-6 py-4 text-sm text-blue-600">{t.order}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">${'{'}t.amount{'}'}</td>
                  <td className="px-6 py-4"><StatusBadge status={t.status} /></td>
                  <td className="px-6 py-4 text-right text-sm"><button className="text-blue-600 hover:text-blue-900">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const MonitoringPage = () => {
    const checks = [
      { id: 'api', name: 'API Health', status: 'Healthy' },
      { id: 'zoho', name: 'Zoho Integration', status: 'Healthy' },
      { id: 'ship', name: 'ShipStation', status: 'Warning' },
    ];
    const logs = [
      { ts: '03:21', level: 'info', msg: 'Health check OK' },
      { ts: '03:20', level: 'warn', msg: 'ShipStation timeout' },
    ];
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Monitoring</h1>
          <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black">Refresh</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {checks.map(c => (
            <div key={c.id} className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{c.name}</p>
                <p className="text-lg font-semibold text-gray-900">Status</p>
              </div>
              <StatusBadge status={c.status} />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Logs</h3>
            <select className="px-3 py-2 border border-gray-300 rounded-md"><option>All</option><option>Info</option><option>Warning</option><option>Error</option></select>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
            </tr></thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((l, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">{l.ts}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{l.level}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{l.msg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };



  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage />;
      case 'products': return <ProductsPage />;
      case 'categories': return <CategoriesBrandsPage />;
      case 'orders': return <OrdersPage />;
      case 'inventory': return <InventoryPage />;
      case 'customers': return <CustomersPage />;
      case 'compliance': return <CompliancePage />;
      case 'shipping': return <ShippingPage />;
      case 'payments': return <PaymentsPage />;
      case 'integrations': return <IntegrationsPage />;
      case 'ai': return <AIConsolePage />;
      case 'seo': return <SEOContentPage />;
      case 'monitoring': return <MonitoringPage />;
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {menuItems.find(item => item.id === currentPage)?.label || 'Page Not Found'}
              </h2>
              <p className="text-gray-600">This page is coming soon...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CN</span>
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-bold text-gray-900">CloudNine Admin</h1>
                <p className="text-xs text-gray-500">v2.0.1</p>
              </div>
            )}
          </div>
        </div>

        <nav className="mt-8">
          {menuItems
            .filter(item => item.roles.includes(userRole))
            .map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                  currentPage === item.id ? 'bg-blue-50 border-r-2 border-blue-600 text-blue-600' : 'text-gray-700'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
              </button>
            ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-xl">{sidebarCollapsed ? '→' : '←'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-2xl">👋</span>
              <div>
                <h2 className="font-semibold text-gray-900">Welcome back, Admin!</h2>
                <p className="text-sm text-gray-600">Here's what's happening with your store today.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <span className="text-xl">🔔</span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                <span className="font-medium text-gray-900">Admin User</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

}

export default AdminDashboard;