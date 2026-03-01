import { ReactNode } from 'react';
import { requireAuthWithRedirect } from '../lib/auth-helpers';
import Link from 'next/link';
import { AccountNavBar } from '../../components/AccountNavBar';

export default async function AccountLayout({ children }: { children: ReactNode }) {
  // Require authentication with automatic redirect
  const user = await requireAuthWithRedirect();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Account Navigation Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-gray-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 sticky top-24">
              <div className="mb-8 px-2">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  My Account
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Welcome back, {user.user_metadata?.firstName || user.email?.split('@')[0]}
                </p>
              </div>

              <AccountNavBar userRole={user.role} />

            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            <div className="bg-gray-900 rounded-lg p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
