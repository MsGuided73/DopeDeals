'use client';

import Link from 'next/link';
import { FlaskConical, ShieldCheck, FileCheck, PackageCheck, Tag } from 'lucide-react';

export default function AboutHighway420() {
  const cards = [
    {
      title: "Third-Party\nLab Tested",
      description: "Every product is verified through independent lab testing for purity and potency.",
      icon: <FlaskConical className="w-10 h-10 text-green-700" strokeWidth={1.5} />,
    },
    {
      title: "Farm Bill\nCompliant",
      description: "All products meet 2018 Farm Bill standards with less than 0.3% Delta-9 THC.",
      icon: <ShieldCheck className="w-10 h-10 text-green-700" strokeWidth={1.5} />,
    },
    {
      title: "Verified &\nTransparent",
      description: "We only source from trusted manufacturers with full COA documentation.",
      icon: <FileCheck className="w-10 h-10 text-green-700" strokeWidth={1.5} />,
    },
    {
      title: "Discreet, Reliable\nShipping",
      description: "Fast fulfillment with packaging designed for privacy and peace of mind.",
      icon: <PackageCheck className="w-10 h-10 text-green-700" strokeWidth={1.5} />,
    },
    {
      title: "VIP Pricing\n& Perks",
      description: "Members get exclusive pricing, early access to drops, and special offers.",
      icon: <Tag className="w-10 h-10 text-green-700" strokeWidth={1.5} />,
    }
  ];

  return (
    <section className="py-24 bg-[#F9F8F6] dark:bg-gray-950 flex flex-col items-center">
      <div className="max-w-[1300px] mx-auto px-4 w-full">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2
            className="mb-3 text-gray-900 dark:text-white"
            style={{ fontFamily: "'Fira Sans','Inter',sans-serif", fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.01em', margin: '0 0 12px' }}
          >
            Why Highway 420
          </h2>
          <p
            className="text-gray-700 dark:text-gray-300"
            style={{ fontFamily: "'Fira Sans','Inter',sans-serif", fontSize: '15px', color: '#5B6560', margin: 0 }}
          >
            Premium products. Verified quality. Better prices.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {cards.map((card, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center transition-transform hover:scale-[1.02] duration-300"
            >
              <div className="mb-6">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 whitespace-pre-line leading-tight">
                {card.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap justify-center gap-6">
          <Link 
            href="/lab-results" 
            className="inline-flex items-center px-8 py-3 bg-[#2A8643] hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
          >
            View Lab Results
          </Link>
          <Link 
            href="/compliance" 
            className="inline-flex items-center px-8 py-3 border border-gray-300 dark:border-gray-600 hover:border-gray-400 bg-white dark:bg-transparent text-gray-800 dark:text-gray-200 font-semibold rounded-lg transition-colors shadow-sm"
          >
            Our Compliance Standards
          </Link>
        </div>
      </div>
    </section>
  );
}
