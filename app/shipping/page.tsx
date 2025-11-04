import { Metadata } from 'next';
import GlobalMasthead from '../components/GlobalMasthead';
import AgeVerification from '../components/AgeVerification';
import { Truck, Clock, Package, Shield, MapPin, DollarSign } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping Information - Highway 420',
  description: 'Learn about Highway 420 shipping rates, delivery times, and policies for your orders.',
};

export default function ShippingPage() {
  const shippingOptions = [
    {
      name: 'Standard Shipping',
      time: '5-7 Business Days',
      cost: '$9.99',
      description: 'Reliable ground shipping for most orders',
      icon: Truck
    },
    {
      name: 'Express Shipping',
      time: '2-3 Business Days',
      cost: '$19.99',
      description: 'Faster delivery for urgent orders',
      icon: Clock
    },
    {
      name: 'Overnight Shipping',
      time: '1 Business Day',
      cost: '$39.99',
      description: 'Next business day delivery',
      icon: Package
    },
    {
      name: 'Free Shipping',
      time: '5-7 Business Days',
      cost: 'FREE',
      description: 'On orders over $75',
      icon: DollarSign
    }
  ];

  return (
    <>
      <AgeVerification />
      <GlobalMasthead />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="dope-city-title text-5xl md:text-6xl mb-4">
              SHIPPING INFO
            </h1>
            <div className="w-24 h-1 bg-dope-orange-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Fast, secure, and reliable shipping for all your Highway 420 orders
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12">
          
          {/* Shipping Options */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              Shipping Options
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {shippingOptions.map((option, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                  <option.icon className="w-12 h-12 text-dope-orange-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{option.name}</h3>
                  <div className="text-2xl font-bold text-dope-orange-500 mb-2">{option.cost}</div>
                  <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">{option.time}</div>
                  <p className="text-gray-600 dark:text-gray-400">{option.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Policies */}
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            
            {/* Processing & Delivery */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Clock className="w-8 h-8 text-dope-orange-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Processing & Delivery</h2>
              </div>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Order Processing</h3>
                  <p>Orders placed before 2 PM EST Monday-Friday are processed the same day. Weekend orders are processed on the next business day.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Delivery Times</h3>
                  <p>Delivery times are business days only and begin after your order has been processed and shipped. Weekend and holiday deliveries may be available in select areas.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Tracking Information</h3>
                  <p>You'll receive a tracking number via email once your order ships. Track your package anytime on our website or the carrier's site.</p>
                </div>
              </div>
            </div>

            {/* Shipping Areas */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <MapPin className="w-8 h-8 text-dope-orange-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shipping Areas</h2>
              </div>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Domestic Shipping</h3>
                  <p>We ship to all 50 US states, Washington DC, and US territories. Some restrictions may apply to certain products in specific states.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">PO Boxes & APO/FPO</h3>
                  <p>We can ship to PO Boxes for most items. Military APO/FPO addresses are supported with standard shipping only.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">International Shipping</h3>
                  <p>Currently, we only ship within the United States. International shipping may be available in the future.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Special Handling */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-12">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-dope-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Special Handling & Security</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Discreet Packaging</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Plain, unmarked packaging</li>
                  <li>• No product descriptions on exterior</li>
                  <li>• Secure, protective materials</li>
                  <li>• Professional appearance</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Fragile Items</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Extra protective packaging for glass</li>
                  <li>• Bubble wrap and foam inserts</li>
                  <li>• "Fragile" handling labels</li>
                  <li>• Insurance included on valuable items</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Shipping FAQ */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Can I change my shipping address after placing an order?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Address changes are possible if your order hasn't been processed yet. Contact us immediately at support@dopecity.com or 1-800-DOPE-CITY.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">What if my package is damaged during shipping?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We pack all items carefully, but damage can occur. Contact us within 48 hours of delivery with photos of the damage for a quick resolution.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Do you require signature confirmation?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Signature confirmation is required for orders over $200 and can be requested for any order. This helps ensure secure delivery.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">What happens if I'm not home for delivery?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  The carrier will typically leave a delivery notice and attempt redelivery. You can also arrange to pick up your package at a local facility.
                </p>
              </div>
            </div>
          </div>

          {/* Contact for Shipping Questions */}
          <div className="bg-gradient-to-r from-dope-orange-500 to-orange-600 rounded-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Questions About Shipping?</h2>
            <p className="text-xl mb-6">
              Our customer service team is here to help with any shipping questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-dope-orange-500 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg transition-colors">
                Contact Support
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-dope-orange-500 px-8 py-3 rounded-lg font-bold text-lg transition-colors">
                Track Order
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
