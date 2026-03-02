import "./globals.css";
import AppProviders from "./providers";
import GlobalMasthead from "./components/GlobalMasthead";
import Highway420Footer from "../components/Highway420Footer";
import ScrollingBanner from "./components/ScrollingBanner";
import FeedbackButton from "./components/FeedbackButton";
import FloatingNav from "./components/FloatingNav";
import StickyCartPopup from "./components/StickyCartPopup";
import AutosuggestRecommendations from "./components/AutosuggestRecommendations";
import RecentlyViewed from "./components/RecentlyViewed";
import { NavigationProvider } from "./contexts/NavigationContext";
import AgeGateModal from "./components/AgeGateModal";
import Script from "next/script";

export const metadata = {
  title: "HIGHWAY 420 - Premium Cannabis Culture & Smoke Shop",
  description: "Life is a Highway, Ride With Us 🌿 Premium glass, bongs, dab rigs & smoking accessories. Curated cannabis culture since day one. Free shipping over $75 🚚 #Highway420",

  // Open Graph / Facebook
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourdomain.com',
    siteName: 'HIGHWAY 420',
    title: 'HIGHWAY 420 - Life is a Highway, Ride With Us 🌿',
    description: 'Curated cannabis culture essentials. Free shipping over $75. Join the movement.',
    images: [
      {
        url: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/logo_Highway420-official_transparent.png',
        width: 1200,
        height: 630,
        alt: 'HIGHWAY 420 - Premium Cannabis Culture & Smoke Shop',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'HIGHWAY 420 - Life is Highway, Ride With Us 🌿',
    description: 'Premium glass, bongs, dab rigs & smoking accessories. Curated cannabis culture since day one. Free shipping over $75 🚚 #Highway420',
    images: ['https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/life_is_highway_ride_with_us.jpg'],
    creator: '@highway420',
  },

  // Additional meta tags
  keywords: ['cannabis', 'smoking accessories', 'bongs', 'pipes', 'dab rigs', 'vaporizers', 'cbd', 'smoke shop', 'premium glass'],
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
        {/* Font Preloading - Inter (Body), Chalets (Primary) and Twilight (Accent) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
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
              {/* Scrolling Banner - DISABLED for now */}
              {/* <ScrollingBanner /> */}

              {/* Global Masthead removed from layout - pages control their own masthead inclusion */}
              {/* <GlobalMasthead /> */}

              <main className="flex-1">
                {children}
              </main>

              {/* Autosuggest Recommendations - Temporarily disabled for debugging */}
              {/* <AutosuggestRecommendations /> */}

              {/* Recently Viewed Products - Temporarily disabled for debugging */}
              {/* <RecentlyViewed /> */}

              <Highway420Footer />

              {/* Global Feedback Button */}
              <FeedbackButton />

              {/* Global Floating Navigation */}
              <FloatingNav />

              {/* Global Sticky Cart Popup */}
              <StickyCartPopup />
            </div>
          </NavigationProvider>
        </AppProviders>
        {/* Global Age Verification Service */}
        <Script
          id="agechecker-script"
          src="https://cdn.agechecker.net/static/popup/v1/popup.js"
          strategy="beforeInteractive"
          data-agecheck-api-key={process.env.NEXT_PUBLIC_AGECHECKER_API_KEY}
          data-agecheck-disable-auto="true"
        />
      </body>
    </html>
  );
}
