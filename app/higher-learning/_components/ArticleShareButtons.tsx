"use client";

import { Twitter, Facebook, Mail } from "lucide-react";
import { useEffect, useState } from "react";

interface ArticleShareButtonsProps {
  title: string;
  /** Optional canonical URL; defaults to window.location.href on the client. */
  url?: string;
}

/**
 * Twitter / Facebook / Email share row. Client component because we read
 * window.location.href when no explicit `url` prop is provided so the share
 * URL stays correct across environments without baking it into the page.
 */
export default function ArticleShareButtons({ title, url }: ArticleShareButtonsProps) {
  const [resolvedUrl, setResolvedUrl] = useState(url ?? "");

  useEffect(() => {
    if (!url && typeof window !== "undefined") {
      setResolvedUrl(window.location.href);
    }
  }, [url]);

  const encodedUrl = encodeURIComponent(resolvedUrl);
  const encodedTitle = encodeURIComponent(title);

  const shares: Array<{ label: string; href: string; icon: typeof Twitter }> = [
    {
      label: "Share on Twitter",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: Twitter,
    },
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: Facebook,
    },
    {
      label: "Share via email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      icon: Mail,
    },
  ];

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-2.5">
        Share This Article
      </p>
      <div className="flex items-center gap-3">
        {shares.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="w-9 h-9 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-700 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors"
          >
            <Icon className="w-4 h-4" aria-hidden />
          </a>
        ))}
      </div>
    </div>
  );
}
