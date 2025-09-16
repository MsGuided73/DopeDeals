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
      {/* Chicago Skyline Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40 z-10"></div>
        {/* CSS Skyline Background - Replace with actual image when available */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-gray-800 via-gray-700 to-gray-600"></div>
          <div className="absolute bottom-0 left-0 right-0 h-48">
            <div className="absolute bottom-0 left-[10%] w-8 h-32 bg-gray-600"></div>
            <div className="absolute bottom-0 left-[15%] w-6 h-40 bg-gray-700"></div>
            <div className="absolute bottom-0 left-[20%] w-10 h-36 bg-gray-600"></div>
            <div className="absolute bottom-0 left-[25%] w-12 h-44 bg-gray-500"></div>
            <div className="absolute bottom-0 left-[30%] w-8 h-28 bg-gray-600"></div>
            <div className="absolute bottom-0 left-[35%] w-14 h-48 bg-gray-700"></div>
            <div className="absolute bottom-0 left-[40%] w-10 h-32 bg-gray-600"></div>
            <div className="absolute bottom-0 left-[45%] w-16 h-52 bg-gray-500"></div>
            <div className="absolute bottom-0 left-[50%] w-12 h-40 bg-gray-600"></div>
            <div className="absolute bottom-0 left-[55%] w-8 h-36 bg-gray-700"></div>
            <div className="absolute bottom-0 left-[60%] w-18 h-56 bg-gray-500"></div>
            <div className="absolute bottom-0 left-[65%] w-10 h-32 bg-gray-600"></div>
            <div className="absolute bottom-0 left-[70%] w-14 h-44 bg-gray-700"></div>
            <div className="absolute bottom-0 left-[75%] w-12 h-38 bg-gray-600"></div>
            <div className="absolute bottom-0 left-[80%] w-8 h-30 bg-gray-700"></div>
            <div className="absolute bottom-0 left-[85%] w-16 h-48 bg-gray-500"></div>
            <div className="absolute bottom-0 left-[90%] w-10 h-34 bg-gray-600"></div>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6 dope-hover hover:scale-105">
              <h2 className="font-chalets text-3xl font-black text-white tracking-wider">
                <span className="text-white">DOPE</span>
                <span className="text-dope-orange-500 ml-2">CITY</span>
              </h2>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Premium cannabis culture meets street authenticity. 
              Your destination for the dopest products in the game.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-12 h-12 bg-gray-800/50 hover:bg-dope-orange-500 rounded-xl flex items-center justify-center dope-hover hover:scale-110 hover:shadow-lg hover:shadow-dope-orange-500/25 group"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-gray-800/50 hover:bg-dope-orange-500 rounded-xl flex items-center justify-center dope-hover hover:scale-110 hover:shadow-lg hover:shadow-dope-orange-500/25 group"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-gray-800/50 hover:bg-dope-orange-500 rounded-xl flex items-center justify-center dope-hover hover:scale-110 hover:shadow-lg hover:shadow-dope-orange-500/25 group"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-gray-800/50 hover:bg-dope-orange-500 rounded-xl flex items-center justify-center dope-hover hover:scale-110 hover:shadow-lg hover:shadow-dope-orange-500/25 group"
                aria-label="Subscribe to our YouTube"
              >
                <Youtube className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Shop Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-gray-300 hover:text-dope-orange-400 dope-hover hover:translate-x-1 transition-all text-sm">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/products?filter=new" className="text-gray-300 hover:text-dope-orange-400 dope-hover hover:translate-x-1 transition-all text-sm">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products?filter=sale" className="text-gray-300 hover:text-dope-orange-400 dope-hover hover:translate-x-1 transition-all text-sm">
                  Sale
                </Link>
              </li>
              <li>
                <Link href="/brands" className="text-gray-300 hover:text-dope-orange-400 dope-hover hover:translate-x-1 transition-all text-sm">
                  Brands
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-dope-orange-400 dope-hover hover:translate-x-1 transition-all text-sm">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/products?filter=vip" className="text-gray-300 hover:text-dope-orange-400 dope-hover hover:translate-x-1 transition-all text-sm">
                  VIP Exclusive
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-dope-orange-400 dope-hover hover:translate-x-1 transition-all text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-dope-orange-400 dope-hover hover:translate-x-1 transition-all text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-dope-orange-400 dope-hover hover:translate-x-1 transition-all text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-dope-orange-400 dope-hover hover:translate-x-1 transition-all text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-300 hover:text-dope-orange-400 dope-hover hover:translate-x-1 transition-all text-sm">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/wholesale" className="text-gray-300 hover:text-dope-orange-400 dope-hover hover:translate-x-1 transition-all text-sm">
                  Wholesale
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Stay in the loop</h3>
            <p className="text-gray-300 text-sm mb-4">
              Get the latest drops, exclusive deals, and cannabis culture updates.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex rounded-xl overflow-hidden">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 bg-gray-800/50 border border-gray-600 border-r-0 px-4 py-3 text-white placeholder-gray-400 text-sm focus:border-dope-orange-400 focus:ring-2 focus:ring-dope-orange-400/20 focus:outline-none transition-all"
                required
              />
              <button
                type="submit"
                className="bg-dope-orange-500 hover:bg-dope-orange-600 text-white font-semibold px-6 py-3 dope-hover hover:scale-105 hover:shadow-lg hover:shadow-dope-orange-500/25 text-sm"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-dope-orange-500/10 rounded-xl flex items-center justify-center group-hover:bg-dope-orange-500/20 dope-hover">
                <Mail className="w-5 h-5 text-dope-orange-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide">Email</p>
                <a href="mailto:hello@dopecity.com" className="text-white hover:text-dope-orange-400 dope-hover transition-colors">
                  hello@dopecity.com
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-dope-orange-500/10 rounded-xl flex items-center justify-center group-hover:bg-dope-orange-500/20 dope-hover">
                <Phone className="w-5 h-5 text-dope-orange-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide">Phone</p>
                <a href="tel:+1-555-DOPE-CITY" className="text-white hover:text-dope-orange-400 dope-hover transition-colors">
                  +1 (555) DOPE-CITY
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-dope-orange-500/10 rounded-xl flex items-center justify-center group-hover:bg-dope-orange-500/20 dope-hover">
                <MapPin className="w-5 h-5 text-dope-orange-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide">Location</p>
                <p className="text-white">Chicago, IL</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-1">
              <span className="text-gray-400 text-sm">© 2025</span>
              <span className="text-yellow-400 font-semibold text-sm">DOPE CITY</span>
              <span className="text-gray-400 text-sm">. All rights reserved.</span>
            </div>
            
            <div className="flex flex-wrap items-center space-x-6">
              <Link href="/legal/privacy-policy" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/legal/terms-of-service" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="/legal/shipping-policy" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                Shipping Policy
              </Link>
              <Link href="/legal/return-policy" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                Returns
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
