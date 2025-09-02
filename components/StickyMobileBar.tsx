"use client";
import Link from 'next/link';

export default function StickyMobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-base-900/90 backdrop-blur border-t border-white/10 md:hidden">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/products" className="flex-1 text-center rounded-lg bg-accent text-black font-semibold py-2">Shop Drops</Link>
        <Link href="#vip" className="flex-1 text-center rounded-lg border border-white/20 py-2">Join VIP</Link>
      </div>
    </div>
  );
}

