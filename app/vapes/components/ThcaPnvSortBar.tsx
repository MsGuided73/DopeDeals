'use client';

import { ChevronDown } from 'lucide-react';

interface ThcaPnvSortBarProps {
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export default function ThcaPnvSortBar({ sortBy, setSortBy }: ThcaPnvSortBarProps) {
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'newest', label: 'Newest First' }
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Sort by:</span>
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:border-dope-orange-500 focus:outline-none focus:ring-1 focus:ring-dope-orange-500"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}
