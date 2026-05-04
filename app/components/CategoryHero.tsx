'use client';

import Image from 'next/image';
import { useState, type ReactNode } from 'react';

export type CategoryHeroPill = {
  id: string;
  label: string;
};

type CategoryHeroProps = {
  /** Headline rendered inside the chalets-font H1. Pass JSX so consumers
   *  can include manual line breaks (e.g. <>BONGS & <br /> WATER PIPES</>). */
  headline: ReactNode;
  /** Brand-green tagline under the headline. */
  subhead: string;
  /** Paragraph copy under the tagline. */
  paragraph: string;
  /** Label for the CTA button (only renders if expandedContent is provided). */
  ctaLabel?: string;
  /** Optional content slot — when provided, the CTA toggles it open. */
  expandedContent?: ReactNode;

  /** Illustration shown on the right side of the hero (full viewport width
   *  wrapper, object-contain object-right so it anchors to the right edge
   *  at its natural aspect ratio). Optional — when omitted the right half
   *  is left empty (used for THCA Flower and other text-only heroes). */
  illustrationSrc?: string;
  illustrationAlt?: string;
  /** Optional horizontal pixel offset applied to the illustration. Positive
   *  values push the image to the right (the right edge is clipped by the
   *  hero wrapper's overflow-hidden). Useful for fine-tuning per page. */
  illustrationOffsetX?: number;

  /** Category pills anchored to the bottom of the left half. */
  pills: ReadonlyArray<CategoryHeroPill>;
  activePillId: string;
  onPillChange: (id: string) => void;

  /** Optional Tailwind class for the hero wrapper background. Defaults to "bg-[#ffffff]". */
  heroBgClassName?: string;

  /** Optional RGB string for the halo gradient. Defaults to "255,255,255". */
  haloColorRGB?: string;
  /** Whether to align content to the left edge instead of centering. */
  isLeftAligned?: boolean;
};

const PILL_BASE =
  'whitespace-nowrap px-5 py-2.5 text-sm md:text-base rounded-lg font-bold transition-all duration-200';
const PILL_ACTIVE =
  'bg-[#2d8f47] text-white border-2 border-[#2d8f47] shadow-[0_4px_10px_rgba(0,0,0,0.18),0_0_28px_8px_rgba(255,255,255,0.9)]';
const PILL_INACTIVE =
  'bg-white text-[#2d8f47] border-2 border-[#2d8f47] hover:bg-[#2d8f47] hover:text-white shadow-[0_4px_10px_rgba(0,0,0,0.18),0_0_28px_8px_rgba(255,255,255,0.9)]';

// Shared category-page hero. Encapsulates: full-viewport-width illustration
// anchored right, soft radial-gradient halo behind the headline (validated
// pattern — see memory/reference_radial_gradient_halo.md), bottom-left pill
// bar with brand-green raised buttons + white halos. Used by every product
// listing page so visual consistency is automatic.
export default function CategoryHero({
  headline,
  subhead,
  paragraph,
  ctaLabel,
  expandedContent,
  illustrationSrc,
  illustrationAlt,
  illustrationOffsetX,
  pills,
  activePillId,
  onPillChange,
  heroBgClassName = 'bg-[#ffffff]',
  haloColorRGB = '255,255,255',
  isLeftAligned = false,
}: CategoryHeroProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
    <div className={`${heroBgClassName} w-full relative overflow-hidden`}>
      {/* Hero photo — full viewport width, anchored right at natural aspect ratio.
          Skipped entirely when no illustrationSrc is provided. */}
      {illustrationSrc ? (
        <div
          className="absolute inset-0 hidden md:block pointer-events-none overflow-hidden z-0"
          style={
            illustrationOffsetX
              ? { transform: `translateX(${illustrationOffsetX}px)` }
              : undefined
          }
        >
          <Image
            src={illustrationSrc}
            alt={illustrationAlt ?? ''}
            fill
            sizes="(min-width: 768px) 100vw, 0px"
            className="object-contain object-right"
            priority
          />
        </div>
      ) : null}

      {/* Hero content section — full viewport width with safe-zone padding.
          `items-center` vertically centers the text + pill block within the
          min-h-[600px] hero so it visually balances with the right-side
          illustration. */}
      <div className={`relative pt-12 pb-24 pr-4 sm:pr-6 lg:pr-8 flex flex-col md:flex-row items-center min-h-[600px] z-30 ${
        isLeftAligned ? 'pl-6' : 'px-4 sm:px-6 lg:px-8'
      }`}>
        {/* Left column — text content centered horizontally within the left half. */}
        <div className="w-full md:w-1/2 z-10 relative">
          <div className={`max-w-xl relative ${isLeftAligned ? 'ml-0' : 'mx-auto'}`}>
            {/* Soft radial-gradient halo behind the text — opaque core, blurred
                fade to transparent. No perceptible seams. */}
            <div
              aria-hidden="true"
              className="absolute pointer-events-none -inset-x-40 -inset-y-24 z-0"
              style={{
                background:
                  `radial-gradient(ellipse 95% 85% at center, rgba(${haloColorRGB},0.98) 45%, rgba(${haloColorRGB},0.88) 62%, rgba(${haloColorRGB},0.5) 80%, transparent 100%)`,
                filter: 'blur(44px)',
              }}
            />
            <div className="relative z-10">
              <h1 className="font-chalets text-[3rem] leading-[0.9] md:text-[4rem] lg:text-[5rem] text-[#1a1a1a] font-bold uppercase tracking-tight mb-4">
                {headline}
              </h1>

              <h2 className="text-[#2d8f47] text-2xl md:text-3xl font-bold mb-3">
                {subhead}
              </h2>

              <p className="text-gray-700 text-lg max-w-lg mb-8 leading-relaxed font-medium">
                {paragraph}
              </p>

              {expandedContent && ctaLabel ? (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="inline-flex items-center px-5 py-3 border-2 border-[#2d8f47] text-[#2d8f47] bg-white rounded font-semibold hover:bg-green-50 transition-colors shadow-sm"
                  aria-expanded={isExpanded}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {ctaLabel}
                  <svg
                    className={`w-5 h-5 ml-2 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              ) : null}

              {/* Pill bar — sits directly under the hero text/CTA so the
                  filter chips read as part of the headline block. First pill
                  aligns with the headline left edge; the row stays on a single
                  line and is allowed to extend rightward past the max-w-xl
                  text column into the illustration area when needed. Hidden on
                  mobile (the mobile layout exposes filtering through the
                  drawer instead). */}
              <div
                className="hidden md:flex flex-nowrap gap-3 mt-8"
                style={{ width: 'max-content' }}
              >
                {pills.map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => onPillChange(pill.id)}
                    aria-pressed={activePillId === pill.id}
                    className={`${PILL_BASE} flex-shrink-0 ${activePillId === pill.id ? PILL_ACTIVE : PILL_INACTIVE}`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Expanded explainer panel — renders as a sibling of the hero so it pushes
        page content down (instead of being absolutely positioned + clipped by
        the hero's overflow-hidden wrapper). */}
    {expandedContent && ctaLabel ? (
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${heroBgClassName} ${
          isExpanded ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!isExpanded}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {expandedContent}
        </div>
      </div>
    ) : null}
    </>
  );
}
