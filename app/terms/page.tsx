import { Metadata } from 'next';
import AgeVerification from '../components/AgeVerification';

export const metadata: Metadata = {
  title: 'Terms of Service - DOPE CITY',
  description: 'DOPE CITY Terms of Service - Legal terms and conditions for using our website and services.',
};

export default function TermsPage() {
  return (
    <>
      <AgeVerification />
      <GlobalMasthead />
      
      <div className="min-h-screen bg-white dark:bg-gray-950">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="dope-city-title text-5xl md:text-6xl mb-4">
              TERMS OF SERVICE
            </h1>
            <div className="w-24 h-1 bg-dope-orange-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300">
              Legal terms and conditions for using DOPE CITY
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">1. Acceptance of Terms</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <p>
                  By accessing and using the DOPE CITY website and services, you accept and agree to be 
                  bound by the terms and provision of this agreement. If you do not agree to abide by 
                  the above, please do not use this service.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">2. Age Verification and Eligibility</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <p>
                  You must be at least 21 years of age to use our services and purchase our products. 
                  By using this website, you represent and warrant that:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You are at least 21 years of age</li>
                  <li>You have the legal capacity to enter into this agreement</li>
                  <li>You will comply with all applicable laws and regulations</li>
                  <li>All information you provide is accurate and truthful</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">3. Products and Services</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <p>
                  DOPE CITY sells smoking accessories, glass pieces, vaporizers, and related products. 
                  All products are intended for legal use only.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Products are sold for tobacco and legal herb use only</li>
                  <li>We reserve the right to refuse service to anyone</li>
                  <li>Product availability and pricing are subject to change</li>
                  <li>We do not sell tobacco or controlled substances</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">4. Orders and Payment</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <p>
                  When you place an order, you agree to the following terms:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All orders are subject to acceptance and availability</li>
                  <li>Prices are in USD and subject to applicable taxes</li>
                  <li>Payment must be received before order processing</li>
                  <li>We reserve the right to cancel orders for any reason</li>
                  <li>You are responsible for providing accurate shipping information</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">5. Shipping and Delivery</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <p>
                  Shipping terms and conditions:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We ship to addresses within the United States only</li>
                  <li>Shipping times are estimates and not guaranteed</li>
                  <li>Risk of loss transfers to you upon delivery</li>
                  <li>We are not responsible for packages lost or stolen after delivery</li>
                  <li>Additional restrictions may apply to certain locations</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">6. Returns and Refunds</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <p>
                  Our return policy includes the following terms:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Returns must be initiated within 30 days of delivery</li>
                  <li>Items must be unused and in original packaging</li>
                  <li>Custom or personalized items cannot be returned</li>
                  <li>Return shipping costs are the customer's responsibility</li>
                  <li>Refunds will be processed to the original payment method</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">7. Prohibited Uses</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <p>
                  You may not use our website or services:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>For any unlawful purpose or to solicit unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations or laws</li>
                  <li>To transmit or procure the sending of any advertising or promotional material</li>
                  <li>To impersonate or attempt to impersonate the company or another user</li>
                  <li>To engage in any other conduct that restricts or inhibits anyone's use of the website</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">8. Intellectual Property</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <p>
                  The service and its original content, features, and functionality are and will remain 
                  the exclusive property of DOPE CITY and its licensors. The service is protected by 
                  copyright, trademark, and other laws.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">9. Disclaimer of Warranties</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <p>
                  The information on this website is provided on an "as is" basis. To the fullest extent 
                  permitted by law, this Company excludes all representations, warranties, conditions, 
                  and terms whether express or implied.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">10. Limitation of Liability</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <p>
                  In no event shall DOPE CITY, nor its directors, employees, partners, agents, suppliers, 
                  or affiliates, be liable for any indirect, incidental, special, consequential, or 
                  punitive damages arising out of your use of the service.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">11. Changes to Terms</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                  If a revision is material, we will try to provide at least 30 days notice prior to any 
                  new terms taking effect.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">12. Contact Information</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <p>
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                  <p><strong>Email:</strong> legal@dopecity.com</p>
                  <p><strong>Phone:</strong> 1-800-DOPE-CITY</p>
                  <p><strong>Mail:</strong> DOPE CITY Legal Department<br />
                  [Address to be added]</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}
