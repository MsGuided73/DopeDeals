import { Metadata } from 'next';
import AgeVerification from '../components/AgeVerification';
import GlobalMasthead from '../components/GlobalMasthead';

export const metadata: Metadata = {
  title: 'Terms & Conditions - Highway 420',
  description: 'Highway 420 Terms & Conditions - Legal terms and conditions for using our website and purchasing our products.',
};

export default function TermsAndConditionsPage() {
  return (
    <>
      <AgeVerification />
      <GlobalMasthead />

      <div className="min-h-screen bg-white dark:bg-gray-950">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="dope-city-title text-5xl md:text-6xl mb-4">
              TERMS & CONDITIONS
            </h1>
            <div className="w-24 h-1 bg-dope-orange-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300">
              Legal terms and conditions for using Highway 420
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Last updated: November 15, 2025
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
                  By accessing, browsing, or using Highway 420, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions and our Privacy Policy. These Terms constitute a legally binding agreement between you and Highway 420.
                </p>
                <p>
                  If you do not agree to these Terms, please do not use our Platform.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">2. Age Restrictions & Eligibility</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <h3 className="text-xl font-semibold mb-3">Age Verification</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You must be at least 21 years old to access or use our Platform.</li>
                  <li>You must be at least 21 years old and a legal resident of a state where cannabis products are legal for recreational or medical use.</li>
                  <li>Highway 420 reserves the right to verify your age and location at any time.</li>
                  <li>False representation of your age or location may result in immediate termination of your account and access to our services.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Medical vs. Recreational Use</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Our products are intended for adult recreational use only, unless otherwise specified.</li>
                  <li>We do not provide medical advice or recommendations.</li>
                  <li>Consult with a qualified healthcare professional before using any cannabis products, especially if you have medical conditions or are taking medications.</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">3. Product Information & Disclaimers</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <h3 className="text-xl font-semibold mb-3">Product Descriptions</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We strive to provide accurate product descriptions, however, slight variations may occur due to natural variations in cannabis products.</li>
                  <li>Product images are for illustrative purposes only and may not exactly match the delivered product.</li>
                  <li>THC/CBD content percentages are estimates based on lab testing and may vary.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Health & Safety Disclaimers</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Cannabis products may impair your ability to drive or operate machinery.</li>
                  <li>Do not consume cannabis products if you are pregnant, breastfeeding, or have certain medical conditions.</li>
                  <li>Keep all cannabis products out of reach of children and pets.</li>
                  <li>Highway 420 is not responsible for any adverse effects from product use.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Legal Compliance</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All products sold comply with applicable federal and state laws.</li>
                  <li>It is your responsibility to ensure compliance with local laws regarding cannabis products.</li>
                  <li>Highway 420 does not ship to states or localities where cannabis products are illegal.</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">4. Account Registration & Security</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <h3 className="text-xl font-semibold mb-3">Account Creation</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You may need to create an account to place orders or access certain features.</li>
                  <li>You agree to provide accurate, current, and complete information during registration.</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                  <li>You are responsible for all activities that occur under your account.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Account Termination</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Highway 420 reserves the right to suspend or terminate your account at any time for violations of these Terms.</li>
                  <li>You may terminate your account at any time by contacting customer support.</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">5. Ordering & Payment</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <h3 className="text-xl font-semibold mb-3">Order Acceptance</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All orders are subject to acceptance and availability.</li>
                  <li>We reserve the right to refuse or cancel any order for any reason, including but not limited to product availability, errors in product information, or payment issues.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Pricing & Payment</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All prices are subject to change without notice.</li>
                  <li>Payment must be made in full at the time of order.</li>
                  <li>We accept major credit cards, debit cards, and other payment methods as indicated on our Platform.</li>
                  <li>You authorize us to charge your payment method for all amounts due.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Taxes</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Prices do not include applicable taxes, which will be added at checkout.</li>
                  <li>You are responsible for all applicable taxes and fees.</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">6. Shipping & Delivery</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <h3 className="text-xl font-semibold mb-3">Shipping Restrictions</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We only ship to addresses within states where cannabis products are legal for recreational or medical use.</li>
                  <li>We do not ship internationally or to certain restricted areas.</li>
                  <li>Delivery addresses must be verified and match your billing address or be pre-approved.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Delivery Times</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Delivery times are estimates only and are not guaranteed.</li>
                  <li>Factors such as weather, carrier delays, or regulatory requirements may affect delivery times.</li>
                  <li>We are not responsible for delays caused by carriers or regulatory agencies.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Shipping Costs</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Shipping costs are calculated based on order weight, distance, and delivery method.</li>
                  <li>Free shipping may be available for orders over a certain amount, as specified on our Platform.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Delivery Verification</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All deliveries require age verification by the carrier.</li>
                  <li>You must be present and provide valid government-issued ID to receive delivery.</li>
                  <li>If you are not available for delivery, additional fees may apply for redelivery.</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">7. Returns & Refunds</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <h3 className="text-xl font-semibold mb-3">Return Policy</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Due to the nature of cannabis products, returns are generally not accepted except in cases of damaged or incorrect items.</li>
                  <li>All return requests must be initiated within 7 days of delivery.</li>
                  <li>Products must be in original packaging and unopened.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Refund Process</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Refunds will be processed within 5-10 business days after approval.</li>
                  <li>Refunds will be issued to the original payment method.</li>
                  <li>Shipping costs are non-refundable unless the return is due to our error.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Damaged or Incorrect Items</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>If you receive damaged or incorrect items, contact us immediately with photos and order details.</li>
                  <li>We will arrange for replacement or refund at our discretion.</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">8. Prohibited Uses & Conduct</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <p>You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the Platform for any illegal purpose or in violation of any laws</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with the proper functioning of the Platform</li>
                  <li>Upload or transmit harmful code, viruses, or malicious content</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Impersonate any person or entity</li>
                  <li>Use automated tools to access the Platform without permission</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">9. Intellectual Property</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <h3 className="text-xl font-semibold mb-3">Our Content</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All content on the Platform, including text, graphics, logos, images, and software, is owned by Highway 420 or our licensors.</li>
                  <li>You may not copy, modify, distribute, or create derivative works without our written permission.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">User Content</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>By posting content on our Platform, you grant us a non-exclusive, royalty-free license to use, modify, and distribute your content.</li>
                  <li>You represent that you own or have rights to any content you post.</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">10. Privacy & Data Protection</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your privacy is important to us. Please review our Privacy Policy for details on how we collect, use, and protect your information.</li>
                  <li>By using our Platform, you consent to our collection and use of your information as described in our Privacy Policy.</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">11. Disclaimers & Limitation of Liability</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <h3 className="text-xl font-semibold mb-3">Service Disclaimers</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The Platform is provided "as is" without warranties of any kind.</li>
                  <li>We do not guarantee the accuracy, completeness, or reliability of any content on the Platform.</li>
                  <li>We reserve the right to modify or discontinue the Platform at any time.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Limitation of Liability</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Highway 420 shall not be liable for any indirect, incidental, special, or consequential damages.</li>
                  <li>Our total liability shall not exceed the amount paid by you for the specific product or service in question.</li>
                  <li>Some jurisdictions do not allow limitation of liability, so these limitations may not apply to you.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Indemnification</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You agree to indemnify and hold Highway 420 harmless from any claims, damages, or expenses arising from your use of the Platform or violation of these Terms.</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">12. Cannabis-Specific Terms</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <h3 className="text-xl font-semibold mb-3">Product Quality & Testing</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All products are lab-tested for potency and contaminants where required by law.</li>
                  <li>Test results are available upon request for compliant products.</li>
                  <li>Product quality may vary due to natural factors.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Regulatory Compliance</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We comply with all applicable cannabis regulations and licensing requirements.</li>
                  <li>Product availability may change based on regulatory changes.</li>
                  <li>We reserve the right to modify product offerings based on legal requirements.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Medical Claims</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>No products are intended to diagnose, treat, cure, or prevent any disease.</li>
                  <li>All health-related claims are prohibited by law.</li>
                  <li>Consult healthcare professionals for medical advice.</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">13. Third-Party Links & Services</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Our Platform may contain links to third-party websites or services.</li>
                  <li>We are not responsible for the content, privacy policies, or practices of third-party sites.</li>
                  <li>Your use of third-party services is subject to their respective terms and conditions.</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">14. Modifications to Terms</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <ul className="list-disc pl-6 space-y-2">
                  <li>We reserve the right to modify these Terms at any time.</li>
                  <li>Changes will be effective immediately upon posting on the Platform.</li>
                  <li>Your continued use of the Platform after changes constitutes acceptance of the modified Terms.</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">15. Governing Law & Dispute Resolution</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <h3 className="text-xl font-semibold mb-3">Governing Law</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>These Terms are governed by the laws of the State of California, without regard to conflict of law principles.</li>
                  <li>Any disputes arising from these Terms shall be resolved in the courts of California.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Dispute Resolution</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We encourage you to contact us first to resolve any disputes informally.</li>
                  <li>For disputes over $10,000, binding arbitration may be required.</li>
                  <li>Class action waivers may apply as permitted by law.</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">16. Severability & Entire Agreement</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <ul className="list-disc pl-6 space-y-2">
                  <li>If any provision of these Terms is found to be unenforceable, the remaining provisions shall remain in effect.</li>
                  <li>These Terms, together with our Privacy Policy, constitute the entire agreement between you and Highway 420.</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">17. Contact Information</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <p>If you have questions about these Terms, please contact us:</p>
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg mt-4">
                  <p><strong>Website:</strong> https://highway420store.com</p>
                  <p><strong>Email:</strong> support@highway420store.com</p>
                  <p><strong>Phone:</strong> 1-800-HIGHWAY (subject to availability)</p>
                  <p><strong>Address:</strong></p>
                  <p>BMB Wholesale, Inc</p>
                  <p>10 Manor Pkwy</p>
                  <p>Salem, NH 03079</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">18. Acknowledgment</h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <p>
                  By using Highway 420, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. You also acknowledge that cannabis use is subject to legal restrictions and that you are responsible for complying with all applicable laws.
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}
