'use client';

import Link from 'next/link';

export default function MushroomsBreadcrumb() {
  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <li>
          <Link href="/" className="hover:text-dope-orange-500">
            Home
          </Link>
        </li>
        <li>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </li>
        <li className="text-gray-900 dark:text-white font-medium">Mushrooms</li>
      </ol>
    </nav>
  );
}
