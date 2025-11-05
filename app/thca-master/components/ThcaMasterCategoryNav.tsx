import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ThcaMasterCategoryNavProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function ThcaMasterCategoryNav({ activeCategory, onCategoryChange }: ThcaMasterCategoryNavProps) {
  const router = useRouter();

  const categories = [
    { id: 'all', name: 'All Products', icon: '🛍️', description: 'Complete collection' },
    { id: 'flower', name: 'THCA Flower', icon: '🌿', description: 'Premium cannabis flower' },
    { id: 'prerolls', name: 'Prerolls & Vapes', icon: '🚬', description: 'Ready to smoke & vape' },
    { id: 'cartridges', name: 'Cartridges', icon: '💨', description: 'Vape cartridges' },
    { id: 'concentrates', name: 'Concentrates', icon: '🧪', description: 'THCA concentrates & rosin' },
    { id: 'edibles', name: 'Edibles', icon: '🍪', description: 'Cannabis edibles' },
    { id: 'cbd', name: 'CBD & Wellness', icon: '🌱', description: 'CBD products & wellness' },
    { id: 'delta', name: 'Delta Products', icon: '⚡', description: 'Delta-8 & Delta-9' },
    { id: 'mushrooms', name: 'Mushrooms', icon: '🍄', description: 'Psychedelic mushrooms' },
    { id: 'kratom', name: 'Kratom', icon: '🌿', description: '7-Hydroxymitragynine' },
  ];

  const handleCategoryClick = (categoryId: string) => {
    onCategoryChange(categoryId);

    // Update URL without page reload
    const newUrl = categoryId === 'all'
      ? '/thca-master'
      : `/thca-master?category=${categoryId}`;

    router.replace(newUrl, { scroll: false });
  };

  return (
    <div id="categories" className="bg-white dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Categories
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our complete collection of THCA and cannabinoid products
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`group relative p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                activeCategory === category.id
                  ? 'border-dope-orange-500 bg-dope-orange-50 dark:bg-dope-orange-900/20 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-dope-orange-300'
              }`}
            >
              <div className="text-center">
                <div className={`text-3xl mb-3 transition-transform group-hover:scale-110 ${
                  activeCategory === category.id ? 'animate-bounce' : ''
                }`}>
                  {category.icon}
                </div>
                <h3 className={`font-semibold mb-1 transition-colors ${
                  activeCategory === category.id
                    ? 'text-dope-orange-600 dark:text-dope-orange-400'
                    : 'text-gray-900 dark:text-white group-hover:text-dope-orange-500'
                }`}>
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                  {category.description}
                </p>
              </div>

              {activeCategory === category.id && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-dope-orange-500 rounded-full border-2 border-white dark:border-gray-900">
                  <div className="w-full h-full bg-dope-orange-500 rounded-full animate-ping"></div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Active Category Indicator */}
        {activeCategory !== 'all' && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-dope-orange-100 dark:bg-dope-orange-900/30 rounded-full">
              <span className="text-sm font-medium text-dope-orange-800 dark:text-dope-orange-200">
                Currently viewing: {categories.find(c => c.id === activeCategory)?.name}
              </span>
              <button
                onClick={() => handleCategoryClick('all')}
                className="ml-3 text-dope-orange-600 hover:text-dope-orange-800 dark:text-dope-orange-400 dark:hover:text-dope-orange-200 font-medium text-sm underline"
              >
                View All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
