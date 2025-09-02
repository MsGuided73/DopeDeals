"use client";
import Link from 'next/link';
import { Menu, ShoppingBag, User } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-base-900/80 backdrop-blur border-b border-white/10 text-text">
      <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="md:hidden p-2 rounded hover:bg-white/10" aria-label="Open Menu"><Menu size={18} /></button>
          <Link href="/" className="font-black tracking-[0.2em] text-sm">DOPE CITY</Link>
        </div>
        <nav className="hidden md:flex gap-6 text-sm text-text/90">
          <Link href="/products" className="hover:text-neon">Drops</Link>
          <Link href="#categories" className="hover:text-neon">Categories</Link>
          <Link href="#vip" className="hover:text-neon">VIP</Link>
          <Link href="/contact" className="hover:text-neon">Contact</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/cart" aria-label="Cart" className="p-2 rounded hover:bg-white/10"><ShoppingBag size={18} /></Link>
          <Link href="/account" aria-label="Account" className="p-2 rounded hover:bg-white/10"><User size={18} /></Link>
        </div>
      </div>
    </header>
  );
}

