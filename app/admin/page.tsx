"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  Users,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye
} from 'lucide-react';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  activeProducts: number;
  totalCustomers: number;
  lowStockProducts: number;
  pendingOrders: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
}

interface RecentActivity {
  id: string;
  type: 'order' | 'product' | 'customer' | 'system';
  message: string;
  timestamp: string;
  icon: string;
  color: string;
}

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  image_url?: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    activeProducts: 0,
    totalCustomers: 0,
    lowStockProducts: 0,
    pendingOrders: 0,
    revenueChange: 0,
    ordersChange: 0,
    customersChange: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    try {
      // Load stats from API
      const statsRes = await fetch('/api/admin/dashboard/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Load recent activity
      const activityRes = await fetch('/api/admin/dashboard/activity');
      if (activityRes.ok) {
        const activityData = await activityRes.json();
        setRecentActivity(activityData.activities || []);
      }

      // Load top products
      const productsRes = await fetch('/api/admin/dashboard/top-products');
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setTopProducts(productsData.products || []);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set mock data for development
      setStats({
        totalRevenue: 125430,
        totalOrders: 1247,
        activeProducts: 342,
        totalCustomers: 892,
        lowStockProducts: 3,
        pendingOrders: 12,
        revenueChange: 12.5,
        ordersChange: 8.2,
        customersChange: 15.3
      });

      setRecentActivity([
        {
          id: '1',
          type: 'order',
          message: 'New order #ORD-001 placed by John Doe',
          timestamp: new Date().toISOString(),
          icon: '📦',
          color: 'text-blue-600'
        },
        {
          id: '2',
          type: 'system',
          message: 'Inventory sync completed successfully',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          icon: '✅',
          color: 'text-green-600'
        },
        {
          id: '3',
          type: 'product',
          message: 'Product "Blue Dream Pre-Roll" is low on stock',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          icon: '⚠️',
          color: 'text-yellow-600'
        },
        {
          id: '4',
          type: 'customer',
          message: 'New customer registration: jane.smith@email.com',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          icon: '👤',
          color: 'text-purple-600'
        }
      ]);

      setTopProducts([
        { id: '1', name: 'Gorilla Glue Pre-Roll', sales: 45, revenue: 2250, image_url: '/placeholder.jpg' },
        { id: '2', name: 'Blue Dream Flower', sales: 38, revenue: 1900, image_url: '/placeholder.jpg' },
        { id: '3', name: 'RooR Bong', sales: 32, revenue: 3200, image_url: '/placeholder.jpg' }
      ]);
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store today.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
            Export Report
          </button>
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium">
            Settings
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              <div className="flex items-center mt-1">
                {stats.revenueChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                )}
                <p className={`text-sm ${stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.revenueChange >= 0 ? '+' : ''}{stats.revenueChange}% from last month
                </p>
              </div>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalOrders)}</p>
              <div className="flex items-center mt-1">
                {stats.ordersChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                )}
                <p className={`text-sm ${stats.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.ordersChange >= 0 ? '+' : ''}{stats.ordersChange}% from last month
                </p>
              </div>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Products</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.activeProducts)}</p>
              {stats.lowStockProducts > 0 && (
                <div className="flex items-center mt-1">
                  <AlertTriangle className="w-4 h-4 text-red-600 mr-1" />
                  <p className="text-sm text-red-600">{stats.lowStockProducts} low stock</p>
                </div>
              )}
            </div>
            <Package className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalCustomers)}</p>
              <div className="flex items-center mt-1">
                {stats.customersChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                )}
                <p className={`text-sm ${stats.customersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.customersChange >= 0 ? '+' : ''}{stats.customersChange}% from last month
                </p>
              </div>
            </div>
            <Users className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Link href="/admin/orders" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All Orders →
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No recent activity</p>
              </div>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <span className={`text-xl ${activity.color}`}>{activity.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/admin/products/new"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-blue-700 hover:text-blue-800"
              >
                <Package className="w-5 h-5" />
                <span className="font-medium">Add New Product</span>
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 text-green-700 hover:text-green-800"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="font-medium">View Orders</span>
              </Link>
              <Link
                href="/admin/customers"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 text-purple-700 hover:text-purple-800"
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Manage Customers</span>
              </Link>
              <Link
                href="/admin/inventory"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 text-orange-700 hover:text-orange-800"
              >
                <Package className="w-5 h-5" />
                <span className="font-medium">Check Inventory</span>
              </Link>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts</h3>
            <div className="space-y-3">
              {stats.pendingOrders > 0 && (
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      {stats.pendingOrders} Pending Orders
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Require attention
                    </p>
                  </div>
                </div>
              )}

              {stats.lowStockProducts > 0 && (
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      {stats.lowStockProducts} Products Low Stock
                    </p>
                    <p className="text-xs text-red-700 mt-1">
                      Restock needed
                    </p>
                  </div>
                </div>
              )}

              {stats.pendingOrders === 0 && stats.lowStockProducts === 0 && (
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      All Systems Normal
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      No immediate action required
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Products</h3>
          <Link href="/admin/products" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All Products →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topProducts.map((product, index) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-bold text-gray-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{product.sales}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(product.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
