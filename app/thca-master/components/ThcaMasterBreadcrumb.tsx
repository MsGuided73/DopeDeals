import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export default function ThcaMasterBreadcrumb() {
  return (
    <nav className="bg-gray-50 dark:bg-gray-900 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link
              href="/"
              className="flex items-center text-gray-500 hover:text-dope-orange-500 transition-colors"
            >
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
          </li>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <li>
            <Link
              href="/products"
              className="text-gray-500 hover:text-dope-orange-500 transition-colors"
            >
              Products
            </Link>
          </li>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <li className="text-gray-900 dark:text-white font-medium">
            THCA Master Collection
          </li>
        </ol>
      </div>
    </nav>
  );
}
