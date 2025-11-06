"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

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
  shippingCountry: string;

  // Billing Address
  billingAddress1: string;
  billingAddress2: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  billingCountry: string;
  billingSameAsShipping: boolean;

  // Payment
  paymentMethod: 'card' | 'ach' | 'saved_card';
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  savePaymentMethod: boolean;

  // Age Verification
  dateOfBirth: string;
  ageVerified: boolean;
}

export default function CheckoutPage() {
  const { cart, isLoading, refreshCart } = useCart();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    shippingCountry: 'US',
    billingAddress1: '',
    billingAddress2: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    billingCountry: 'US',
    billingSameAsShipping: true,
    paymentMethod: 'card',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    savePaymentMethod: false,
    dateOfBirth: '',
    ageVerified: false
  });

  const updateForm = (field: keyof CheckoutForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));

    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-sync billing address if same as shipping
    if (field.startsWith('shipping') && form.billingSameAsShipping) {
      const billingField = field.replace('shipping', 'billing') as keyof CheckoutForm;
      if (billingField in form) {
        setForm(prev => ({ ...prev, [billingField]: value }));
      }
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Customer Info & Age Verification
        if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!form.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid';
        if (!form.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        else {
          const age = calculateAge(form.dateOfBirth);
          if (age < 21) newErrors.dateOfBirth = 'You must be 21 or older to purchase';
        }
        break;

      case 2: // Shipping Address
        if (!form.shippingAddress1.trim()) newErrors.shippingAddress1 = 'Address is required';
        if (!form.shippingCity.trim()) newErrors.shippingCity = 'City is required';
        if (!form.shippingState.trim()) newErrors.shippingState = 'State is required';
        if (!form.shippingZip.trim()) newErrors.shippingZip = 'ZIP code is required';
        break;

      case 3: // Payment
        if (!form.paymentMethod) newErrors.paymentMethod = 'Payment method is required';
        if (form.paymentMethod === 'card') {
          if (!form.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
          if (!form.expiryMonth) newErrors.expiryMonth = 'Expiry month is required';
          if (!form.expiryYear) newErrors.expiryYear = 'Expiry year is required';
          if (!form.cvv.trim()) newErrors.cvv = 'CVV is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

    // Validate all steps
    for (let step = 1; step <= 3; step++) {
      if (!validateStep(step)) {
        setCurrentStep(step);
        return;
      }
    }

    setProcessing(true);

    try {
      // Prepare checkout payload
      const checkoutData = {
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        shippingAddress: {
          firstName: form.firstName,
          lastName: form.lastName,
          address1: form.shippingAddress1,
          address2: form.shippingAddress2 || undefined,
          city: form.shippingCity,
          state: form.shippingState,
          postalCode: form.shippingZip,
          country: form.shippingCountry,
          phone: form.phone || undefined
        },
        billingAddress: form.billingSameAsShipping ? {
          firstName: form.firstName,
          lastName: form.lastName,
          address1: form.shippingAddress1,
          address2: form.shippingAddress2 || undefined,
          city: form.shippingCity,
          state: form.shippingState,
          postalCode: form.shippingZip,
          country: form.shippingCountry,
          email: form.email,
          phone: form.phone || undefined
        } : {
          firstName: form.firstName,
          lastName: form.lastName,
          address1: form.billingAddress1,
          address2: form.billingAddress2 || undefined,
          city: form.billingCity,
          state: form.billingState,
          postalCode: form.billingZip,
          country: form.billingCountry,
          email: form.email,
          phone: form.phone || undefined
        },
        paymentMethod: {
          type: form.paymentMethod,
          cardNumber: form.cardNumber.replace(/\s/g, ''),
          expiryMonth: form.expiryMonth,
          expiryYear: form.expiryYear,
          cvv: form.cvv
        },
        processPayment: true,
        savePaymentMethod: form.savePaymentMethod
      };

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
        },
        body: JSON.stringify(checkoutData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('Order placed successfully!', { duration: 4000 });

        // Refresh cart to clear it
        await refreshCart();

        // Redirect to order confirmation
        router.push(`/order-confirmation/${result.order.id}`);
      } else {
        const errorMessage = result.error || result.payment?.error || 'Failed to process order';
        toast.error(errorMessage);
        console.error('Checkout error:', result);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('An error occurred during checkout. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Redirect if cart is empty
  useEffect(() => {
    if (!isLoading && (!cart || cart.items.length === 0)) {
      router.push('/cart');
    }
  }, [cart, isLoading, router]);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/cart"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3, 4].map((step) => (
            <React.Fragment key={step}>
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  step < currentStep ? 'bg-green-600 text-white' :
                  step === currentStep ? 'bg-black text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${
                  step <= currentStep ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step === 1 ? 'Information' : step === 2 ? 'Shipping' : step === 3 ? 'Payment' : 'Review'}
                </span>
              </div>
              {step < 4 && (
                <div className={`w-12 h-px ${
                  step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Forms */}
          <div className="space-y-8">
            {/* Step 1: Customer Information & Age Verification */}
            {currentStep >= 1 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                  <h2 className="text-xl font-semibold text-gray-900">Customer Information</h2>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) => updateForm('firstName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${
                          errors.firstName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) => updateForm('lastName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${
                          errors.lastName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateForm('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth (Must be 21+) *
                    </label>
                    <input
                      type="date"
                      value={form.dateOfBirth}
                      onChange={(e) => updateForm('dateOfBirth', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${
                        errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.dateOfBirth && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.dateOfBirth}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Age verification required for cannabis products
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!validateStep(1)}
                    className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Continue to Shipping
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Shipping Address */}
            {currentStep >= 2 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                  <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      value={form.shippingAddress1}
                      onChange={(e) => updateForm('shippingAddress1', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${
                        errors.shippingAddress1 ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="123 Main Street"
                    />
                    {errors.shippingAddress1 && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.shippingAddress1}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={form.shippingAddress2}
                      onChange={(e) => updateForm('shippingAddress2', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                      placeholder="Apartment, suite, etc."
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
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${
                          errors.shippingCity ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Los Angeles"
                      />
                      {errors.shippingCity && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.shippingCity}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={form.shippingState}
                        onChange={(e) => updateForm('shippingState', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${
                          errors.shippingState ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="CA"
                      />
                      {errors.shippingState && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.shippingState}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={form.shippingZip}
                        onChange={(e) => updateForm('shippingZip', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${
                          errors.shippingZip ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="90210"
                      />
                      {errors.shippingZip && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.shippingZip}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    disabled={!validateStep(2)}
                    className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Information */}
            {currentStep >= 3 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                  <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Payment Method *
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={form.paymentMethod === 'card'}
                          onChange={(e) => updateForm('paymentMethod', e.target.value as any)}
                          className="mr-3"
                        />
                        <CreditCard className="w-5 h-5 text-gray-600 mr-3" />
                        <span className="text-sm font-medium text-gray-900">Credit/Debit Card</span>
                      </label>
                    </div>
                    {errors.paymentMethod && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.paymentMethod}
                      </p>
                    )}
                  </div>

                  {form.paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          value={form.cardNumber}
                          onChange={(e) => updateForm('cardNumber', e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${
                            errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                        {errors.cardNumber && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.cardNumber}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Month *
                          </label>
                          <select
                            value={form.expiryMonth}
                            onChange={(e) => updateForm('expiryMonth', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${
                              errors.expiryMonth ? 'border-red-300' : 'border-gray-300'
                            }`}
                          >
                            <option value="">MM</option>
                            {Array.from({ length: 12 }, (_, i) => {
                              const month = (i + 1).toString().padStart(2, '0');
                              return <option key={month} value={month}>{month}</option>;
                            })}
                          </select>
                          {errors.expiryMonth && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.expiryMonth}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Year *
                          </label>
                          <select
                            value={form.expiryYear}
                            onChange={(e) => updateForm('expiryYear', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${
                              errors.expiryYear ? 'border-red-300' : 'border-gray-300'
                            }`}
                          >
                            <option value="">YYYY</option>
                            {Array.from({ length: 10 }, (_, i) => {
                              const year = (new Date().getFullYear() + i).toString();
                              return <option key={year} value={year}>{year}</option>;
                            })}
                          </select>
                          {errors.expiryYear && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.expiryYear}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            value={form.cvv}
                            onChange={(e) => updateForm('cvv', e.target.value.replace(/\D/g, ''))}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${
                              errors.cvv ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="123"
                            maxLength={4}
                          />
                          {errors.cvv && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.cvv}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="savePaymentMethod"
                          checked={form.savePaymentMethod}
                          onChange={(e) => updateForm('savePaymentMethod', e.target.checked)}
                          className="mr-3"
                        />
                        <label htmlFor="savePaymentMethod" className="text-sm text-gray-700">
                          Save this payment method for future purchases
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(4)}
                    disabled={!validateStep(3)}
                    className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Order Review */}
            {currentStep >= 4 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                  <h2 className="text-xl font-semibold text-gray-900">Review Your Order</h2>
                </div>

                <div className="space-y-6">
                  {/* Customer Info Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Customer Information</h3>
                    <p className="text-sm text-gray-600">{form.firstName} {form.lastName}</p>
                    <p className="text-sm text-gray-600">{form.email}</p>
                    {form.phone && <p className="text-sm text-gray-600">{form.phone}</p>}
                  </div>

                  {/* Shipping Address Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                    <p className="text-sm text-gray-600">
                      {form.shippingAddress1}<br />
                      {form.shippingAddress2 && <>{form.shippingAddress2}<br /></>}
                      {form.shippingCity}, {form.shippingState} {form.shippingZip}
                    </p>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
                    <p className="text-sm text-gray-600">
                      {form.paymentMethod === 'card' ? 'Credit/Debit Card' : 'Other Payment Method'}
                      {form.paymentMethod === 'card' && form.cardNumber && (
                        <span> ending in {form.cardNumber.slice(-4)}</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={processing}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Complete Order - $${cart?.total.toFixed(2)}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart?.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {item.product?.imageUrl && (
                      <img
                        src={item.product.imageUrl}
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
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Secure SSL Encryption</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Age Verification Required (21+)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Fast & Discreet Shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
