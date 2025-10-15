import "./globals.css";
import AppProviders from "./providers";
import DopeCityFooter from "../components/DopeCityFooter";
import ScrollingBanner from "./components/ScrollingBanner";

export const metadata = {
  title: "DOPE CITY - Premium Cannabis Culture & Smoke Shop",
  description: "Welcome to DOPE CITY - Where premium meets street. Discover the finest smoking accessories, CBD products, and cannabis culture essentials.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Font Preloading */}
        <link rel="preload" href="/fonts/chalets-webfont.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/chalets-webfont.woff" as="font" type="font/woff" crossOrigin="anonymous" />

        {/* DNS Prefetch for External Domains */}
        <link rel="dns-prefetch" href="//qirbapivptotybspnbet.supabase.co" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="dns-prefetch" href="//sigdistro.com" />

        {/* Preconnect to Critical External Resources */}
        <link rel="preconnect" href="https://qirbapivptotybspnbet.supabase.co" />

        {/* Viewport and Performance Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />

        {/* Resource Hints */}
        <link rel="prefetch" href="/api/products" />
      </head>
      <body className="bg-white" suppressHydrationWarning>
        <AppProviders>
          <div className="min-h-screen flex flex-col" suppressHydrationWarning>
            {/* Scrolling Banner - DISABLED for now */}
            {/* <ScrollingBanner /> */}

            <main className="flex-1">
              {children}
            </main>
            <DopeCityFooter />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
