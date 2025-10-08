'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Truck, CreditCard } from 'lucide-react';
import GlobalMasthead from '../../components/GlobalMasthead';

interface Order {
  id: string;
  order_number: string;
  customer_email: string;
  customer_first_name: string;
  customer_last_name: string;
  status: string;
  payment_status: string;
  total_amount: number;
  shipping_address: any;
  created_at: string;
  order_items: Array<{
    id: string;
    product_name: string;
    product_sku: string;
    product_image_url: string;
    unit_price: number;
    quantity: number;
    total_price: number;
  }>;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setOrder(data.order);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError(err instanceof Error ? err.message : 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <GlobalMasthead />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white">
        <GlobalMasthead />
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The order could not be loaded.'}</p>
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

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your order, {order.customer_first_name}!
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Order #{order.order_number} • {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

          {/* Order Items */}
          <div className="space-y-4 mb-6">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-white rounded-lg">
                {item.product_image_url && (
                  <img
                    src={item.product_image_url}
                    alt={item.product_name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                  <p className="text-sm text-gray-500">SKU: {item.product_sku}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${item.unit_price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">${item.total_price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total</span>
              <span>${order.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-gray-50 rounded-lg p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
          </div>
          <div className="text-gray-600">
            <p>{order.customer_first_name} {order.customer_last_name}</p>
            {order.shipping_address && (
              <>
                <p>{order.shipping_address.address1}</p>
                {order.shipping_address.address2 && <p>{order.shipping_address.address2}</p>}
                <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipcode}</p>
              </>
            )}
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-blue-50 rounded-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CreditCard className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Payment Confirmed</h3>
                <p className="text-sm text-gray-600">Your payment has been processed successfully.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Order Processing</h3>
                <p className="text-sm text-gray-600">We're preparing your items for shipment.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Truck className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Shipping Updates</h3>
                <p className="text-sm text-gray-600">You'll receive tracking information once your order ships.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="text-center space-y-4">
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Continue Shopping
          </Link>
          <p className="text-sm text-gray-500">
            A confirmation email has been sent to {order.customer_email}
          </p>
        </div>
      </div>
    </div>
  );
}
