import "./globals.css";
import AppProviders from "./providers";

export const metadata = {
  title: "DOPE CITY - Premium Cannabis Culture & Smoke Shop",
  description: "Welcome to DOPE CITY - Where premium meets street. Discover the finest smoking accessories, CBD products, and cannabis culture essentials.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
