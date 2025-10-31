'use client';

import Link from 'next/link';

export default function ThcaPnvBreadcrumb() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            href="/products"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Products
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">
            THCA Prerolls & Vapes
          </span>
        </nav>
      </div>
    </div>
  );
}
