import { Metadata } from "next";
import { Target, Waves, Zap } from "lucide-react";
import HigherLearningArticleLayout from "../_components/HigherLearningArticleLayout";
import { searchHref } from "../../../lib/search-link";
import ArticleQuickAnswer from "../_components/ArticleQuickAnswer";
import ComparisonBlock from "../_components/ComparisonBlock";
import DecisionBlock from "../_components/DecisionBlock";

const ARTICLE_SLUG = "percolator-vs-regular-bong";

const ASSETS_BASE =
  "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Blog";

// Hero / cover image (already in the bucket — used by HomeBlogArticles + Higher Learning index).
const HERO_IMAGE = `${ASSETS_BASE}/Percolator%20Bong%20Comp%20for%20Higher%20Learning%20Blog.png`;

// Comparison-block images. Sourced from real catalog SKUs in main_site_products
// so the photos always reflect a product Highway 420 actually sells.
//   Regular     → RooR PD Classic 18" Beaker 45x5mm White ($269.99)
//   Percolator  → RooR Tech Fixed 18" Straight 50x5mm 10 Arm Tree Perc ($511.99)
const REGULAR_BONG_IMAGE =
  "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/PRODUCTS/Bongs/RooR/roor-pd-classic-18-beaker-45x5mm-white-no-ice-pinches-389.jpg";
const PERCOLATOR_BONG_IMAGE =
  "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/PRODUCTS/Bongs/RooR/roor-tech-fixed-18-straight-50x5mm-10-arm-tree-perc-263.jpg";

export const metadata: Metadata = {
  title:
    "Percolator Bong vs Regular Bong: What's the Difference? | Higher Learning",
  description:
    "At first glance, most bongs look similar. We break down regular bongs vs percolator bongs across filtration, smoothness, and cost so you can pick the right setup.",
  openGraph: {
    title: "Percolator Bong vs Regular Bong: What's the Difference?",
    description:
      "Regular = simple + powerful. Percolator = smooth + refined. Here's how they actually differ.",
    type: "article",
    images: [HERO_IMAGE],
  },
};

/**
 * Article: Percolator Bong vs Regular Bong.
 *
 * Reuses the Higher Learning comparison template (same shape as
 * e-rig-vs-dab-rig): Quick Answer → two ComparisonBlocks → Real Difference
 * row → DecisionBlock → Final Take.
 *
 * Conversion data:
 *   - Right-rail products  → article_recommended_products WHERE slot='rail'
 *   - Inline upgrade row   → article_recommended_products WHERE slot='inline'
 *   - "Shop All Bongs"     → /bongs (broad-intent fallback)
 *
 * Until DB rows exist, fallbackProductSlugs renders end-to-end. Replace with
 * real merchandiser picks via SQL/Studio when ready.
 */
