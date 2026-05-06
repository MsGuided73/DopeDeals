import { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  Beaker,
  ChevronRight,
  CookingPot,
  FlaskConical,
  Landmark,
  Leaf,
  Map,
  Scale,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sprout,
  Target,
  Truck,
} from "lucide-react";
import HigherLearningArticleLayout from "../_components/HigherLearningArticleLayout";
import IconRowSection from "../_components/IconRowSection";
import InlineHighlightCallout from "../_components/InlineHighlightCallout";
import CheckmarkList from "../_components/CheckmarkList";
import StateLegalityChecker from "../_components/StateLegalityChecker";

const ARTICLE_SLUG = "thca-legal-alternative";

const ASSETS_BASE =
  "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Blog";

// IMAGES TO UPLOAD
//
// Cover photo (article hero, ~1000x800):
//   ${ASSETS_BASE}/thca-legal-alternative-hero.png
//
// Landing-page link photo (homepage 3-card grid + Higher Learning index thumb,
// ~1280x720):
//   ${ASSETS_BASE}/thca-legal-alternative-card.png
//
// Both are referenced below and on the homepage cards. Once uploaded to the
// Supabase `Highway420_assets/Blog` bucket with these names, the page renders
// end-to-end. No code change required.
const THCA_HERO_IMAGE = `${ASSETS_BASE}/THCA/map%20and%20flower%20and%20scale%20only.png`;

export const metadata: Metadata = {
  title:
    "THCA: The Legal Alternative in States Without Medical or Recreational THC | Higher Learning",
  description:
    "Hemp-derived THCA products offer a federally compliant alternative under the 2018 Farm Bill. Here's how the regulatory framework, product formats, and state availability really work.",
  openGraph: {
    title:
      "THCA: The Legal Alternative in States Without Medical or Recreational THC",
    description:
      "How hemp-derived THCA fits inside the 2018 Farm Bill framework — and what that means for availability in your state.",
    type: "article",
    images: [THCA_HERO_IMAGE],
  },
};

/**
 * Article: THCA — The Legal Alternative.
 *
 * Renders inside HigherLearningArticleLayout, which provides breadcrumbs,
 * header, hero, sticky right rail, share buttons, and related articles. This
 * page slots in:
 *   - Hero overlay  → 3 trust badges anchored to the bottom of the hero image
 *   - Body content  → "Federally Legal" CTA + 7 IconRowSections
 *   - Extra rail    → State Legality Checker form (THCA-specific)
 *   - Bottom CTA    → "Explore THCA Products" trust-badges banner
 *
 * Conversion data:
 *   - Right-rail products → article_recommended_products WHERE slot='rail'
 *     for slug 'thca-legal-alternative'. Until rows exist, the
 *     fallbackProductSlugs below render the rail. Replace with real slugs
 *     once the merchandiser commits picks (THCA Flower / Pre-Rolls / Gummies
 *     / Chocolate).
 */
