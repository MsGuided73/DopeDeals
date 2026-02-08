"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Package, MapPin, CreditCard, Settings, LogOut } from 'lucide-react';
import GlobalMasthead from '../components/GlobalMasthead';
import { useAuth } from '../contexts/AuthContext';
interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  total: number;
  createdAt: string;
  items: {
    id: string;
    productName: string;
    productImageUrl?: string;
    quantity: number;
    unitPrice: number;
  }[];
}

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  shippingAddress?: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipcode: string;
  };
  billingAddress?: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipcode: string;
  };
  marketingEmails: boolean;
  smsNotifications: boolean;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, updateUserMetadata, updateProfile } = useAuth();

  useEffect(() => {
    if (user) {
      setProfile({
        id: user.id,
        firstName: user.user_metadata?.firstName || user.user_metadata?.full_name?.split(' ')[0] || '',
        lastName: user.user_metadata?.lastName || user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || user.user_metadata?.phone || '',
        dateOfBirth: user.user_metadata?.dateOfBirth,
        shippingAddress: user.user_metadata?.shippingAddress,
        billingAddress: user.user_metadata?.billingAddress,
        marketingEmails: user.user_metadata?.marketingEmails || false,
        smsNotifications: user.user_metadata?.smsNotifications || false
      });
    }
    // Set empty orders for now as we don't have order fetching logic yet
    setOrders([]);
    setLoading(false);
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'fulfilled':
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'processing':
      case 'partial':
        return 'text-yellow-600 bg-yellow-100';
      case 'pending':
        return 'text-blue-600 bg-blue-100';
      case 'cancelled':
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <GlobalMasthead />
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
              <div className="lg:col-span-3 space-y-4">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <GlobalMasthead />
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {profile?.firstName}! Manage your account and view your orders.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'overview' 
                    ? 'bg-black text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <User className="w-5 h-5" />
                Account Overview
              </button>
              
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'orders' 
                    ? 'bg-black text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Package className="w-5 h-5" />
                Order History
              </button>
              
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'addresses' 
                    ? 'bg-black text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <MapPin className="w-5 h-5" />
                Addresses
              </button>
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'settings' 
                    ? 'bg-black text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Settings className="w-5 h-5" />
                Account Settings
              </button>
              
              <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Account Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{profile?.firstName} {profile?.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{profile?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{profile?.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Member Since</p>
                      <p className="font-medium">
                        {user?.created_at 
                          ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                          : 'Recent Member'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <div className="text-gray-500 italic">No recent orders found.</div>
                    ) : (
                      orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                          <div>
                            <p className="font-medium">Order #{order.orderNumber}</p>
                            <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${order.total.toFixed(2)}</p>
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="mt-4 text-black hover:underline font-medium"
                  >
                    View All Orders →
                  </button>
                </div>
              </div>
            )}

            {/* Account Settings */}
            {activeTab === 'settings' && (
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  setError(null);
                  
                  const formData = new FormData(e.currentTarget);
                  const updates = {
                    first_name: formData.get('firstName'),
                    last_name: formData.get('lastName'),
                    phone: formData.get('phone')
                  };
                  
                  // Use updateProfile for public.users table updates
                  // Cast to any to bypass strict type checking for now, as types need updating but DB is ready
                  const { error } = await updateProfile(updates);
                  
                  if (error) {
                    setError(error);
                    alert(`Error: ${error}`);
                  } else {
                    alert('Profile updated successfully!');
                    // Force reload logic if needed, or rely on realtime subscription
                  }
                  setLoading(false);
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input 
                        type="text" 
                        name="firstName"
                        defaultValue={profile?.firstName}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        placeholder="First Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input 
                        type="text" 
                        name="lastName"
                        defaultValue={profile?.lastName}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        placeholder="Last Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone"
                        defaultValue={profile?.phone}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        placeholder="(555) 555-5555"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4 border-t">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="px-6 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Saving Changes...' : 'Save Profile'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Addresses */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Address</h2>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    
                    const formData = new FormData(e.currentTarget);
                    
                    // Map form fields to DB columns
                    const updates = {
                      shipping_address_line1: formData.get('address1'),
                      shipping_address_line2: formData.get('address2'),
                      shipping_city: formData.get('city'),
                      shipping_state: formData.get('state'),
                      shipping_zipcode: formData.get('zipcode')
                    };
                    
                    const { error } = await updateProfile(updates);
                    
                    if (error) {
                      setError(error);
                      alert(`Error: ${error}`);
                    } else {
                      alert('Address updated successfully!');
                    }
                    setLoading(false);
                  }}>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
                        <input 
                          type="text" 
                          name="address1"
                          defaultValue={profile?.shippingAddress?.address1}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                          placeholder="Street Address"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2 (Optional)</label>
                        <input 
                          type="text" 
                          name="address2"
                          defaultValue={profile?.shippingAddress?.address2}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                          placeholder="Apt, Suite, Floor, etc."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                          <input 
                            type="text" 
                            name="city"
                            defaultValue={profile?.shippingAddress?.city}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                          <input 
                            type="text" 
                            name="state"
                            defaultValue={profile?.shippingAddress?.state}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                            placeholder="State"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                        <input 
                          type="text" 
                          name="zipcode"
                          defaultValue={profile?.shippingAddress?.zipcode}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                          placeholder="Zip Code"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-4 border-t">
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="px-6 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? 'Saving...' : 'Save Address'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {/* Orders Tab Placeholder if empty */}
            {activeTab === 'orders' && orders.length === 0 && (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-6">When you place an order, it will appear here.</p>
                    <Link href="/products" className="inline-block px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
                        Start Shopping
                    </Link>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
