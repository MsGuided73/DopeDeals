import Link from 'next/link';
import GlobalMasthead from '../components/GlobalMasthead';
import AgeVerification from '../components/AgeVerification';

export default function AffiliatePage() {
  return (
    <div className="min-h-screen bg-white">
      <GlobalMasthead />
      <AgeVerification />
      
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-chalets text-gray-900 mb-6" style={{ letterSpacing: '-0.02em' }}>
            AFFILIATE PROGRAM
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join the DOPE CITY affiliate program and earn commissions by promoting premium smoking accessories 
            and THCA products to your audience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-dope-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-lg">
              Join Now - It's Free!
            </button>
            <button className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:border-dope-orange hover:text-dope-orange transition-colors font-medium text-lg">
              Learn More
            </button>
          </div>
        </div>

        {/* Commission Structure */}
        <section className="mb-16 bg-gradient-to-r from-dope-orange to-orange-600 rounded-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-chalets mb-4" style={{ letterSpacing: '-0.02em' }}>
              Earn Up To 15% Commission
            </h2>
            <p className="text-xl opacity-90">
              Our tiered commission structure rewards top performers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold mb-2">8%</div>
              <h3 className="text-lg font-semibold mb-2">Starter Level</h3>
              <p className="text-sm opacity-90">$0 - $1,000 in monthly sales</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-center border-2 border-white/30">
              <div className="text-3xl font-bold mb-2">12%</div>
              <h3 className="text-lg font-semibold mb-2">Pro Level</h3>
              <p className="text-sm opacity-90">$1,000 - $5,000 in monthly sales</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold mb-2">15%</div>
              <h3 className="text-lg font-semibold mb-2">Elite Level</h3>
              <p className="text-sm opacity-90">$5,000+ in monthly sales</p>
            </div>
          </div>
        </section>

        {/* Why Join */}
        <section className="mb-16">
          <h2 className="text-3xl font-chalets text-gray-900 text-center mb-12" style={{ letterSpacing: '-0.02em' }}>
            Why Join DOPE CITY Affiliates?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-dope-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">High Commissions</h3>
              <p className="text-gray-600">
                Earn up to 15% commission on every sale with our competitive tiered structure.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-dope-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-Time Tracking</h3>
              <p className="text-gray-600">
                Monitor your performance with detailed analytics and real-time reporting.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-dope-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Marketing Materials</h3>
              <p className="text-gray-600">
                Access professional banners, product images, and promotional content.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-dope-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fast Payments</h3>
              <p className="text-gray-600">
                Get paid monthly via PayPal, direct deposit, or check. No minimum payout.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-dope-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Dedicated Support</h3>
              <p className="text-gray-600">
                Get help from our affiliate management team whenever you need it.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-dope-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Premium Products</h3>
              <p className="text-gray-600">
                Promote high-quality products that customers love and trust.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16 bg-gray-50 rounded-2xl p-8">
          <h2 className="text-3xl font-chalets text-gray-900 text-center mb-12" style={{ letterSpacing: '-0.02em' }}>
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-dope-orange text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Sign Up</h3>
              <p className="text-gray-600 text-sm">Create your free affiliate account and get approved instantly.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-dope-orange text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Get Links</h3>
              <p className="text-gray-600 text-sm">Access your unique affiliate links and marketing materials.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-dope-orange text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Promote</h3>
              <p className="text-gray-600 text-sm">Share your links on social media, blogs, or websites.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-dope-orange text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Earn</h3>
              <p className="text-gray-600 text-sm">Get paid commissions for every sale you generate.</p>
            </div>
          </div>
        </section>

        {/* Perfect For */}
        <section className="mb-16">
          <h2 className="text-3xl font-chalets text-gray-900 text-center mb-12" style={{ letterSpacing: '-0.02em' }}>
            Perfect For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Influencers</h3>
              <p className="text-gray-600 text-sm">Cannabis and lifestyle influencers with engaged audiences.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Bloggers</h3>
              <p className="text-gray-600 text-sm">Content creators writing about cannabis culture and products.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">YouTubers</h3>
              <p className="text-gray-600 text-sm">Video creators reviewing smoking accessories and products.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Communities</h3>
              <p className="text-gray-600 text-sm">Online communities and forum moderators.</p>
            </div>
          </div>
        </section>

        {/* Terms & Requirements */}
        <section className="mb-16 bg-gray-900 text-white rounded-2xl p-8">
          <h2 className="text-3xl font-chalets text-center mb-8" style={{ letterSpacing: '-0.02em' }}>
            Program Requirements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Eligibility Requirements</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Must be 21+ years of age</li>
                <li>• Valid website, blog, or social media presence</li>
                <li>• Comply with all applicable laws</li>
                <li>• No promotion to minors</li>
                <li>• Professional and appropriate content</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Program Terms</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• 30-day cookie duration</li>
                <li>• Monthly commission payments</li>
                <li>• Real-time tracking and reporting</li>
                <li>• No minimum payout threshold</li>
                <li>• Exclusive promotional opportunities</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-3xl font-chalets text-gray-900 text-center mb-12" style={{ letterSpacing: '-0.02em' }}>
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">How much can I earn?</h3>
              <p className="text-gray-600">
                There's no limit to how much you can earn! Top affiliates earn thousands per month. 
                Your earnings depend on your traffic quality and promotional efforts.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">When do I get paid?</h3>
              <p className="text-gray-600">
                Commissions are paid monthly, typically within the first week of each month for the previous month's sales.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">What marketing materials are provided?</h3>
              <p className="text-gray-600">
                We provide banners, product images, promotional codes, and content suggestions. 
                New materials are added regularly to keep your promotions fresh.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Can I promote on social media?</h3>
              <p className="text-gray-600">
                Yes! Social media promotion is encouraged. Just make sure to follow platform guidelines 
                and include appropriate disclaimers where required.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-white">
          <h2 className="text-4xl font-chalets mb-6" style={{ letterSpacing: '-0.02em' }}>
            Ready to Start Earning?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of affiliates who are already earning with DOPE CITY. 
            Sign up today and start promoting premium products your audience will love.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-dope-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-lg">
              Join the Program
            </button>
            <Link href="/contact" className="px-8 py-4 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors font-medium text-lg">
              Contact Us
            </Link>
          </div>
          <p className="text-sm opacity-70 mt-6">
            Questions? Email us at affiliates@dopecity.com
          </p>
        </section>
      </div>
    </div>
  );
}