export default function ThcaLegalAlternativePage() {
  return (
    <HigherLearningArticleLayout
        articleSlug={ARTICLE_SLUG}
        breadcrumbs={[
          { name: "Higher Learning", href: "/higher-learning" },
          { name: "THCA", href: "/higher-learning?topic=thca" },
          { name: "THCA: The Legal Alternative" },
        ]}
        title="THCA: The Legal Alternative in States Without Medical or Recreational THC"
        deck="In many parts of the U.S., access to traditional THC products is still limited by state law. THCA products offer a lawful, hemp-derived alternative under the 2018 Farm Bill."
        author="Highway 420 Team"
        publishedDate="May 20, 2024"
        readTime="8 min read"
        authorAvatar={`${ASSETS_BASE}/highway420_avatar.png`}
        hero={{
          src: THCA_HERO_IMAGE,
          alt: "THCA flower beside a U.S. map outline and scales of justice — illustrating the federal vs. state legal framework.",
        }}
        heroOverlay={<HeroBadgeRow />}
        shopAllRail={{ href: "/shop/thca", label: "Shop All THCA" }}
        railHeading="Shop THCA Products"
        inlineUpgradePosition="none"
        // Replace with the merchandiser's real product slugs once committed.
        fallbackProductSlugs={{
          rail: [
            "thca-flower",
            "thca-pre-rolls",
            "thca-gummies",
            "thca-chocolate",
          ],
        }}
        extraRailContent={<StateLegalityChecker />}
        relatedArticlesInRail
        relatedArticles={[
          {
            href: "/higher-learning/thca-vs-thc",
            title: "THCA vs THC: What's the Difference?",
            category: "Education",
            image: {
              src: `${ASSETS_BASE}/thca-vs-thc-card.png`,
              alt: "Cannabis leaf beside molecular icons comparing THCA and THC.",
            },
          },
          {
            href: "/higher-learning/is-thca-legal-in-your-state",
            title: "Is THCA Legal in Your State?",
            category: "Compliance",
            image: {
              src: `${ASSETS_BASE}/thca-state-legality-card.png`,
              alt: "Scales of justice over a U.S. map highlighting state-by-state THCA legality.",
            },
          },
          {
            href: "/higher-learning/best-thca-flower",
            title: "Best THCA Flower: What to Look For",
            category: "Product Guide",
            image: {
              src: `${ASSETS_BASE}/best-thca-flower-card.png`,
              alt: "Premium THCA flower nug shown in macro detail.",
            },
          },
        ]}
      >
        <FederallyLegalCallout />

        <div className="mt-8">
          <IconRowSection
            divider={false}
            icon={<Leaf className="w-7 h-7" aria-hidden />}
            title="What Is THCA?"
            rightContent={
              <CheckmarkList
                items={[
                  "Found in raw hemp flower",
                  "Naturally occurring cannabinoid",
                  "Distinct from Delta-9 THC in regulatory classification",
                ]}
              />
            }
          >
            <p>
              THCA (tetrahydrocannabinolic acid) is a naturally occurring compound
              found in cannabis and hemp plants. In hemp-derived products, THCA
              exists in its raw form and is classified differently than Delta-9
              THC under federal law.
            </p>
          </IconRowSection>

          <IconRowSection
            icon={<Map className="w-7 h-7" aria-hidden />}
            title="Why THCA Is Available in More States"
            leftBelow={
              <InlineHighlightCallout label="In simple terms:" tone="neutral">
                THCA products can fall within federal hemp guidelines, making
                them more accessible in areas where cannabis laws are more
                restrictive.
              </InlineHighlightCallout>
            }
          >
            <p>
              Under the 2018 Farm Bill, hemp-derived products are federally legal
              if they contain no more than 0.3% Delta-9 THC by dry weight.
              Because THCA is measured differently than Delta-9 THC, certain
              hemp-derived products can meet federal compliance standards while
              still offering a different cannabinoid profile than traditional
              cannabis.
            </p>
          </IconRowSection>

          <IconRowSection
            icon={<ShoppingBag className="w-7 h-7" aria-hidden />}
            title="A Growing Category in the Hemp Market"
            rightContent={
              <div>
                <p className="text-[14px] font-semibold text-neutral-900 mb-2">
                  Common product formats include:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-[14px] text-neutral-700 leading-relaxed">
                  <li>THCA flower</li>
                  <li>Pre-rolls</li>
                  <li>Gummies</li>
                  <li>Chocolate and other edibles</li>
                </ul>
                <p className="mt-3 text-[12.5px] text-neutral-500 leading-relaxed">
                  Availability may vary depending on state regulations.
                </p>
              </div>
            }
          >
            <p>
              THCA has quickly become one of the most talked-about segments
              within the hemp industry. Consumers are exploring these products
              as part of a broader shift toward hemp-derived alternatives.
            </p>
          </IconRowSection>

          <IconRowSection
            icon={<Scale className="w-7 h-7" aria-hidden />}
            title="Understanding Legal Nuance"
            rightContent={
              <div className="rounded-md border border-[#e8e1cf] bg-[#f7f4ec] p-4">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck
                    className="w-5 h-5 text-[#1B7A4D] shrink-0 mt-0.5"
                    aria-hidden
                  />
                  <p className="text-[13.5px] text-neutral-700 leading-relaxed">
                    There are proposed legislative discussions that could impact
                    allowable THC thresholds in raw, unheated products.
                  </p>
                </div>
              </div>
            }
            leftBelow={
              <InlineHighlightCallout label="Bottom line:" tone="neutral">
                THCA exists within a rapidly evolving legal landscape, and
                staying informed is important.
              </InlineHighlightCallout>
            }
          >
            <p>
              While THCA products can fall under federal hemp definitions, state
              laws vary. Some states have embraced hemp-derived products, others
              have added restrictions, and many are still working through
              legislative updates.
            </p>
          </IconRowSection>

          <IconRowSection
            icon={<Search className="w-7 h-7" aria-hidden />}
            title="How to Navigate Availability"
            rightContent={
              <p className="text-[14px] text-neutral-700 leading-relaxed">
                We maintain a real-time overview of THCA availability across all{" "}
                <span className="font-semibold text-[#1B7A4D]">50 states</span>{" "}
                so you can shop with confidence based on your location.
              </p>
            }
          >
            <p>
              Because regulations differ across the country, availability isn't
              always consistent. That's why many consumers rely on updated
              resources to understand what's currently allowed in their state.
            </p>
          </IconRowSection>

          <IconRowSection
            icon={<Sprout className="w-7 h-7" aria-hidden />}
            title="Which Products Should You Explore?"
            rightContent={<ProductFormatGrid />}
          >
            <p>
              If you're considering hemp-derived options, THCA products offer a
              range of formats to fit different preferences and lifestyles.
            </p>
          </IconRowSection>

          <IconRowSection
            icon={<Target className="w-7 h-7" aria-hidden />}
            title="Final Take"
            rightContent={
              <CheckmarkList
                items={[
                  "THCA = federally compliant hemp-derived cannabinoid category",
                  "Availability = dependent on evolving state laws",
                ]}
              />
            }
          >
            <p>
              In states without medical or recreational THC access, THCA has
              emerged as a notable category within the hemp market.
            </p>
          </IconRowSection>
        </div>

        <ExploreThcaBanner />
    </HigherLearningArticleLayout>
  );
}

