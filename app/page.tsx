import Navbar from 'components/Navbar';
import Hero from '@/components/dope-city/Hero';
import CollectionsMosaic from '@/components/dope-city/CollectionsMosaic';
import type { CollectionTile } from '@/components/dope-city/types';
import TestimonialCard from 'components/TestimonialCard';
import EmailCapture from 'components/EmailCapture';
import Footer from 'components/Footer';
import StickyMobileBar from 'components/StickyMobileBar';
import VibeFinder from 'components/VibeFinder';
import ExitIntent from 'components/ExitIntent';

export const metadata = { title: 'DOPE CITY — Premium hits. Everyday prices.' };

export default function Page() {
  const tiles: CollectionTile[] = [
    { title: 'Dab Rigs', href: '/collections/dab-rigs', img: '/dope-city/collections/dope-deals-card.jpg', blurb: 'Precision rigs & tools for big draws.', tag: 'Clouds', size: 'feature' },
    { title: 'Water Bongs', href: '/collections/water-bongs', img: '/dope-city/hero/dope-city-hero.jpg', blurb: 'Smooth pulls. Hand-picked glass.', tag: 'Balance', size: 'wide' },
    { title: 'Pipes', href: '/collections/pipes', img: '/dope-city/collections/dope-deals-card.jpg', tag: 'Flavor', size: 'small' },
    { title: 'CBD, THCA & More', href: '/collections/vapes', img: '/dope-city/collections/dope-deals-card.jpg', tag: 'Balance', size: 'small' },
    { title: 'Kratom / 7-OH', href: '/collections/kratom', img: '/dope-city/collections/dope-deals-card.jpg', tag: 'Balance', size: 'small' },
    { title: 'Accessories', href: '/collections/accessories', img: '/dope-city/collections/dope-deals-card.jpg', tag: 'Flavor', size: 'small' },
  ];

  return (
    <div className="bg-base-900 text-text">
      <Navbar />
      <Hero
        bgUrl="/dope-city/hero/dope-city-hero.jpg"
        title="DOPE CITY"
        subtitle="From daily drivers to legendary pieces—always at Dope City prices."
        ctas={[
          { label: 'Shop This Week’s Drop', href: '/products', variant: 'primary' },
          { label: 'Join Dope City VIP — early access', href: '#vip', variant: 'ghost' },
        ]}
      />

      {/* Collections Mosaic */}
      <CollectionsMosaic tiles={tiles} />

      {/* Vibe Finder */}
      <VibeFinder />

      {/* Social Proof strip */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-2xl border border-white/10 bg-glass p-6 text-center text-text/80">Trusted by <span className="text-neon font-semibold">10,000+</span> customers</div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-6 grid gap-4 md:grid-cols-3">
        {[
          { quote: 'Fast shipping, clean glass, no fluff.', author: 'Lee R.' },
          { quote: 'My daily driver came from DC — unreal value.', author: 'Maya C.' },
          { quote: 'VIP pricing paid for itself week one.', author: 'Jesse P.' },
        ].map((t) => (<TestimonialCard key={t.author} {...t} />))}
      </section>

      {/* VIP Section */}
      <section id="vip" className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-2xl bg-gradient-to-br from-black/70 via-black/50 to-black/30 border border-white/10 p-6 md:p-8">
          <h2 className="text-2xl font-bold">Unlock Dope City VIP</h2>
          <ul className="mt-3 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-text/80">
            <li className="rounded-lg bg-black/40 p-3">Early access to drops</li>
            <li className="rounded-lg bg-black/40 p-3">VIP pricing</li>
            <li className="rounded-lg bg-black/40 p-3">Secret bundles</li>
            <li className="rounded-lg bg-black/40 p-3">Setup guides</li>
          </ul>
          <p className="mt-3 text-sm text-text/70">Enrollment closes when this drop ends.</p>
          <div className="mt-4">
            <EmailCapture cta="Join Dope City VIP" />
          </div>
        </div>
      </section>

      <Footer />
      <StickyMobileBar />
      <ExitIntent />
    </div>
  );
}

