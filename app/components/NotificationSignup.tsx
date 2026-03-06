"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Mail, MessageSquare, Check, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  orderId?: string;
  initialEmail?: string;
  initialPhone?: string;
}

export default function NotificationSignup({ orderId, initialEmail = '', initialPhone = '' }: Props) {
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [subscribeEmail, setSubscribeEmail] = useState(true);
  const [subscribeSms, setSubscribeSms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!email && subscribeEmail) {
      toast.error('Please enter an email address');
      return;
    }
    if (!phone && subscribeSms) {
      toast.error('Please enter a phone number');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/account/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          email,
          phone,
          subscribeEmail,
          subscribeSms
        })
      });

      if (res.ok) {
        setSaved(true);
        toast.success('Notification preferences saved');
      } else {
        toast.error('Failed to save preferences');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (saved) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-500/10 border border-green-500/20 rounded-3xl p-8 flex flex-col items-center text-center gap-4"
      >
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
          <Check className="w-6 h-6 text-white" />
        </div>
        <div>
          <h4 className="text-xl font-display-twilight italic tracking-widest text-white uppercase">Stay Synced</h4>
          <p className="text-white/40 text-xs mt-1 uppercase tracking-widest">You'll receive updates via {subscribeEmail && 'Email'}{subscribeEmail && subscribeSms && ' & '}{subscribeSms && 'SMS'}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 text-left relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
        <Bell className="w-32 h-32 text-white" />
      </div>

      <div className="relative z-10 space-y-8">
        <div>
          <h3 className="text-2xl font-display-twilight italic tracking-widest text-white uppercase">Real-Time Updates</h3>
          <p className="text-white/50 text-sm mt-2">Get notified about your shipment, lab tests, and exclusive drops.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Email Signup */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-green-500" />
                <span className="text-xs font-black uppercase tracking-[0.2em]">Email Alerts</span>
              </div>
              <button 
                onClick={() => setSubscribeEmail(!subscribeEmail)}
                className={`w-10 h-6 rounded-full transition-all relative ${subscribeEmail ? 'bg-green-500' : 'bg-white/10'}`}
              >
                <motion.div 
                  animate={{ x: subscribeEmail ? 18 : 2 }}
                  className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-lg"
                />
              </button>
            </div>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:border-green-500/50 focus:outline-none transition-colors placeholder:text-white/20"
            />
          </div>

          {/* SMS Signup */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <span className="text-xs font-black uppercase tracking-[0.2em]">SMS Updates</span>
              </div>
              <button 
                onClick={() => setSubscribeSms(!subscribeSms)}
                className={`w-10 h-6 rounded-full transition-all relative ${subscribeSms ? 'bg-blue-500' : 'bg-white/10'}`}
              >
                <motion.div 
                  animate={{ x: subscribeSms ? 18 : 2 }}
                  className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-lg"
                />
              </button>
            </div>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:border-blue-500/50 focus:outline-none transition-colors placeholder:text-white/20"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-5 bg-white text-black rounded-3xl font-black uppercase tracking-[0.3em] text-xs hover:bg-green-500 hover:text-white transition-all duration-500 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Protect My Collection
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>

        <p className="text-[10px] text-white/20 text-center uppercase tracking-widest leading-relaxed">
          By opting in, you agree to receive automated messages. Message and data rates may apply.
        </p>
      </div>
    </div>
  );
}
