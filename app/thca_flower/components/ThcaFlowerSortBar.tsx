'use client';

interface ThcaFlowerSortBarProps {
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export default function ThcaFlowerSortBar({ sortBy, setSortBy }: ThcaFlowerSortBarProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent"
      >
        <option value="featured">Featured</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="name">Name A-Z</option>
        <option value="newest">Newest First</option>
      </select>
    </div>
  );
}
