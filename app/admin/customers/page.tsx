"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Download,
  MoreHorizontal
} from 'lucide-react';

interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  date_of_birth?: string;
  created_at: string;
  last_login?: string;
  total_orders: number;
  total_spent: number;
  status: 'active' | 'inactive' | 'suspended';
  vip_status: boolean;
  age_verified: boolean; // Added
  addresses?: Address[];
}

interface Address {
  id: string;
  type: 'billing' | 'shipping';
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  newCustomersThisMonth: number;
  vipCustomers: number;
  averageOrderValue: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats>({
    totalCustomers: 0,
    activeCustomers: 0,
    newCustomersThisMonth: 0,
    vipCustomers: 0,
    averageOrderValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vipFilter, setVipFilter] = useState('all');
  const [verifiedFilter, setVerifiedFilter] = useState('all'); // Added
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadCustomers();
    loadStats();
  }, []);

  async function loadCustomers() {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/customers');
      if (response.ok) {
        const data = await response.json();
        // The API might not return all fields, map safely
        setCustomers(data.customers?.map((c: any) => ({
          ...c,
          first_name: c.name?.split(' ')[0] || 'Unknown',
          last_name: c.name?.split(' ').slice(1).join(' ') || '',
          age_verified: !!c.age_verified,
          status: c.status || 'active',
          created_at: c.joined_at || new Date().toISOString(),
          total_orders: c.orders || 0,
          total_spent: c.total || 0,
        })) || []);
      } else {
        // Fallback for dev
        setCustomers([
          {
            id: '1',
            email: 'john.doe@email.com',
            first_name: 'John',
            last_name: 'Doe',
            phone: '+1 (555) 123-4567',
            date_of_birth: '1990-05-15',
            created_at: '2024-01-15T10:30:00Z',
            last_login: '2024-11-08T14:20:00Z',
            total_orders: 12,
            total_spent: 1247.50,
            status: 'active',
            vip_status: true,
            age_verified: true,
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const response = await fetch('/api/admin/customers/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        // Mock stats for development
        setStats({
          totalCustomers: 892,
          activeCustomers: 756,
          newCustomersThisMonth: 45,
          vipCustomers: 67,
          averageOrderValue: 72.95
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  async function updateCustomer(customerId: string, updates: Partial<Customer>) {
    try {
      const response = await fetch(`/api/admin/customers/${customerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        await loadCustomers();
        if (selectedCustomer?.id === customerId) {
          setSelectedCustomer(prev => prev ? { ...prev, ...updates } : null);
        }
      }
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = searchQuery === '' ||
      `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    const matchesVip = vipFilter === 'all' ||
      (vipFilter === 'vip' && customer.vip_status) ||
      (vipFilter === 'regular' && !customer.vip_status);
    
    const matchesVerified = verifiedFilter === 'all' ||
      (verifiedFilter === 'verified' && customer.age_verified) ||
      (verifiedFilter === 'unverified' && !customer.age_verified);

    return matchesSearch && matchesStatus && matchesVip && matchesVerified;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600 mt-1">Manage your customer database and relationships</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="bg-dope-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Customers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeCustomers}</p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New This Month</p>
              <p className="text-2xl font-bold text-gray-900">{stats.newCustomersThisMonth}</p>
            </div>
            <UserPlus className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">VIP Customers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.vipCustomers}</p>
            </div>
            <Users className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.averageOrderValue)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">Status: All</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>

            <select
              value={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">Verification: All</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Verification</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Spend</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{customer.first_name} {customer.last_name}</div>
                      <div className="text-sm text-gray-500">{customer.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => updateCustomer(customer.id, { age_verified: !customer.age_verified })}
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                          customer.age_verified 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-red-100 text-red-800 border-red-200'
                        } border`}
                      >
                        {customer.age_verified ? 'Verified ✓' : 'Unverified ✗'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={customer.status}
                        onChange={(e) => updateCustomer(customer.id, { status: e.target.value as any })}
                        className="text-xs bg-gray-50 border rounded p-1"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      ${customer.total_spent.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => { setSelectedCustomer(customer); setShowCustomerModal(true); }} className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCustomerModal && selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          onUpdate={(updates) => updateCustomer(selectedCustomer.id, updates)}
          onClose={() => { setShowCustomerModal(false); setSelectedCustomer(null); }}
        />
      )}
    </div>
  );
}

function CustomerDetailsModal({ customer, onUpdate, onClose }: { customer: Customer; onUpdate: (u: Partial<Customer>) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Customer <span className="text-dope-orange">Profile</span></h2>
            <button onClick={onClose} className="text-zinc-400 hover:text-black">✕</button>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <label className="text-xs font-black uppercase text-zinc-500 tracking-widest">Identity</label>
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                <p className="text-lg font-bold">{customer.first_name} {customer.last_name}</p>
                <p className="text-zinc-500 text-sm">{customer.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black uppercase text-zinc-500 tracking-widest">Compliance Status</label>
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-between">
                <span className="font-bold">Age Verified</span>
                <button
                  onClick={() => onUpdate({ age_verified: !customer.age_verified })}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                    customer.age_verified 
                      ? 'bg-green-500 text-white shadow-[0_4px_12px_rgba(34,197,94,0.3)]' 
                      : 'bg-zinc-200 text-zinc-500'
                  }`}
                >
                  {customer.age_verified ? 'Verified ✓' : 'Unverified'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border border-zinc-200 rounded-xl font-bold hover:bg-zinc-50">Edit Information</button>
            <button className="p-4 bg-black text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
