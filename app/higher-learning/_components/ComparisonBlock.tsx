import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";

export interface ComparisonBlockProps {
  /** Section heading, e.g., "What Is a Traditional Dab Rig?" */
  heading: string;
  /** Body paragraph(s) introducing this option. */
  description: string;
  /** Hero image for the option. */
  image: { src: string; alt: string };
  /** Optional "Typical features" list rendered above Pros/Cons. */
  features?: string[];
  /** Override for the features list heading. */
  featuresHeading?: string;
  pros: string[];
  cons: string[];
  /** "Best for: People who want the authentic, hands-on experience." */
  bestForCopy: string;
  /** Optional href on the "Best for" line — soft CTA to product family. */
  bestForHref?: string;
  /** Visually separates two consecutive blocks with a thin rule above. */
  divider?: boolean;
}

/**
 * Two-column section: image + description on the left, pros/cons + "Best for"
 * on the right. Used twice on a comparison article (one for each option).
 *
 * The "Best for" line is both editorial copy AND the lowest-effort soft CTA
 * on the page — a reader scanning Pros/Cons lands on a one-line audience
 * hook that links directly to the matching product family.
 */
export default function ComparisonBlock({
  heading,
  description,
  image,
  features,
  featuresHeading = "Typical features:",
  pros,
  cons,
  bestForCopy,
  bestForHref,
  divider,
}: ComparisonBlockProps) {
  return (
    <section className={divider ? "pt-10 mt-10 border-t border-neutral-200" : ""}>
      <h2 className="text-2xl md:text-[28px] font-bold text-neutral-900 mb-3 leading-tight">
        {heading}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div>
          <p className="text-[15px] text-neutral-700 leading-relaxed mb-4">{description}</p>
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-neutral-100">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {features && features.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-1.5">
                {featuresHeading}
              </h3>
              <ul className="list-disc list-inside text-sm text-neutral-800 space-y-1 marker:text-neutral-400">
                {features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-base font-bold text-[#1B7A4D] mb-1.5">Pros</h3>
            <ul className="list-disc list-inside text-sm text-neutral-800 space-y-1 marker:text-neutral-400">
              {pros.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#c84329] mb-1.5">Cons</h3>
            <ul className="list-disc list-inside text-sm text-neutral-800 space-y-1 marker:text-neutral-400">
              {cons.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-start gap-2 pt-2 text-sm text-neutral-800">
            <User className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" aria-hidden />
            <p>
              <span className="font-bold">Best for:</span>{" "}
              {bestForHref ? (
                <Link
                  href={bestForHref}
                  className="underline decoration-neutral-300 underline-offset-2 hover:text-[#1B7A4D] hover:decoration-[#1B7A4D] transition-colors"
                >
                  {bestForCopy}
                </Link>
              ) : (
                <span>{bestForCopy}</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
