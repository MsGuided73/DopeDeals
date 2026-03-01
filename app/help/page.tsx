import { Metadata } from 'next';
import Link from 'next/link';
import GlobalMasthead from '../components/GlobalMasthead';
import { Search, Package, CreditCard, Truck, RotateCcw, Shield, MessageCircle, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Help Center - Highway 420',
  description: 'Find answers to frequently asked questions about orders, shipping, returns, and more at Highway 420.',
};

export default function HelpPage() {
  const faqCategories = [
    {
      title: 'Orders & Payment',
      icon: CreditCard,
      questions: [
        'How do I place an order?',
        'What payment methods do you accept?',
        'Can I modify or cancel my order?',
        'Why was my payment declined?',
        'Do you offer payment plans?'
      ]
    },
    {
      title: 'Shipping & Delivery',
      icon: Truck,
      questions: [
        'How long does shipping take?',
        'What are your shipping rates?',
        'Do you ship internationally?',
        'How can I track my order?',
        'What if my package is lost or damaged?'
      ]
    },
    {
      title: 'Returns & Exchanges',
      icon: RotateCcw,
      questions: [
        'What is your return policy?',
        'How do I return an item?',
        'Can I exchange a product?',
        'When will I receive my refund?',
        'What items cannot be returned?'
      ]
    },
    {
      title: 'Products & Quality',
      icon: Package,
      questions: [
        'Are your products authentic?',
        'Do you test your products?',
        'What if I receive a defective item?',
        'How do I care for glass products?',
        'Do you offer warranties?'
      ]
    },
    {
      title: 'Account & Privacy',
      icon: Shield,
      questions: [
        'How do I create an account?',
        'How do I reset my password?',
        'Is my personal information secure?',
        'How do I update my profile?',
        'Can I delete my account?'
      ]
    }
  ];

  return (
    <>
      <GlobalMasthead />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="dope-city-title text-5xl md:text-6xl mb-4">
              HELP CENTER
            </h1>
            <div className="w-24 h-1 bg-dope-orange-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Find answers to common questions and get the support you need
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border-0 focus:ring-2 focus:ring-dope-orange-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Link href="/contact" className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow group">
              <MessageCircle className="w-12 h-12 text-dope-orange-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Contact Support</h3>
              <p className="text-gray-600 dark:text-gray-300">Get personalized help from our support team</p>
            </Link>

            <Link href="/orders" className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow group">
              <Package className="w-12 h-12 text-dope-orange-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Track Order</h3>
              <p className="text-gray-600 dark:text-gray-300">Check the status of your recent orders</p>
            </Link>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow group cursor-pointer">
              <Phone className="w-12 h-12 text-dope-orange-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Call Us</h3>
              <p className="text-gray-600 dark:text-gray-300">1-800-DOPE-CITY</p>
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {faqCategories.map((category, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <category.icon className="w-8 h-8 text-dope-orange-500 mr-3" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{category.title}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {category.questions.map((question, qIndex) => (
                      <button
                        key={qIndex}
                        className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <span className="text-gray-700 dark:text-gray-300 hover:text-dope-orange-500">
                          {question}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Articles */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              Popular Help Articles
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
                  How to Care for Glass Pieces
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Learn proper cleaning and maintenance techniques for your glass accessories.
                </p>
                <button className="text-dope-orange-500 hover:text-dope-orange-600 font-semibold">
                  Read More →
                </button>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
                  Age Verification Process
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Understanding our age verification requirements and compliance.
                </p>
                <button className="text-dope-orange-500 hover:text-dope-orange-600 font-semibold">
                  Read More →
                </button>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
                  VIP Membership Benefits
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Discover exclusive perks and savings with Highway 420 VIP membership.
                </p>
                <button className="text-dope-orange-500 hover:text-dope-orange-600 font-semibold">
                  Read More →
                </button>
              </div>
            </div>
          </div>

          {/* Still Need Help */}
          <div className="bg-gradient-to-r from-dope-orange-500 to-orange-600 rounded-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-xl mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-white text-dope-orange-500 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg transition-colors">
                Contact Support
              </Link>
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
