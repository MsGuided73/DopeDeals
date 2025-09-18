"use client";
import React, { useState } from 'react';
import { Star, Gift, Zap, Crown } from 'lucide-react';

interface DopeClubSignupProps {
  onSuccess?: (member: any) => void;
}

export default function DopeClubSignup({ onSuccess }: DopeClubSignupProps) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/dope-club/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join DOPE CLUB');
      }

      setSuccess(true);
      if (onSuccess) {
        onSuccess(data.member);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-gradient-to-br from-dope-orange-500 to-dope-orange-600 rounded-2xl p-8 text-center text-white">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Crown className="w-10 h-10 text-white" />
        </div>
        <h3 className="font-chalets text-3xl mb-4 tracking-tight">WELCOME TO DOPE CLUB!</h3>
        <p className="text-xl mb-6 text-white/90">
          You've successfully joined our VIP rewards program!
        </p>
        <div className="bg-white/10 rounded-lg p-4 mb-6">
          <p className="text-lg font-semibold">🎉 Welcome Bonus: 100 Points!</p>
          <p className="text-sm text-white/80">Start earning rewards on your next purchase</p>
        </div>
        <button
          onClick={() => window.location.href = '/products'}
          className="bg-white text-dope-orange-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-dope-orange-500/20">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-dope-orange-500 to-dope-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-white" />
        </div>
        <h3 className="font-chalets text-3xl text-white mb-2 tracking-tight">JOIN DOPE CLUB</h3>
        <p className="text-gray-300">Unlock exclusive rewards and VIP benefits</p>
      </div>

      {/* Benefits Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 border border-amber-600/30 rounded-lg p-4 text-center">
          <Gift className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <p className="text-sm text-white font-semibold">Birthday Gifts</p>
          <p className="text-xs text-gray-400">Annual surprises</p>
        </div>
        <div className="bg-gradient-to-br from-gray-400/20 to-gray-500/10 border border-gray-400/30 rounded-lg p-4 text-center">
          <Zap className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-white font-semibold">Early Access</p>
          <p className="text-xs text-gray-400">New products first</p>
        </div>
        <div className="bg-gradient-to-br from-dope-orange-500/20 to-dope-orange-600/10 border border-dope-orange-500/30 rounded-lg p-4 text-center">
          <Crown className="w-6 h-6 text-dope-orange-500 mx-auto mb-2" />
          <p className="text-sm text-white font-semibold">VIP Rewards</p>
          <p className="text-xs text-gray-400">Up to 10% back</p>
        </div>
      </div>

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-dope-orange-500 focus:ring-2 focus:ring-dope-orange-500/20 focus:outline-none transition-colors"
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-dope-orange-500 focus:ring-2 focus:ring-dope-orange-500/20 focus:outline-none transition-colors"
              placeholder="Enter your last name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-dope-orange-500 focus:ring-2 focus:ring-dope-orange-500/20 focus:outline-none transition-colors"
            placeholder="Enter your email address"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-dope-orange-500 focus:ring-2 focus:ring-dope-orange-500/20 focus:outline-none transition-colors"
            placeholder="(555) 123-4567"
          />
        </div>

        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-dope-orange-500 focus:ring-2 focus:ring-dope-orange-500/20 focus:outline-none transition-colors"
          />
          <p className="text-xs text-gray-400 mt-1">Required for birthday rewards and age verification</p>
        </div>

        <div className="bg-dope-orange-500/10 border border-dope-orange-500/20 rounded-lg p-4">
          <p className="text-sm text-dope-orange-300 font-semibold mb-2">🎁 Welcome Bonus</p>
          <p className="text-xs text-gray-300">Get 100 bonus points just for joining DOPE CLUB!</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-dope-orange-500 to-dope-orange-600 text-white font-bold py-4 px-6 rounded-lg hover:from-dope-orange-600 hover:to-dope-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Joining DOPE CLUB...
            </span>
          ) : (
            'JOIN DOPE CLUB - FREE'
          )}
        </button>

        <p className="text-xs text-gray-400 text-center">
          By joining, you agree to receive promotional emails and SMS messages. 
          You can unsubscribe at any time.
        </p>
      </form>
    </div>
  );
}
