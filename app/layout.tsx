import "./globals.css";
import AppProviders from "./providers";
import DopeCityFooter from "../components/DopeCityFooter";

export const metadata = {
  title: "DOPE CITY - Premium Cannabis Culture & Smoke Shop",
  description: "Welcome to DOPE CITY - Where premium meets street. Discover the finest smoking accessories, CBD products, and cannabis culture essentials.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/chalets-webfont.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/chalets-webfont.woff" as="font" type="font/woff" crossOrigin="anonymous" />
      </head>
      <body className="bg-black">
        <AppProviders>
          <div className="min-h-screen flex flex-col">
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