export default function PercolatorVsRegularBongPage() {
  return (
    <HigherLearningArticleLayout
        articleSlug={ARTICLE_SLUG}
        breadcrumbs={[
          { name: "Higher Learning", href: "/higher-learning" },
          { name: "Bongs & Glass", href: "/higher-learning?topic=bongs" },
          { name: "Percolator Bong vs Regular Bong" },
        ]}
        title="Percolator Bong vs Regular Bong: What's the Difference?"
        deck="At first glance, most bongs look similar. But once you start comparing, the experience can change a lot. Here's how they differ — and which one is right for you."
        author="Highway 420 Team"
        publishedDate="May 20, 2024"
        readTime="7 min read"
        authorAvatar={`${ASSETS_BASE}/highway420_avatar.png`}
        hero={{
          src: HERO_IMAGE,
          alt: "Side-by-side comparison of a classic beaker bong and a percolator bong.",
        }}
        shopAllRail={{ href: searchHref("Bongs"), label: "Shop All Bongs" }}
        railHeading="Shop This Setup"
        inlineUpgradeHeading="Upgrade Your Setup"
        // Replace with the merchandiser's real product slugs once committed.
        fallbackProductSlugs={{
          rail: [
            "classic-beaker-bong",
            "tree-percolator-bong",
            "blazer-big-shot-torch",
          ],
          inline: [
            "classic-beaker-bong",
            "tree-percolator-bong",
            "recycler-percolator-bong",
            "showerhead-perc-bong",
          ],
        }}
        relatedArticles={[
          {
            href: "/higher-learning/how-to-clean-bong",
            title: "How to Clean Your Bong the Right Way",
            category: "Bongs & Glass",
            image: {
              src: HERO_IMAGE,
              alt: "Hands cleaning a glass bong with brushes and solution.",
            },
          },
          {
            href: "/higher-learning/best-water-for-bong",
            title: "Best Water for Your Bong: Does It Matter?",
            category: "How To",
            image: {
              src: HERO_IMAGE,
              alt: "Pouring fresh water into a glass bong.",
            },
          },
          {
            href: "/higher-learning/inline-vs-showerhead-perc",
            title: "Inline vs Showerhead Perc: What's Better?",
            category: "Bongs & Glass",
            image: {
              src: HERO_IMAGE,
              alt: "Two percolator styles compared side by side.",
            },
          },
        ]}
      >
        <ArticleQuickAnswer
          takeaways={[
            "Regular bongs = stronger, more direct hits",
            "Percolator bongs = smoother, cooler smoke",
          ]}
          picks={[
            {
              label: "Best for simplicity & power",
              value: "Regular Bong",
              href: searchHref("Beaker Bong"),
              icon: "star",
            },
            {
              label: "Best for smoothness & comfort",
              value: "Percolator",
              href: searchHref("Percolator Bong"),
              icon: "flame",
            },
          ]}
        />

        <div className="mt-10 space-y-10">
          <ComparisonBlock
            heading="What Is a Regular Bong?"
            description="A regular bong is the classic, straightforward water pipe. It uses a single chamber of water to filter smoke before inhalation. Because of its simple design, airflow stays direct and unrestricted — resulting in a stronger, more immediate hit."
            image={{
              src: REGULAR_BONG_IMAGE,
              alt: "A classic beaker-style regular bong with a single water chamber.",
            }}
            features={[
              "Single chamber",
              "Basic water filtration",
              "Straightforward airflow",
            ]}
            pros={["Easy to use", "Lower cost", "Minimal maintenance"]}
            cons={["Harsher hits", "Less filtration", "Warmer smoke"]}
            bestForCopy="Users who want simplicity, power, and a no-fuss experience."
            bestForHref={searchHref("Beaker Bong")}
          />

          <ComparisonBlock
            divider
            heading="What Is a Percolator Bong?"
            description="A percolator bong adds one or more additional filtration chambers — called percs — inside the piece. These percs break smoke into smaller bubbles, increasing surface area and allowing the water to cool and filter the smoke more effectively. The result is a smoother, more refined session."
            image={{
              src: PERCOLATOR_BONG_IMAGE,
              alt: "A percolator bong with a tree-style perc visible in the chamber.",
            }}
            features={[
              "One or multiple percolators",
              "Increased diffusion",
              "Enhanced filtration",
            ]}
            pros={["Smoother hits", "Cooler smoke", "Better filtration"]}
            cons={[
              "Higher cost",
              "More complex cleaning",
              "Slightly more airflow resistance",
            ]}
            bestForCopy="Users who prioritize smoothness, comfort, and a refined experience."
            bestForHref={searchHref("Percolator Bong")}
          />
        </div>

        <RealDifference />

        <DecisionBlock
          title="Which Should You Choose?"
          intro="It comes down to how you like to smoke."
          left={{
            heading: "Choose a regular bong if:",
            items: [
              "You want a simple setup",
              "You prefer stronger, more direct hits",
              "You want low maintenance",
            ],
          }}
          right={{
            heading: "Choose a percolator bong if:",
            items: [
              "You want smoother sessions",
              "You care about cooler smoke",
              "You don't mind a little extra cleaning",
            ],
          }}
        />

        <FinalTake />
    </HigherLearningArticleLayout>
  );
}

/* ---------- Article-local components ---------- */

function RealDifference() {
  return (
    <section className="mt-12">
      <h2 className="text-2xl md:text-[28px] font-bold text-neutral-900 mb-2 leading-tight">
        The Real Difference
      </h2>
      <p className="text-[15px] text-neutral-700 mb-5">
        Both types get the job done — but the feel is very different.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-5 md:p-6">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-[#f0f5e8] border border-[#d8e6cf] flex items-center justify-center text-[#1B7A4D] shrink-0">
            <Target className="w-5 h-5" aria-hidden />
          </div>
          <p className="text-[14px] text-neutral-700 leading-relaxed">
            <span className="font-semibold text-neutral-900">Regular bongs</span>{" "}
            deliver stronger, more direct hits with minimal resistance.
          </p>
        </div>

        <div className="flex items-start gap-3 md:border-l md:border-neutral-200 md:pl-6">
          <div className="w-12 h-12 rounded-full bg-[#eaf2f7] border border-[#cfdfe9] flex items-center justify-center text-[#1f6f8b] shrink-0">
            <Waves className="w-5 h-5" aria-hidden />
          </div>
          <p className="text-[14px] text-neutral-700 leading-relaxed">
            <span className="font-semibold text-neutral-900">Percolator bongs</span>{" "}
            focus on smoothing and cooling each inhale.
          </p>
        </div>
      </div>
    </section>
  );
}

function FinalTake() {
  return (
    <section className="mt-12">
      <h2 className="text-2xl md:text-[28px] font-bold text-neutral-900 mb-2 leading-tight">
        Final Take
      </h2>
      <p className="text-[15px] text-neutral-700 mb-4">
        There's no one-size-fits-all answer — just what fits your style.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-lg border border-neutral-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#f0f5e8] border border-[#d8e6cf] flex items-center justify-center text-[#1B7A4D] shrink-0">
            <Zap className="w-4 h-4" aria-hidden />
          </div>
          <p className="text-[14px] text-neutral-800">
            <span className="font-bold">Regular</span> = simple + powerful
          </p>
        </div>

        <div className="flex items-center gap-3 md:border-l md:border-neutral-200 md:pl-5">
          <div className="w-10 h-10 rounded-full bg-[#eaf2f7] border border-[#cfdfe9] flex items-center justify-center text-[#1f6f8b] shrink-0">
            <Waves className="w-4 h-4" aria-hidden />
          </div>
          <p className="text-[14px] text-neutral-800">
            <span className="font-bold">Percolator</span> = smooth + refined
          </p>
        </div>
      </div>

      <p className="mt-3 text-[14px] text-neutral-600">
        Many users keep both on hand depending on the session.
      </p>
    </section>
  );
}
