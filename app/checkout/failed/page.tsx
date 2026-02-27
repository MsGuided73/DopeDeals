"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertTriangle, RefreshCcw, Home, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function FailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawReason = searchParams.get('reason');
  
  const [errorMessage, setErrorMessage] = useState('');
  const [retryPath, setRetryPath] = useState('');

  useEffect(() => {
    // Map common error reasons to user-friendly messages and appropriate retry paths
    switch (rawReason) {
      case 'declined':
        setErrorMessage('Your payment was declined by your bank or card issuer. Please check your card details or try a different payment method.');
        setRetryPath('/checkout/review'); // Send them back to the review/payment form
        break;
      case 'insufficient_funds':
        setErrorMessage('Your card has insufficient funds to cover the transaction.');
        setRetryPath('/checkout/review');
        break;
      case 'fraud_suspected':
        setErrorMessage('This transaction was flagged by our security systems. Please try a different card or contact support.');
        setRetryPath('/checkout/review');
        break;
      case 'missing_order':
        setErrorMessage('We could not locate the associated order session. Please start your checkout process again.');
        setRetryPath('/checkout/shipping');
        break;
      case 'stock_unavailable':
        setErrorMessage('One or more items in your cart just went out of stock. Please review your cart.');
        setRetryPath('/cart');
        break;
      case 'validation_failed':
        setErrorMessage('There was a problem validating your address or payment format. Please double check your entries.');
        setRetryPath('/checkout/shipping');
        break;
      default:
        setErrorMessage('An unexpected error occurred while processing your payment. Your card has not been charged.');
        setRetryPath('/checkout/review');
        break;
    }
  }, [rawReason]);

  return (
    <div className="container mx-auto px-4 py-16 lg:py-24 max-w-3xl text-center">
      
      <div className="flex justify-center mb-8">
        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold font-heading uppercase tracking-widest text-white mb-6">Payment Failed</h1>
      
      <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-6 md:p-8 mb-10 max-w-2xl mx-auto shadow-lg">
        <p className="text-red-200 text-lg leading-relaxed">
          {errorMessage}
        </p>
        <p className="text-sm text-red-300/60 mt-4">
          Error Code: <span className="font-mono">{rawReason?.toUpperCase() || 'UNKNOWN_TRANSACTION_ERROR'}</span>
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        
        <button 
          onClick={() => router.push(retryPath || '/checkout/review')}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest rounded transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]"
        >
          <RefreshCcw className="w-5 h-5" /> Try Again
        </button>

        <Link 
          href="/cart"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 border border-zinc-700 hover:bg-zinc-800 text-gray-300 rounded transition-colors"
        >
          <ShoppingCart className="w-5 h-5" /> Return to Cart
        </Link>
        
      </div>

      <p className="text-gray-500 text-sm mt-12">
        Need assistance? Please <a href="mailto:support@vipsmoke.com" className="text-primary hover:underline">contact our support team</a> and provide the error code above.
      </p>

    </div>
  );
}
