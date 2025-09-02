import Navbar from 'components/Navbar';
import Hero from 'components/Hero';
import ProductCategoryCard from 'components/ProductCategoryCard';
import TestimonialCard from 'components/TestimonialCard';
import EmailCapture from 'components/EmailCapture';
import Footer from 'components/Footer';
import StickyMobileBar from 'components/StickyMobileBar';
import VibeFinder from 'components/VibeFinder';
import ExitIntent from 'components/ExitIntent';

export const metadata = { title: 'DOPE CITY — Premium hits. Everyday prices.' };

export default function Page() {
  const categories = [
    { title: 'Dab Rigs', tagline: 'Precision for concentrates.', img: '/dope-city/collections/dope-deals-card.jpg', href: '/collections/dab-rigs' },
    { title: 'Water Bongs', tagline: 'Smooth pulls, big chambers.', img: '/dope-city/collections/dope-deals-card.jpg', href: '/collections/water-bongs' },
    { title: 'Pipes', tagline: 'Pocketable. Classic.', img: '/dope-city/collections/dope-deals-card.jpg', href: '/collections/pipes' },
    { title: 'Vapes/Disposables', tagline: 'Convenience, anywhere.', img: '/dope-city/collections/dope-deals-card.jpg', href: '/collections/vapes' },
    { title: 'Kratom / 7-OH', tagline: 'Strictly sourced, know your supply.', img: '/dope-city/collections/dope-deals-card.jpg', href: '/collections/kratom' },
    { title: 'Accessories', tagline: 'Dial in your setup.', img: '/dope-city/collections/dope-deals-card.jpg', href: '/collections/accessories' },
  ];

  return (
    <div className="bg-base-900 text-text">
      <Navbar />
      <Hero />

      {/* Categories */}
      <section id="categories" className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-2xl font-bold">Shop by category</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (<ProductCategoryCard key={c.title} {...c} />))}
        </div>
      </section>

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

