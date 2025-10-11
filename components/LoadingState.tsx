'use client';

import { useState, useEffect } from 'react';
import { siteMonitor } from '../lib/site-monitor';

interface LoadingStateProps {
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
  timeout?: number; // Auto-retry after timeout
}

export default function LoadingState({
  loading,
  error,
  onRetry,
  children,
  timeout = 10000 // 10 seconds default
}: LoadingStateProps) {
  const [showTimeout, setShowTimeout] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (loading && timeout > 0) {
      timeoutId = setTimeout(() => {
        setShowTimeout(true);
        siteMonitor.reportError({
          error: `Loading timeout after ${timeout}ms`,
          severity: 'medium',
          url: window.location.href
        });
      }, timeout);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [loading, timeout]);

  const handleRetry = () => {
    setShowTimeout(false);
    setRetryCount(prev => prev + 1);
    onRetry?.();
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="mb-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to Load Content
          </h2>

          <p className="text-gray-600 mb-6">
            {error || 'Something went wrong while loading the content. Please try again.'}
          </p>

          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-dope-orange hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>

            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Go Home
            </button>
          </div>

          {retryCount > 0 && (
            <p className="text-sm text-gray-500 mt-4">
              Retry attempts: {retryCount}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="mb-4">
            <div className="mx-auto flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-dope-orange border-t-transparent"></div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Content
          </h2>

          <p className="text-gray-600 mb-4">
            Please wait while we load the content for you...
          </p>

          {showTimeout && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 text-sm">
                Taking longer than expected? Our team has been notified.
              </p>
              <button
                onClick={handleRetry}
                className="mt-2 text-yellow-600 hover:text-yellow-800 font-medium text-sm"
              >
                Try Again
              </button>
            </div>
          )}

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-dope-orange h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Hook for handling loading states with automatic error detection
export function useLoadingState(initialLoading = false) {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);

  const startLoading = () => {
    setLoading(true);
    setError(null);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const setLoadingError = (errorMessage: string) => {
    setLoading(false);
    setError(errorMessage);

    // Report to monitoring system
    siteMonitor.reportError({
      error: errorMessage,
      severity: 'medium',
      url: window.location.href
    });
  };

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setLoadingError
  };
}
