'use client';

interface ThcaJumpBarProps {
  subcategories: Array<{
    id: string;
    name: string;
    icon: string;
    description: string;
  }>;
  activeSection: string;
  productCounts: {[key: string]: number};
}

export default function ThcaJumpBar({ subcategories, activeSection, productCounts }: ThcaJumpBarProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update URL hash without triggering navigation
      window.history.replaceState(null, '', `#${sectionId}`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-6 overflow-x-auto">
            {subcategories.map((subcategory) => {
              const count = productCounts[subcategory.id] || 0;
              const isActive = activeSection === subcategory.id;

              return (
                <button
                  key={subcategory.id}
                  onClick={() => scrollToSection(subcategory.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="text-lg">{subcategory.icon}</span>
                  <span className="font-medium text-sm">{subcategory.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isActive
                      ? 'bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Total count indicator */}
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Total Products:</span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              {Object.values(productCounts).reduce((sum, count) => sum + count, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
