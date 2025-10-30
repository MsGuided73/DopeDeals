import { Metadata } from 'next';
import { Shield, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';
import GlobalMasthead from '../components/GlobalMasthead';

export const metadata: Metadata = {
  title: 'Age Verification - DOPE CITY',
  description: 'Age verification process and compliance information for DOPE CITY customers.',
};

export default function AgeVerificationPage() {
  return (
    <>
      <GlobalMasthead />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 relative">
        {/* Logo Background Watermark */}
        <div
          className="absolute inset-0 opacity-20 z-0 pointer-events-none"
          style={{
            backgroundImage: `url("https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/logo_Highway420-official_transparent.png")`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh'
          }}
        ></div>

        <div className="relative z-10">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-gray-900/95 via-black/95 to-gray-900/95 text-white py-16 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="dope-city-title text-5xl md:text-6xl mb-4">
              AGE VERIFICATION
            </h1>
            <div className="w-24 h-1 bg-dope-orange-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ensuring compliance and responsible access to our products
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12">
          
          {/* Age Requirement Notice */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 mb-12">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
              <h2 className="text-2xl font-bold text-red-800 dark:text-red-200">Important Notice</h2>
            </div>
            <p className="text-red-700 dark:text-red-300 text-lg">
              You must be <strong>21 years of age or older</strong> to access this website and purchase our products. 
              This requirement is strictly enforced in compliance with federal and state laws.
            </p>
          </div>

          {/* Why Age Verification */}
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Shield className="w-8 h-8 text-dope-orange-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Why We Verify Age</h2>
              </div>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  Age verification is a legal requirement for businesses selling smoking accessories and related products. 
                  We take this responsibility seriously to:
                </p>
                <ul className="space-y-2">
                  <li>• Comply with federal and state regulations</li>
                  <li>• Prevent underage access to our products</li>
                  <li>• Maintain our business licenses and permits</li>
                  <li>• Protect minors from age-restricted products</li>
                  <li>• Ensure responsible business practices</li>
                </ul>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Calendar className="w-8 h-8 text-dope-orange-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verification Process</h2>
              </div>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  Our age verification process is designed to be secure and straightforward:
                </p>
                <ul className="space-y-2">
                  <li>• Enter your date of birth</li>
                  <li>• Confirm you are 21 or older</li>
                  <li>• Accept our terms and conditions</li>
                  <li>• Verification is stored for your session</li>
                  <li>• Additional verification may be required at checkout</li>
                </ul>
              </div>
            </div>

          </div>

          {/* Verification Methods */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-12">
            <div className="flex items-center mb-6">
              <CheckCircle className="w-8 h-8 text-dope-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verification Methods</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-dope-orange-100 dark:bg-dope-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-dope-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Date of Birth</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Simple date entry to verify you meet the minimum age requirement
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-dope-orange-100 dark:bg-dope-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-dope-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">ID Verification</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  For certain purchases, we may require government-issued ID verification
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-dope-orange-100 dark:bg-dope-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-dope-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Account Verification</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Registered users maintain verified status for future visits
                </p>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Privacy & Security</h2>
            
            <div className="space-y-6 text-gray-600 dark:text-gray-300">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Data Protection</h3>
                <p className="mb-4">
                  We take the security of your personal information seriously. Your age verification data is:
                </p>
                <ul className="space-y-2">
                  <li>• Encrypted during transmission and storage</li>
                  <li>• Used solely for age verification purposes</li>
                  <li>• Not shared with third parties</li>
                  <li>• Stored securely in compliance with privacy laws</li>
                  <li>• Automatically deleted after the required retention period</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Your Rights</h3>
                <p className="mb-4">
                  You have the right to:
                </p>
                <ul className="space-y-2">
                  <li>• Know what information we collect and why</li>
                  <li>• Request access to your verification data</li>
                  <li>• Request correction of inaccurate information</li>
                  <li>• Request deletion of your data (subject to legal requirements)</li>
                  <li>• Opt-out of non-essential data processing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Legal Compliance */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Legal Compliance</h2>
            
            <div className="space-y-6 text-gray-600 dark:text-gray-300">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Federal Requirements</h3>
                <p>
                  Our age verification process complies with federal regulations governing the sale of 
                  smoking accessories and tobacco-related products. We maintain detailed records as 
                  required by law.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">State Regulations</h3>
                <p>
                  Different states may have varying requirements for age verification and product sales. 
                  We ensure compliance with the most restrictive applicable laws to maintain consistent 
                  standards across all jurisdictions.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Penalties for False Information</h3>
                <p>
                  Providing false age information is illegal and may result in:
                </p>
                <ul className="space-y-2 mt-2">
                  <li>• Immediate account termination</li>
                  <li>• Order cancellation and refund</li>
                  <li>• Permanent ban from our services</li>
                  <li>• Potential legal consequences</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-dope-orange-500 to-orange-600 rounded-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Questions About Age Verification?</h2>
            <p className="text-xl mb-6">
              Our compliance team is available to help with any age verification questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-dope-orange-500 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg transition-colors">
                Contact Compliance
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-dope-orange-500 px-8 py-3 rounded-lg font-bold text-lg transition-colors">
                View Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
