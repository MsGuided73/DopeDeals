"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Package, MapPin, CreditCard, Settings, LogOut } from 'lucide-react';
import GlobalMasthead from '../components/GlobalMasthead';

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

  // Mock data for now - replace with actual auth integration
  const mockProfile: UserProfile = {
    id: 'user_123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    dateOfBirth: '1990-01-15',
    shippingAddress: {
      address1: '123 Main St',
      address2: 'Apt 4B',
      city: 'Los Angeles',
      state: 'CA',
      zipcode: '90210'
    },
    billingAddress: {
      address1: '123 Main St',
      address2: 'Apt 4B',
      city: 'Los Angeles',
      state: 'CA',
      zipcode: '90210'
    },
    marketingEmails: true,
    smsNotifications: false
  };

  const mockOrders: Order[] = [
    {
      id: 'order_1',
      orderNumber: 'DC20250117001',
      status: 'delivered',
      paymentStatus: 'paid',
      fulfillmentStatus: 'fulfilled',
      total: 89.99,
      createdAt: '2025-01-15T10:30:00Z',
      items: [
        {
          id: 'item_1',
          productName: 'Premium Glass Bong - 12"',
          productImageUrl: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=100&h=100&fit=crop',
          quantity: 1,
          unitPrice: 79.99
        }
      ]
    },
    {
      id: 'order_2',
      orderNumber: 'DC20250110002',
      status: 'processing',
      paymentStatus: 'paid',
      fulfillmentStatus: 'partial',
      total: 156.47,
      createdAt: '2025-01-10T14:20:00Z',
      items: [
        {
          id: 'item_2',
          productName: 'Rolling Papers Bundle',
          quantity: 3,
          unitPrice: 12.99
        },
        {
          id: 'item_3',
          productName: 'Grinder - 4 Piece',
          quantity: 1,
          unitPrice: 45.99
        }
      ]
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setProfile(mockProfile);
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

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
                      <p className="font-medium">January 2025</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
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
                    ))}
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
