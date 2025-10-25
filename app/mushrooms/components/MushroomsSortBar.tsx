'use client';

interface MushroomsSortBarProps {
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export default function MushroomsSortBar({ sortBy, setSortBy }: MushroomsSortBarProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dope-orange-500"
      >
        <option value="featured">Featured</option>
        <option value="name">Name A-Z</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="newest">Newest</option>
      </select>
    </div>
  );
}
