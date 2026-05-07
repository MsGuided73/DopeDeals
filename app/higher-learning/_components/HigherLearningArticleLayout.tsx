import Image from "next/image";
import { ReactNode } from "react";
import {
  fetchArticleRecommendations,
  type ArticleSlot,
} from "../../../lib/article-recommendations";
import ArticleBreadcrumbs, { type BreadcrumbCrumb } from "./ArticleBreadcrumbs";
import ShopSetupRail from "./ShopSetupRail";
import InlineProductUpgrade from "./InlineProductUpgrade";
import ExpertGuidesNav, { type ExpertGuideLink } from "./ExpertGuidesNav";
import ArticleShareButtons from "./ArticleShareButtons";
import RelatedArticles, { type RelatedArticle } from "./RelatedArticles";

export interface HigherLearningArticleLayoutProps {
  /** Slug of this article — used to look up DB recommendations. */
  articleSlug: string;
  /** Breadcrumb tail (Home is auto-prepended). */
  breadcrumbs: BreadcrumbCrumb[];
  /** Article header. */
  title: string;
  deck: string; // sub-headline
  author: string;
  publishedDate: string; // pre-formatted, e.g., "May 18, 2024"
  readTime: string; // e.g., "6 min read"
  authorAvatar?: string;
  hero: { src: string; alt: string };
  /** Article body — long-form content + any inline components (decision block, etc.). */
  children: ReactNode;
  /** Right-rail "Shop All" CTA — broad-intent fallback below the curated SKUs. */
  shopAllRail?: { href: string; label: string };
  /** Optional title override for the rail card. */
  railHeading?: string;
  /**
   * Editor-set fallback slugs per slot. Used only when the DB has zero rows
   * for that slot — lets a brand-new article ship looking correct before any
   * `article_recommended_products` rows exist. DB rows take precedence as
   * soon as they're added.
   */
  fallbackProductSlugs?: Partial<Record<ArticleSlot, string[]>>;
  /** Where the inline "Upgrade Your Setup" carousel renders. Default: just before related articles. */
  inlineUpgradePosition?: "after-children" | "none";
  inlineUpgradeHeading?: string;
  /** "You Might Also Like" cards. */
  relatedArticles?: RelatedArticle[];
  /** Right-rail secondary nav. Falls back to defaults inside ExpertGuidesNav when omitted. */
  expertGuides?: ExpertGuideLink[];
  /** Optional content overlaid on the hero image (e.g., trust-badge row anchored to bottom). */
  heroOverlay?: ReactNode;
  /** Optional extra widgets appended to the right-rail aside (between Shop rail and Expert guides). */
  extraRailContent?: ReactNode;
  /** When true, renders RelatedArticles inside the right-rail aside instead of the article column. */
  relatedArticlesInRail?: boolean;
}

/**
 * Reusable layout for Higher Learning article pages. Renders the full chrome
 * (breadcrumbs, header, hero, sticky right rail, share buttons, related
 * articles, expert-guides nav) and slots the article body in via `children`.
 *
 * Server component — fetches recommendations on the server so the rail and
 * inline carousel stream with the page. The Share buttons component is the
 * only client island.
 */
export default async function HigherLearningArticleLayout(
  props: HigherLearningArticleLayoutProps,
) {
  const recs = await fetchArticleRecommendations({
    articleSlug: props.articleSlug,
    fallbackProductSlugs: props.fallbackProductSlugs,
  });

  const inlinePosition = props.inlineUpgradePosition ?? "after-children";

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10">
        <div className="mb-6">
          <ArticleBreadcrumbs crumbs={props.breadcrumbs} />
        </div>

        {/* Header: title + deck on the left, hero image on the right */}
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 mb-10">
          <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1">
            <h1 className="font-bold text-3xl md:text-4xl lg:text-[44px] leading-[1.1] text-neutral-900 mb-4"
                style={{ fontFamily: "'Fira Sans','Inter',sans-serif", letterSpacing: '0.02em' }}>
              {props.title}
            </h1>
            <p className="text-base text-neutral-600 leading-relaxed mb-5 max-w-md">
              {props.deck}
            </p>
            <div className="flex items-center gap-3 text-xs text-neutral-500">
              {props.authorAvatar && (
                <Image
                  src={props.authorAvatar}
                  alt={props.author}
                  width={32}
                  height={32}
                  className="rounded-full border border-neutral-200"
                />
              )}
              <span>By {props.author}</span>
              <span aria-hidden>•</span>
              <span>{props.publishedDate}</span>
              <span aria-hidden>•</span>
              <span>{props.readTime}</span>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative aspect-[16/10] lg:aspect-[5/4] rounded-lg overflow-hidden bg-neutral-900">
              <Image
                src={props.hero.src}
                alt={props.hero.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {props.heroOverlay && (
                <div className="absolute inset-x-0 bottom-0 z-10">
                  {props.heroOverlay}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Body grid: article column + sticky right rail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          <article className="lg:col-span-8 max-w-3xl">
            {props.children}

            {inlinePosition === "after-children" && recs.inline.length > 0 && (
              <InlineProductUpgrade
                products={recs.inline}
                heading={props.inlineUpgradeHeading}
              />
            )}

            {!props.relatedArticlesInRail &&
              props.relatedArticles &&
              props.relatedArticles.length > 0 && (
                <RelatedArticles items={props.relatedArticles} />
              )}
          </article>

          <aside className="lg:col-span-4 space-y-5">
            <div className="lg:sticky lg:top-24 space-y-5">
              <ArticleShareButtons title={props.title} />

              <ShopSetupRail
                products={recs.rail}
                shopAllHref={props.shopAllRail?.href}
                shopAllLabel={props.shopAllRail?.label}
                heading={props.railHeading}
              />

              {props.extraRailContent}

              {props.relatedArticlesInRail &&
                props.relatedArticles &&
                props.relatedArticles.length > 0 && (
                  <RelatedArticles
                    items={props.relatedArticles}
                    variant="rail"
                  />
                )}

              <ExpertGuidesNav links={props.expertGuides} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
