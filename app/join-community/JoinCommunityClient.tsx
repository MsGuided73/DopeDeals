'use client';

import { useState } from 'react';
import AgeVerification from '../components/AgeVerification';
import GlobalMasthead from '../components/GlobalMasthead';
import { Mail, User, CheckCircle } from 'lucide-react';

export default function JoinCommunityClient() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{fullName?: string; email?: string}>({});

  const validateForm = () => {
    const newErrors: {fullName?: string; email?: string} = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/community/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ fullName: '', email: '' });
      } else {
        throw new Error('Failed to join community');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error joining the community. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  if (isSubmitted) {
    return (
      <>
        <AgeVerification />
        <GlobalMasthead />

        <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
          <div className="max-w-md mx-auto px-6 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="chalets-title text-3xl font-normal mb-4 text-gray-900 dark:text-white">
              Welcome to the Community!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Thank you for joining Highway 420! You'll start receiving our weekly newsletter
              with exclusive events, special product drops, and community updates.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
            >
              Join Another Member
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AgeVerification />
      <GlobalMasthead />

      <div className="min-h-screen bg-white dark:bg-gray-950">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-16">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80')] bg-cover bg-center opacity-20"></div>
          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <h1 className="chalets-title text-4xl md:text-6xl mb-6 highway-text-shadow">
              JOIN THE HIGHWAY 420<br />
              <span className="text-green-600">COMMUNITY</span>
            </h1>
            <div className="w-32 h-1 bg-green-600 mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Get exclusive access to special events, product drops, and our weekly newsletter
              featuring the latest in premium cannabis culture.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md mx-auto px-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
              <div className="text-center mb-8">
                <h2 className="chalets-title text-2xl font-normal mb-4 text-gray-900 dark:text-white">
                  Join Our Newsletter
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Stay connected with weekly updates on exclusive events and special product drops
                  available only to our community members.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                        errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Enter your email address"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Joining Community...' : 'Join the Community'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  By joining, you agree to receive our newsletter. You can unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
