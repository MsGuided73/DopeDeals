"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import Countdown from './Countdown';
import { track } from 'lib/analytics';

export default function Hero() {
  return (
    <section aria-labelledby="hero" className="relative isolate overflow-hidden bg-base-900 text-text">
      <div aria-hidden className="absolute inset-0 -z-10">
        {/* background image + smoke overlay */}
        <div className="absolute inset-0 bg-[url('/dope-city/hero/dope-city-hero.jpg')] bg-cover bg-center opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/40 to-black/80" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-24 pb-16 md:pt-32 md:pb-24">
        <motion.h1 id="hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-5xl md:text-7xl font-extrabold tracking-tight">
          DOPE CITY
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }} className="mt-3 max-w-2xl text-text/80">
          From daily drivers to legendary pieces—always at Dope City prices.
        </motion.p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link href="/products" onClick={() => track({ type: 'cta_click', id: 'hero_shop' })} className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-3 text-black font-semibold shadow-glow hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-neon">
            Shop This Week’s Drop
          </Link>
          <Link href="#vip" onClick={() => track({ type: 'cta_click', id: 'hero_vip' })} className="inline-flex items-center justify-center rounded-lg border border-white/20 px-5 py-3 font-semibold hover:bg-white/10">
            Join Dope City VIP — early access
          </Link>
        </div>

        <div className="mt-6">
          <Countdown endsAt={new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString()} />
        </div>

        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-text/80">
          <li className="rounded-lg bg-glass p-3">Wide selection, curated by vibe.</li>
          <li className="rounded-lg bg-glass p-3">Premium steals at every budget.</li>
          <li className="rounded-lg bg-glass p-3">Fast shipping, easy returns.</li>
        </ul>
      </div>
    </section>
  );
}

