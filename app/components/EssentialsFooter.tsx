"use client";

import Link from "next/link";
import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";

export default function EssentialsFooter() {
  return (
    <footer className="bg-white border-t border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Helpful Links */}
          <div>
            <h3 className="text-slate-900 font-bold text-lg mb-4">Helpful Links</h3>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/about" className="text-slate-600 hover:text-emerald-600 transition-colors text-sm">About Us</Link>
              <Link href="/help" className="text-slate-600 hover:text-emerald-600 transition-colors text-sm">Help Center & FAQ</Link>
              <Link href="/contact" className="text-slate-600 hover:text-emerald-600 transition-colors text-sm">Contact Us</Link>
              <Link href="/returns" className="text-slate-600 hover:text-emerald-600 transition-colors text-sm">Returns & Refunds</Link>
              <Link href="/shipping" className="text-slate-600 hover:text-emerald-600 transition-colors text-sm">Shipping Policy</Link>
              <Link href="/privacy" className="text-slate-600 hover:text-emerald-600 transition-colors text-sm">Privacy Policy</Link>
              <Link href="/terms-and-conditions" className="text-slate-600 hover:text-emerald-600 transition-colors text-sm">Terms & Conditions</Link>
            </div>
          </div>

          {/* Connect */}
          <div className="flex md:justify-end items-start gap-4">
            {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 bg-slate-100 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-all group"
              >
                <Icon className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
              </a>
            ))}
          </div>
        </div>

        {/* Compliance Text */}
        <div className="border-t border-slate-100 pt-8 text-center">
            <p className="text-slate-500 text-xs leading-relaxed max-w-4xl mx-auto">
            These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose,
            treat, cure or prevent any disease. Must be 21 years or older to purchase from this website. This product is not intended
            for children, or pregnant or lactating women. Consult with a physician before use if you have a serious medical
            condition or use prescription medications. A Doctor's advice should be sought before using this and any dietary
            supplement product. All trademarks and copyrights are property of their respective owners and are not affiliated with nor
            do they endorse this product. By using this site, you agree to follow the Privacy Policy and all Terms & Conditions printed
            on this site. Void Where Prohibited by Law. Products on this site contain less than 0.3% Δ9-THC. Our THCA products are not
            allowed to be shipped to the following states: CA, HI, ID, MN, OR, RI, UT, VT. We do not ship amanita muscaria to the State of
            Louisiana.
          </p>
        </div>

        {/* Copyright & Payments */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} HIGHWAY 420. All rights reserved.
          </p>
          <img
            src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/credit-card-brands-logos-c87zqqz38n8jbptz.jpg"
            alt="Accepted Payment Methods"
            className="h-8 w-auto object-contain opacity-80"
          />
        </div>
      </div>
    </footer>
  );
}
