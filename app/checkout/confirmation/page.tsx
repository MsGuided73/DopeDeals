"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (!orderId) {
      router.push('/checkout/failed?reason=missing_order');
    }
  }, [orderId, router]);

  const handleResendEmail = async () => {
    setIsSendingEmail(true);
    try {
      // Setup the actual Resend interaction endpoint when email API is ready
      // const res = await fetch(`/api/email/resend?orderId=${orderId}`);
      // if (!res.ok) throw new Error('Failed to send');
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEmailSent(true);
      toast.success('Confirmation email resent successfully!');
    } catch (error) {
      toast.error('Failed to resend email. Please try again later.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const proceedToSuccess = () => {
    router.push(`/checkout/success?orderId=${orderId}`);
  };

  if (!orderId) {
    return <div className="flex justify-center items-center my-32"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
      </div>
      
      <h1 className="text-4xl font-bold mb-4 font-heading tracking-widest uppercase text-white">Payment Processing...</h1>
      <p className="text-gray-400 mb-8 text-lg">
        Your payment has been handed off successfully. We are awaiting final confirmation from the merchant.
      </p>

      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl shadow-2xl mb-8 text-left space-y-4">
         <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-2">Order Details</h2>
         <p className="text-gray-300"><span className="font-semibold text-white">Order ID:</span> {orderId}</p>
         <p className="text-gray-300">A receipt is being prepared and will be sent to the email provided during shipping.</p>
         
         <div className="pt-4 mt-4 border-t border-zinc-800 flex items-center gap-4">
            <button 
              onClick={handleResendEmail} 
              disabled={isSendingEmail || emailSent}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded transition-colors text-sm disabled:opacity-50"
            >
              {isSendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              {emailSent ? 'Email Sent' : 'Resend Email Receipt'}
            </button>
         </div>
      </div>

      <button 
        onClick={proceedToSuccess}
        className="px-8 py-3 bg-primary text-white font-bold uppercase tracking-widest rounded transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]"
      >
        View Final Order Status
      </button>

    </div>
  );
}
