"use client";
import { useEffect, useRef, useState } from 'react';
import EmailCapture from './EmailCapture';
import { track } from '@/lib/analytics';

export default function ExitIntent() {
  const [open, setOpen] = useState(false);
  const shownRef = useRef(false);

  useEffect(() => {
    // Only on larger screens
    if (typeof window === 'undefined') return;
    if (window.innerWidth < 768) return;

    const already = sessionStorage.getItem('dc_exit_shown');
    if (already === '1') return;

    function onMouseOut(e: MouseEvent) {
      if (e.clientY <= 0 && !shownRef.current) {
        shownRef.current = true;
        sessionStorage.setItem('dc_exit_shown', '1');
        setOpen(true);
      }
    }

    const timer = setTimeout(() => {
      // Fallback: show after 25s if user hasn't interacted
      if (!shownRef.current) {
        shownRef.current = true;
        sessionStorage.setItem('dc_exit_shown', '1');
        setOpen(true);
      }
    }, 25000);

    document.addEventListener('mouseout', onMouseOut);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-labelledby="exit-title" aria-modal="true">
      <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} aria-hidden />
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/15 bg-base-900 p-6 shadow-glow">
        <button onClick={() => setOpen(false)} className="absolute right-3 top-3 rounded px-2 py-1 text-sm text-text/70 hover:bg-white/10" aria-label="Close">Close</button>
        <h2 id="exit-title" className="text-xl font-bold text-text">Get 10% off your first order</h2>
        <p className="mt-1 text-sm text-text/70">Join Dope City VIP for early access and lower pricing. We’ll send your code instantly.</p>
        <div className="mt-4">
          <EmailCapture cta="Join Dope City VIP" />
        </div>
        <div className="mt-3 text-[11px] text-text/50">By joining, you agree to receive periodic emails. Unsubscribe anytime.</div>
        <div className="mt-4 flex gap-2">
          <button onClick={() => { track({ type: 'cta_click', id: 'exit_vip' }); }} className="hidden" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

