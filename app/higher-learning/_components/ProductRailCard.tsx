import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import StarRating from "../../components/reviews/StarRating";
import type { ArticleProductCard } from "../../../lib/article-recommendations";

interface ProductRailCardProps {
  product: ArticleProductCard;
  /** Visual variant — "rail" (compact horizontal) or "inline" (taller card grid). */
  variant: "rail" | "inline";
  ctaLabel?: string;
}

function productHref(p: ArticleProductCard): string {
  return p.slug ? `/product/${p.slug}` : `/product/${p.id}`;
}

function priceDisplay(p: ArticleProductCard): string | null {
  const price = p.salePrice && p.salePrice > 0 ? p.salePrice : p.price;
  return price !== null ? `$${price.toFixed(2)}` : null;
}

/**
 * Decide which product the card actually surfaces as the primary click target.
 *
 * Rules:
 *   - No successor → article product (normal behavior).
 *   - Has successor + article product is in stock → article product is primary,
 *     successor surfaces as a secondary "Newer model available" badge link.
 *   - Has successor + article product is OUT of stock + successor is in stock →
 *     successor becomes primary; original gets a one-liner if requested by the
 *     reader, but doesn't take the click.
 */
function resolvePrimary(p: ArticleProductCard): {
  primary: ArticleProductCard;
  successorBadge: { successor: ArticleProductCard; note: string | null } | null;
  showOriginalSoldOutNote: boolean;
} {
  const successor = p.supersession?.successor ?? null;
  const note = p.supersession?.note ?? null;

  // No successor — straightforward.
  if (!successor) {
    return { primary: p, successorBadge: null, showOriginalSoldOutNote: false };
  }

  // Determine stock state. stock_quantity is the customer-facing count; treat
  // null/undefined as "stock unknown" — keep the old SKU primary in that case
  // (Zoho-disconnected default), since silently swapping to the successor
  // would be more surprising than showing the old one with the badge.
  const originalInStock = (p.stockQuantity ?? 1) > 0;
  const successorInStock = (successor.stockQuantity ?? 1) > 0;

  if (!originalInStock && successorInStock) {
    return {
      primary: successor,
      successorBadge: null,
      showOriginalSoldOutNote: true,
    };
  }

  // Original in stock (or stock unknown) — keep as primary, show successor badge.
  return {
    primary: p,
    successorBadge: { successor, note },
    showOriginalSoldOutNote: false,
  };
}

export default function ProductRailCard({ product, variant, ctaLabel }: ProductRailCardProps) {
  const { primary, successorBadge, showOriginalSoldOutNote } = resolvePrimary(product);
  const price = priceDisplay(primary);
  const cta = ctaLabel ?? (variant === "rail" ? "View Product" : "Shop Now");

  if (variant === "rail") {
    return (
      <article className="flex gap-3 items-start">
        <Link
          href={productHref(primary)}
          className="block w-[88px] h-[88px] shrink-0 rounded-md overflow-hidden bg-neutral-100 border border-neutral-200"
        >
          {primary.imageUrl && (
            <Image
              src={primary.imageUrl}
              alt={primary.name}
              width={176}
              height={176}
              className="w-full h-full object-contain p-1.5"
            />
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={productHref(primary)} className="block group">
            <h3 className="text-sm font-bold text-neutral-900 leading-snug line-clamp-2 group-hover:text-[#1B7A4D] transition-colors">
              {primary.name}
            </h3>
          </Link>

          {price && (
            <p className="mt-1 text-sm font-bold text-neutral-900">{price}</p>
          )}

          {primary.averageRating !== null && (
            <div className="mt-1 flex items-center gap-1.5">
              <StarRating value={primary.averageRating} size={14} theme="light" />
              <span className="text-xs text-neutral-500">
                ({primary.reviewCount ?? 0})
              </span>
            </div>
          )}

          <Link
            href={productHref(primary)}
            className="mt-2 inline-flex items-center justify-center w-full px-3 py-1.5 border border-neutral-300 rounded-sm text-[11px] font-bold uppercase tracking-widest text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
          >
            {cta}
          </Link>

          {successorBadge && (
            <Link
              href={productHref(successorBadge.successor)}
              className="mt-2 flex items-start gap-1 text-[11px] text-[#1B7A4D] hover:text-[#133221] transition-colors group"
              title={successorBadge.note ?? undefined}
            >
              <ArrowRight className="w-3 h-3 mt-0.5 shrink-0" aria-hidden />
              <span className="leading-snug">
                <span className="font-bold uppercase tracking-wider">Newer model: </span>
                <span className="underline-offset-2 group-hover:underline">
                  {successorBadge.successor.name}
                </span>
                {successorBadge.note && (
                  <span className="block text-neutral-500 normal-case font-normal mt-0.5">
                    {successorBadge.note}
                  </span>
                )}
              </span>
            </Link>
          )}

          {showOriginalSoldOutNote && (
            <p className="mt-1.5 text-[11px] text-neutral-500 italic leading-snug">
              The original {product.name} is sold out — showing the current model.
            </p>
          )}
        </div>
      </article>
    );
  }

  // inline (mid-article 3-card upgrade carousel)
  return (
    <article className="rounded-lg border border-neutral-200 bg-white p-4 flex flex-col">
      <Link
        href={productHref(primary)}
        className="block aspect-square w-full rounded-md overflow-hidden bg-neutral-50 mb-3"
      >
        {primary.imageUrl && (
          <Image
            src={primary.imageUrl}
            alt={primary.name}
            width={400}
            height={400}
            className="w-full h-full object-contain p-3"
          />
        )}
      </Link>

      <Link href={productHref(primary)} className="group">
        <h3 className="text-sm font-bold text-neutral-900 leading-snug line-clamp-2 group-hover:text-[#1B7A4D] transition-colors min-h-[2.5rem]">
          {primary.name}
        </h3>
      </Link>

      {price && (
        <p className="mt-1 text-base font-bold text-neutral-900">{price}</p>
      )}

      {primary.averageRating !== null && (
        <div className="mt-1 flex items-center gap-1.5">
          <StarRating value={primary.averageRating} size={14} theme="light" />
          <span className="text-xs text-neutral-500">({primary.reviewCount ?? 0})</span>
        </div>
      )}

      <Link
        href={productHref(primary)}
        className="mt-3 inline-flex items-center justify-center w-full px-3 py-2 bg-[#1B4332] hover:bg-[#133221] text-white rounded-sm text-[11px] font-bold uppercase tracking-widest transition-colors"
      >
        {cta}
      </Link>

      {successorBadge && (
        <Link
          href={productHref(successorBadge.successor)}
          className="mt-2 flex items-start gap-1 text-[11px] text-[#1B7A4D] hover:text-[#133221] transition-colors group"
          title={successorBadge.note ?? undefined}
        >
          <ArrowRight className="w-3 h-3 mt-0.5 shrink-0" aria-hidden />
          <span className="leading-snug">
            <span className="font-bold uppercase tracking-wider">Newer: </span>
            <span className="underline-offset-2 group-hover:underline">
              {successorBadge.successor.name}
            </span>
          </span>
        </Link>
      )}
    </article>
  );
}
