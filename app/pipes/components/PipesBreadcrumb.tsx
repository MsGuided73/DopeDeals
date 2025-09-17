'use client';

import Link from 'next/link';

export default function PipesBreadcrumb() {
  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 py-3 text-sm">
          <Link 
            href="/" 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            Home
          </Link>
          <span className="text-gray-400 dark:text-gray-500">/</span>
          <Link 
            href="/products" 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            Products
          </Link>
          <span className="text-gray-400 dark:text-gray-500">/</span>
          <span className="text-gray-900 dark:text-white font-medium">
            Glass Pipes & Hand Pipes
          </span>
        </div>
      </div>
    </nav>
  );
}
