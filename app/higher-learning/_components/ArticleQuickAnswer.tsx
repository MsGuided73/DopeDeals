import Link from "next/link";
import { CheckCircle2, Star, Flame } from "lucide-react";

export interface QuickAnswerPick {
  /** e.g., "Best for beginners" */
  label: string;
  /** e.g., "E-Rig" */
  value: string;
  /** Optional link to the matching product family / category. */
  href?: string;
  /** Which icon to show. */
  icon?: "star" | "flame";
}

interface ArticleQuickAnswerProps {
  /** Two-column bullet list on the left side of the card. */
  takeaways: string[];
  /** "Best for X → Y" pointers on the right side of the card. */
  picks: QuickAnswerPick[];
}

const ICONS = {
  star: Star,
  flame: Flame,
} as const;

/**
 * Top-of-article callout. Two columns inside one card:
 *   - left: quick "TL;DR" takeaways
 *   - right: routing pointers ("Best for beginners → E-Rig") that double as
 *     soft CTAs to the relevant product family.
 */
export default function ArticleQuickAnswer({ takeaways, picks }: ArticleQuickAnswerProps) {
  return (
    <aside className="rounded-lg border border-[#d8e6cf] bg-[#f0f5e8] p-5 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="w-5 h-5 text-[#1B7A4D]" aria-hidden />
        <span className="text-xs font-bold uppercase tracking-widest text-[#1B7A4D]">
          Quick Answer
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ul className="space-y-1.5 text-sm text-neutral-800 leading-relaxed">
          {takeaways.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>

        <ul className="space-y-2.5 text-sm text-neutral-800">
          {picks.map((p, i) => {
            const Icon = ICONS[p.icon ?? "star"];
            const inner = (
              <>
                <Icon className="w-4 h-4 text-[#1B7A4D] shrink-0 mt-0.5" aria-hidden />
                <span>
                  <span className="font-semibold">{p.label}</span>
                  <span className="mx-1.5 text-neutral-400">→</span>
                  <span>{p.value}</span>
                </span>
              </>
            );
            return (
              <li key={i}>
                {p.href ? (
                  <Link
                    href={p.href}
                    className="flex items-start gap-2 hover:text-[#1B7A4D] transition-colors"
                  >
                    {inner}
                  </Link>
                ) : (
                  <span className="flex items-start gap-2">{inner}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
