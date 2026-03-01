"use client";

import { useState } from 'react';
import Link from 'next/link';
import GlobalMasthead from '../../components/GlobalMasthead';

interface Address {
  id: string;
  type: 'shipping' | 'billing';
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export default function AddressBookPage() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      type: 'shipping',
      firstName: 'John',
      lastName: 'Doe',
      address1: '123 Main Street',
      address2: 'Apt 4B',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'United States',
      phone: '(555) 123-4567',
      isDefault: true
    },
    {
      id: '2',
      type: 'billing',
      firstName: 'John',
      lastName: 'Doe',
      address1: '456 Oak Avenue',
      city: 'Beverly Hills',
      state: 'CA',
      zipCode: '90211',
      country: 'United States',
      isDefault: false
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);

  const handleDeleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalMasthead />
      
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-dope-orange">Home</Link>
            <span>/</span>
            <Link href="/account" className="hover:text-dope-orange">Account</Link>
            <span>/</span>
            <span className="text-gray-900">Address Book</span>
          </div>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-chalets-legweb text-gray-900 mb-2" style={{ letterSpacing: '-0.02em' }}>
              Address Book
            </h1>
            <p className="text-gray-600">Manage your shipping and billing addresses</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-dope-orange text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Add New Address
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Account Settings</h3>
              <nav className="space-y-2">
                <Link href="/account/profile" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  Profile Settings
                </Link>
                <Link href="/account/addresses" className="block px-3 py-2 bg-dope-orange text-white rounded-md">
                  Address Book
                </Link>
                <Link href="/payment-methods" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  Payment Methods
                </Link>
                <Link href="/account" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  Back to Account
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Address Cards */}
            <div className="space-y-4">
              {addresses.map((address) => (
                <div key={address.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        address.type === 'shipping' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {address.type === 'shipping' ? 'Shipping' : 'Billing'}
                      </div>
                      {address.isDefault && (
                        <div className="px-3 py-1 bg-dope-orange text-white rounded-full text-xs font-medium">
                          Default
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingAddress(address.id)}
                        className="text-sm text-gray-600 hover:text-dope-orange"
                      >
                        Edit
                      </button>
                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="text-sm text-gray-600 hover:text-dope-orange"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-gray-900">
                    <p className="font-medium">{address.firstName} {address.lastName}</p>
                    {address.company && <p>{address.company}</p>}
                    <p>{address.address1}</p>
                    {address.address2 && <p>{address.address2}</p>}
                    <p>{address.city}, {address.state} {address.zipCode}</p>
                    <p>{address.country}</p>
                    {address.phone && <p className="mt-2 text-gray-600">{address.phone}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Address Form */}
            {showAddForm && (
              <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Add New Address</h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dope-orange focus:border-dope-orange">
                        <option value="shipping">Shipping Address</option>
                        <option value="billing">Billing Address</option>
                      </select>
                    </div>
                    <div></div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dope-orange focus:border-dope-orange"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dope-orange focus:border-dope-orange"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company (Optional)</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dope-orange focus:border-dope-orange"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dope-orange focus:border-dope-orange"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dope-orange focus:border-dope-orange"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dope-orange focus:border-dope-orange"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dope-orange focus:border-dope-orange">
                        <option value="">Select State</option>
                        <option value="CA">California</option>
                        <option value="NY">New York</option>
                        <option value="TX">Texas</option>
                        {/* Add more states */}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dope-orange focus:border-dope-orange"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dope-orange focus:border-dope-orange"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="setDefault"
                      className="w-4 h-4 text-dope-orange focus:ring-dope-orange border-gray-300 rounded"
                    />
                    <label htmlFor="setDefault" className="ml-2 text-sm text-gray-700">
                      Set as default address
                    </label>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-dope-orange text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
