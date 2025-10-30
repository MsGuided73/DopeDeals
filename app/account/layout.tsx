import { ReactNode } from 'react';
import { requireAuthWithRedirect } from '../lib/auth-helpers';
import Link from 'next/link';

export default async function AccountLayout({ children }: { children: ReactNode }) {
  // Require authentication with automatic redirect
  const user = await requireAuthWithRedirect();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Account Navigation Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-2">My Account</h2>
                <p className="text-gray-400 text-sm">
                  Welcome back, {user.user_metadata?.firstName || user.email?.split('@')[0]}
                </p>
              </div>

              <nav className="space-y-2">
                <Link
                  href="/account"
                  className="block px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  Account Overview
                </Link>
                <Link
                  href="/orders"
                  className="block px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  Order History
                </Link>
                <Link
                  href="/profile"
                  className="block px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  Profile Settings
                </Link>
                <Link
                  href="/payment-methods"
                  className="block px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  Payment Methods
                </Link>
                <Link
                  href="/wishlist"
                  className="block px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  Wishlist
                </Link>
                <Link
                  href="/rewards"
                  className="block px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  VIP Rewards
                </Link>

                {/* Admin link for admin users */}
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="block px-4 py-2 rounded-lg text-orange-400 hover:bg-orange-900 hover:text-orange-300 transition-colors border-t border-gray-700 mt-4 pt-4"
                  >
                    Admin Panel
                  </Link>
                )}
              </nav>
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
