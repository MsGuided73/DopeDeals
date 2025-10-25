"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle } from 'lucide-react';
import GlobalMasthead from '../components/GlobalMasthead';

interface CheckoutForm {
  // Customer Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Shipping Address
  shippingAddress1: string;
  shippingAddress2: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;

  // Billing Address
  billingAddress1: string;
  billingAddress2: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  billingSameAsShipping: boolean;

  // Payment
  paymentMethod: 'kajapay' | 'card' | 'test';

  // Age Verification
  dateOfBirth: string;
  ageVerified: boolean;
}

interface Cart {
  items: any[];
  itemCount: number;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    shippingAddress1: '',
    shippingAddress2: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    billingAddress1: '',
    billingAddress2: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    billingSameAsShipping: true,
    paymentMethod: 'kajapay',
    dateOfBirth: '',
    ageVerified: false
  });

  const getSessionId = () => {
    return localStorage.getItem('cart_session_id') || '';
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const sessionId = getSessionId();

      const response = await fetch(`/api/cart?sessionId=${sessionId}`);
      const data = await response.json();

      if (data.success) {
        setCart(data.cart);
      }
    } catch (err) {
      console.error('Cart fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (field: keyof CheckoutForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Customer Info
        return !!(form.firstName && form.lastName && form.email && form.dateOfBirth);
      case 2: // Shipping
        return !!(form.shippingAddress1 && form.shippingCity && form.shippingState && form.shippingZip);
      case 3: // Payment
        return !!form.paymentMethod;
      default:
        return false;
    }
  };

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const handleSubmit = async () => {
    if (!cart || cart.items.length === 0) return;

    // Age verification
    const age = calculateAge(form.dateOfBirth);
    if (age < 21) {
      alert('You must be 21 or older to purchase these products.');
      return;
    }

    setProcessing(true);

    try {
      // Create order
      const orderData = {
        customerInfo: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          dateOfBirth: form.dateOfBirth
        },
        shippingAddress: {
          address1: form.shippingAddress1,
          address2: form.shippingAddress2,
          city: form.shippingCity,
          state: form.shippingState,
          zipcode: form.shippingZip
        },
        billingAddress: form.billingSameAsShipping ? {
          address1: form.shippingAddress1,
          address2: form.shippingAddress2,
          city: form.shippingCity,
          state: form.shippingState,
          zipcode: form.shippingZip
        } : {
          address1: form.billingAddress1,
          address2: form.billingAddress2,
          city: form.billingCity,
          state: form.billingState,
          zipcode: form.billingZip
        },
        paymentMethod: form.paymentMethod,
        sessionId: getSessionId()
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (result.success) {
        // Process payment
        const paymentResponse = await fetch('/api/payments/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: result.orderId,
            paymentMethod: form.paymentMethod,
            amount: result.total
          })
        });

        const paymentResult = await paymentResponse.json();

        if (paymentResult.success && paymentResult.status === 'paid') {
          // Redirect to order confirmation
          window.location.href = `/order-confirmation/${result.orderId}`;
        } else {
          alert(paymentResult.message || 'Payment failed');
        }
      } else {
        alert(result.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout');
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <GlobalMasthead />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <GlobalMasthead />
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some products before checking out.</p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <GlobalMasthead />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/cart"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        {/* Checkout Steps */}
        <div className="flex items-center gap-4 mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step <= currentStep ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              <span className={`text-sm font-medium ${
                step <= currentStep ? 'text-black' : 'text-gray-400'
              }`}>
                {step === 1 ? 'Information' : step === 2 ? 'Shipping' : 'Payment'}
              </span>
              {step < 3 && (
                <div className={`w-12 h-px mx-2 ${
                  step < currentStep ? 'bg-black' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Forms */}
          <div className="space-y-8">
            {/* Customer Information */}
            {currentStep >= 1 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => updateForm('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => updateForm('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateForm('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth (Must be 21+) *
                    </label>
                    <input
                      type="date"
                      value={form.dateOfBirth}
                      onChange={(e) => updateForm('dateOfBirth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!validateStep(1)}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Continue to Shipping
                  </button>
                </div>
              </div>
            )}

            {/* Shipping Address */}
            {currentStep >= 2 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      value={form.shippingAddress1}
                      onChange={(e) => updateForm('shippingAddress1', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={form.shippingAddress2}
                      onChange={(e) => updateForm('shippingAddress2', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={form.shippingCity}
                        onChange={(e) => updateForm('shippingCity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={form.shippingState}
                        onChange={(e) => updateForm('shippingState', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={form.shippingZip}
                        onChange={(e) => updateForm('shippingZip', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    disabled={!validateStep(2)}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Payment Information */}
            {currentStep >= 3 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Payment Method
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="kajapay"
                          checked={form.paymentMethod === 'kajapay'}
                          onChange={(e) => updateForm('paymentMethod', e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Kajapay (Recommended)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={form.paymentMethod === 'card'}
                          onChange={(e) => updateForm('paymentMethod', e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Credit Card</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="test"
                          checked={form.paymentMethod === 'test'}
                          onChange={(e) => updateForm('paymentMethod', e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Test Payment (Always Succeeds)</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!validateStep(3) || processing}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {processing ? 'Processing...' : `Complete Order - $${cart?.total.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart?.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    {item.product?.image_url && (
                      <img
                        src={item.product.image_url}
                        alt={item.product?.name || 'Product'}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">
                        {item.product?.name || 'Unknown Product'}
                      </h3>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 text-sm">
                        ${(item.priceAtTime * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${cart?.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${cart?.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">${cart?.shippingAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-300">
                  <span>Total</span>
                  <span>${cart?.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Shield className="w-4 h-4" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Age Verification Required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
