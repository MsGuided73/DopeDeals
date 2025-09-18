"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

export default function DopeCityFooter() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      // TODO: Implement actual newsletter signup API call
      console.log('Newsletter signup:', email);

      // Show success message (you can replace with toast notification)
      alert('Thanks for joining the DOPE CITY community! 🔥');
      setEmail('');
    } catch (error) {
      console.error('Newsletter signup error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <footer className="relative bg-black">
      {/* DOPE CITY Skyline Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Skyline Background Image */}
        <div
          className="absolute inset-0 opacity-45 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/background/footer/DopeCity%20Skyline%20-%20Dk1.png')"
          }}
        ></div>
      </div>

      {/* Glassmorphic Footer Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 py-16">
        {/* Service Features */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Get loyalty rewards and rocket up the ladder in the DOPE CLUB */}
            <div className="text-center">
              <div className="w-16 h-16 glassmorphic-medium rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-dope-orange-400" />
              </div>
              <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg">GET LOYALTY REWARDS</h3>
              <p className="text-gray-200 text-xs drop-shadow-md">Rocket up the ladder in the DOPE CLUB and reap the benefits for years to come</p>
            </div>

            {/* Low Price Guarantee */}
            <div className="text-center">
              <div className="w-16 h-16 glassmorphic-medium rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-dope-orange-400 font-bold text-xl">$</span>
              </div>
              <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg">LOW PRICE</h3>
              <p className="text-gray-200 text-xs drop-shadow-md">Guarantee</p>
            </div>

            {/* Easy, Hassle Free Returns */}
            <div className="text-center">
              <div className="w-16 h-16 glassmorphic-medium rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-dope-orange-400" />
              </div>
              <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg">EASY, HASSLE FREE</h3>
              <p className="text-gray-200 text-xs drop-shadow-md">Returns</p>
            </div>

            {/* Get 10% Back in Rewards */}
            <div className="text-center">
              <div className="w-16 h-16 glassmorphic-medium rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-dope-orange-400" />
              </div>
              <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg">GET 10% BACK IN</h3>
              <p className="text-gray-200 text-xs drop-shadow-md">Rewards</p>
            </div>
          </div>
        </div>

        {/* Glassmorphic Main Footer */}
        <div className="glassmorphic-strong rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Help Section */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6 drop-shadow-lg">Help</h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-gray-100 hover:text-dope-orange-400 dope-hover transition-colors text-sm drop-shadow-md">About Us</Link></li>
                <li><Link href="/help" className="text-gray-100 hover:text-dope-orange-400 dope-hover transition-colors text-sm drop-shadow-md">Help Center & FAQ</Link></li>
                <li><Link href="/contact" className="text-gray-100 hover:text-dope-orange-400 dope-hover transition-colors text-sm drop-shadow-md">Contact Us</Link></li>
                <li><Link href="/reviews" className="text-gray-100 hover:text-dope-orange-400 dope-hover transition-colors text-sm drop-shadow-md">Customer Reviews</Link></li>
                <li><Link href="/price-guarantee" className="text-gray-100 hover:text-dope-orange-400 dope-hover transition-colors text-sm drop-shadow-md">Low Price Guarantee</Link></li>
                <li><Link href="/returns" className="text-gray-100 hover:text-dope-orange-400 dope-hover transition-colors text-sm drop-shadow-md">Returns & Refund Policy</Link></li>
                <li><Link href="/shipping" className="text-gray-100 hover:text-dope-orange-400 dope-hover transition-colors text-sm drop-shadow-md">Shipping Policy</Link></li>
                <li><Link href="/privacy" className="text-gray-100 hover:text-dope-orange-400 dope-hover transition-colors text-sm drop-shadow-md">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-100 hover:text-dope-orange-400 dope-hover transition-colors text-sm drop-shadow-md">Terms and Conditions</Link></li>
                <li><Link href="/hemp-disclaimer" className="text-gray-100 hover:text-dope-orange-400 dope-hover transition-colors text-sm drop-shadow-md">Hemp Disclaimer</Link></li>
                <li><Link href="/fda-disclaimer" className="text-gray-100 hover:text-dope-orange-400 dope-hover transition-colors text-sm drop-shadow-md">FDA Disclaimer</Link></li>
                <li><Link href="/accessibility" className="text-gray-100 hover:text-dope-orange-400 dope-hover transition-colors text-sm drop-shadow-md">Accessibility Statement</Link></li>
                <li><Link href="/accessibility-help" className="text-gray-100 hover:text-dope-orange-400 dope-hover transition-colors text-sm drop-shadow-md">Accessibility</Link></li>
              </ul>
            </div>

            {/* Useful Links Section */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6 drop-shadow-lg">Useful Links</h3>
              <ul className="space-y-3">
                <li><Link href="/sale" className="text-gray-100 hover:text-dope-orange-400 dope-hover transition-colors text-sm drop-shadow-md">On Sale</Link></li>
                <li><Link href="/products?filter=new" className="text-gray-100 hover:text-dope-orange-400 dope-hover transition-colors text-sm drop-shadow-md">Newest Products</Link></li>
                <li><Link href="/brands" className="text-gray-100 hover:text-dope-orange-400 dope-hover transition-colors text-sm drop-shadow-md">Shop by Brand</Link></li>
                <li><Link href="/gift-cards" className="text-gray-100 hover:text-dope-orange-400 dope-hover transition-colors text-sm drop-shadow-md">Gift Cards</Link></li>
                <li><Link href="/rewards" className="text-gray-100 hover:text-dope-orange-400 dope-hover transition-colors text-sm drop-shadow-md">DOPE CITY Rewards</Link></li>
                <li><Link href="/glossary" className="text-gray-100 hover:text-dope-orange-400 dope-hover transition-colors text-sm drop-shadow-md">Glossary of Terms</Link></li>
                <li><Link href="/knowledge-base" className="text-gray-100 hover:text-dope-orange-400 dope-hover transition-colors text-sm drop-shadow-md">Knowledge Base</Link></li>
              </ul>
            </div>

            {/* Partners & Industry Section */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6 drop-shadow-lg">Partners & Industry</h3>
              <ul className="space-y-3">
                <li><Link href="/brands" className="text-gray-100 hover:text-dope-orange-400 dope-hover transition-colors text-sm drop-shadow-md">Our Brands</Link></li>
                <li><Link href="/wholesale" className="text-gray-100 hover:text-dope-orange-400 dope-hover transition-colors text-sm drop-shadow-md">DOPE CITY Wholesale</Link></li>
                <li><Link href="/medical-card" className="text-gray-100 hover:text-dope-orange-400 dope-hover transition-colors text-sm drop-shadow-md">Get Your Medical Card</Link></li>
                <li><Link href="/creators" className="text-gray-100 hover:text-dope-orange-400 dope-hover transition-colors text-sm drop-shadow-md">Creators & Influencers</Link></li>
              </ul>
            </div>

            {/* Keep in Touch Section */}
            <div>
              <h3 className="text-dope-orange-400 font-bold text-lg mb-6 border-b border-dope-orange-400/50 pb-2 drop-shadow-lg">Keep in Touch</h3>
              <p className="text-gray-100 text-sm mb-6 drop-shadow-md">
                Sign up for our newsletter and be the first to know about coupons and special promotions.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your-email@example.com"
                  className="w-full glassmorphic-medium rounded-lg px-4 py-3 text-white placeholder-gray-300 text-sm focus:border-dope-orange-400 focus:ring-2 focus:ring-dope-orange-400/30 focus:outline-none transition-all mb-3"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-dope-orange-500 hover:bg-dope-orange-600 text-white font-bold px-6 py-3 rounded-lg dope-hover hover:scale-105 hover:shadow-xl hover:shadow-dope-orange-500/30 text-sm transition-all drop-shadow-lg"
                >
                  Subscribe
                </button>
              </form>

              {/* Social Media Icons */}
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 glassmorphic-medium hover:bg-dope-orange-500 rounded-lg flex items-center justify-center dope-hover hover:scale-110 hover:shadow-xl hover:shadow-dope-orange-500/30 group"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="w-5 h-5 text-gray-200 group-hover:text-white transition-colors drop-shadow-md" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 glassmorphic-medium hover:bg-dope-orange-500 rounded-lg flex items-center justify-center dope-hover hover:scale-110 hover:shadow-xl hover:shadow-dope-orange-500/30 group"
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="w-5 h-5 text-gray-200 group-hover:text-white transition-colors drop-shadow-md" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 glassmorphic-medium hover:bg-dope-orange-500 rounded-lg flex items-center justify-center dope-hover hover:scale-110 hover:shadow-xl hover:shadow-dope-orange-500/30 group"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="w-5 h-5 text-gray-200 group-hover:text-white transition-colors drop-shadow-md" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 glassmorphic-medium hover:bg-dope-orange-500 rounded-lg flex items-center justify-center dope-hover hover:scale-110 hover:shadow-xl hover:shadow-dope-orange-500/30 group"
                  aria-label="Subscribe to our YouTube"
                >
                  <Youtube className="w-5 h-5 text-gray-200 group-hover:text-white transition-colors drop-shadow-md" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright with DOPE CITY Branding */}
        <div className="mt-12 text-center">
          <div className="mb-8">
            <p className="text-gray-200 text-sm mb-2 drop-shadow-lg">
              © 2025 DOPE CITY. All rights reserved. | Designed with
              <span className="text-dope-orange-400 mx-1">♥</span>
              for better shopping experience.
            </p>
          </div>

          {/* Large DOPE CITY Branding */}
          <div className="mb-8">
            <Link href="/" className="inline-block dope-hover hover:scale-105">
              <h1 className="font-chalets text-8xl md:text-9xl lg:text-[12rem] tracking-wider drop-shadow-2xl">
                <span className="text-white drop-shadow-2xl">DOPE</span>
                <span className="text-dope-orange-500 ml-4 drop-shadow-2xl">CITY</span>
              </h1>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
