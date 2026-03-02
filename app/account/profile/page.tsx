"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GlobalMasthead from '../../components/GlobalMasthead';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

export default function ProfileSettingsPage() {
  const { user, updateProfile, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initial state from user metadata
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    orderUpdates: true
  });

  // Sync state when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.user_metadata?.firstName || user.user_metadata?.full_name?.split(' ')[0] || '',
        lastName: user.user_metadata?.lastName || user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        dateOfBirth: user.user_metadata?.dateOfBirth || '',
        emailNotifications: user.user_metadata?.emailNotifications ?? true,
        smsNotifications: user.user_metadata?.smsNotifications ?? false,
        marketingEmails: user.user_metadata?.marketingEmails ?? true,
        orderUpdates: user.user_metadata?.orderUpdates ?? true
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        emailNotifications: formData.emailNotifications,
        smsNotifications: formData.smsNotifications,
        marketingEmails: formData.marketingEmails,
        orderUpdates: formData.orderUpdates
      });

      if (error) throw new Error(error);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
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
            <span className="text-gray-900">Profile Settings</span>
          </div>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-chalets-legweb text-gray-900 mb-2" style={{ letterSpacing: '-0.02em' }}>
              Profile Settings
            </h1>
            <p className="text-gray-600">Manage your personal information and preferences</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-dope-orange text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Account Settings</h3>
              <nav className="space-y-2">
                <Link href="/account/profile" className="block px-3 py-2 bg-dope-orange text-white rounded-md">
                  Profile Settings
                </Link>
                <Link href="/account/addresses" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
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
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dope-orange focus:border-dope-orange disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dope-orange focus:border-dope-orange disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dope-orange focus:border-dope-orange disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dope-orange focus:border-dope-orange disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dope-orange focus:border-dope-orange disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Age Verification Status */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Age Verification</h3>
                {user?.user_metadata?.age_verified ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full border border-green-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider rounded-full border border-red-200">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Pending
                  </span>
                )}
              </div>
              
              <div className={`flex flex-col md:flex-row items-center justify-between p-5 rounded-2xl border transition-all ${
                user?.user_metadata?.age_verified 
                  ? 'bg-green-50/30 border-green-100' 
                  : 'bg-orange-50/30 border-orange-100'
              }`}>
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    user?.user_metadata?.age_verified ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    <Shield className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className={`font-bold ${user?.user_metadata?.age_verified ? 'text-green-900' : 'text-orange-900'}`}>
                      {user?.user_metadata?.age_verified ? 'Official Verification Active' : 'Action Required: Verify Identity'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {user?.user_metadata?.age_verified 
                        ? `Verified on ${new Date(user.user_metadata.age_verified_at || Date.now()).toLocaleDateString()}`
                        : 'Please complete the AgeChecker protocol to enable purchases.'}
                    </p>
                  </div>
                </div>
                
                <Link 
                  href="/age-verification" 
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all ${
                    user?.user_metadata?.age_verified
                      ? 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                      : 'bg-dope-orange text-white shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95'
                  }`}
                >
                  {user?.user_metadata?.age_verified ? 'View Audit Log' : 'Verify Now →'}
                </Link>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive general notifications via email</p>
                  </div>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={formData.emailNotifications}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-4 h-4 text-dope-orange focus:ring-dope-orange border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-sm text-gray-600">Receive notifications via text message</p>
                  </div>
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={formData.smsNotifications}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-4 h-4 text-dope-orange focus:ring-dope-orange border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Marketing Emails</p>
                    <p className="text-sm text-gray-600">Receive promotional offers and updates</p>
                  </div>
                  <input
                    type="checkbox"
                    name="marketingEmails"
                    checked={formData.marketingEmails}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-4 h-4 text-dope-orange focus:ring-dope-orange border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Order Updates</p>
                    <p className="text-sm text-gray-600">Receive updates about your orders</p>
                  </div>
                  <input
                    type="checkbox"
                    name="orderUpdates"
                    checked={formData.orderUpdates}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-4 h-4 text-dope-orange focus:ring-dope-orange border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-dope-orange text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
