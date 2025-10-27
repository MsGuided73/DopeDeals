import { ReactNode } from 'react';
import { requireAuthWithRedirect } from '../lib/auth-helpers';
import GlobalMasthead from '../components/GlobalMasthead';
import Highway420Footer from '../../components/DopeCityFooter';
import Link from 'next/link';

export default async function OrdersLayout({ children }: { children: ReactNode }) {
  // Require authentication with automatic redirect
  const user = await requireAuthWithRedirect();

  return (
    <div className="min-h-screen bg-black text-white">
      <GlobalMasthead />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/account" className="hover:text-white">Account</Link>
            <span>/</span>
            <span className="text-white">Orders</span>
          </nav>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-6">
          {children}
        </div>
      </div>
      
      <Highway420Footer />
    </div>
  );
}
