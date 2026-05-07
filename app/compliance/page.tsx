import Link from 'next/link';
import GlobalMasthead from '../components/GlobalMasthead';

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-white font-fira-heading">
      <GlobalMasthead />
      
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-dope-orange">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Compliance Information</span>
          </div>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-chalets-legweb text-gray-900 mb-4" style={{ letterSpacing: '-0.02em' }}>
            Legal Compliance & Regulations
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Highway 420 is committed to full compliance with all applicable laws and regulations governing the sale of smoking accessories and hemp-derived products.
          </p>
        </div>

        {/* Compliance Sections */}
        <div className="space-y-12">
          {/* Age Verification */}
          <section className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-chalets-legweb text-gray-900 mb-6" style={{ letterSpacing: '-0.02em' }}>
              Age Verification Requirements
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-4">
                All customers must be 21 years of age or older to purchase products from Highway 420. We employ strict age verification measures including:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Digital age verification at account creation</li>
                <li>ID verification for high-value orders</li>
                <li>Adult signature required for delivery</li>
                <li>Regular compliance audits and monitoring</li>
              </ul>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-medium">
                  ⚠️ Important: Attempting to purchase products while under 21 years of age is prohibited and may result in legal consequences.
                </p>
              </div>
            </div>
          </section>

          {/* Product Compliance */}
          <section>
            <h2 className="text-2xl font-chalets-legweb text-gray-900 mb-6" style={{ letterSpacing: '-0.02em' }}>
              Product Compliance Standards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Hemp-Derived Products</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Delta-9 THC content below 0.3% (dry weight basis)</li>
                  <li>• Third-party lab testing for all products</li>
                  <li>• Certificates of Analysis (COAs) available</li>
                  <li>• Compliant with 2018 Farm Bill regulations</li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Smoking Accessories</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Intended for legal tobacco and hemp use only</li>
                  <li>• Quality materials meeting safety standards</li>
                  <li>• Proper labeling and usage instructions</li>
                  <li>• No promotion of illegal substance use</li>
                </ul>
              </div>
            </div>
          </section>

          {/* State Regulations */}
          <section className="bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-chalets-legweb text-gray-900 mb-6" style={{ letterSpacing: '-0.02em' }}>
              State-Specific Regulations
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-4">
                Cannabis and hemp laws vary significantly by state. Highway 420 monitors and complies with regulations in all states where we operate:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Shipping Restrictions</h4>
                  <p className="text-sm text-gray-700">Certain products may be restricted in specific states based on local laws.</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Tax Compliance</h4>
                  <p className="text-sm text-gray-700">Appropriate state and local taxes applied based on delivery location.</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Licensing Requirements</h4>
                  <p className="text-sm text-gray-700">All necessary licenses and permits maintained for legal operation.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Banking & Payment Compliance */}
          <section>
            <h2 className="text-2xl font-chalets-legweb text-gray-900 mb-6" style={{ letterSpacing: '-0.02em' }}>
              Financial Compliance
            </h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Banking Regulations</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Full compliance with BSA/AML requirements</li>
                    <li>• Transparent financial reporting</li>
                    <li>• Secure payment processing systems</li>
                    <li>• Regular compliance audits</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tax Obligations</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Federal and state tax compliance</li>
                    <li>• Proper sales tax collection</li>
                    <li>• Accurate financial record keeping</li>
                    <li>• Quarterly compliance reviews</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Shipping & Delivery Compliance */}
          <section className="bg-green-50 rounded-lg p-8">
            <h2 className="text-2xl font-chalets-legweb text-gray-900 mb-6" style={{ letterSpacing: '-0.02em' }}>
              Shipping & Delivery Compliance
            </h2>
            <div className="prose prose-lg max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Packaging Requirements</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Discreet, unmarked packaging</li>
                    <li>• Child-resistant containers where required</li>
                    <li>• Proper labeling and warnings</li>
                    <li>• Tamper-evident seals</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery Standards</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Adult signature required (21+)</li>
                    <li>• ID verification at delivery</li>
                    <li>• Secure shipping methods only</li>
                    <li>• Full tracking and documentation</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Regulatory Updates */}
          <section>
            <h2 className="text-2xl font-chalets-legweb text-gray-900 mb-6" style={{ letterSpacing: '-0.02em' }}>
              Staying Current with Regulations
            </h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                The regulatory landscape for cannabis and hemp products is constantly evolving. Highway 420 maintains compliance through:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-dope-orange rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Regular Monitoring</h4>
                  <p className="text-sm text-gray-700">Daily monitoring of federal and state regulatory changes</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-dope-orange rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Legal Consultation</h4>
                  <p className="text-sm text-gray-700">Regular consultation with cannabis law specialists</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-dope-orange rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Proactive Updates</h4>
                  <p className="text-sm text-gray-700">Immediate implementation of new compliance requirements</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-gray-900 text-white rounded-lg p-8">
            <h2 className="text-2xl font-chalets-legweb mb-6" style={{ letterSpacing: '-0.02em' }}>
              Compliance Questions?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="mb-4">
                  If you have questions about our compliance practices or need clarification on any regulations, our compliance team is here to help.
                </p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> info@highway420store.com</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
                <div className="space-y-2">
                  <Link href="/age-verification" className="block text-dope-orange hover:text-orange-300">Age Verification Process</Link>
                  <Link href="/terms" className="block text-dope-orange hover:text-orange-300">Terms of Service</Link>
                  <Link href="/privacy" className="block text-dope-orange hover:text-orange-300">Privacy Policy</Link>
                  <Link href="/shipping" className="block text-dope-orange hover:text-orange-300">Shipping Policies</Link>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> This information is provided for educational purposes and should not be considered legal advice. 
            Cannabis and hemp laws are subject to change. Always consult with qualified legal counsel for specific compliance questions. 
            Last updated: {new Date().toLocaleDateString()}.
          </p>
        </div>
      </div>
    </div>
  );
}
