import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export default function BubblersBreadcrumb() {
  return (
    <nav className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center space-x-2 text-sm">
          <Link 
            href="/" 
            className="flex items-center text-gray-500 hover:text-dope-orange-500 transition-colors"
          >
            <Home className="w-4 h-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link 
            href="/products" 
            className="text-gray-500 hover:text-dope-orange-500 transition-colors"
          >
            Products
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 dark:text-gray-100 font-medium">
            Bubblers
          </span>
        </div>
      </div>
    </nav>
  );
}
