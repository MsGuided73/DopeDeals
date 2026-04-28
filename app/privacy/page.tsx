import { Metadata } from 'next';
import GlobalMasthead from '../components/GlobalMasthead';
import GlobalBreadcrumbs from '../components/GlobalBreadcrumbs';

export const metadata: Metadata = {
  title: 'Privacy Policy - Highway 420',
  description: 'Highway 420 Privacy Policy - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <>
      <GlobalMasthead />
      
      <div className="min-h-screen bg-white dark:bg-gray-950">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="mb-8 flex justify-start">
              <GlobalBreadcrumbs paths={[{ name: 'Privacy Policy' }]} />
            </div>
            <h1 className="text-5xl md:text-6xl mb-4 font-sans">
              PRIVACY POLICY
            </h1>
            <div className="w-24 h-1 bg-dope-orange-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 font-sans">
              Your privacy and data security are our top priorities
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
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white font-sans">1. Information We Collect</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <p>
                  We collect information you provide directly to us, such as when you create an account, 
                  make a purchase, or contact us for support.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white font-sans">Personal Information:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name, email address, phone number</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information (processed securely by our payment processors)</li>
                  <li>Age verification information</li>
                  <li>Account preferences and settings</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white font-sans">Usage Information:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Pages visited, products viewed, search queries</li>
                  <li>Device information, IP address, browser type</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white font-sans">2. How We Use Your Information</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process and fulfill your orders</li>
                  <li>Provide customer service and support</li>
                  <li>Verify age and comply with legal requirements</li>
                  <li>Send order confirmations and shipping updates</li>
                  <li>Improve our website and services</li>
                  <li>Send promotional emails (with your consent)</li>
                  <li>Prevent fraud and ensure security</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white font-sans">3. Information Sharing</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <p>
                  We do not sell, trade, or rent your personal information to third parties. 
                  We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Service Providers:</strong> Payment processors, shipping companies, and other service providers</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>Consent:</strong> When you explicitly consent to sharing</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white font-sans">4. Data Security</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure payment processing</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to personal information</li>
                  <li>Employee training on data protection</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white font-sans">5. Your Rights</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access and review your personal information</li>
                  <li>Correct inaccurate or incomplete information</li>
                  <li>Delete your account and personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request data portability</li>
                  <li>Object to certain processing activities</li>
                </ul>
                <p>
                  To exercise these rights, please contact us at privacy@dopecity.com
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white font-sans">6. Cookies and Tracking</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <p>
                  We use cookies and similar technologies to enhance your experience:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand website usage</li>
                  <li><strong>Marketing Cookies:</strong> Used for personalized advertising</li>
                </ul>
                <p>
                  You can control cookie settings through your browser preferences.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white font-sans">7. Age Verification</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <p>
                  Our products are intended for adults only. We collect and verify age information 
                  to comply with applicable laws and regulations. This information is stored securely 
                  and used solely for compliance purposes.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white font-sans">8. Changes to This Policy</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any 
                  material changes by posting the new policy on our website and updating the 
                  "Last updated" date.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white font-sans">9. Contact Us</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <p>
                  If you have any questions about this Privacy Policy or our data practices, 
                  please contact us:
                </p>
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                  <p><strong>Email:</strong> bmbwholesale2025@gmail.com</p>
                  <p><strong>Phone:</strong> (626) 656-6287</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}
