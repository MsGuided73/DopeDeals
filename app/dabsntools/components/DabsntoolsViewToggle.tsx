'use client';

import { Grid, List } from 'lucide-react';

interface DabsntoolsViewToggleProps {
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

export default function DabsntoolsViewToggle({ viewMode, setViewMode }: DabsntoolsViewToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-md p-1">
      <button
        onClick={() => setViewMode('grid')}
        className={`p-2 rounded transition-colors ${
          viewMode === 'grid'
            ? 'bg-dope-orange-500 text-white'
            : 'hover:bg-gray-100 text-gray-600'
        }`}
        title="Grid View"
      >
        <Grid className="h-4 w-4" />
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`p-2 rounded transition-colors ${
          viewMode === 'list'
            ? 'bg-dope-orange-500 text-white'
            : 'hover:bg-gray-100 text-gray-600'
        }`}
        title="List View"
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  );
}
