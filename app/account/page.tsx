'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import {
  User, Settings, Package, Heart, CreditCard, MapPin, LogOut,
  Star, Gift, ShoppingBag, Bell, Shield, HelpCircle,
  TrendingUp, Award, Clock, Edit, Eye, Trash2, Loader2
} from 'lucide-react';
import GlobalBreadcrumbs from '../components/GlobalBreadcrumbs';

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

export default function AccountPage() {
  const { user, isVip, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    ordersCount: 0,
    totalSpent: 0,
    favoritesCount: 0,
    isVip: false
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;
      
      try {
        const response = await fetch('/api/account/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching account stats:', error);
      } finally {
        setStatsLoading(false);
      }
    }

    async function fetchOrders() {
        if (!user) return;
        setOrdersLoading(true);
        try {
            const response = await fetch('/api/orders');
            if (response.ok) {
                const data = await response.json();
                setOrders(data.orders || []);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setOrdersLoading(false);
        }
    }

    async function fetchWishlist() {
        if (!user) return;
        setWishlistLoading(true);
        try {
            const response = await fetch('/api/favorites/details');
            if (response.ok) {
                const data = await response.json();
                setWishlist(data.products || []);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setWishlistLoading(false);
        }
    }

    if (!authLoading && user) {
      fetchStats();
      fetchOrders();
      fetchWishlist();
    } else if (!authLoading && !user) {
      setStatsLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-dope-orange-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6">
          <User className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4 font-chalets">PLEASE SIGN IN</h1>
        <p className="text-gray-600 mb-8 max-w-md">You need to be signed in to view your account statistics and manage your profile.</p>
        <Link 
          href="/auth" 
          className="bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all"
        >
          Sign In / Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20">
        <div className="relative w-full max-w-none mx-0 px-6 text-center flex flex-col items-center">
          
          <div className="mb-8 w-full max-w-4xl flex justify-start">
            <GlobalBreadcrumbs paths={[{ name: "My Account" }]} />
          </div>

          <div className="mb-8 w-full max-w-4xl flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-dope-orange-400 to-dope-orange-600 rounded-full mb-6 shadow-2xl">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-chalets font-bold text-gray-900 mb-6 leading-tight tracking-wide">
              MY ACCOUNT
            </h1>
            <div className="w-32 h-1 bg-dope-orange-500 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl md:text-2xl text-gray-800 max-w-3xl mx-auto leading-relaxed font-medium">
              Manage your account, track orders, and access exclusive member benefits
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="text-3xl font-bold text-dope-orange-500 mb-2">
                {statsLoading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : stats.ordersCount}
              </div>
              <div className="text-gray-700 text-sm font-medium">Total Orders</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="text-3xl font-bold text-dope-orange-500 mb-2">
                {statsLoading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : `$${stats.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </div>
              <div className="text-gray-700 text-sm font-medium">Total Spent</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="text-3xl font-bold text-dope-orange-500 mb-2">
                {statsLoading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (stats.isVip ? 'VIP' : 'Standard')}
              </div>
              <div className="text-gray-700 text-sm font-medium">Member Status</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="text-3xl font-bold text-dope-orange-500 mb-2">
                {statsLoading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : stats.favoritesCount}
              </div>
              <div className="text-gray-700 text-sm font-medium">Saved Items</div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Dashboard */}
      <div className="w-full max-w-none mx-0 px-6 py-12">
        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8 bg-white rounded-xl shadow-lg p-2">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'orders', label: 'Orders', icon: Package },
            { id: 'wishlist', label: 'Wishlist', icon: Heart },
            { id: 'addresses', label: 'Addresses', icon: MapPin },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-dope-orange-500 text-white shadow-lg transform scale-105'
                  : 'text-gray-700 hover:text-dope-orange-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${user?.user_metadata?.age_verified ? 'bg-green-500' : 'bg-red-500'}`}>
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Age Verification</h2>
                  <p className={`text-sm ${user?.user_metadata?.age_verified ? 'text-green-600' : 'text-red-600'}`}>
                    {user?.user_metadata?.age_verified ? 'Verified & Secure' : 'Verification Required'}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {user?.user_metadata?.age_verified 
                  ? 'Your identity has been verified. You can shop all products across DopeDeals.' 
                  : 'You must verify your age before purchasing restricted items.'}
              </p>
              {!user?.user_metadata?.age_verified ? (
                <Link 
                  href="/age-verification"
                  className="inline-flex items-center text-dope-orange-600 font-semibold hover:text-dope-orange-700 bg-dope-orange-50 px-4 py-2 rounded-lg transition-colors w-full justify-center group"
                >
                  Verify Now <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              ) : (
                <Link 
                  href="/age-verification"
                  className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors"
                >
                  View Verification Details <span className="ml-2">→</span>
                </Link>
              )}
            </div>

            {/* Profile Settings */}
            <Link href="/profile" className="group">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-dope-orange-300 group-hover:transform group-hover:scale-105">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-dope-orange-400 to-dope-orange-600 rounded-full flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
                    <p className="text-sm text-gray-600">Edit profile, preferences, password</p>
                  </div>
                </div>
                <div className="flex items-center text-dope-orange-600 font-semibold group-hover:text-dope-orange-700">
                  Manage Profile <span className="ml-2">→</span>
                </div>
              </div>
            </Link>

            {/* Order History */}
            <Link href="/orders" className="group">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-dope-orange-300 group-hover:transform group-hover:scale-105">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mr-4">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Order History</h2>
                    <p className="text-sm text-gray-600">View orders, track shipments</p>
                  </div>
                </div>
                <div className="flex items-center text-dope-orange-600 font-semibold group-hover:text-dope-orange-700">
                  View Orders <span className="ml-2">→</span>
                </div>
              </div>
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist" className="group">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-dope-orange-300 group-hover:transform group-hover:scale-105">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-700 rounded-full flex items-center justify-center mr-4">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Wishlist</h2>
                    <p className="text-sm text-gray-600">Saved favorite products</p>
                  </div>
                </div>
                <div className="flex items-center text-dope-orange-600 font-semibold group-hover:text-dope-orange-700">
                  View Wishlist <span className="ml-2">→</span>
                </div>
              </div>
            </Link>

            {/* Payment Methods */}
            <Link href="/payment-methods" className="group">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-dope-orange-300 group-hover:transform group-hover:scale-105">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mr-4">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Payment Methods</h2>
                    <p className="text-sm text-gray-600">Saved cards, billing info</p>
                  </div>
                </div>
                <div className="flex items-center text-dope-orange-600 font-semibold group-hover:text-dope-orange-700">
                  Manage Payments <span className="ml-2">→</span>
                </div>
              </div>
            </Link>

            {/* Address Book */}
            <Link href="/account/addresses" className="group">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-dope-orange-300 group-hover:transform group-hover:scale-105">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mr-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Address Book</h2>
                    <p className="text-sm text-gray-600">Shipping & billing addresses</p>
                  </div>
                </div>
                <div className="flex items-center text-dope-orange-600 font-semibold group-hover:text-dope-orange-700">
                  Manage Addresses <span className="ml-2">→</span>
                </div>
              </div>
            </Link>

            {/* Account Settings */}
            <Link href="/profile" className="group">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-dope-orange-300 group-hover:transform group-hover:scale-105">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center mr-4">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
                    <p className="text-sm text-gray-600">Privacy, notifications, preferences</p>
                  </div>
                </div>
                <div className="flex items-center text-dope-orange-600 font-semibold group-hover:text-dope-orange-700">
                  Account Settings <span className="ml-2">→</span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Orders</h2>
            {ordersLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-10 h-10 text-dope-orange-500 animate-spin" />
                </div>
            ) : orders.length > 0 ? (
                <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:border-dope-orange-300 transition-colors">
                    <div className="flex justify-between items-center">
                        <div>
                        <h3 className="font-semibold text-gray-900">Order #{order.order_number || order.id.slice(0, 8)}</h3>
                        <p className="text-sm text-gray-600">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                        <p className="font-semibold text-gray-900">${Number(order.total_amount).toFixed(2)}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-blue-100 text-blue-800'
                        }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No orders found.</p>
                    <Link href="/shop" className="text-dope-orange-500 font-bold hover:underline mt-2 inline-block">Start Shopping</Link>
                </div>
            )}
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h2>
            {wishlistLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-10 h-10 text-dope-orange-500 animate-spin" />
                </div>
            ) : wishlist.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlist.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:border-dope-orange-300 transition-colors">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                        {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                            <Package className="w-8 h-8 text-gray-400" />
                        )}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.name}</h3>
                    <p className="text-dope-orange-600 font-bold">${Number(item.our_price).toFixed(2)}</p>
                    <Link href={`/product/${item.id}`} className="text-xs text-dope-orange-500 hover:underline mt-2 inline-block">View Product</Link>
                    </div>
                ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Your wishlist is empty.</p>
                </div>
            )}
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Address Book</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">Home Address</h3>
                    <p className="text-sm text-gray-600">123 Main St, Anytown, ST 12345</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-600 hover:text-dope-orange-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <button className="mt-4 bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
              Add New Address
            </button>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Receive order updates and promotional emails</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-dope-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dope-orange-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900">SMS Notifications</h3>
                  <p className="text-sm text-gray-600">Receive text messages for order updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-dope-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dope-orange-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900">Marketing Emails</h3>
                  <p className="text-sm text-gray-600">Receive promotional offers and new product announcements</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-dope-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dope-orange-500"></div>
                </label>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
