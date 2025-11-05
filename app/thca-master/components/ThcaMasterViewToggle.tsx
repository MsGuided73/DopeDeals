import { Grid, List } from 'lucide-react';

interface ThcaMasterViewToggleProps {
  viewMode: 'grid' | 'list' | 'sidebar';
  setViewMode: (mode: 'grid' | 'list' | 'sidebar') => void;
}

export default function ThcaMasterViewToggle({ viewMode, setViewMode }: ThcaMasterViewToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-md p-1">
      <button
        onClick={() => setViewMode('grid')}
        className={`p-2 rounded transition-colors ${
          viewMode === 'grid'
            ? 'bg-white dark:bg-gray-700 text-dope-orange-500 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
        }`}
        title="Grid View"
      >
        <Grid className="w-4 h-4" />
      </button>
      <button
        onClick={() => setViewMode('sidebar')}
        className={`p-2 rounded transition-colors ${
          viewMode === 'sidebar'
            ? 'bg-white dark:bg-gray-700 text-dope-orange-500 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
        }`}
        title="Sidebar View"
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}
