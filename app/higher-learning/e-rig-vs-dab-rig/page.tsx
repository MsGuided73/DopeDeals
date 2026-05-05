import { Metadata } from "next";
import GlobalMasthead from "../../components/GlobalMasthead";
import HigherLearningArticleLayout from "../_components/HigherLearningArticleLayout";
import ArticleQuickAnswer from "../_components/ArticleQuickAnswer";
import ComparisonBlock from "../_components/ComparisonBlock";
import DecisionBlock from "../_components/DecisionBlock";

const ARTICLE_SLUG = "e-rig-vs-dab-rig";

const ASSETS_BASE =
  "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Blog";

export const metadata: Metadata = {
  title:
    "E-Rig vs Dab Rig: Which Is Better for Flavor, Convenience, and Performance? | Higher Learning",
  description:
    "Not sure which setup fits your style? We compare e-rigs and traditional dab rigs across flavor, convenience, and performance so you can pick the right one.",
  openGraph: {
    title:
      "E-Rig vs Dab Rig: Which Is Better for Flavor, Convenience, and Performance?",
    description:
      "Not sure which setup fits your style? Here's exactly how they compare.",
    type: "article",
    images: [`${ASSETS_BASE}/dab%20and%20e-rg%20-%20Copy.png`],
  },
};

/**
 * Article: E-Rig vs Dab Rig.
 *
 * Renders inside HigherLearningArticleLayout, which provides breadcrumbs,
 * header, hero, sticky right rail (Shop This Setup + Shop All Dab Rigs CTA),
 * inline upgrade carousel, related articles, and expert-guides nav.
 *
 * Conversion data sources:
 *   - Right-rail products    → article_recommended_products WHERE slot='rail'
 *   - Inline upgrade row     → article_recommended_products WHERE slot='inline'
 *   - "Shop All Dab Rigs"    → /dabsntools (broad-intent fallback)
 *   - "Best for…" lines      → linked to /dabsntools subcategories
 *
 * Until DB rows exist, fallbackProductSlugs (below) renders the article
 * end-to-end. Add rows to article_recommended_products to take over — DB
 * rows always win.
 */
