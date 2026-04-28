import Link from "next/link";
import Image from "next/image";

export default function ReducedFooter() {
  return (
    <footer className="bg-white border-t border-slate-200 py-12 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Shield Logo */}
        <div className="mb-8">
          <Image
            src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/logo_Highway420-official_transparent.png"
            alt="Highway 420 Shield"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>

        {/* Essential Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-10">
          <Link href="/about" className="text-slate-600 hover:text-[#1A472A] transition-colors text-sm uppercase tracking-wider font-bold font-['Oswald']">About Us</Link>
          <Link href="/contact" className="text-slate-600 hover:text-[#1A472A] transition-colors text-sm uppercase tracking-wider font-bold font-['Oswald']">Contact Us</Link>
          <Link href="/returns" className="text-slate-600 hover:text-[#1A472A] transition-colors text-sm uppercase tracking-wider font-bold font-['Oswald']">Returns</Link>
          <Link href="/shipping" className="text-slate-600 hover:text-[#1A472A] transition-colors text-sm uppercase tracking-wider font-bold font-['Oswald']">Shipping</Link>
          <Link href="/privacy" className="text-slate-600 hover:text-[#1A472A] transition-colors text-sm uppercase tracking-wider font-bold font-['Oswald']">Privacy</Link>
          <Link href="/terms-and-conditions" className="text-slate-600 hover:text-[#1A472A] transition-colors text-sm uppercase tracking-wider font-bold font-['Oswald']">Terms</Link>
        </div>

        {/* Compliance Text */}
        <div className="border-t border-slate-100 pt-8 text-center w-full">
          <p className="text-slate-400 text-[11px] leading-relaxed max-w-4xl mx-auto uppercase tracking-wide">
            These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose,
            treat, cure or prevent any disease. Must be 21 years or older to purchase from this website. This product is not intended
            for children, or pregnant or lactating women. Consult with a physician before use if you have a serious medical
            condition or use prescription medications. Void Where Prohibited by Law. Products on this site contain less than 0.3% Δ9-THC. 
            Our THCA products are not allowed to be shipped to: CA, HI, ID, MN, OR, RI, UT, VT.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm font-medium font-['Oswald'] tracking-wider uppercase">
            © {new Date().getFullYear()} HIGHWAY 420. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
