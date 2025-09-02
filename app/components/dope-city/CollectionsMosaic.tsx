import Link from 'next/link';
import Image from 'next/image';
import type { CollectionTile } from '@/components/dope-city/types';

export default function CollectionsMosaic({ tiles = [] as CollectionTile[] }) {
  // enforce layout order: 1 feature, 1 wide, then four small
  const feature = tiles.find(t=>t.size==='feature');
  const wide = tiles.find(t=>t.size==='wide');
  const smalls = tiles.filter(t=>t.size==='small').slice(0,4);
  return (
    <section id="collections" className="bg-[#F5F5F4] py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-12 gap-4">
          {feature && (
            <Tile t={feature} className="col-span-12 md:col-span-7 h-[340px]" />
          )}
          {wide && (
            <Tile t={wide} className="col-span-12 md:col-span-5 h-[340px]" />
          )}
          {smalls.map((t,i)=> (
            <Tile key={t.href} t={t} className="col-span-12 sm:col-span-6 md:col-span-3 h-[220px]" />
          ))}
        </div>
      </div>
    </section>
  );
}

function Tile({ t, className }: { t: CollectionTile; className?: string }) {
  return (
    <Link href={t.href} className={`group relative overflow-hidden rounded-2xl ${className}`}>
      <Image src={t.img} alt={t.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        {t.tag && (<span className="inline-block rounded-full bg-white/15 px-2 py-0.5 text-xs mr-2">{t.tag}</span>)}
        <div className="text-xl font-bold">{t.title}</div>
        {t.blurb && <p className="text-sm text-white/80">{t.blurb}</p>}
      </div>
    </Link>
  );
}

