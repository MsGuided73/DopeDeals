'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  User, Settings, Package, Heart, CreditCard, MapPin, LogOut,
  Star, Gift, ShoppingBag, Bell, Shield, HelpCircle,
  TrendingUp, Award, Clock, Edit, Eye, Trash2
} from 'lucide-react';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Animated Metallic Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 py-20">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 via-transparent to-gray-800/20 animate-pulse"></div>

        {/* Metallic shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-pulse"></div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full mb-6 shadow-2xl border-2 border-gray-500/30">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-chalets font-bold text-white mb-6 leading-tight tracking-wide drop-shadow-2xl">
              MY ACCOUNT
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-dope-orange-400 to-dope-orange-600 mx-auto mb-8 rounded-full shadow-lg"></div>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-medium">
              Manage your account, track orders, and access exclusive member benefits
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-dope-orange-400 mb-2">12</div>
              <div className="text-gray-300 text-sm font-medium">Total Orders</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-dope-orange-400 mb-2">$2,450</div>
              <div className="text-gray-300 text-sm font-medium">Total Spent</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-dope-orange-400 mb-2">VIP</div>
              <div className="text-gray-300 text-sm font-medium">Member Status</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-dope-orange-400 mb-2">5</div>
              <div className="text-gray-300 text-sm font-medium">Saved Items</div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Dashboard */}
      <div className="max-w-6xl mx-auto px-6 py-12">
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
            {/* Profile Settings */}
            <Link href="/profile" className="group">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-dope-orange-300 group-hover:transform group-hover:scale-105">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-dope-orange-400 to-dope-orange-600 rounded-full flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
                    <p className="text-sm text-gray-600">Edit profile, preferences, age verification</p>
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
            <Link href="/addresses" className="group">
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
            <Link href="/settings" className="group">
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
            <div className="space-y-4">
              {[1, 2, 3].map((order) => (
                <div key={order} className="border border-gray-200 rounded-lg p-4 hover:border-dope-orange-300 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900">Order #{2024001 + order}</h3>
                      <p className="text-sm text-gray-600">Placed on {new Date(Date.now() - order * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${(Math.random() * 200 + 50).toFixed(2)}</p>
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Delivered</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="border border-gray-200 rounded-lg p-4 hover:border-dope-orange-300 transition-colors">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">Premium Glass Bong #{item}</h3>
                  <p className="text-dope-orange-600 font-bold">${(Math.random() * 100 + 50).toFixed(2)}</p>
                </div>
              ))}
            </div>
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
