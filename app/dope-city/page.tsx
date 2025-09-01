import Image from 'next/image';

export const metadata = {
  title: 'DOPE CITY — Premium Glass & Accessories',
  description: 'Smoky, glassmorphic landing for DOPE CITY collections. No nicotine products shown.',
};

const HERO_IMAGES = [
  'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Upscale%20DOPE%20CITY%20Scape.png',
];

const COLLECTIONS: Array<{ key: string; name: string; href: string; img: string; subtitle?: string; }>= [
  { key: 'pipes', name: 'Pipes', href: '/category/pipes', img: '/dope-city/collections/dope-deals-card.jpg' },
  { key: 'water-bongs', name: 'Water Bongs', href: '/category/water-bongs', img: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1600&auto=format&fit=crop' },
  { key: 'dab-rigs', name: 'Dab Rigs', href: '/category/dab-rigs', img: 'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?q=80&w=1600&auto=format&fit=crop' },
  { key: 'accessories', name: 'Accessories', href: '/category/accessories', img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1600&auto=format&fit=crop' },
  { key: 'grinders', name: 'Grinders', href: '/category/grinders', img: 'https://images.unsplash.com/photo-1615486363870-5e5f62a4b860?q=80&w=1600&auto=format&fit=crop' },
  { key: 'cbd', name: 'CBD', href: '/category/cbd', img: 'https://images.unsplash.com/photo-1541976076758-347942db1970?q=80&w=1600&auto=format&fit=crop' },
  { key: '7-oh', name: '7‑OH', href: '/category/7-oh', img: 'https://images.unsplash.com/photo-1518112166137-85f9979a43a5?q=80&w=1600&auto=format&fit=crop' },
  { key: 'thca-d8', name: 'THCa • Delta‑8', href: '/category/thca-d8', img: 'https://images.unsplash.com/photo-1599599810694-08d2d9e06bbb?q=80&w=1600&auto=format&fit=crop' },
  { key: 'thca-d10', name: 'THCa • Delta‑10', href: '/category/thca-d10', img: 'https://images.unsplash.com/photo-1553531384-397c80973a05?q=80&w=1600&auto=format&fit=crop' },
];

function GlassCard({ c, i }: { c: (typeof COLLECTIONS)[number]; i: number }) {
  return (
    <a
      href={c.href}
      className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.06] hover:bg-white/[0.08] backdrop-blur-xl shadow-[0_10px_50px_-12px_rgba(0,0,0,0.65)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_80px_-12px_rgba(0,0,0,0.75)]"
      aria-label={`Shop ${c.name}`}
    >
      <div className="absolute inset-0">
        {/* background image */}
        <Image src={c.img} alt="" fill priority={i < 6} className="object-cover opacity-70 group-hover:opacity-80 transition-opacity" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/55 to-black/85" />
        {/* glass highlight */}
        <div className="pointer-events-none absolute -inset-[30%] bg-[radial-gradient(60%_40%_at_50%_10%,rgba(255,255,255,0.15),transparent_50%)]" />
      </div>
      <div className="relative p-6 sm:p-7 md:p-8 h-44 sm:h-56 md:h-64 flex items-end">
        <div>
          <div className="text-xs uppercase tracking-widest text-white/70">Collection</div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
            {c.name}
          </h3>
        </div>
      </div>
      {/* glossy ring */}
      <div className="absolute inset-0 rounded-3xl ring-1 ring-white/10 group-hover:ring-white/20" />
    </a>
  );
}

export default function DopeCityLanding() {
  const hero = HERO_IMAGES[0];
  return (
    <div className="relative min-h-screen text-white">
      {/* Hero */}
      <section id="top" className="relative isolate py-8 sm:py-12">
        <div className="mx-auto w-[95vw] max-w-[1800px] px-2 sm:px-4">
          {/* Glassmorphic frame */}
          <div className="relative h-[68vh] sm:h-[78vh] rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur-xl overflow-hidden shadow-[0_20px_120px_-24px_rgba(0,0,0,0.7)]">
            {/* Contained hero image (show entire image) */}
            <Image src={hero} alt="Dope City hero" fill priority className="object-contain" unoptimized />
            {/* subtle glass highlights */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
            <div className="pointer-events-none absolute -inset-[30%] bg-[radial-gradient(60%_40%_at_50%_10%,rgba(255,255,255,0.12),transparent_50%)]" />
          </div>

          {/* Headline below the frame */}
          <div className="mt-8 max-w-5xl">
            <div className="mb-2 text-sm font-medium tracking-widest text-white/70">WELCOME TO</div>
            <h1 className="text-[52px] leading-[0.95] sm:text-[88px] md:text-[110px] font-black tracking-tight uppercase">
              DOPE <span className="text-white/80">CITY</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-white/85">
              Curated glass. Premium rigs. Zero compromises. Explore collections crafted for the culture — no nicotine products displayed.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#collections" className="rounded-xl bg-white/10 px-5 py-3 backdrop-blur-md border border-white/20 hover:bg-white/15 transition">Shop Collections</a>
              <a href="/vip" className="rounded-xl bg-black/60 px-5 py-3 border border-white/20 hover:bg-black/70 transition">Join VIP</a>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky right nav */}
      <aside className="hidden md:block fixed right-6 top-1/2 -translate-y-1/2 z-40">
        <nav className="backdrop-blur-xl bg-white/10 border border-white/15 rounded-2xl shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6)] p-2 flex flex-col items-stretch gap-2">
          <a href="#top" className="px-3 py-2 rounded-lg text-sm hover:bg-white/15 transition">Top</a>
          <a href="#collections" className="px-3 py-2 rounded-lg text-sm hover:bg-white/15 transition">Collections</a>
          <a href="/products" className="px-3 py-2 rounded-lg text-sm hover:bg-white/15 transition">All Products</a>
        </nav>
      </aside>

      {/* Collections */}
      <section id="collections" className="relative bg-gradient-to-b from-black via-black to-black/95 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Shop the Collections</h2>
              <p className="mt-2 text-white/70">Glassmorphic cards. Big energy. Tap in.</p>
            </div>
            <a href="/products" className="hidden sm:inline-flex rounded-xl px-4 py-2 border border-white/20 hover:bg-white/10 transition">View All Products</a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {COLLECTIONS.map((c, i) => (
              <GlassCard key={c.key} c={c} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand band */}
      <section className="relative py-12 border-t border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center gap-4 text-white/60 text-sm">
          <span>Premium Borosilicate</span>
          <span className="h-px w-5 bg-white/10" />
          <span>Hand‑picked Rigs</span>
          <span className="h-px w-5 bg-white/10" />
          <span>Secure Checkout</span>
          <span className="h-px w-5 bg-white/10" />
          <span>Fast Fulfillment</span>
        </div>
      </section>
    </div>
  );
}

