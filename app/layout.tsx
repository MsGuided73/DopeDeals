import "./globals.css";
import Link from "next/link";
import { Bebas_Neue, Inter } from "next/font/google";

const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-display' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

import ThemeToggle from "@/components/ThemeToggle";

function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 header-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="font-black tracking-widest gradient-text text-xl">DOPE CITY</Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/dope-city" className="hover:text-primary">Dope City</Link>
            <Link href="/products" className="hover:text-primary">Products</Link>
            <Link href="/category/pipes" className="hover:text-primary">Collections</Link>
            <Link href="/cart" className="hover:text-primary">Cart</Link>
          </nav>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="mt-12 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground">
          <div>
            <div className="font-semibold text-foreground mb-2">About</div>
            <p className="text-sm">Premium glass and accessories. Zero compromises.</p>
          </div>
          <div>
            <div className="font-semibold text-foreground mb-2">Links</div>
            <div className="flex gap-4">
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/privacy-policy">Privacy</Link>
              <Link href="/terms-of-service">Terms</Link>
            </div>
          </div>
          <div>
            <div className="font-semibold text-foreground mb-2">Follow</div>
            <div className="flex items-center gap-3">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-primary">Instagram</a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-primary">TikTok</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-primary">X</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import AppProviders from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${bebas.variable}`}>
      <body className="min-h-screen bg-background text-foreground font-[var(--font-sans)]">
        <SiteChrome>
          <AppProviders>
            {children}
          </AppProviders>
        </SiteChrome>
      </body>
    </html>
  );
}
