import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export interface RelatedArticle {
  href: string;
  title: string;
  category: string;
  image: { src: string; alt: string };
}

interface RelatedArticlesProps {
  items: RelatedArticle[];
  heading?: string;
}

/**
 * "You Might Also Like" — anti-bounce content surface at the foot of the
 * article. Three cards in a responsive grid.
 */
export default function RelatedArticles({
  items,
  heading = "You Might Also Like",
}: RelatedArticlesProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-14 pt-8 border-t border-neutral-200">
      <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-5">{heading}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="group block rounded-lg overflow-hidden border border-neutral-200 bg-white hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-[16/10] bg-neutral-100">
              <Image
                src={a.image.src}
                alt={a.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
              <span className="absolute top-3 left-3 bg-[#1b4332] text-[#4ade80] text-[10px] font-bold uppercase tracking-widest py-1 px-2 rounded-sm">
                {a.category}
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-sm md:text-base font-bold text-neutral-900 leading-snug line-clamp-2 group-hover:text-[#1B7A4D] transition-colors">
                {a.title}
              </h3>
              <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-neutral-900 group-hover:text-[#1B7A4D] transition-colors">
                Read More <ArrowRight className="w-3 h-3" aria-hidden />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
