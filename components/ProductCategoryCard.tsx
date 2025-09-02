import Image from 'next/image';
import Link from 'next/link';

export default function ProductCategoryCard({ href, title, tagline, img }: { href: string; title: string; tagline: string; img: string; }) {
  return (
    <Link href={href} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-glass hover:shadow-glow transition">
      <div className="relative h-40">
        <Image src={img} alt="" fill className="object-cover opacity-80 group-hover:opacity-90" />
      </div>
      <div className="p-4">
        <div className="text-lg font-bold text-text">{title}</div>
        <div className="text-sm text-text/70">{tagline}</div>
      </div>
    </Link>
  );
}

