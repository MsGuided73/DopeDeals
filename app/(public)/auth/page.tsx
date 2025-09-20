"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '../../lib/supabase-browser';
import Link from 'next/link';
import GlobalMasthead from '../../components/GlobalMasthead';
import AgeVerification from '../../components/AgeVerification';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Check if user is already authenticated and redirect
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (user) {
        router.push('/');
      }
    };
    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // User successfully signed in, redirect to home
          setTimeout(() => {
            router.push('/');
          }, 1500);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  async function signIn() {
    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabaseBrowser.auth.signInWithPassword({ email, password });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        const firstName = data.user?.user_metadata?.firstName || data.user?.email?.split('@')[0];
        setMessage(`Welcome back, ${firstName}! 👋`);
        // The auth state listener will handle the redirect
      }

      setLoading(false);
    } catch (error) {
      setMessage('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }

  async function signUp() {
    setLoading(true);
    setMessage(null);

    if (!firstName.trim() || !lastName.trim()) {
      setMessage('Please enter your first and last name');
      setLoading(false);
      return;
    }

    const { data, error } = await supabaseBrowser.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          fullName: `${firstName.trim()} ${lastName.trim()}`
        }
      }
    });

    if (error) setMessage(error.message);
    else setMessage(`Welcome ${firstName}! Check your email to confirm your account. 📧`);
    setLoading(false);
  }

  async function signOut() {
    setLoading(true);
    setMessage(null);
    const { error } = await supabaseBrowser.auth.signOut();
    if (error) setMessage(error.message);
    else setMessage('See you later! 👋');
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      await signUp();
    } else {
      await signIn();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Custom CSS for glow animation */}
      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.02);
          }
        }
        .animate-pulse-glow::before {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Age Verification Popup */}
      <AgeVerification />

      {/* Universal Layout Components */}
      <GlobalMasthead />

      {/* Main Content */}
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8 relative animate-pulse-glow">
          {/* Animated Orange Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-dope-orange via-orange-400 to-dope-orange rounded-lg blur-sm opacity-30 animate-pulse"></div>
          <div className="relative bg-white rounded-lg p-8 -m-8">
          <div className="text-center mb-8">
            <h1 className="dope-city-title text-4xl text-black mb-2 uppercase">
              {isSignUp ? 'Join DOPE CITY' : 'Welcome Back'}
            </h1>
            <p className="text-gray-600">
              {isSignUp
                ? 'Create your account to get personalized recommendations'
                : 'Sign in to your account'
              }
            </p>
          </div>

          {message && (
            <div className={`p-4 rounded-lg text-sm mb-6 ${
              message.includes('error') || message.includes('Error')
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    placeholder="First name"
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-dope-orange transition-colors disabled:opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    placeholder="Last name"
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-dope-orange transition-colors disabled:opacity-50"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-dope-orange transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-dope-orange transition-colors disabled:opacity-50"
              />
              {isSignUp && (
                <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-dope-orange hover:bg-orange-600 text-black font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="text-center pt-6 border-t border-gray-200 mt-8">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-gray-600 hover:text-dope-orange transition-colors"
              disabled={loading}
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </button>
          </div>

          {/* Sign Out Button - Only show if user might be logged in */}
          <div className="text-center pt-4">
            <button
              onClick={signOut}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              Sign Out
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

