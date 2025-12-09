'use client';

import { useState } from 'react';
import { Package, Search, Truck, CheckCircle, Clock, AlertTriangle, MapPin } from 'lucide-react';

interface OrderStatus {
  orderNumber: string;
  status: 'processing' | 'shipped' | 'delivered' | 'delayed' | 'cancelled';
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
  estimatedDelivery: string;
  shipDate: string;
  currentLocation?: string;
  statusHistory: Array<{
    date: string;
    status: string;
    location?: string;
  }>;
}

export default function TrackOrderForm() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderNumber || !email) {
      setError('Please enter both order number and email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual Shipstation API integration
      // For now, simulate different order statuses for demo purposes

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock different order statuses based on order number for demo
      const mockOrderStatus = generateMockOrderStatus(orderNumber);
      setOrderStatus(mockOrderStatus);

    } catch (err) {
      console.error('Error tracking order:', err);
      setError('Unable to track order. Please try again or contact customer support.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockOrderStatus = (orderNum: string): OrderStatus => {
    // Generate different statuses based on order number for demo
    const lastDigit = parseInt(orderNum.slice(-1)) || 0;

    const baseStatus = {
      orderNumber: orderNum,
      carrier: 'UPS',
      trackingNumber: `1Z${Math.random().toString(36).substring(2, 10).toUpperCase()}1234567890`,
      trackingUrl: 'https://www.ups.com',
      shipDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      statusHistory: [
        {
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          status: 'Order Processed',
          location: 'Salem, NH'
        }
      ]
    };

    // Generate different scenarios based on order number
    if (lastDigit === 0 || lastDigit === 1) {
      // Processing
      return {
        ...baseStatus,
        status: 'processing',
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        statusHistory: [
          ...baseStatus.statusHistory,
          {
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            status: 'Label Created',
            location: 'Salem, NH'
          }
        ]
      };
    } else if (lastDigit === 2 || lastDigit === 3) {
      // Shipped
      return {
        ...baseStatus,
        status: 'shipped',
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        currentLocation: 'En Route - Boston, MA',
        statusHistory: [
          ...baseStatus.statusHistory,
          {
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            status: 'Picked Up',
            location: 'Salem, NH'
          },
          {
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            status: 'In Transit',
            location: 'Boston, MA'
          }
        ]
      };
    } else if (lastDigit === 4 || lastDigit === 5) {
      // Delivered
      return {
        ...baseStatus,
        status: 'delivered',
        estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        statusHistory: [
          ...baseStatus.statusHistory,
          {
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            status: 'Out for Delivery',
            location: 'Your City, ST'
          },
          {
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            status: 'Delivered',
            location: 'Your Address'
          }
        ]
      };
    } else if (lastDigit === 6 || lastDigit === 7) {
      // Delayed
      return {
        ...baseStatus,
        status: 'delayed',
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        currentLocation: 'Held at Facility - Chicago, IL',
        statusHistory: [
          ...baseStatus.statusHistory,
          {
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            status: 'Picked Up',
            location: 'Salem, NH'
          },
          {
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            status: 'Delayed - Weather',
            location: 'Chicago, IL'
          }
        ]
      };
    } else {
      // Cancelled
      return {
        ...baseStatus,
        status: 'cancelled',
        estimatedDelivery: 'N/A - Order Cancelled',
        statusHistory: [
          ...baseStatus.statusHistory,
          {
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            status: 'Order Cancelled',
            location: 'Salem, NH'
          }
        ]
      };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-6 h-6 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-6 h-6 text-orange-500" />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'delayed':
        return <AlertTriangle className="w-6 h-6 text-red-500" />;
      case 'cancelled':
        return <AlertTriangle className="w-6 h-6 text-gray-500" />;
      default:
        return <Package className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'shipped':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'delayed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                How to Track Your Order
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Enter your order number (e.g., HW420-12345)</li>
                <li>• Use the email address from your order confirmation</li>
                <li>• Tracking information updates automatically</li>
                <li>• You'll receive email updates when your order ships</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Track Order Form */}
        {!orderStatus && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Order Number *
                </label>
                <input
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                  placeholder="e.g., HW420-12345"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3" />
                  <p className="text-red-800 dark:text-red-200">{error}</p>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-dope-orange-500 hover:bg-dope-orange-600 disabled:bg-gray-400 text-white px-12 py-4 rounded-lg font-bold text-lg transition-colors disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Tracking Order...
                  </>
                ) : (
                  <>
                    <Search className="w-6 h-6 mr-3" />
                    Track Order
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Order Status Display */}
        {orderStatus && (
          <div className="space-y-6">
            {/* Order Status Header */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Order #{orderStatus.orderNumber}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Shipped on {orderStatus.shipDate}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orderStatus.status)}`}>
                    {getStatusIcon(orderStatus.status)}
                    <span className="ml-2 capitalize">{orderStatus.status}</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Carrier</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{orderStatus.carrier}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tracking Number</p>
                  <p className="font-semibold text-gray-900 dark:text-white font-mono">{orderStatus.trackingNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Delivery</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{orderStatus.estimatedDelivery}</p>
                </div>
              </div>

              {orderStatus.currentLocation && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Location</p>
                  <p className="font-semibold text-gray-900 dark:text-white flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {orderStatus.currentLocation}
                  </p>
                </div>
              )}
            </div>

            {/* Tracking Button */}
            <div className="text-center">
              <a
                href={orderStatus.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-bold transition-colors"
              >
                <Truck className="w-5 h-5 mr-2" />
                Track with {orderStatus.carrier}
              </a>
            </div>

            {/* Status History */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tracking History</h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {orderStatus.statusHistory.map((event, index) => (
                  <div key={index} className="px-6 py-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        {index === 0 ? (
                          <div className="w-8 h-8 bg-dope-orange-500 rounded-full flex items-center justify-center">
                            <Package className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {event.status}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {event.date}
                          </p>
                        </div>
                        {event.location && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {event.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Track Another Order */}
            <div className="text-center">
              <button
                onClick={() => {
                  setOrderStatus(null);
                  setOrderNumber('');
                  setEmail('');
                }}
                className="text-dope-orange-500 hover:text-dope-orange-600 font-medium"
              >
                Track Another Order →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
