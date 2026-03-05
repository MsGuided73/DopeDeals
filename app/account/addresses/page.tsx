"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GlobalMasthead from '../../components/GlobalMasthead';

interface Address {
  id: string;
  type: 'shipping' | 'billing';
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export default function AddressBookPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    type: 'shipping',
    firstName: '',
    lastName: '',
    company: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    isDefault: false
  });

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/account/addresses');
      if (!res.ok) throw new Error('Failed to fetch addresses');
      const data = await res.json();
      // Map backend fields to frontend interface
      const mapped = data.addresses.map((a: any) => ({
        id: a.id,
        type: a.type,
        firstName: a.first_name,
        lastName: a.last_name,
        company: a.company || '',
        addressLine1: a.address_line_1,
        addressLine2: a.address_line_2 || '',
        city: a.city,
        state: a.state,
        zipCode: a.zip_code,
        country: a.country || 'United States',
        phone: a.phone || '',
        isDefault: a.is_default
      }));
      setAddresses(mapped);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleEditClick = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type,
      firstName: address.firstName,
      lastName: address.lastName,
      company: address.company || '',
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone || '',
      isDefault: address.isDefault
    });
    setShowAddForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingAddress 
        ? `/api/account/addresses/${editingAddress.id}`
        : '/api/account/addresses';
      
      const method = editingAddress ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save address');
      }

      await fetchAddresses();
      setShowAddForm(false);
      setEditingAddress(null);
      // Reset form
      setFormData({
        type: 'shipping',
        firstName: '',
        lastName: '',
        company: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
        phone: '',
        isDefault: false
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      const res = await fetch(`/api/account/addresses/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete address');
      await fetchAddresses();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch(`/api/account/addresses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDefault: true })
      });
      if (!res.ok) throw new Error('Failed to set default address');
      await fetchAddresses();
    } catch (err: any) {
      alert(err.message);
    }
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
            onClick={() => {
              setEditingAddress(null);
              setFormData({
                type: 'shipping',
                firstName: '',
                lastName: '',
                company: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'United States',
                phone: '',
                isDefault: false
              });
              setShowAddForm(true);
            }}
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
                <Link href="/account/payment-methods" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
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
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dope-orange"></div>
              </div>
            ) : (
              <>
                {/* Address Cards */}
                <div className="space-y-4">
                  {addresses.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-200">
                      <p className="text-gray-500 mb-4">You have not saved any addresses yet.</p>
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="text-dope-orange hover:text-orange-600 font-medium"
                      >
                        Add your first address
                      </button>
                    </div>
                  ) : (
                    addresses.map((address) => (
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
                              onClick={() => handleEditClick(address)}
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
                          <p>{address.addressLine1}</p>
                          {address.addressLine2 && <p>{address.addressLine2}</p>}
                          <p>{address.city}, {address.state} {address.zipCode}</p>
                          <p>{address.country}</p>
                          {address.phone && <p className="mt-2 text-gray-600">{address.phone}</p>}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add/Edit Address Form */}
                {showAddForm && (
                  <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {editingAddress ? 'Edit Address' : 'Add New Address'}
                      </h3>
                      <button
                        onClick={() => {
                          setShowAddForm(false);
                          setEditingAddress(null);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                          <select 
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dope-orange focus:border-dope-orange"
                          >
                            <option value="shipping">Shipping Address</option>
                            <option value="billing">Billing Address</option>
                          </select>
                        </div>
                        <div></div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dope-orange focus:border-dope-orange"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dope-orange focus:border-dope-orange"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Company (Optional)</label>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dope-orange focus:border-dope-orange"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                          <input
                            type="text"
                            name="addressLine1"
                            value={formData.addressLine1}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dope-orange focus:border-dope-orange"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                          <input
                            type="text"
                            name="addressLine2"
                            value={formData.addressLine2}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dope-orange focus:border-dope-orange"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dope-orange focus:border-dope-orange"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                          <select 
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dope-orange focus:border-dope-orange"
                            required
                          >
                            <option value="">Select State</option>
                            <option value="CA">California</option>
                            <option value="NY">New York</option>
                            <option value="TX">Texas</option>
                            {/* In a real app, use a proper state list */}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dope-orange focus:border-dope-orange"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dope-orange focus:border-dope-orange"
                          />
                        </div>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="setDefault"
                          name="isDefault"
                          checked={formData.isDefault}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-dope-orange focus:ring-dope-orange border-gray-300 rounded"
                        />
                        <label htmlFor="setDefault" className="ml-2 text-sm text-gray-700">
                          Set as default address
                        </label>
                      </div>

                      <div className="flex justify-end space-x-4 pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddForm(false);
                            setEditingAddress(null);
                          }}
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-dope-orange text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          {editingAddress ? 'Update Address' : 'Save Address'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
