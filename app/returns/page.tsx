import { Metadata } from 'next';
import GlobalMasthead from '../components/GlobalMasthead';
import AgeVerification from '../components/AgeVerification';
import { RotateCcw, Clock, CheckCircle, XCircle, Package, CreditCard } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Returns Policy - DOPE CITY',
  description: 'Learn about DOPE CITY return policy, exchange process, and refund procedures.',
};

export default function ReturnsPage() {
  const returnSteps = [
    {
      step: 1,
      title: 'Initiate Return',
      description: 'Contact us within 30 days of delivery to start your return',
      icon: RotateCcw
    },
    {
      step: 2,
      title: 'Get Authorization',
      description: 'Receive your Return Authorization (RA) number and instructions',
      icon: CheckCircle
    },
    {
      step: 3,
      title: 'Package & Ship',
      description: 'Pack items securely and ship using provided return label',
      icon: Package
    },
    {
      step: 4,
      title: 'Receive Refund',
      description: 'Get your refund within 5-7 business days after we receive your return',
      icon: CreditCard
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
              RETURNS POLICY
            </h1>
            <div className="w-24 h-1 bg-dope-orange-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Easy returns and exchanges to ensure your complete satisfaction
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12">
          
          {/* Return Process */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              How to Return an Item
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {returnSteps.map((step, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-dope-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">{step.step}</span>
                  </div>
                  <step.icon className="w-8 h-8 text-dope-orange-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Return Policy Details */}
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            
            {/* What Can Be Returned */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What Can Be Returned</h2>
              </div>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Eligible Items</h3>
                  <ul className="space-y-2">
                    <li>• Unused items in original packaging</li>
                    <li>• Items within 30 days of delivery</li>
                    <li>• Defective or damaged products</li>
                    <li>• Wrong items sent by mistake</li>
                    <li>• Items that don't match description</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Return Conditions</h3>
                  <ul className="space-y-2">
                    <li>• Must be in original condition</li>
                    <li>• Include all original accessories</li>
                    <li>• Original packaging required</li>
                    <li>• Return Authorization (RA) number needed</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* What Cannot Be Returned */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <XCircle className="w-8 h-8 text-red-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What Cannot Be Returned</h2>
              </div>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Non-Returnable Items</h3>
                  <ul className="space-y-2">
                    <li>• Used or damaged items (unless defective)</li>
                    <li>• Custom or personalized products</li>
                    <li>• Items returned after 30 days</li>
                    <li>• Products without original packaging</li>
                    <li>• Gift cards and digital products</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Special Cases</h3>
                  <ul className="space-y-2">
                    <li>• Clearance items (final sale)</li>
                    <li>• Items marked "non-returnable"</li>
                    <li>• Products damaged by misuse</li>
                    <li>• Items missing accessories or parts</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

          {/* Refund Information */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-12">
            <div className="flex items-center mb-6">
              <CreditCard className="w-8 h-8 text-dope-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Refunds & Processing</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Refund Methods</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Original payment method (credit/debit cards)</li>
                  <li>• PayPal refunds to PayPal account</li>
                  <li>• Store credit for exchanges</li>
                  <li>• Gift cards for special circumstances</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Processing Times</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• 1-2 business days to process return</li>
                  <li>• 5-7 business days for refund to appear</li>
                  <li>• Credit card refunds may take 1-2 billing cycles</li>
                  <li>• PayPal refunds typically within 24 hours</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Exchanges */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-12">
            <div className="flex items-center mb-6">
              <RotateCcw className="w-8 h-8 text-dope-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Exchanges</h2>
            </div>
            
            <div className="space-y-6 text-gray-600 dark:text-gray-300">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">How Exchanges Work</h3>
                <p className="mb-4">
                  We offer exchanges for defective items, wrong sizes, or if you received the wrong product. 
                  Exchanges follow the same 30-day timeline as returns.
                </p>
                <ul className="space-y-2">
                  <li>• Contact us to initiate an exchange</li>
                  <li>• We'll send a replacement once we receive your return</li>
                  <li>• No additional shipping charges for our mistakes</li>
                  <li>• Size/color exchanges may incur shipping fees</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Exchange Limitations</h3>
                <ul className="space-y-2">
                  <li>• Item must be available in desired size/color</li>
                  <li>• Price differences may apply</li>
                  <li>• Custom items cannot be exchanged</li>
                  <li>• One exchange per item maximum</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Return FAQ */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Return FAQ</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Do I need to pay for return shipping?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Return shipping is free for defective items or our mistakes. For other returns, you're responsible for return shipping costs unless you have a prepaid return label.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Can I return a gift?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, gifts can be returned within 30 days. The refund will be issued as store credit unless you have the original receipt.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">What if my return is damaged during shipping?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Pack returns carefully using the original packaging when possible. We recommend using tracking and insurance for valuable returns.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Can I return sale or clearance items?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Sale items can typically be returned unless marked as "final sale." Clearance items are usually final sale and cannot be returned.
                </p>
              </div>
            </div>
          </div>

          {/* Contact for Returns */}
          <div className="bg-gradient-to-r from-dope-orange-500 to-orange-600 rounded-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Need Help with a Return?</h2>
            <p className="text-xl mb-6">
              Our customer service team is ready to help you with your return or exchange.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-dope-orange-500 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg transition-colors">
                Start Return
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-dope-orange-500 px-8 py-3 rounded-lg font-bold text-lg transition-colors">
                Contact Support
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