export default function ERigVsDabRigPage() {
  return (
    <>
      <GlobalMasthead />
      <HigherLearningArticleLayout
        articleSlug={ARTICLE_SLUG}
        breadcrumbs={[
          { name: "Higher Learning", href: "/higher-learning" },
          { name: "Dab Rigs", href: "/higher-learning?topic=dab-rigs" },
          { name: "E-Rig vs Dab Rig" },
        ]}
        title="E-Rig vs Dab Rig: Which Is Better for Flavor, Convenience, and Performance?"
        deck="Not sure which setup fits your style? Here's exactly how they compare."
        author="Highway 420 Team"
        publishedDate="May 18, 2024"
        readTime="6 min read"
        authorAvatar={`${ASSETS_BASE}/highway420_avatar.png`}
        hero={{
          src: `${ASSETS_BASE}/dab%20and%20e-rg%20-%20Copy.png`,
          alt: "An electronic e-rig sitting next to a traditional glass dab rig.",
        }}
        shopAllRail={{ href: "/dabsntools", label: "Shop All Dab Rigs" }}
        railHeading="Shop This Setup"
        inlineUpgradeHeading="Upgrade Your Setup"
        // Editor fallbacks — used only until article_recommended_products has rows.
        // Replace these slugs once the merchandiser commits real picks via SQL/Studio.
        fallbackProductSlugs={{
          rail: ["diamond-glass-inline-rig", "puffco-peak-pro", "blazer-big-shot-torch"],
          inline: ["diamond-glass-beaker-rig", "puffco-peak-pro", "blazer-big-shot-torch"],
        }}
        relatedArticles={[
          {
            href: "/higher-learning/percolator-vs-regular-bong",
            title: "Percolator vs Regular Bong: What's the Difference?",
            category: "Bongs & Glass",
            image: {
              src: `${ASSETS_BASE}/Percolator%20Bong%20Comp%20for%20Higher%20Learning%20Blog.png`,
              alt: "Two bongs side by side comparing percolated and standard glass.",
            },
          },
          {
            href: "/higher-learning/how-to-grind-weed",
            title: "How to Grind Properly for a Smoother Smoke",
            category: "How To",
            image: {
              src: `${ASSETS_BASE}/Grinder%20Image%20for%20Blog%20and%20Grid.png`,
              alt: "Cannabis grinder with freshly ground flower beside it.",
            },
          },
          {
            href: "/higher-learning/how-to-clean-dab-rig",
            title: "How to Clean Your Dab Rig the Right Way",
            category: "How To",
            image: {
              src: `${ASSETS_BASE}/dab%20and%20e-rg%20-%20Copy.png`,
              alt: "Hand cleaning a glass dab rig.",
            },
          },
        ]}
      >
        <ArticleQuickAnswer
          takeaways={[
            "E-rigs = convenience + consistency",
            "Dab rigs = control + flavor",
          ]}
          picks={[
            {
              label: "Best for beginners",
              value: "E-Rig",
              href: "/dabsntools?type=e-rigs",
              icon: "star",
            },
            {
              label: "Best for enthusiasts",
              value: "Traditional Rig",
              href: "/dabsntools?type=glass-rigs",
              icon: "flame",
            },
          ]}
        />

        <div className="mt-10 space-y-10">
          <ComparisonBlock
            heading="What Is a Traditional Dab Rig?"
            description="A traditional dab rig is a manual setup that uses a torch to heat a banger or nail. It requires a bit more technique but gives you complete control over temperature, timing, and airflow—delivering maximum flavor and customization."
            image={{
              src: `${ASSETS_BASE}/dab%20and%20e-rg%20-%20Copy.png`,
              alt: "Torch heating a banger on a traditional glass dab rig.",
            }}
            pros={[
              "Full control over temperature",
              "Strong, flavorful hits",
              "Lower upfront cost",
            ]}
            cons={[
              "Requires a torch",
              "Learning curve",
              "Less portable",
            ]}
            bestForCopy="People who want the authentic, hands-on experience."
            bestForHref="/dabsntools?type=glass-rigs"
          />

          <ComparisonBlock
            divider
            heading="What Is an E-Rig?"
            description="An e-rig is an electronic dab device that heats your concentrate with the press of a button. It offers precise temperature control, consistent hits, and is incredibly easy to use—making it perfect for everyday sessions and beginners."
            image={{
              src: `${ASSETS_BASE}/Puffco_Peak_Pro_Hero.png`,
              alt: "An electronic e-rig with chamber and mouthpiece visible.",
            }}
            pros={[
              "Easy to use",
              "Consistent temperature",
              "Portable and clean",
            ]}
            cons={[
              "Higher upfront cost",
              'Less "manual control" feel',
              "Needs charging",
            ]}
            bestForCopy="Convenience, portability, and plug-and-play sessions."
            bestForHref="/dabsntools?type=e-rigs"
          />
        </div>

        <DecisionBlock
          intro="It comes down to how you like to enjoy your sessions."
          left={{
            heading: "Choose a traditional rig if:",
            items: [
              "You enjoy the ritual",
              "You want full control",
              "You're chasing peak flavor",
            ],
          }}
          right={{
            heading: "Choose an E-Rig if:",
            items: [
              "You want convenience",
              "You don't want a torch",
              "You prefer quick, clean sessions",
            ],
          }}
        />

        <section className="mt-12">
          <h2 className="text-2xl md:text-[28px] font-bold text-neutral-900 mb-3 leading-tight">
            Final Take
          </h2>
          <p className="text-[15px] text-neutral-700 leading-relaxed mb-2">
            There's no single "better" option—only what fits your style.
          </p>
          <p className="text-[15px] text-neutral-800 font-semibold mb-2">
            Traditional = control + ritual &nbsp;|&nbsp; E-rig = convenience + consistency
          </p>
          <p className="text-[15px] text-neutral-700 leading-relaxed">
            Many experienced users keep both in rotation depending on the situation.
          </p>
        </section>
      </HigherLearningArticleLayout>
    </>
  );
}
