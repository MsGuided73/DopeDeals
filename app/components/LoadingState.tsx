'use client';

import { useEffect, useState } from 'react';

interface LoadingStateProps {
  loading: boolean;
  onRetry?: () => void;
  timeout?: number;
  children?: React.ReactNode;
}

export default function LoadingState({
  loading,
  onRetry,
  timeout = 10000,
  children
}: LoadingStateProps) {
  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setShowRetry(true);
      }, timeout);

      return () => clearTimeout(timer);
    } else {
      setShowRetry(false);
    }
  }, [loading, timeout]);

  if (!loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {children || (
          <>
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dope-orange-500 mx-auto mb-8"></div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Loading...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we fetch the latest products
            </p>
          </>
        )}

        {showRetry && onRetry && (
          <div className="mt-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              This is taking longer than expected
            </p>
            <button
              onClick={onRetry}
              className="px-6 py-2 bg-dope-orange-500 text-white rounded-lg hover:bg-dope-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
