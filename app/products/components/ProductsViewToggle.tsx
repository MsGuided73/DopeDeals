interface ProductsViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (viewMode: 'grid' | 'list') => void;
}

export default function ProductsViewToggle({ viewMode, onViewModeChange }: ProductsViewToggleProps) {
  return (
    <div className="flex items-center border border-gray-300 rounded-md">
      <button
        onClick={() => onViewModeChange('grid')}
        className={`p-2 ${
          viewMode === 'grid'
            ? 'bg-dope-orange-500 text-white'
            : 'text-gray-400 hover:text-gray-600'
        }`}
        aria-label="Grid view"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>
      <button
        onClick={() => onViewModeChange('list')}
        className={`p-2 ${
          viewMode === 'list'
            ? 'bg-dope-orange-500 text-white'
            : 'text-gray-400 hover:text-gray-600'
        }`}
        aria-label="List view"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}