/* ---------- Article-local components ---------- */

function HeroBadgeRow() {
  const badges = [
    { icon: <Leaf className="w-4 h-4" aria-hidden />, label: "2018 Farm Bill", sub: "Compliant" },
    {
      icon: <FlaskConical className="w-4 h-4" aria-hidden />,
      label: "< 0.3% Delta-9 THC",
      sub: "( raw, unheated )",
    },
    {
      icon: <ShieldCheck className="w-4 h-4" aria-hidden />,
      label: "Legal in More",
      sub: "States",
    },
  ];

  return (
    <div className="flex items-center justify-around gap-2 px-3 py-3 bg-gradient-to-t from-black/85 via-black/55 to-transparent">
      {badges.map((b, i) => (
        <div
          key={i}
          className="flex items-center gap-2 rounded-full bg-black/70 backdrop-blur-sm px-3 py-1.5 border border-white/10"
        >
          <span className="text-[#4ade80]">{b.icon}</span>
          <span className="text-white leading-tight">
            <span className="block text-[11px] font-bold tracking-wide">{b.label}</span>
            <span className="block text-[10px] text-white/70">{b.sub}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function FederallyLegalCallout() {
  return (
    <aside className="rounded-lg border border-[#d8e6cf] bg-[#f0f5e8] p-5 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center gap-5">
        <div className="w-14 h-14 rounded-full bg-[#133221] flex items-center justify-center text-white shrink-0">
          <Landmark className="w-6 h-6" aria-hidden />
        </div>

        <div className="flex-1">
          <h2 className="text-[18px] font-bold text-neutral-900 mb-1.5">
            Federally Legal. State Dependent.
          </h2>
          <p className="text-[13.5px] text-neutral-700 leading-relaxed max-w-xl">
            Hemp-derived THCA flower contains less than 0.3% Delta-9 THC by dry
            weight, making it compliant with the 2018 Farm Bill. Availability
            may vary based on state laws.
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
          <Link
            href="#check-legality"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-[#1B4332] hover:bg-[#133221] text-white rounded-md font-bold text-[13px] tracking-wide transition-colors"
          >
            Check Your State
          </Link>
          <Link
            href="#check-legality"
            className="text-[12px] text-[#1B7A4D] hover:text-[#133221] font-semibold inline-flex items-center gap-1"
          >
            View real-time legality
            <ChevronRight className="w-3 h-3" aria-hidden />
          </Link>
        </div>
      </div>
    </aside>
  );
}

function ProductFormatGrid() {
  const formats = [
    { icon: <Leaf className="w-5 h-5" aria-hidden />, label: "Flower" },
    { icon: <Sparkles className="w-5 h-5" aria-hidden />, label: "Pre-Rolls" },
    { icon: <CookingPot className="w-5 h-5" aria-hidden />, label: "Gummies" },
    { icon: <Award className="w-5 h-5" aria-hidden />, label: "Chocolate" },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {formats.map((f) => (
        <div key={f.label} className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-[#f0f5e8] border border-[#d8e6cf] flex items-center justify-center text-[#1B7A4D]">
            {f.icon}
          </div>
          <span className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-700">
            {f.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function ExploreThcaBanner() {
  const trust = [
    { icon: <Beaker className="w-5 h-5" aria-hidden />, label: "Lab Tested", sub: "3rd-Party Verified" },
    { icon: <Leaf className="w-5 h-5" aria-hidden />, label: "2018 Farm Bill", sub: "Compliant" },
    { icon: <Award className="w-5 h-5" aria-hidden />, label: "Quality You", sub: "Can Trust" },
    { icon: <Truck className="w-5 h-5" aria-hidden />, label: "Fast & Discreet", sub: "Shipping" },
  ];

  return (
    <section className="mt-12 rounded-lg border border-[#e8e1cf] bg-[#f7f4ec] p-5 md:p-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
        <div>
          <h2 className="text-[20px] font-bold text-neutral-900 mb-1">
            Explore THCA Products
          </h2>
          <p className="text-[14px] text-neutral-700 leading-relaxed max-w-md">
            Browse our premium selection of hemp-derived THCA products.
          </p>
        </div>
        <Link
          href="/shop/thca"
          className="inline-flex items-center justify-center px-6 py-3 bg-[#1B4332] hover:bg-[#133221] text-white rounded-md font-bold text-[13px] tracking-widest uppercase transition-colors shrink-0"
        >
          Shop THCA Now
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5 border-t border-[#e8e1cf]">
        {trust.map((t, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className="text-[#1B7A4D] shrink-0">{t.icon}</span>
            <span className="text-[12px] text-neutral-700 leading-tight">
              <span className="block font-bold text-neutral-900">{t.label}</span>
              <span className="block text-neutral-500">{t.sub}</span>
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[11.5px] text-neutral-500 text-center md:text-right">
        Available where permitted by law.
      </p>
    </section>
  );
}
