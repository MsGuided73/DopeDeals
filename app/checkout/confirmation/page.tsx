"use client";

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Loader2, XCircle, Mail } from 'lucide-react';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<'processing' | 'success' | 'failed' | 'resending'>('processing');
  const [errorReason, setErrorReason] = useState('');
  const [resent, setResent] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    // KajaPay redirects back with these query params after hosted payment
    const status = searchParams.get('status');           // 'approved' | 'declined' | 'cancelled'
    const kajaPayTxId = searchParams.get('transactionId') || searchParams.get('transaction_id');
    const referenceNumber = searchParams.get('referenceNumber') || searchParams.get('reference_number');
    const orderId = searchParams.get('orderId') || searchParams.get('order_id') || sessionStorage.getItem('pendingOrderId');
    const responseCode = searchParams.get('responseCode') || searchParams.get('response_code');

    if (!orderId) {
      // No order context — likely a direct page visit
      setState('failed');
      setErrorReason('No order found. Please return to the cart and try again.');
      return;
    }

    if (!status) {
      // Params missing — something went wrong on redirect
      setState('failed');
      setErrorReason('Payment result unknown. Contact support with your order details.');
      return;
    }

    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus === 'approved' || normalizedStatus === 'success') {
      // Confirm the payment server-side
      confirmPayment(orderId, kajaPayTxId, referenceNumber, responseCode);
    } else if (normalizedStatus === 'cancelled') {
      // User cancelled — go back to review
      router.replace('/checkout/review');
    } else {
      // Declined or unknown
      setState('failed');
      setErrorReason(responseCode ? `Payment declined (code: ${responseCode}). Please try a different card.` : 'Payment declined. Please try again.');
    }
  }, [searchParams, router]);

  async function confirmPayment(
    orderId: string,
    transactionId: string | null,
    referenceNumber: string | null,
    responseCode: string | null
  ) {
    try {
      const res = await fetch('/api/checkout/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, transactionId, referenceNumber, responseCode, status: 'approved' }),
      });

      if (res.ok) {
        // Clear session storage and send to success
        sessionStorage.removeItem('pendingOrderId');
        sessionStorage.removeItem('checkoutData');
        router.replace(`/checkout/success?orderId=${orderId}`);
      } else {
        const data = await res.json().catch(() => ({}));
        setState('failed');
        setErrorReason(data.error || 'Failed to confirm payment. Your card may have been charged — please contact support.');
      }
    } catch {
      setState('failed');
      setErrorReason('Network error while confirming payment. Please contact support immediately.');
    }
  }

  async function handleResend() {
    const orderId = searchParams.get('orderId') || searchParams.get('order_id') || sessionStorage.getItem('pendingOrderId');
    if (!orderId) return;
    setState('resending');
    await fetch('/api/orders/resend-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });
    setResent(true);
    setState('failed'); // keep on page
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center space-y-6">

        {state === 'processing' && (
          <>
            <Loader2 className="mx-auto w-14 h-14 text-green-500 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900">Confirming Your Payment</h1>
            <p className="text-gray-500 text-sm">Please wait — we&apos;re verifying your transaction with KajaPay...</p>
          </>
        )}

        {state === 'resending' && (
          <>
            <Loader2 className="mx-auto w-14 h-14 text-blue-500 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900">Resending Confirmation</h1>
          </>
        )}

        {state === 'success' && (
          <>
            <CheckCircle className="mx-auto w-14 h-14 text-green-500" />
            <h1 className="text-2xl font-bold text-gray-900">Payment Confirmed!</h1>
            <p className="text-gray-500 text-sm">Redirecting you to your order summary...</p>
          </>
        )}

        {state === 'failed' && (
          <>
            <XCircle className="mx-auto w-14 h-14 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">Payment Issue</h1>
            <p className="text-gray-600 text-sm leading-relaxed">{errorReason}</p>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => router.push('/checkout/review')}
                className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
              >
                Try Again
              </button>
              {!resent && (
                <button
                  onClick={handleResend}
                  className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Resend Confirmation Email
                </button>
              )}
              {resent && (
                <p className="text-green-600 text-sm font-medium">Confirmation email sent!</p>
              )}
              <a
                href="mailto:support@highway420store.com"
                className="text-sm text-gray-400 hover:text-gray-600 transition"
              >
                Contact Support
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <Loader2 className="w-14 h-14 text-green-500 animate-spin" />
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
