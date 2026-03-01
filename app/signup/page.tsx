import { Suspense } from 'react';
import SignUpForm from './SignUpForm';
import GlobalMasthead from '../components/GlobalMasthead';

export const metadata = {
  title: 'Sign Up | Highway 420',
  description: 'Create your Highway 420 account to access exclusive deals, track orders, and get personalized recommendations.',
  keywords: 'signup, register, account, highway 420, cannabis, smoking accessories',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Universal Layout Components */}
      <GlobalMasthead />

      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dope-orange-500"></div>
        </div>
      }>
        <div className="flex min-h-screen">
          {/* Left side - Branding */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-green-700 to-green-800 p-12 flex-col justify-center">
            <div className="max-w-md mx-auto text-center">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-4">
                  Join Highway 420
                </h1>
                <p className="text-xl text-green-100 leading-relaxed">
                  Create your account and unlock exclusive access to premium products and deals
                </p>
              </div>

              <div className="space-y-6 text-green-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span>Free shipping on orders over $75</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span>Early access to new products</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span>VIP rewards and exclusive discounts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span>Personalized product recommendations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Sign Up Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-md space-y-8">
              <div className="text-center lg:hidden">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Create Account
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Join Highway 420 today
                </p>
              </div>

              <SignUpForm />
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
