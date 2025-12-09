"use client"; 
import { useState } from "react";
import Link from "next/link";
import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";

export default function Highway420Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      console.log("Newsletter signup:", email);
      alert("Thanks for joining the HIGHWAY 420 community! 🔥");
      setEmail("");
    } catch (error) {
      console.error("Newsletter signup error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <footer className="relative bg-black">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/sign/Highway420_assets/assets/ChatGPT%20Image%20Oct%2023,%202025,%2004_02_38%20PM.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xZDFmMmVhMi1kNjI5LTQ5MWQtOWNmYi01MTE2Y2UwMjcxNmYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJIaWdod2F5NDIwX2Fzc2V0cy9hc3NldHMvQ2hhdEdQVCBJbWFnZSBPY3QgMjMsIDIwMjUsIDA0XzAyXzM4IFBNLnBuZyIsImlhdCI6MTc2NDkzNTU1NywiZXhwIjoxNzk2NDcxNTU3fQ.RyPalWiDNqwZxn5h7pgPFZq68YAxnmsBmiNMVt1TZEw')",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.35)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 py-16">
        {/* Feature Icons */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Discreet Shipping */}
            <div className="text-center">
              <div className="w-20 h-20 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
                <img
                  src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/icons/discreet%20icon%201.png"
                  alt="Discreet Shipping"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <h3 className="text-black font-bold text-xl mb-3" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                DISCREET SHIPPING
              </h3>
              <p className="text-black font-bold text-xl" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                Nothing to see here
              </p>
            </div>

            {/* Low Price Guarantee */}
            <div className="text-center">
              <div className="w-20 h-20 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
                <span className="text-black font-black text-2xl">$</span>
              </div>
              <h3 className="text-black font-bold text-xl mb-3" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                LOW PRICE GUARANTEE
              </h3>
              <p className="text-black font-bold text-xl" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                Save on Every Item
              </p>
            </div>

            {/* Fast & Free */}
            <div className="text-center">
              <div className="w-20 h-20 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
                <svg
                  className="w-10 h-10 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V7M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-black font-bold text-xl mb-3" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                FAST & FREE DELIVERY
              </h3>
              <p className="text-black font-bold text-xl" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                at $75 or more
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer */}
        <div className="bg-white/50 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Helpful Links Section */}
            <div>
              <h3 className="text-black font-bold text-2xl mb-6" style={{ fontFamily: "Inter, sans-serif !important" }}>Helpful Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-gray-800 hover:text-green-600">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-gray-800 hover:text-green-600">
                    Help Center & FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-800 hover:text-green-600">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-gray-800 hover:text-green-600">
                    Returns & Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-gray-800 hover:text-green-600">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-800 hover:text-green-600">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-and-conditions" className="text-gray-800 hover:text-green-600">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Useful Links */}
            <div>
              <h3 className="text-black font-bold text-2xl mb-6" style={{ fontFamily: "Inter, sans-serif !important" }}>Useful Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/sale" className="text-gray-800 hover:text-green-600">
                    On Sale
                  </Link>
                </li>
                <li>
                  <Link href="/brands" className="text-gray-800 hover:text-green-600">
                    Shop by Brand
                  </Link>
                </li>
                <li>
                  <Link href="/ride-with-us" className="text-gray-800 hover:text-green-600">
                    Ride With Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Shop Now */}
            <div>
              <h3 className="text-black font-bold text-2xl mb-6" style={{ fontFamily: "Inter, sans-serif !important" }}>SHOP NOW</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/thca_flower" className="text-gray-800 hover:text-green-600">
                    THCA FLOWER
                  </Link>
                </li>
                <li>
                  <Link href="/pre-rolls" className="text-gray-800 hover:text-green-600">
                    PRE-ROLLS
                  </Link>
                </li>
                <li>
                  <Link href="/thca_pnv" className="text-gray-800 hover:text-green-600">
                    THCA VAPES
                  </Link>
                </li>
                <li>
                  <Link href="/7-hydroxymitragynine" className="text-gray-800 hover:text-green-600">
                    KRATOM & 7-OH
                  </Link>
                </li>
                <li>
                  <Link href="/edibles" className="text-gray-800 hover:text-green-600">
                    EDIBLES & MORE
                  </Link>
                </li>
                <li>
                  <Link href="/mushrooms" className="text-gray-800 hover:text-green-600">
                    MUSHROOMS
                  </Link>
                </li>
                <li>
                  <Link href="/nitrous-oxide" className="text-gray-800 hover:text-green-600">
                    N2O
                  </Link>
                </li>
                <li>
                  <Link href="/accessories" className="text-gray-800 hover:text-green-600">
                    ACCESSORIES
                  </Link>
                </li>
              </ul>
            </div>

            {/* Find Out First */}
            <div>
              <h3 className="text-green-600 font-bold text-3xl mb-6 border-b border-green-600/50 pb-3">
                Find Out First
              </h3>
              <p className="text-gray-800 font-medium text-lg mb-6">
                Sign up for our newsletter and be the first to know about coupons and special promotions.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your-email@example.com"
                  className="w-full bg-white/20 backdrop-blur-md rounded-lg px-4 py-3 text-black placeholder-gray-600 text-sm focus:ring-2 focus:ring-green-600/30 border border-white/30 mb-3"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transition-all hover:scale-105 hover:shadow-xl text-sm"
                  style={{ backgroundColor: "#2d8f47" }}
                >
                  Subscribe
                </button>
              </form>

              <div className="flex space-x-4">
                {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-green-600 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-xl border border-white/30 group"
                    style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                  >
                    <Icon className="w-5 h-5 text-gray-800 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 text-center">
          <p className="text-gray-800 font-medium text-base mb-6">
            © 2025 HIGHWAY 420. All rights reserved. | Designed with{" "}
            <span className="text-green-600 font-bold mx-1 text-lg">♥</span> for better shopping experience.
          </p>
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <img
              src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/logo_Highway420-official_transparent.png"
              alt="HIGHWAY 420"
              className="h-32 md:h-40 lg:h-48 mx-auto object-contain"
              style={{
                filter: "drop-shadow(2px 2px 4px rgba(255,255,255,0.5))",
                maxWidth: "400px",
              }}
            />
          </Link>
          <p className="mt-10 text-xs leading-relaxed text-gray-900/80 max-w-5xl mx-auto" style={{ fontSize: "0.7rem", lineHeight: 1.5 }}>
            These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose,
            treat, cure or prevent any disease. Must be 21 years or older to purchase from this website. This product is not intended
            for children, or pregnant or lactating women. Consult with a physician before use if you have a serious medical
            condition or use prescription medications. A Doctor’s advice should be sought before using this and any dietary
            supplement product. All trademarks and copyrights are property of their respective owners and are not affiliated with nor
            do they endorse this product. By using this site, you agree to follow the Privacy Policy and all Terms & Conditions printed
            on this site. Void Where Prohibited by Law. Products on this site contain less than 0.3% Δ9-THC. Our THCA products are not
            allowed to be shipped to the following states: HI, ID, MN, OR, RI, UT, VT. We do not ship amanita muscaria to the State of
            Louisiana.
          </p>
          <div className="mt-8 flex justify-center">
            <img
              src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/credit-card-brands-logos-c87zqqz38n8jbptz.jpg"
              alt="Accepted Payment Methods"
              className="h-12 w-auto object-contain drop-shadow-lg"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
