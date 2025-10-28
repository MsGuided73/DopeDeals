"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

export default function Highway420Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      // TODO: Implement actual newsletter signup API call
      console.log('Newsletter signup:', email);

      // Show success message (you can replace with toast notification)
      alert('Thanks for joining the HIGHWAY 420 community! 🔥');
      setEmail('');
    } catch (error) {
      console.error('Newsletter signup error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <footer className="relative bg-black">
      {/* New Background Image with Glassmorphic Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/ChatGPT%20Image%20Oct%2023,%202025,%2004_02_38%20PM.png')"
          }}
        ></div>
        {/* Glassmorphic Overlay with Translucent White */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
        ></div>
      </div>

      {/* Glassmorphic Footer Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 py-16">
        {/* Service Features */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Discreet Shipping - Nothing to see here */}
            <div className="text-center">
              <div className="w-20 h-20 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
                <img
                  src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/icons/discreet%20icon%201.png"
                  alt="Discreet Shipping"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <h3 className="text-black font-black text-base mb-2">DISCREET SHIPPING</h3>
              <p className="text-gray-800 font-medium text-sm">Nothing to see here</p>
            </div>

            {/* Low Price Guarantee */}
            <div className="text-center">
              <div className="w-20 h-20 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
                <span className="text-green-600 font-black text-2xl">$</span>
              </div>
              <h3 className="text-black font-black text-base mb-2">LOW PRICE</h3>
              <p className="text-gray-800 font-medium text-sm">Guarantee</p>
            </div>

            {/* Easy, Hassle Free Returns */}
            <div className="text-center">
              <div className="w-20 h-20 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
                <Phone className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-black font-black text-base mb-2">EASY, HASSLE FREE</h3>
              <p className="text-gray-800 font-medium text-sm">Returns</p>
            </div>

            {/* Get 10% Back in Rewards */}
            <div className="text-center">
              <div className="w-20 h-20 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
                <MapPin className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-black font-black text-base mb-2">GET 10% BACK IN</h3>
              <p className="text-gray-800 font-medium text-sm">Rewards</p>
            </div>
          </div>
        </div>

        {/* Glassmorphic Main Footer */}
        <div className="bg-white/50 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Help Section */}
            <div>
              <h3 className="text-black font-black text-xl mb-6">Help</h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium">About Us</Link></li>
                <li><Link href="/help" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium">Help Center & FAQ</Link></li>
                <li><Link href="/contact" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium">Contact Us</Link></li>
                <li><Link href="/reviews" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium">Customer Reviews</Link></li>
                <li><Link href="/price-guarantee" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium">Low Price Guarantee</Link></li>
                <li><Link href="/returns" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium">Returns & Refund Policy</Link></li>
                <li><Link href="/shipping" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium">Shipping Policy</Link></li>
                <li><Link href="/privacy" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium">Terms and Conditions</Link></li>
                <li><Link href="/hemp-disclaimer" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium">Hemp Disclaimer</Link></li>
                <li><Link href="/fda-disclaimer" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium">FDA Disclaimer</Link></li>
                <li><Link href="/accessibility" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium">Accessibility Statement</Link></li>
                <li><Link href="/accessibility-help" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium">Accessibility</Link></li>
              </ul>
            </div>

            {/* Useful Links Section */}
            <div>
              <h3 className="text-black font-black text-xl mb-6">Useful Links</h3>
              <ul className="space-y-3">
                <li><Link href="/sale" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium">On Sale</Link></li>
                <li><Link href="/products?filter=new" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium">Newest Products</Link></li>
                <li><Link href="/brands" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium">Shop by Brand</Link></li>
                <li><Link href="/gift-cards" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium">Gift Cards</Link></li>
                <li><Link href="/rewards" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium">HIGHWAY 420 Rewards</Link></li>
                <li><Link href="/glossary" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium">Glossary of Terms</Link></li>
                <li><Link href="/blog" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium">HIGHWAY 420 Dispatches</Link></li>
              </ul>
            </div>

            {/* Shop Now Section */}
            <div>
              <h3 className="text-black font-black text-xl mb-6">SHOP NOW</h3>
              <ul className="space-y-3">
                <li><Link href="/products" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium" prefetch={false}>All Products</Link></li>
                <li><Link href="/thca" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium" prefetch={false}>THCA & More</Link></li>
                <li><Link href="/pre-rolls" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium" prefetch={false}>Pre-Rolls</Link></li>
                <li><Link href="/bongs" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium" prefetch={false}>Bongs</Link></li>
                <li><Link href="/bubblers" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium" prefetch={false}>Bubblers</Link></li>
                <li><Link href="/pipes" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium" prefetch={false}>Pipes</Link></li>
                <li><Link href="/dab-rigs" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium" prefetch={false}>Dab Rigs</Link></li>
                <li><Link href="/vaporizers" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium" prefetch={false}>Vaporizers</Link></li>
                <li><Link href="/accessories" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium">Accessories</Link></li>
                <li><Link href="/brands" className="text-gray-800 hover:text-green-600 transition-colors text-base font-medium">Shop by Brand</Link></li>
              </ul>
            </div>

            {/* Keep in Touch Section */}
            <div>
              <h3 className="text-green-600 font-black text-2xl mb-6 border-b border-green-600/50 pb-3">Keep in Touch</h3>
              <p className="text-gray-800 font-medium text-base mb-6 leading-relaxed">
                Sign up for our newsletter and be the first to know about coupons and special promotions.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your-email@example.com"
                  className="w-full bg-white/20 backdrop-blur-md rounded-lg px-4 py-3 text-black placeholder-gray-600 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-600/30 focus:outline-none transition-all mb-3 border border-white/30"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transition-all hover:scale-105 hover:shadow-xl text-sm"
                  style={{ backgroundColor: '#2d8f47' }}
                >
                  Subscribe
                </button>
              </form>

              {/* Social Media Icons */}
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-green-600 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-xl border border-white/30 group"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="w-5 h-5 text-gray-800 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-green-600 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-xl border border-white/30 group"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="w-5 h-5 text-gray-800 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-green-600 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-xl border border-white/30 group"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="w-5 h-5 text-gray-800 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-green-600 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-xl border border-white/30 group"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  aria-label="Subscribe to our YouTube"
                >
                  <Youtube className="w-5 h-5 text-gray-800 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright with HIGHWAY 420 Logo */}
        <div className="mt-12 text-center">
          <div className="mb-8">
              <p className="text-gray-800 font-medium text-base mb-6 leading-relaxed">
              © 2025 HIGHWAY 420. All rights reserved. | Designed with
              <span className="text-green-600 font-bold mx-1 text-lg">♥</span>
              for better shopping experience.
            </p>
          </div>

          {/* HIGHWAY 420 Logo */}
          <div className="mb-12">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <img
                src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/logo_Highway420-official_transparent.png"
                alt="HIGHWAY 420"
                className="h-32 md:h-40 lg:h-48 mx-auto object-contain"
                style={{
                  filter: 'drop-shadow(2px 2px 4px rgba(255,255,255,0.5))',
                  maxWidth: '400px',
                  width: 'auto'
                }}
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
