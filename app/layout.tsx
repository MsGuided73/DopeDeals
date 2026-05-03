import "./globals.css";
import AppProviders from "./providers";
import Highway420Footer from "../components/Highway420Footer";
import FloatingNav from "./components/FloatingNav";
import StickyCartPopup from "./components/StickyCartPopup";
import TrustStrip from "./components/TrustStrip";
import { NavigationProvider } from "./contexts/NavigationContext";
import AgeGateModal from "./components/AgeGateModal";

export const metadata = {
  title: "HIGHWAY 420 - Premium Cannabis Culture & Smoke Shop",
  description: "Life is a Highway, Ride With Us 🌿 Premium cannabis products at the lowest prices — glass, bongs, dab rigs, vapes, edibles & more. Quality guaranteed. Free shipping over $75 🚚 #Highway420",

  // Open Graph / Facebook
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://highway420store.com',
    siteName: 'HIGHWAY 420',
    title: 'HIGHWAY 420 — Premium Products, Lowest Prices 🌿',
    description: 'Top-quality cannabis accessories, edibles & more — all at the lowest prices. Free shipping over $75. Life is a Highway, Ride With Us. 🚚 #Highway420',
    images: [
      {
        // Primary share image — lifestyle photo with solid background (renders on all platforms)
        url: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/life_is_highway_ride_with_us.jpg',
        width: 1200,
        height: 630,
        alt: 'HIGHWAY 420 — Premium Cannabis Products at the Lowest Prices',
      },
      {
        // Secondary: brand logo
        url: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/logo_Highway420-official_transparent.png',
        width: 800,
        height: 400,
        alt: 'HIGHWAY 420 Official Logo',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'HIGHWAY 420 — Premium Products, Lowest Prices 🌿',
    description: 'Top-quality cannabis accessories, edibles & more at the lowest prices. Free shipping over $75 🚚 Life is a Highway, Ride With Us. #Highway420',
    images: ['https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/life_is_highway_ride_with_us.jpg'],
    creator: '@highway420',
  },

  // Additional meta tags
  keywords: ['cannabis', 'smoking accessories', 'bongs', 'pipes', 'dab rigs', 'vaporizers', 'cbd', 'smoke shop', 'premium glass', 'lowest prices', 'best deals'],
  authors: [{ name: 'HIGHWAY 420' }],
  creator: 'HIGHWAY 420',
  publisher: 'HIGHWAY 420',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Font Preloading - Bebas Neue (self-hosted), Source Serif 4, DM Sans, Inter, Space Grotesk */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Inter:wght@400;500;600;700;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {/* Bebas Neue — self-hosted on Supabase CDN (highest priority preload) */}
        <link rel="preload" href="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/fonts/BebasNeue-Regular/BebasNeue-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/fonts/BebasNeue-Regular/BebasNeue-Regular.woff" as="font" type="font/woff" crossOrigin="anonymous" />
        {/* Montserrat ExtraBold — self-hosted on Supabase CDN */}
        <link rel="preload" href="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/fonts/Montserrat%20ExtraBold/Montserrat-ExtraBold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/fonts/Chalets/chalets-webfont.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/fonts/Twilight/FontsFree-Net-TwilightFont-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

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
      <body className="bg-white">
        <AppProviders>
          {/* Age Gate — renders as fixed overlay on first visit. Blurs page behind it. */}
          <AgeGateModal />
          <NavigationProvider>
            <div className="min-h-screen flex flex-col">
              {/* Global trust strip — appears above the masthead on every page */}
              <TrustStrip />
              <main className="flex-1">
                {children}
              </main>

              <Highway420Footer />

              {/* Global Floating Navigation */}
              <FloatingNav />

              {/* Global Sticky Cart Popup */}
              <StickyCartPopup />
            </div>
          </NavigationProvider>
        </AppProviders>
      </body>
    </html>
  );
}
