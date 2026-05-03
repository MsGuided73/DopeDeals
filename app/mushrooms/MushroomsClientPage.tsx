'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { Mail, Phone, Calendar, Tag, Bell, ArrowRight, ShieldCheck, Truck, Award, Lock } from 'lucide-react';
import GlobalMasthead from '../components/GlobalMasthead';

// Coming-soon landing for the shrooms category. Replaces the previous
// listing-style page until products are live. Two CTAs (top hero +
// bottom bar) both submit to /api/vip-signup so emails land in the
// existing vip_signups table; subscribers are tagged via lastName
// "Shrooms-Coming-Soon" so they can be filtered later.

const PRODUCT_IMAGE_URL =
  'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Product_Pages/SHROOMS%20PRODUCT%20.png';

const BACKDROP_URL =
  'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Product_Pages/CreeksideRoad2-5T.png';

// Custom mushroom SVG — Lucide doesn't ship one and the third feature
// column visually needs the mushroom shape.
function MushroomIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 11a7 7 0 0 1 14 0v.5H5z" />
      <path d="M9 11.5v8a2 2 0 0 0 4 0v-8" />
      <circle cx="9" cy="8.5" r="0.6" fill="currentColor" />
      <circle cx="13.5" cy="7.5" r="0.6" fill="currentColor" />
      <circle cx="11.5" cy="10" r="0.6" fill="currentColor" />
    </svg>
  );
}

const FEATURES = [
  {
    Icon: Calendar,
    title: 'EARLY ACCESS',
    body: 'Be the first to shop before products go live.',
  },
  {
    Icon: Tag,
    title: 'EXCLUSIVE OFFERS',
    body: 'Members get launch-only discounts and perks.',
  },
  {
    Icon: MushroomIcon,
    title: 'NEW RELEASES',
    body: 'Get first dibs on new products and limited drops.',
  },
] as const;

// Avatar initials + gradient backgrounds for the "Join 1,000+ customers"
// social proof strip. Placeholder visuals — swap to real avatars later.
const AVATARS = [
  { initials: 'JS', from: '#fde68a', to: '#f59e0b' },
  { initials: 'DM', from: '#bbf7d0', to: '#16a34a' },
  { initials: 'AW', from: '#bfdbfe', to: '#2563eb' },
  { initials: 'KP', from: '#fecaca', to: '#dc2626' },
  { initials: 'TR', from: '#e9d5ff', to: '#7c3aed' },
] as const;

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

function SignupForm({
  variant,
  onSubmitSuccess,
}: {
  variant: 'card' | 'inline';
  onSubmitSuccess?: () => void;
}) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState<SubmitState>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === 'loading') return;
    setState('loading');
    setErrorMsg(null);
    try {
      const namePart = email.split('@')[0]?.slice(0, 40) || 'Shrooms';
      const res = await fetch('/api/vip-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: namePart,
          lastName: 'Shrooms-Coming-Soon',
          email,
          phone: phone || undefined,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Signup failed');
      setState('success');
      onSubmitSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      setErrorMsg(message);
      setState('error');
    }
  };

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d8f47] focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={state === 'loading' || state === 'success'}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2d4a2b] hover:bg-[#1f3a1f] disabled:bg-gray-400 text-white rounded-lg font-bold tracking-wide transition-colors"
        >
          {state === 'success' ? "YOU'RE ON THE LIST" : 'NOTIFY ME'}
          {state !== 'success' && <ArrowRight className="w-4 h-4" />}
        </button>
        {errorMsg && (
          <p className="text-xs text-red-600 sm:absolute sm:-bottom-6 sm:left-0">{errorMsg}</p>
        )}
      </form>
    );
  }

  // Card variant (top hero)
  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-5 lg:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Mail className="w-5 h-5 text-[#2d8f47]" />
        <h3 className="font-bold text-[#1a1a1a] tracking-wide">BE FIRST TO KNOW</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Join the list and be the first to know when we launch.
      </p>

      <div className="space-y-3">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d8f47] focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number (optional)"
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d8f47] focus:border-transparent"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={state === 'loading' || state === 'success'}
        className="w-full mt-4 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2d4a2b] hover:bg-[#1f3a1f] disabled:bg-gray-400 text-white rounded-lg font-bold tracking-wide transition-colors"
      >
        {state === 'success' ? "YOU'RE ON THE LIST" : state === 'loading' ? 'JOINING…' : 'NOTIFY ME'}
        {state !== 'success' && state !== 'loading' && <ArrowRight className="w-4 h-4" />}
      </button>

      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
        <Lock className="w-3.5 h-3.5" />
        <span>No spam. Just early access + exclusive offers.</span>
      </div>

      {errorMsg && <p className="mt-2 text-xs text-red-600">{errorMsg}</p>}
    </form>
  );
}

