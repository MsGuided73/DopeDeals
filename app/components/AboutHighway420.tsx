'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function AboutHighway420() {
  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Mobile: Copy First, Desktop: Logo First */}
          
          {/* Left Column - Large Logo (hidden on mobile, shown on desktop) */}
          <div className="hidden md:flex justify-center md:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <Image
                src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/logo_Highway420-official_transparent.png"
                alt="Highway 420 - Premium Hemp Products"
                width={500}
                height={500}
                className="w-full h-auto"
                priority={false}
              />
            </div>
          </div>

          {/* Right Column - Copy with Left Justification */}
          <div className="text-left order-first md:order-last">
            <h2 className="text-4xl md:text-6xl font-display-twilight font-bold mb-6 text-gray-900 dark:text-white leading-tight">
              YOUR TRUSTED SOURCE FOR PREMIUM HEMP
            </h2>
            
            {/* Main Copy - Trust-Focused */}
            <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                <strong className="text-gray-900 dark:text-white">Highway 420</strong> is a licensed retailer of federally compliant hemp-derived products. 
                Every THC-A, Delta-8, and CBD product in our catalog is sourced from trusted manufacturers and verified through independent third-party lab testing.
              </p>
              
              <p>
                We take compliance seriously. All products meet the requirements of the 2018 Farm Bill, containing less than 0.3% Delta-9 THC by dry weight. 
                Age verification is required for all purchases — we only sell to customers 21 and older.
              </p>
            </div>

            {/* CTA Links */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link 
                href="/lab-results" 
                className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                View Lab Results
              </Link>
              <Link 
                href="/compliance" 
                className="inline-flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 hover:border-green-500 text-gray-700 dark:text-gray-200 font-semibold rounded-lg transition-colors"
              >
                Our Compliance Standards
              </Link>
            </div>
          </div>

          {/* Mobile Only - Logo Below Copy */}
          <div className="flex md:hidden justify-center mt-8">
            <div className="relative w-full max-w-xs">
              <Image
                src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/logo_Highway420-official_transparent.png"
                alt="Highway 420 - Premium Hemp Products"
                width={300}
                height={300}
                className="w-full h-auto"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
