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
  /** "grid" = full-width 3-up cards under the article. "rail" = compact stacked cards for the sidebar. */
  variant?: "grid" | "rail";
  /** Optional CTA link rendered under the rail variant (e.g., "View All Articles"). */
  viewAllHref?: string;
  viewAllLabel?: string;
}

/**
 * "You Might Also Like" — anti-bounce content surface. Default `grid` variant
 * renders three cards in a responsive grid at the foot of the article. The
 * `rail` variant renders compact horizontal cards stacked vertically inside
 * the right-rail aside.
 */
export default function RelatedArticles({
  items,
  heading = "You Might Also Like",
  variant = "grid",
  viewAllHref,
  viewAllLabel = "View All Articles",
}: RelatedArticlesProps) {
  if (items.length === 0) return null;

  if (variant === "rail") {
    return (
      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-200 pb-3 mb-4">
          {heading}
        </h2>
        <ul className="space-y-4">
          {items.map((a) => (
            <li key={a.href}>
              <Link href={a.href} className="group flex items-center gap-3">
                <div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden bg-neutral-100">
                  <Image
                    src={a.image.src}
                    alt={a.image.alt}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-neutral-900 leading-snug line-clamp-2 group-hover:text-[#1B7A4D] transition-colors">
                    {a.title}
                  </h3>
                  <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#1B7A4D]">
                    Read More <ArrowRight className="w-3 h-3" aria-hidden />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="mt-5 inline-flex w-full items-center justify-center px-4 py-3 border border-neutral-300 hover:border-[#1B7A4D] text-neutral-900 hover:text-[#1B7A4D] rounded-sm font-bold text-xs tracking-widest uppercase transition-colors"
          >
            {viewAllLabel}
          </Link>
        )}
      </section>
    );
  }

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