export default function MushroomsClientPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Shrooms — Coming Soon | Highway 420',
    description:
      'Premium mushroom products coming soon to Highway 420. Join the list for early access.',
    url: 'https://highway420store.com/mushrooms',
  };

  return (
    <>
      <GlobalMasthead />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ── Top hero ────────────────────────────────────────────────────── */}
      <section className="relative bg-[#f7f3ec] overflow-hidden">
        {/* Subtle mountain backdrop on the left */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1/2 hidden md:block pointer-events-none opacity-25"
        >
          <Image
            src={BACKDROP_URL}
            alt=""
            fill
            sizes="50vw"
            className="object-cover object-left"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative">
          <nav className="text-sm text-gray-600 mb-8 flex items-center gap-2">
            <Link href="/" className="hover:text-[#2d8f47] transition-colors">
              Home
            </Link>
            <span className="text-gray-400">›</span>
            <Link href="/higher-learning" className="hover:text-[#2d8f47] transition-colors">
              Higher Learning
            </Link>
            <span className="text-gray-400">›</span>
            <span className="text-gray-900 font-medium">Shrooms</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12 items-center">
            {/* Left — copy + signup */}
            <div>
              <p className="text-[#2d8f47] text-sm font-bold tracking-[0.2em] uppercase border-b-2 border-[#2d8f47] inline-block pb-1 mb-6">
                SHROOMS
              </p>
              <h1 className="font-chalets text-[4.5rem] leading-[0.9] md:text-[7rem] lg:text-[8rem] text-[#1a1a1a] font-bold uppercase tracking-tight mb-6">
                COMING <br /> SOON
              </h1>
              <h2 className="text-[#2d8f47] text-2xl md:text-3xl font-bold mb-4">
                Elevate your mind. Naturally.
              </h2>
              <p className="text-gray-700 text-lg max-w-md mb-8 leading-relaxed">
                We&apos;re curating a premium lineup of mushroom products designed for balance,
                focus, and elevated experiences.
              </p>

              <div className="max-w-md">
                <SignupForm variant="card" />
              </div>
            </div>

            {/* Right — product image. Container uses a 3:4 portrait aspect
                that matches the source product photo so the image fills the
                frame edge-to-edge instead of getting letterboxed inside a
                square. `mx-auto` plus a max-width keeps the image centered
                within the wider grid column on large viewports. */}
            <div className="relative w-full max-w-2xl aspect-[3/4] mx-auto">
              <Image
                src={PRODUCT_IMAGE_URL}
                alt="Shroom Gummies by Highway 420 — Balance, Focus, Elevate"
                fill
                sizes="(max-width: 1024px) 100vw, 672px"
                className="object-contain object-center"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Three-column feature row ───────────────────────────────────── */}
      <section className="bg-[#f7f3ec] border-t border-[#e6dfd1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="text-center mb-10">
            <h3 className="text-[#2d8f47] text-xl md:text-2xl font-bold tracking-wider">
              BE FIRST TO EXPERIENCE THE DROP
            </h3>
            <div className="h-0.5 w-16 bg-[#2d8f47] mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 max-w-5xl mx-auto">
            {FEATURES.map(({ Icon, title, body }) => (
              <div key={title} className="text-center px-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-[#1c352d]/40 flex items-center justify-center text-[#1c352d]">
                  <Icon className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-[#1a1a1a] tracking-wider mb-2">{title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed max-w-[14rem] mx-auto">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof strip ─────────────────────────────────────────── */}
      <section className="bg-[#f7f3ec]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="bg-white border border-[#e6dfd1] rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="flex items-center gap-4 z-10">
              <div className="flex -space-x-3">
                {AVATARS.map((a) => (
                  <div
                    key={a.initials}
                    className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${a.from}, ${a.to})` }}
                    aria-hidden="true"
                  >
                    {a.initials}
                  </div>
                ))}
              </div>
              <p className="text-sm md:text-base text-gray-800 font-semibold leading-snug">
                Join 1,000+ customers
                <span className="block text-gray-600 font-normal">
                  getting early access to new drops.
                </span>
              </p>
            </div>
            {/* Soft mountain accent on the right */}
            <div className="hidden md:block flex-1 max-w-xs h-16 relative opacity-40">
              <Image
                src={BACKDROP_URL}
                alt=""
                fill
                sizes="320px"
                className="object-contain object-right"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────── */}
      <section className="bg-[#e8e3d6] border-t border-[#d6cfbf]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#2d4a2b] flex items-center justify-center">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-[#2d8f47] text-2xl md:text-3xl font-bold tracking-wide mb-2">
            GET NOTIFIED WHEN WE LAUNCH
          </h3>
          <p className="text-gray-700 mb-6">
            Don&apos;t miss out — join the list and be the first to know.
          </p>
          <SignupForm variant="inline" />
        </div>
      </section>

      {/* ── Bottom dark stats bar ─────────────────────────────────────── */}
      <section className="bg-[#0f1d12] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
            <div className="flex items-center gap-3">
              <Award className="w-7 h-7 text-[#5EB499] flex-shrink-0" strokeWidth={1.5} />
              <div>
                <div className="font-bold text-lg">500+</div>
                <div className="text-xs text-gray-400">Premium Pieces</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-[#5EB499] flex-shrink-0" strokeWidth={1.5} />
              <div>
                <div className="font-bold text-lg">50+</div>
                <div className="text-xs text-gray-400">Trusted Brands</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="w-7 h-7 text-[#5EB499] flex-shrink-0" strokeWidth={1.5} />
              <div>
                <div className="font-bold text-sm md:text-base">Fast &amp; Discreet</div>
                <div className="text-xs text-gray-400">Shipping $50+</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Lock className="w-7 h-7 text-[#5EB499] flex-shrink-0" strokeWidth={1.5} />
              <div>
                <div className="font-bold text-sm md:text-base">Secure Checkout</div>
                <div className="text-xs text-gray-400">Your info is safe</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
