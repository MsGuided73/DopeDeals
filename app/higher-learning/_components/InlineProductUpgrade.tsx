import { TrendingUp } from "lucide-react";
import ProductRailCard from "./ProductRailCard";
import type { ArticleProductCard } from "../../../lib/article-recommendations";

interface InlineProductUpgradeProps {
  /** 3 products positioned mid-article — the upgrade path after the reader has decided. */
  products: ArticleProductCard[];
  heading?: string;
}

/**
 * Mid-article 3-card "Upgrade Your Setup" carousel. Different intent from the
 * sticky rail: the rail is "buy what's in the photos," this is "you've
 * decided, here's where to go next."
 */
export default function InlineProductUpgrade({
  products,
  heading = "Upgrade Your Setup",
}: InlineProductUpgradeProps) {
  if (products.length === 0) return null;

  return (
    <section className="my-12 rounded-lg border border-neutral-200 bg-neutral-50 p-5 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-[#1B7A4D]" aria-hidden />
        <h2 className="text-base md:text-lg font-bold text-neutral-900">{heading}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <ProductRailCard key={p.id} product={p} variant="inline" />
        ))}
      </div>
    </section>
  );
}
