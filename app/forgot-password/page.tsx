import { Suspense } from 'react';
import ForgotPasswordForm from './ForgotPasswordForm';
import GlobalMasthead from '../components/GlobalMasthead';

export const metadata = {
  title: 'Forgot Password | Highway 420',
  description: 'Reset your Highway 420 account password. Enter your email to receive reset instructions.',
  keywords: 'forgot password, reset password, account recovery, highway 420',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-fira-heading">
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
                  Password Reset
                </h1>
                <p className="text-xl text-green-100 leading-relaxed">
                  Enter your email address and we'll send you a link to reset your password
                </p>
              </div>

              <div className="space-y-4 text-green-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span>Secure password reset process</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span>Instant email delivery</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span>24/7 support available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Forgot Password Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-md space-y-8">
              <div className="text-center lg:hidden">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Password Reset
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter your email to reset your password
                </p>
              </div>

              <ForgotPasswordForm />
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
