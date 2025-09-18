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
  paymentMethod: 'kajapay' | 'card';

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
        // Redirect to order confirmation or payment processor
        window.location.href = `/order-confirmation/${result.orderId}`;
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
      </div>
    </div>
  );
}