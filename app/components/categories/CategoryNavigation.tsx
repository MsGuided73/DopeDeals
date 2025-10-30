"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface CategoryNavigationProps {
  activeCategory?: string;
}

// Category data
const CATEGORIES = [
  {
    id: 'pipes',
    name: 'PIPES',
    href: '/pipes',
    description: 'Hand pipes and one-hitters',
    gradient: 'from-orange-500 to-red-600',
  },
  {
    id: 'bongs',
    name: 'BONGS',
    href: '/bongs',
    description: 'Water pipes and accessories',
    gradient: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'bubblers',
    name: 'BUBBLERS',
    href: '/bubblers',
    description: 'Small water pipes',
    gradient: 'from-green-500 to-teal-600',
  },
  {
    id: 'dab-rigs',
    name: "DAB RIGS",
    href: '/dab-rigs',
    description: 'Concentrate vaporizers',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    id: 'vaporizers',
    name: 'VAPORIZERS',
    href: '/vaporizers',
    description: 'Dry herb vaporizers',
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'pre-rolls',
    name: 'PRE-ROLLS',
    href: '/pre-rolls',
    description: 'Premium joints & cones',
    gradient: 'from-yellow-500 to-amber-600',
  },
  {
    id: 'accessories',
    name: 'ACCESSORIES',
    href: '/accessories',
    description: 'Grinders, papers & tools',
    gradient: 'from-gray-500 to-slate-600',
  },
  {
    id: 'apparel',
    name: 'APPAREL',
    href: '/apparel',
    description: 'Cannabis culture clothing',
    gradient: 'from-red-500 to-pink-600',
  },
];

export default function CategoryNavigation({ activeCategory = '' }: CategoryNavigationProps) {
  const pathname = usePathname();

  // Determine active category from URL if not provided
  const currentCategory = activeCategory || pathname.split('/')[1] || '';

  return (
    <nav className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
          <Link
            href="/products"
            className="text-dope-orange-600 hover:text-dope-orange-700 font-medium flex items-center gap-2 transition-colors"
          >
            View All Products →
          </Link>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {CATEGORIES.map((category) => {
            const isActive = currentCategory === category.id;

            return (
              <Link
                key={category.id}
                href={category.href}
                className={`group relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  isActive
                    ? 'ring-2 ring-dope-orange-500 shadow-lg'
                    : 'hover:border-dope-orange-300'
                }`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />

                {/* Content */}
                <div className="relative p-4 text-center">
                  <div className="text-sm font-bold text-gray-900 mb-2 leading-tight">
                    {category.name}
                  </div>
                  <div className="text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {category.description}
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-dope-orange-500 rounded-full" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
