"use client";
import { useEffect, useState } from 'react';

export default function Countdown({ endsAt }: { endsAt: string }) {
  const [remain, setRemain] = useState(0);
  useEffect(() => {
    const end = new Date(endsAt).getTime();
    const t = setInterval(() => setRemain(Math.max(0, end - Date.now())), 1000);
    return () => clearInterval(t);
  }, [endsAt]);

  const s = Math.floor(remain / 1000);
  const hh = String(Math.floor(s / 3600)).padStart(2, '0');
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');

  return (
    <div aria-live="polite" className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm">
      <span className="text-text/70">Drop ends in</span>
      <span className="font-mono font-bold text-neon">{hh}:{mm}:{ss}</span>
    </div>
  );
}

