"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Package, Truck, Compass, CheckCircle2, MessageCircleQuestion } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [trackingNumber, setTrackingNumber] = useState('Pending Generation');

  useEffect(() => {
    // In a real scenario, we'd poll the backend or use the order ID to fetch 
    // the ShipStation tracking number once the webhook fulfills it.
    // For now, we simulate a tracking number if the order exists.
    if (orderId) {
      setTimeout(() => {
        setTrackingNumber(`VIP-${Math.floor(Math.random() * 100000000)}`);
      }, 2000);
    }
  }, [orderId]);

  if (!orderId) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4 text-white">Order Not Found</h1>
        <Link href="/" className="text-primary hover:underline">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:py-16 max-w-4xl">
      
      {/* Hero Success Banner */}
      <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-8 mb-8 text-center shadow-[0_0_30px_rgba(34,197,94,0.1)]">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl md:text-5xl font-bold font-heading uppercase tracking-widest text-white mb-2">Order Successful</h1>
        <p className="text-green-400 text-lg">Thank you for shopping with VIP Smoke. Your stash is secured.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Tracking & Shipping Details */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
             
             <h2 className="text-xl font-bold flex items-center gap-2 text-white mb-6 border-b border-zinc-800 pb-3">
               <Truck className="text-primary w-5 h-5" /> Shipping Status
             </h2>
             
             <div className="space-y-4">
               <div>
                 <p className="text-sm text-gray-400 mb-1">Tracking Number</p>
                 <div className="flex items-center justify-between bg-zinc-950 px-4 py-3 rounded-lg border border-zinc-800">
                   <span className="font-mono text-primary font-medium">{trackingNumber}</span>
                   {trackingNumber !== 'Pending Generation' && (
                     <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded">ShipStation</span>
                   )}
                 </div>
               </div>

               <div className="flex gap-4 items-start pt-2">
                 <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                   <Package className="w-5 h-5 text-gray-400" />
                 </div>
                 <div>
                   <p className="text-white font-medium">Preparing for Shipment</p>
                   <p className="text-sm text-gray-400">We are packing your order. Expected to ship within 24-48 hours.</p>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Order Info & Support */}
        <div className="space-y-6">
           <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
             <h2 className="text-xl font-bold flex items-center gap-2 text-white mb-6 border-b border-zinc-800 pb-3">
               <Compass className="text-primary w-5 h-5" /> Order Summary
             </h2>
             <div className="space-y-3 text-gray-300">
               <div className="flex justify-between">
                 <span className="text-gray-500">Order Reference:</span>
                 <span className="font-mono text-white">{orderId.split('-')[0]}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-gray-500">Date:</span>
                 <span className="text-white">{new Date().toLocaleDateString()}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-gray-500">Payment Status:</span>
                 <span className="text-green-500 font-medium">Paid</span>
               </div>
             </div>
           </div>

           <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg flex items-start gap-4 hover:border-zinc-700 transition-colors cursor-pointer" onClick={() => window.location.href = 'mailto:support@vipsmoke.com'}>
             <div className="p-3 bg-zinc-800 rounded-lg text-primary">
               <MessageCircleQuestion className="w-6 h-6" />
             </div>
             <div>
               <h3 className="text-white font-medium mb-1">Need Help?</h3>
               <p className="text-sm text-gray-400">Contact our support team if you need to change your address or have questions about this order.</p>
             </div>
           </div>
        </div>

      </div>

      <div className="mt-12 text-center">
        <Link 
          href="/products" 
          className="inline-block px-8 py-3 border border-zinc-700 hover:border-primary text-gray-300 hover:text-white rounded transition-colors"
        >
          Continue Shopping
        </Link>
      </div>

    </div>
  );
}
