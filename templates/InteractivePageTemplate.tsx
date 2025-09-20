/**
 * DOPE CITY Interactive Page Template
 * 
 * Template for pages that need client-side interactivity,
 * state management, and dynamic content.
 * 
 * Usage:
 * 1. Copy to your page location
 * 2. Create a page.tsx that imports this component
 * 3. Update component name and metadata
 * 4. Add your interactive features
 */

'use client';

import { useState, useEffect } from 'react';
import GlobalMasthead from '../app/components/GlobalMasthead';
import DopeCityFooter from '../components/DopeCityFooter';
import { supabaseBrowser } from '../app/lib/supabase-browser';
import { Button } from '../app/components/ui/button';
import { Input } from '../app/components/ui/input';
import { Loader2, Search, Filter } from 'lucide-react';

interface InteractivePageProps {
  title?: string;
  showSearch?: boolean;
}

export default function InteractivePageTemplate({ 
  title = "Interactive Page",
  showSearch = true 
}: InteractivePageProps) {
  
  // State management
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    sortBy: 'name'
  });

  // Initialize page
  useEffect(() => {
    loadData();
  }, []);

  // Load data function
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Example: Fetch data from Supabase
      const { data: results, error } = await supabaseBrowser
        .from('your_table') // Update table name
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setData(results || []);
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Add search logic here
  };

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    // Add filter logic here
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <GlobalMasthead />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-dope-orange-500" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
        <DopeCityFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* Global Masthead */}
      <GlobalMasthead />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-black text-white py-16">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h1 className="dope-city-title text-6xl mb-6">
            {title}
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Interactive page with dynamic content and filtering.
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      {showSearch && (
        <section className="bg-gray-50 border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange-500"
                >
                  <option value="all">All Categories</option>
                  <option value="category1">Category 1</option>
                  <option value="category2">Category 2</option>
                </select>

                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="date">Sort by Date</option>
                  <option value="price">Sort by Price</option>
                </select>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Results Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              Results ({data.length})
            </h2>
            <Button 
              onClick={loadData}
              variant="outline"
            >
              Refresh
            </Button>
          </div>

          {/* Content Grid */}
          {data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((item: any, index) => (
                <div 
                  key={item.id || index}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold mb-2">
                    {item.name || `Item ${index + 1}`}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {item.description || 'No description available'}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {item.category || 'Uncategorized'}
                    </span>
                    <Button size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Filter className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filters.
              </p>
            </div>
          )}

          {/* Load More Button */}
          {data.length > 0 && (
            <div className="text-center mt-12">
              <Button 
                onClick={loadData}
                size="lg"
                className="bg-dope-orange-500 hover:bg-dope-orange-600"
              >
                Load More
              </Button>
            </div>
          )}

        </div>
      </main>

      {/* Global Footer */}
      <DopeCityFooter />
      
    </div>
  );
}
