"use client";
import { useState } from 'react';
import { track } from '@/lib/analytics';

export default function EmailCapture({ cta = 'Get early access' }: { cta?: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle'|'ok'|'err'>('idle');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const r = await fetch('/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, tag: 'VIP' }) });
      setStatus(r.ok ? 'ok' : 'err');
      if (r.ok) track({ type: 'email_subscribed', vip: true });
    } catch {
      setStatus('err');
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md flex gap-2">
      <label htmlFor="email" className="sr-only">Email</label>
      <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@dopecity.com" className="flex-1 rounded-lg bg-black/40 border border-white/15 px-3 py-2" />
      <button type="submit" className="rounded-lg bg-accent text-black px-4 font-semibold">{cta}</button>
      {status === 'ok' && <span className="text-green-400 text-sm">Thanks! Check your inbox.</span>}
      {status === 'err' && <span className="text-red-400 text-sm">Try again</span>}
    </form>
  );
}

