import Link from "next/link";
import ProductRailCard from "./ProductRailCard";
import type { ArticleProductCard } from "../../../lib/article-recommendations";

interface ShopSetupRailProps {
  /** "Shop This Setup" — the products this article actually photographs/discusses. */
  products: ArticleProductCard[];
  /** "Shop All Dab Rigs" CTA at the bottom of the rail. Optional. */
  shopAllHref?: string;
  shopAllLabel?: string;
  /** Section heading override. Default: "Shop This Setup". */
  heading?: string;
}

/**
 * Sticky right-rail product list. Highest-intent conversion surface on the
 * page — visible the entire scroll. Renders a compact card per product, with
 * supersession ("Newer model available") affordances inherited from
 * ProductRailCard.
 *
 * The wrapping <aside> is sticky-positioned by HigherLearningArticleLayout,
 * not here, so this component can also be reused inline if needed.
 */
export default function ShopSetupRail({
  products,
  shopAllHref,
  shopAllLabel = "Shop All",
  heading = "Shop This Setup",
}: ShopSetupRailProps) {
  if (products.length === 0 && !shopAllHref) return null;

  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-5">
      <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-200 pb-3 mb-4">
        {heading}
      </h2>

      {products.length > 0 && (
        <div className="space-y-5">
          {products.map((p) => (
            <ProductRailCard key={p.id} product={p} variant="rail" />
          ))}
        </div>
      )}

      {shopAllHref && (
        <Link
          href={shopAllHref}
          className="mt-5 inline-flex w-full items-center justify-center px-4 py-3 bg-[#1B4332] hover:bg-[#133221] text-white rounded-sm font-bold text-xs tracking-widest uppercase transition-colors"
        >
          {shopAllLabel}
        </Link>
      )}
    </section>
  );
}
