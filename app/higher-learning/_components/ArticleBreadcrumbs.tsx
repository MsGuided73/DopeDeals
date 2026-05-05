import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbCrumb {
  name: string;
  href?: string;
}

interface ArticleBreadcrumbsProps {
  crumbs: BreadcrumbCrumb[];
}

/**
 * Light-theme breadcrumbs for Higher Learning article pages.
 * Distinct from the global dark-theme GlobalBreadcrumbs because the article
 * layout sits on a white/cream background.
 */
export default function ArticleBreadcrumbs({ crumbs }: ArticleBreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-neutral-500" aria-label="Breadcrumb">
      <Link href="/" className="hover:text-neutral-900 transition-colors">
        Home
      </Link>
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" aria-hidden />
          {c.href ? (
            <Link href={c.href} className="hover:text-neutral-900 transition-colors">
              {c.name}
            </Link>
          ) : (
            <span className="text-neutral-900 font-medium">{c.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
