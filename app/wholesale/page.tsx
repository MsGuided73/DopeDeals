import Link from 'next/link';
import GlobalMasthead from '../components/GlobalMasthead';

export default function WholesalePage() {
  return (
    <div className="min-h-screen bg-white">
      <GlobalMasthead />
      
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-chalets-legweb text-gray-900 mb-6" style={{ letterSpacing: '-0.02em' }}>
            WHOLESALE PORTAL
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Partner with DOPE CITY for premium wholesale pricing on smoking accessories, THCA products, and more. 
            Built for retailers, dispensaries, and distributors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-dope-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-lg">
              Apply for Wholesale Account
            </button>
            <button className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:border-dope-orange hover:text-dope-orange transition-colors font-medium text-lg">
              Download Catalog
            </button>
          </div>
        </div>

        {/* Benefits Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-chalets-legweb text-gray-900 text-center mb-12" style={{ letterSpacing: '-0.02em' }}>
            Why Choose DOPE CITY Wholesale?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-dope-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Competitive Pricing</h3>
              <p className="text-gray-600">
                Tiered pricing structure with volume discounts. The more you buy, the more you save.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-dope-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Premium Products</h3>
              <p className="text-gray-600">
                Curated selection of high-quality smoking accessories and hemp-derived products.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-dope-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fast Fulfillment</h3>
              <p className="text-gray-600">
                Quick processing and shipping to keep your inventory stocked and customers happy.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="mb-16 bg-gray-50 rounded-2xl p-8">
          <h2 className="text-3xl font-chalets-legweb text-gray-900 text-center mb-12" style={{ letterSpacing: '-0.02em' }}>
            Wholesale Pricing Tiers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Bronze Tier</h3>
                <p className="text-gray-600">$500+ per order</p>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  15% off retail prices
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Standard shipping rates
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Email support
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6 border-2 border-dope-orange relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-dope-orange text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Silver Tier</h3>
                <p className="text-gray-600">$1,500+ per order</p>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  25% off retail prices
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Free shipping on orders $2,000+
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Priority phone support
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Marketing materials
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Gold Tier</h3>
                <p className="text-gray-600">$5,000+ per order</p>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  35% off retail prices
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Free expedited shipping
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Dedicated account manager
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Custom product sourcing
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Exclusive product access
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-chalets-legweb text-gray-900 text-center mb-12" style={{ letterSpacing: '-0.02em' }}>
            How to Get Started
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-dope-orange text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Apply Online</h3>
              <p className="text-gray-600 text-sm">Submit your wholesale application with business details and tax information.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-dope-orange text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Verification</h3>
              <p className="text-gray-600 text-sm">We verify your business credentials and review your application.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-dope-orange text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Account Setup</h3>
              <p className="text-gray-600 text-sm">Once approved, we'll set up your wholesale account with pricing access.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-dope-orange text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Start Ordering</h3>
              <p className="text-gray-600 text-sm">Begin placing wholesale orders and growing your business with DOPE CITY.</p>
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="mb-16 bg-gray-900 text-white rounded-2xl p-8">
          <h2 className="text-3xl font-chalets-legweb text-center mb-8" style={{ letterSpacing: '-0.02em' }}>
            Wholesale Requirements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Business Requirements</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Valid business license</li>
                <li>• Federal Tax ID (EIN)</li>
                <li>• Tobacco/smoke shop license (if applicable)</li>
                <li>• Minimum order quantities</li>
                <li>• Business bank account</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Age & Compliance</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• 21+ age verification required</li>
                <li>• Compliance with local/state laws</li>
                <li>• No sales to minors policy</li>
                <li>• Proper product storage requirements</li>
                <li>• Regular compliance audits</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="text-center">
          <h2 className="text-3xl font-chalets-legweb text-gray-900 mb-6" style={{ letterSpacing: '-0.02em' }}>
            Ready to Partner with Us?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of retailers who trust DOPE CITY for their wholesale needs. 
            Let's grow your business together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="px-8 py-4 bg-dope-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-lg">
              Start Application
            </button>
            <Link href="/contact" className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:border-dope-orange hover:text-dope-orange transition-colors font-medium text-lg">
              Contact Sales Team
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Wholesale Sales</h4>
              <p className="text-gray-600">wholesale@dopecity.com</p>
              <p className="text-gray-600">1-800-WHOLESALE</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Account Management</h4>
              <p className="text-gray-600">accounts@dopecity.com</p>
              <p className="text-gray-600">1-800-ACCOUNTS</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Support</h4>
              <p className="text-gray-600">support@dopecity.com</p>
              <p className="text-gray-600">1-800-SUPPORT</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
