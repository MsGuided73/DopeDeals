import Link from "next/link";
import { Droplet, FlaskConical, BookOpen, Cigarette, User2 } from "lucide-react";

const TOPICS = [
  { label: "DAB RIGS",        href: "/dabsntools",      Icon: Droplet },
  { label: "BONGS & GLASS",   href: "/bongs",           Icon: FlaskConical },
  { label: "HOW TO",          href: "/higher-learning", Icon: BookOpen },
  { label: "VAPES & CARTS",   href: "/vapes",           Icon: Cigarette },
  { label: "BEGINNER GUIDES", href: "/higher-learning", Icon: User2 },
] as const;

export default function HomeTopicLinksBar() {
  return (
    <section
      aria-label="Browse by topic"
      className="bg-[#F7F6F2] border-y border-amber-300/70"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 md:py-8">
        <ul className="flex flex-wrap items-center justify-center md:justify-between gap-y-4 divide-x divide-slate-300/70">
          {TOPICS.map(({ label, href, Icon }) => (
            <li key={label} className="flex-1 min-w-[160px] flex justify-center px-4 md:px-6 first:border-l-0">
              <Link
                href={href}
                className="group inline-flex items-center gap-3 text-slate-800 hover:text-amber-600 transition-colors"
              >
                <Icon
                  strokeWidth={1.4}
                  className="w-6 h-6 md:w-7 md:h-7 text-slate-700 group-hover:text-amber-600 transition-colors"
                  aria-hidden="true"
                />
                <span className="text-xs md:text-sm font-semibold tracking-[0.18em] uppercase whitespace-nowrap">
                  {label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
