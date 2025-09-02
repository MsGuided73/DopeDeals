import Image from 'next/image';

type CTA = { label:string; href:string; variant?:'primary'|'ghost'|'outline' };

export default function Hero({ bgUrl, bgPosition = 'center top 35%', title, subtitle, ctas = [] }: { bgUrl: string; bgPosition?: string; title?: string; subtitle?: string; ctas?: CTA[] }) {
  return (
    <section className="relative isolate min-h-[70vh] w-full bg-brand-dark text-white">
      {/* background */}
      <div className="absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={bgUrl} alt="Dope City hero background" className="h-full w-full object-cover" style={{ objectPosition: bgPosition }} />
        {/* overlay for contrast */}
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase">{title ?? 'DOPE CITY'}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-white/85">{subtitle}</p>}
        {ctas.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {ctas.map((c) => (
              <a key={c.href} href={c.href} className={c.variant === 'ghost' ? 'btn-ghost' : c.variant === 'outline' ? 'btn-outline' : 'btn-primary'}>{c.label}</a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

