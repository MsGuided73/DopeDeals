import Link from 'next/link';
import { Instagram, Music4, Twitter, Youtube } from 'lucide-react';
import EmailCapture from './EmailCapture';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-base-900 text-text/80">
      {/* Upper: newsletter + link columns */}
      <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm items-start">
        <div className="sm:col-span-2">
          <div className="font-black tracking-[0.2em] text-text">DOPE CITY</div>
          <p className="mt-2 text-xs text-text/60">Gear for the culture, built by the culture.</p>
          <div className="mt-4">
            <EmailCapture cta="Join the Circle" />
            <p className="mt-2 text-[11px] text-text/50">Member‑only drops, VIP pricing, and first looks. No spam.</p>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <a href="#" aria-label="Instagram" className="p-2 rounded hover:bg-white/10"><Instagram size={18} /></a>
            <a href="#" aria-label="TikTok" className="p-2 rounded hover:bg-white/10"><Music4 size={18} /></a>
            <a href="#" aria-label="X" className="p-2 rounded hover:bg-white/10"><Twitter size={18} /></a>
            <a href="#" aria-label="YouTube" className="p-2 rounded hover:bg-white/10"><Youtube size={18} /></a>
          </div>
        </div>

        <div>
          <div className="font-semibold mb-3 text-text">Shop</div>
          <ul className="space-y-2">
            <li><Link href="/collections/dab-rigs" className="hover:text-neon">Dab Rigs</Link></li>
            <li><Link href="/collections/water-bongs" className="hover:text-neon">Water Bongs</Link></li>
            <li><Link href="/collections/pipes" className="hover:text-neon">Pipes</Link></li>
            <li><Link href="/collections/vapes" className="hover:text-neon">Vapes & Disposables</Link></li>
            <li><Link href="/collections/kratom" className="hover:text-neon">Kratom / 7‑OH</Link></li>
            <li><Link href="/collections/accessories" className="hover:text-neon">Accessories</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-3 text-text">Company</div>
          <ul className="space-y-2">
            <li><Link href="/about" className="hover:text-neon">About</Link></li>
            <li><Link href="/contact" className="hover:text-neon">Contact</Link></li>
            <li><Link href="/kb" className="hover:text-neon">Guides</Link></li>
            <li><Link href="/merch" className="hover:text-neon">Merch</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-3 text-text">Support</div>
          <ul className="space-y-2">
            <li><Link href="/account/orders" className="hover:text-neon">Order tracking</Link></li>
            <li><Link href="/shipping" className="hover:text-neon">Shipping & returns</Link></li>
            <li><Link href="/warranty" className="hover:text-neon">Warranty</Link></li>
            <li><Link href="/privacy" className="hover:text-neon">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-neon">Terms</Link></li>
            <li><Link href="/affiliates" className="hover:text-neon">Affiliates</Link></li>
          </ul>
        </div>
      </div>

      {/* Lower: legal */}
      <div className="border-t border-white/10 py-4 text-xs text-center text-text/60">© {new Date().getFullYear()} Dope City — All rights reserved.</div>
    </footer>
  );
}
