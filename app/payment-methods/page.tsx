import { Metadata } from 'next';
import AgeVerification from '../components/AgeVerification';
import { CreditCard, Smartphone, Shield, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Payment Methods - DOPE CITY',
  description: 'Secure payment options available at DOPE CITY including credit cards, digital wallets, and more.',
};

export default function PaymentMethodsPage() {
  const paymentMethods = [
    {
      name: 'Credit & Debit Cards',
      description: 'Visa, Mastercard, American Express, Discover',
      icon: CreditCard,
      features: ['Instant processing', 'Secure encryption', 'Fraud protection'],
      fees: 'No additional fees'
    },
    {
      name: 'PayPal',
      description: 'Pay with your PayPal account or linked cards',
      icon: Smartphone,
      features: ['Buyer protection', 'Quick checkout', 'No account required'],
      fees: 'No additional fees'
    },
    {
      name: 'Apple Pay',
      description: 'Fast and secure payment with Touch ID or Face ID',
      icon: Smartphone,
      features: ['Biometric security', 'One-touch payment', 'No card details shared'],
      fees: 'No additional fees'
    },
    {
      name: 'Google Pay',
      description: 'Pay quickly with your Google account',
      icon: Smartphone,
      features: ['Secure tokenization', 'Quick setup', 'Multiple card support'],
      fees: 'No additional fees'
    }
  ];

  return (
    <>
      <AgeVerification />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="dope-city-title text-5xl md:text-6xl mb-4">
              PAYMENT METHODS
            </h1>
            <div className="w-24 h-1 bg-dope-orange-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Secure, fast, and convenient payment options for your DOPE CITY orders
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12">
          
          {/* Payment Methods Grid */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              Accepted Payment Methods
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {paymentMethods.map((method, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
                  <div className="flex items-center mb-6">
                    <method.icon className="w-10 h-10 text-dope-orange-500 mr-4" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{method.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{method.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Features:</h4>
                      <ul className="space-y-1">
                        {method.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-center text-gray-600 dark:text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-semibold text-dope-orange-500">{method.fees}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Features */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-12">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-dope-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Security</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Security Measures</h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <span><strong>SSL Encryption:</strong> All payment data is encrypted during transmission</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <span><strong>PCI Compliance:</strong> We meet the highest security standards</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <span><strong>Fraud Detection:</strong> Advanced systems monitor for suspicious activity</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <span><strong>Secure Storage:</strong> Payment information is never stored on our servers</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Your Protection</h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <Shield className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                    <span><strong>Chargeback Protection:</strong> Dispute resolution support</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                    <span><strong>Purchase Protection:</strong> Coverage for eligible transactions</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                    <span><strong>Identity Verification:</strong> Additional security for large orders</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                    <span><strong>24/7 Monitoring:</strong> Continuous security surveillance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Payment Process */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-12">
            <div className="flex items-center mb-6">
              <Clock className="w-8 h-8 text-dope-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Process</h2>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-dope-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Add to Cart</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Select your products and proceed to checkout</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-dope-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Choose Payment</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Select your preferred payment method</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-dope-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Secure Payment</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Complete payment through encrypted connection</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-dope-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">4</span>
                </div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Confirmation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Receive order confirmation and tracking info</p>
              </div>
            </div>
          </div>

          {/* Payment FAQ */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Payment FAQ</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Is it safe to use my credit card?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, absolutely. We use industry-standard SSL encryption and are PCI DSS compliant. 
                  Your payment information is processed securely and never stored on our servers.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">When will my payment be charged?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your payment is charged immediately when you place your order. For pre-orders, 
                  payment is charged when the item ships.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Can I save my payment information?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, you can securely save payment methods to your account for faster checkout. 
                  We use tokenization to protect your card details.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">What if my payment is declined?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Contact your bank to ensure the transaction isn't blocked. You can also try a 
                  different payment method or contact our support team for assistance.
                </p>
              </div>
            </div>
          </div>

          {/* Contact for Payment Issues */}
          <div className="bg-gradient-to-r from-dope-orange-500 to-orange-600 rounded-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Payment Questions?</h2>
            <p className="text-xl mb-6">
              Our payment support team is here to help with any payment-related questions or issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-dope-orange-500 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg transition-colors">
                Contact Support
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-dope-orange-500 px-8 py-3 rounded-lg font-bold text-lg transition-colors">
                Live Chat
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
