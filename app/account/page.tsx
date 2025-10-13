import { Metadata } from 'next';
import { User, Settings, Package, Heart, CreditCard, MapPin, LogOut } from 'lucide-react';

export const metadata: Metadata = {
  title: 'My Account - DOPE CITY',
  description: 'Manage your DOPE CITY account, view orders, update preferences, and access exclusive member benefits.',
};

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="dope-city-title text-5xl md:text-6xl mb-4 text-center">
            MY ACCOUNT
          </h1>
          <div className="w-24 h-1 bg-dope-orange-500 mx-auto mb-6"></div>
          <p className="text-xl text-center text-gray-300 max-w-2xl mx-auto">
            Manage your account, track orders, and access exclusive member benefits
          </p>
        </div>
      </div>

      {/* Account Dashboard */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Profile Settings */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <User className="w-8 h-8 text-dope-orange-500 mr-3" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Edit profile, preferences, age verification status
            </p>
            <button className="w-full bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              Manage Profile
            </button>
          </div>

          {/* Order History */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <Package className="w-8 h-8 text-dope-orange-500 mr-3" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order History</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              View past orders, track shipments, reorder favorites
            </p>
            <button className="w-full bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              View Orders
            </button>
          </div>

          {/* Wishlist */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <Heart className="w-8 h-8 text-dope-orange-500 mr-3" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Wishlist</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Save and track your favorite products
            </p>
            <button className="w-full bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              View Wishlist
            </button>
          </div>

          {/* Payment Methods */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <CreditCard className="w-8 h-8 text-dope-orange-500 mr-3" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Methods</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Saved payment methods, billing information
            </p>
            <button className="w-full bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              Manage Payments
            </button>
          </div>

          {/* Address Book */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <MapPin className="w-8 h-8 text-dope-orange-500 mr-3" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Address Book</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Manage shipping and billing addresses
            </p>
            <button className="w-full bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              Manage Addresses
            </button>
          </div>

          {/* Account Settings */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <Settings className="w-8 h-8 text-dope-orange-500 mr-3" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Account Settings</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Privacy settings, notifications, preferences
            </p>
            <button className="w-full bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              Account Settings
            </button>
          </div>

        </div>

        {/* VIP Membership Section */}
        <div className="mt-12 bg-gradient-to-r from-dope-orange-500 to-orange-600 rounded-lg p-8 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">VIP MEMBERSHIP</h2>
            <p className="text-xl mb-6">
              Unlock exclusive products, early access, and special pricing
            </p>
            <button className="bg-white text-dope-orange-500 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg transition-colors">
              Upgrade to VIP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
