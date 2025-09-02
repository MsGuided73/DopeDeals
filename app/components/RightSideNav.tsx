"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dope-city", label: "Dope City" },
  { href: "/products", label: "Products" },
  { href: "/category/pipes", label: "Collections" },
  { href: "/cart", label: "Cart" },
];

export default function RightSideNav() {
  return (
    <aside className="hidden md:block fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-50">
      {/* Glassmorphic container with coral glow */}
      <nav
        className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 rounded-2xl p-2 flex flex-col items-stretch gap-2 shadow-[0_0_32px_0_rgba(255,122,89,0.35)] ring-1 ring-[rgba(255,122,89,0.25)]"
        aria-label="Right side navigation"
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-3 py-2 rounded-lg text-sm font-semibold text-zinc-900 dark:text-white/90 hover:bg-black/5 dark:hover:bg-white/15 transition shadow-none hover:shadow-[0_0_20px_rgba(255,122,89,0.55)] focus:outline-none focus:ring-2 focus:ring-[rgba(255,122,89,0.6)]"
          >
            {item.label}
          </Link>
        ))}
        <div className="my-1 h-px bg-white/15" />
        <div className="px-1 py-1 flex items-center justify-center">
          <ThemeToggle />
        </div>
      </nav>
    </aside>
  );
}

