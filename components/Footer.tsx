import Link from 'next/link';
import { Instagram, Music4, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-base-800 text-text/80">
      <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
        <div className="col-span-2 sm:col-span-1">
          <div className="font-black tracking-[0.2em] text-text">DOPE CITY</div>
          <p className="mt-2 text-xs text-text/60">Premium hits. Everyday prices.</p>
        </div>
        <div>
          <div className="font-semibold mb-2 text-text">Links</div>
          <ul className="space-y-2">
            <li><Link href="/about" className="hover:text-neon">About</Link></li>
            <li><Link href="/contact" className="hover:text-neon">Contact</Link></li>
            <li><Link href="/specials" className="hover:text-neon">Specials</Link></li>
            <li><Link href="/kb" className="hover:text-neon">Knowledge Base</Link></li>
            <li><Link href="/merch" className="hover:text-neon">Merch</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2 text-text">Social</div>
          <div className="flex gap-3">
            <a href="#" aria-label="Instagram" className="p-2 rounded hover:bg-white/10"><Instagram size={18} /></a>
            <a href="#" aria-label="TikTok" className="p-2 rounded hover:bg-white/10"><Music4 size={18} /></a>
            <a href="#" aria-label="X" className="p-2 rounded hover:bg-white/10"><Twitter size={18} /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-xs text-center text-text/60">© {new Date().getFullYear()} Dope City</div>
    </footer>
  );
}

