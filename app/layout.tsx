import "./globals.css";
import { Bebas_Neue, Inter } from "next/font/google";
import Navbar from "components/Navbar";
import Footer from "components/Footer";
import AppProviders from "./providers";

const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-display' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 relative">{children}</main>
      <Footer />
    </div>
  );
}

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
