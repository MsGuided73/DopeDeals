'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-browser';

interface DataSourcePanelProps {
  selectedComponent: string | null;
  onDataSourceUpdate: (config: any) => void;
}

interface DataSourceConfig {
  sourceType: 'products' | 'brands' | 'categories' | 'storage' | 'custom';
  sourceTable?: string;
  sourceBucket?: string;
  filters: any[];
  sorting: { field: string; direction: 'asc' | 'desc' }[];
  limit: number;
  fieldMapping: Record<string, string>;
}

export default function DataSourcePanel({ selectedComponent, onDataSourceUpdate }: DataSourcePanelProps) {
  const [config, setConfig] = useState<DataSourceConfig>({
    sourceType: 'products',
    filters: [],
    sorting: [],
    limit: 10,
    fieldMapping: {}
  });

  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Data source options
  const dataSources = [
    { value: 'products', label: 'Products', table: 'products', icon: '📦', description: '4000+ products with images from Zoho' },
    { value: 'brands', label: 'Brands', table: 'brands', icon: '🏷️', description: 'Brand information and logos' },
    { value: 'categories', label: 'Categories', table: 'categories', icon: '📂', description: 'Product categories' },
    { value: 'product_media', label: 'Product Images', table: 'product_media', icon: '🖼️', description: 'All product images (hero + gallery)' },
    { value: 'storage', label: 'Media Storage', icon: '💾', description: 'Supabase storage buckets' }
  ];

  // Load available fields when source changes
  useEffect(() => {
    if (config.sourceType && config.sourceType !== 'storage') {
      loadTableFields(config.sourceType);
    }
  }, [config.sourceType]);

  const loadTableFields = async (tableName: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setAvailableFields(Object.keys(data[0]));
      }
    } catch (error) {
      console.error('Error loading table fields:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPreviewData = async () => {
    if (!config.sourceType || config.sourceType === 'storage') return;

    try {
      setLoading(true);
      let query = supabase.from(config.sourceType).select('*');

      // Apply filters
      config.filters.forEach(filter => {
        if (filter.field && filter.operator && filter.value) {
          switch (filter.operator) {
            case 'eq':
              query = query.eq(filter.field, filter.value);
              break;
            case 'neq':
              query = query.neq(filter.field, filter.value);
              break;
            case 'gt':
              query = query.gt(filter.field, filter.value);
              break;
            case 'lt':
              query = query.lt(filter.field, filter.value);
              break;
            case 'like':
              query = query.like(filter.field, `%${filter.value}%`);
              break;
            case 'ilike':
              query = query.ilike(filter.field, `%${filter.value}%`);
              break;
          }
        }
      });

      // Apply sorting
      config.sorting.forEach(sort => {
        if (sort.field) {
          query = query.order(sort.field, { ascending: sort.direction === 'asc' });
        }
      });

      // Apply limit
      query = query.limit(config.limit);

      const { data, error } = await query;
      if (error) throw error;

      setPreviewData(data || []);
    } catch (error) {
      console.error('Error loading preview data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFilter = () => {
    setConfig(prev => ({
      ...prev,
      filters: [...prev.filters, { field: '', operator: 'eq', value: '' }]
    }));
  };

  const updateFilter = (index: number, updates: any) => {
    setConfig(prev => ({
      ...prev,
      filters: prev.filters.map((filter, i) => 
        i === index ? { ...filter, ...updates } : filter
      )
    }));
  };

  const removeFilter = (index: number) => {
    setConfig(prev => ({
      ...prev,
      filters: prev.filters.filter((_, i) => i !== index)
    }));
  };

  const addSorting = () => {
    setConfig(prev => ({
      ...prev,
      sorting: [...prev.sorting, { field: '', direction: 'asc' }]
    }));
  };

  const updateSorting = (index: number, updates: any) => {
    setConfig(prev => ({
      ...prev,
      sorting: prev.sorting.map((sort, i) => 
        i === index ? { ...sort, ...updates } : sort
      )
    }));
  };

  const removeSorting = (index: number) => {
    setConfig(prev => ({
      ...prev,
      sorting: prev.sorting.filter((_, i) => i !== index)
    }));
  };

  const handleConfigUpdate = (updates: Partial<DataSourceConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onDataSourceUpdate(newConfig);
  };

  if (!selectedComponent) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="mb-4">🗄️</div>
        <p className="text-sm">Select a component to configure its data source</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Data Source</h3>
        
        {/* Source Type Selection */}
        <div className="space-y-2">
          {dataSources.map(source => (
            <button
              key={source.value}
              onClick={() => handleConfigUpdate({ sourceType: source.value as any })}
              className={`w-full p-3 text-left rounded-lg border transition-colors ${
                config.sourceType === source.value
                  ? 'border-dope-orange-500 bg-dope-orange-50 text-dope-orange-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{source.icon}</span>
                <div>
                  <div className="font-medium">{source.label}</div>
                  {source.table && (
                    <div className="text-xs text-gray-500">Table: {source.table}</div>
                  )}
                  {source.description && (
                    <div className="text-xs text-gray-400 mt-1">{source.description}</div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900">Filters</h4>
          <button
            onClick={addFilter}
            className="text-sm text-dope-orange-600 hover:text-dope-orange-700"
          >
            + Add Filter
          </button>
        </div>

        <div className="space-y-2">
          {config.filters.map((filter, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border border-gray-200 rounded">
              <select
                value={filter.field}
                onChange={(e) => updateFilter(index, { field: e.target.value })}
                className="flex-1 text-sm border-0 bg-transparent"
              >
                <option value="">Select field</option>
                {availableFields.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>

              <select
                value={filter.operator}
                onChange={(e) => updateFilter(index, { operator: e.target.value })}
                className="text-sm border-0 bg-transparent"
              >
                <option value="eq">equals</option>
                <option value="neq">not equals</option>
                <option value="gt">greater than</option>
                <option value="lt">less than</option>
                <option value="like">contains</option>
                <option value="ilike">contains (case insensitive)</option>
              </select>

              <input
                type="text"
                value={filter.value}
                onChange={(e) => updateFilter(index, { value: e.target.value })}
                placeholder="Value"
                className="flex-1 text-sm border-0 bg-transparent"
              />

              <button
                onClick={() => removeFilter(index)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sorting */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900">Sorting</h4>
          <button
            onClick={addSorting}
            className="text-sm text-dope-orange-600 hover:text-dope-orange-700"
          >
            + Add Sort
          </button>
        </div>

        <div className="space-y-2">
          {config.sorting.map((sort, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border border-gray-200 rounded">
              <select
                value={sort.field}
                onChange={(e) => updateSorting(index, { field: e.target.value })}
                className="flex-1 text-sm border-0 bg-transparent"
              >
                <option value="">Select field</option>
                {availableFields.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>

              <select
                value={sort.direction}
                onChange={(e) => updateSorting(index, { direction: e.target.value })}
                className="text-sm border-0 bg-transparent"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>

              <button
                onClick={() => removeSorting(index)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Limit */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Limit
        </label>
        <input
          type="number"
          value={config.limit}
          onChange={(e) => handleConfigUpdate({ limit: parseInt(e.target.value) || 10 })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          min="1"
          max="100"
        />
      </div>

      {/* Preview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900">Preview</h4>
          <button
            onClick={loadPreviewData}
            disabled={loading}
            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        <div className="max-h-40 overflow-y-auto border border-gray-200 rounded">
          {previewData.length > 0 ? (
            <div className="p-2 text-xs">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(previewData.slice(0, 3), null, 2)}
              </pre>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              No data to preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
