import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { GraduationCap, BookOpen, TrendingUp, Smile } from "lucide-react";

export interface ExpertGuideLink {
  label: string;
  href: string;
  icon?: keyof typeof ICON_MAP;
}

const ICON_MAP: Record<string, LucideIcon> = {
  learn: GraduationCap,
  understand: BookOpen,
  upgrade: TrendingUp,
  enjoy: Smile,
};

const DEFAULT_LINKS: ExpertGuideLink[] = [
  { label: "Learn", href: "/higher-learning?topic=beginner-guides", icon: "learn" },
  { label: "Understand", href: "/higher-learning?topic=how-to", icon: "understand" },
  { label: "Upgrade", href: "/higher-learning?topic=dab-rigs", icon: "upgrade" },
  { label: "Enjoy", href: "/higher-learning", icon: "enjoy" },
];

interface ExpertGuidesNavProps {
  /** Override the default Learn / Understand / Upgrade / Enjoy quartet. */
  links?: ExpertGuideLink[];
  heading?: string;
  subheading?: string;
}

/**
 * Right-rail secondary nav: "Expert guides and tips to elevate every
 * session." Cross-sells other Higher Learning content; lower-intent than the
 * product rail above it but still keeps the reader inside the funnel.
 */
export default function ExpertGuidesNav({
  links = DEFAULT_LINKS,
  heading = "Expert guides and tips",
  subheading = "to elevate every session.",
}: ExpertGuidesNavProps) {
  return (
    <aside className="rounded-lg border border-neutral-200 bg-[#f5f3ee] p-5">
      <p className="text-sm text-neutral-800 mb-4 leading-snug">
        <span className="block font-medium">{heading}</span>
        <span className="block text-neutral-600">{subheading}</span>
      </p>

      <ul className="space-y-2">
        {links.map((l) => {
          const Icon = l.icon ? ICON_MAP[l.icon] : null;
          return (
            <li key={l.href + l.label}>
              <Link
                href={l.href}
                className="flex items-center gap-2 text-sm text-neutral-800 hover:text-[#1B7A4D] transition-colors"
              >
                {Icon && <Icon className="w-4 h-4 text-[#1B7A4D]" aria-hidden />}
                <span>{l.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
