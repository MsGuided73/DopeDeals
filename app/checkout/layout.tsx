import { ReactNode } from 'react';
import { getSessionUser } from '@/lib/supabase-server-ssr';
import Link from 'next/link';

export default async function CheckoutLayout({ children }: { children: ReactNode }) {
  // Allow guest checkout: get user if they exist, but don't redirect if they don't
  const user = await getSessionUser().catch(() => null);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-white">Cart</Link>
            <span>/</span>
            <span className="text-white">Checkout</span>
          </nav>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Secure Checkout</h1>
            <p className="text-gray-400">
              Complete your order securely. Your information is protected with SSL encryption.
            </p>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}
