"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Set the site-password cookie with 1-day expiration
      Cookies.set('site-password', password, { expires: 1, path: '/' });

      // Validate redirect URL - only redirect to valid routes, default to homepage
      let validRedirect = '/';

      // Only redirect to the original URL if it's not the login page or protected route
      if (redirectTo && redirectTo !== '/_protected/login' && redirectTo !== '/auth/login') {
        // Check if it's a valid route (starts with / and doesn't contain suspicious chars)
        if (redirectTo.startsWith('/') && !redirectTo.includes('..') && !redirectTo.includes('//')) {
          validRedirect = redirectTo;
        }
      }

      // Trigger a page refresh to let middleware verify the cookie, then redirect
      router.refresh();
      router.push(validRedirect);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Clear any existing error on password change
    if (error) {
      setError('');
    }
  }, [password]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden"
      style={{
        backgroundImage: `
          radial-gradient(circle at top, rgba(25, 255, 98, 0.1), transparent 70%),
          linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(25, 255, 98, 0.05) 100%)
        `,
        backgroundSize: '100% 100%, 100% 100%',
      }}
    >
      {/* Background glow effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-[#19ff62] rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#19ff62] rounded-full blur-2xl opacity-10"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl md:text-6xl font-black text-[#19ff62] mb-4 tracking-wider uppercase"
            style={{
              textShadow: '0 0 20px rgba(25, 255, 98, 0.8), 0 0 40px rgba(25, 255, 98, 0.4)',
              fontFamily: 'sans-serif',
            }}
          >
            HIGHWAY 420
          </h1>
          <p className="text-gray-300 text-sm md:text-base opacity-90">
            Authorized Access Only — Private Preview Mode
          </p>
        </div>

        {/* Login card */}
        <div
          className="backdrop-blur-md bg-black/70 border border-[#19ff62]/50 rounded-2xl p-8 shadow-2xl"
          style={{
            boxShadow: `
              0 0 30px rgba(25, 255, 98, 0.3),
              0 8px 32px rgba(0, 0, 0, 0.5),
              inset 0 1px 0 rgba(25, 255, 98, 0.1)
            `,
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password input */}
            <div>
              <label
                htmlFor="password"
                className="block text-gray-200 font-medium mb-2 text-sm"
              >
                Enter Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="
                  w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl
                  text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#19ff62]
                  focus:ring-1 focus:ring-[#19ff62]/60 focus:bg-black/80
                  transition-all duration-300 text-sm
                "
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
                placeholder="Enter access code"
                disabled={loading}
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full bg-[#19ff62] hover:bg-[#18e257] text-black font-bold py-3 px-4
                rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                text-sm uppercase tracking-wide
              "
              style={{
                boxShadow: '0 0 20px rgba(25, 255, 98, 0.55), 0 4px 12px rgba(0, 0, 0, 0.3)',
                textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)',
              }}
            >
              {loading ? 'ACCESSING...' : 'ACCESS HIGHWAY'}
            </button>
          </form>

          {/* Footer text */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-gray-400 text-xs opacity-75">
              This site is currently in private preview while we finalize inventory and pricing.
            </p>
            <a
              href="mailto:bensondc73@gmail.com?subject=Password Request: Highway 420"
              className="text-[#19ff62] hover:text-[#18e257] text-xs underline transition-colors duration-200"
            >
              Request Access
            </a>
          </div>
        </div>

        {/* Subtle branding at bottom */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-xs uppercase tracking-[0.2em]">
            Highway 420 Ventures
          </p>
        </div>
      </div>
    </div>
  );
}
