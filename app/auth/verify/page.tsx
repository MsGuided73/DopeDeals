'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import GlobalMasthead from '../../components/GlobalMasthead';

export default function AuthVerifyPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      // If user is already verified, send them to account
      if (user?.user_metadata?.age_verified) {
        router.replace('/account');
      } else {
        // Otherwise, send them to the main age verification flow
        router.replace('/age-verification');
      }
    }
  }, [user, authLoading, router]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <GlobalMasthead />
      <div className="flex flex-col items-center gap-6 p-8 text-center max-w-md">
        <div className="w-20 h-20 bg-dope-orange-500/20 rounded-full flex items-center justify-center border border-dope-orange-500/50 animate-pulse">
          <Shield className="w-10 h-10 text-dope-orange-500" />
        </div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">
          Verifying <span className="text-dope-orange-500">Access</span>
        </h1>
        <p className="text-zinc-400 font-medium leading-relaxed">
          One moment while we prepare your secure age verification session...
        </p>
        <Loader2 className="w-8 h-8 text-dope-orange-500 animate-spin mt-4" />
      </div>
    </div>
  );
}
