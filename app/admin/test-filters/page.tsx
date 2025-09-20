'use client';

import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

interface FilterTestResults {
  totalProducts: number;
  tests: {
    categories?: any;
    brands?: any;
    prices?: any;
    stock?: any;
    featured?: any;
    tags?: any;
    materials?: any;
  };
}

interface FilterCombinationTest {
  originalCount: number;
  filteredCount: number;
  filters: any;
  query: string;
  samples: any[];
}

export default function TestFiltersPage() {
  const [testResults, setTestResults] = useState<FilterTestResults | null>(null);
  const [combinationTest, setCombinationTest] = useState<FilterCombinationTest | null>(null);
  const [loading, setLoading] = useState(false);
  const [testFilters, setTestFilters] = useState({
    category: 'all',
    brand: 'all',
    priceMin: '',
    priceMax: '',
    inStock: false,
    featured: false
  });
  const [testQuery, setTestQuery] = useState('');

  // Run basic filter tests
  const runFilterTests = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/search/test-filters?type=all');
      const data = await response.json();
      setTestResults(data);
    } catch (error) {
      console.error('Filter test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Test specific filter combination
  const testFilterCombination = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/search/test-filters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filters: testFilters,
          query: testQuery
        })
      });
      const data = await response.json();
      setCombinationTest(data);
    } catch (error) {
      console.error('Filter combination test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runFilterTests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Filter System Testing</h1>

        {/* Basic Filter Tests */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Basic Filter Analysis</h2>
            <Button onClick={runFilterTests} disabled={loading}>
              {loading ? 'Testing...' : 'Refresh Tests'}
            </Button>
          </div>

          {testResults && (
            <div className="space-y-6">
              <div className="text-sm text-gray-600">
                Total Products Analyzed: {testResults.totalProducts}
              </div>

              {/* Categories */}
              {testResults.tests.categories && (
                <div>
                  <h3 className="font-medium mb-2">Categories</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {testResults.tests.categories.availableCategories.map((cat: any) => (
                      <div key={cat.value} className="bg-gray-50 p-3 rounded">
                        <div className="font-medium">{cat.label}</div>
                        <div className="text-sm text-gray-600">{cat.count} products</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Brands */}
              {testResults.tests.brands && (
                <div>
                  <h3 className="font-medium mb-2">Brands</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {testResults.tests.brands.availableBrands
                      .filter((brand: any) => brand.count > 0)
                      .map((brand: any) => (
                        <div key={brand.value} className="bg-gray-50 p-3 rounded">
                          <div className="font-medium">{brand.label}</div>
                          <div className="text-sm text-gray-600">{brand.count} products</div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Price Ranges */}
              {testResults.tests.prices && (
                <div>
                  <h3 className="font-medium mb-2">Price Distribution</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(testResults.tests.prices.ranges).map(([range, count]) => (
                      <div key={range} className="bg-gray-50 p-3 rounded">
                        <div className="font-medium">{range.replace('-', ' - $')}</div>
                        <div className="text-sm text-gray-600">{count as number} products</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Price Range: ${testResults.tests.prices.minPrice} - ${testResults.tests.prices.maxPrice}
                  </div>
                </div>
              )}

              {/* Stock & Featured */}
              <div className="grid grid-cols-2 gap-6">
                {testResults.tests.stock && (
                  <div>
                    <h3 className="font-medium mb-2">Stock Status</h3>
                    <div className="space-y-2">
                      <div className="bg-green-50 p-3 rounded">
                        <div className="font-medium text-green-800">In Stock</div>
                        <div className="text-sm text-green-600">{testResults.tests.stock.inStock} products</div>
                      </div>
                      <div className="bg-red-50 p-3 rounded">
                        <div className="font-medium text-red-800">Out of Stock</div>
                        <div className="text-sm text-red-600">{testResults.tests.stock.outOfStock} products</div>
                      </div>
                    </div>
                  </div>
                )}

                {testResults.tests.featured && (
                  <div>
                    <h3 className="font-medium mb-2">Featured Status</h3>
                    <div className="space-y-2">
                      <div className="bg-yellow-50 p-3 rounded">
                        <div className="font-medium text-yellow-800">Featured</div>
                        <div className="text-sm text-yellow-600">{testResults.tests.featured.featured} products</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="font-medium text-gray-800">Not Featured</div>
                        <div className="text-sm text-gray-600">{testResults.tests.featured.notFeatured} products</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Filter Combination Testing */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Filter Combinations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Search Query */}
            <div>
              <label className="block text-sm font-medium mb-2">Search Query</label>
              <Input
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Enter search term..."
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={testFilters.category}
                onChange={(e) => setTestFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Categories</option>
                <option value="disposables">Disposables</option>
                <option value="e-liquids">E-Liquids</option>
                <option value="cannabis">Cannabis</option>
                <option value="pipes-bongs">Pipes & Bongs</option>
                <option value="batteries">Batteries</option>
              </select>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Brand</label>
              <select
                value={testFilters.brand}
                onChange={(e) => setTestFilters(prev => ({ ...prev, brand: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Brands</option>
                <option value="crave">Crave</option>
                <option value="geek-bar">Geek Bar</option>
                <option value="elf-bar">Elf Bar</option>
                <option value="nu-e-liquid">NU E-Liquid</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium mb-2">Min Price</label>
              <Input
                type="number"
                value={testFilters.priceMin}
                onChange={(e) => setTestFilters(prev => ({ ...prev, priceMin: e.target.value }))}
                placeholder="Min price"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Max Price</label>
              <Input
                type="number"
                value={testFilters.priceMax}
                onChange={(e) => setTestFilters(prev => ({ ...prev, priceMax: e.target.value }))}
                placeholder="Max price"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={testFilters.inStock}
                  onChange={(e) => setTestFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                  className="mr-2"
                />
                In Stock Only
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={testFilters.featured}
                  onChange={(e) => setTestFilters(prev => ({ ...prev, featured: e.target.checked }))}
                  className="mr-2"
                />
                Featured Only
              </label>
            </div>
          </div>

          <Button onClick={testFilterCombination} disabled={loading} className="mb-6">
            Test Filter Combination
          </Button>

          {combinationTest && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Test Results</h3>
              <div className="text-sm space-y-1">
                <div>Original Products: {combinationTest.originalCount}</div>
                <div>Filtered Products: {combinationTest.filteredCount}</div>
                <div>Reduction: {((1 - combinationTest.filteredCount / combinationTest.originalCount) * 100).toFixed(1)}%</div>
              </div>
              
              {combinationTest.samples.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Sample Results:</h4>
                  <div className="space-y-2">
                    {combinationTest.samples.map((sample, index) => (
                      <div key={index} className="text-xs bg-white p-2 rounded">
                        <div className="font-medium">{sample.name}</div>
                        <div className="text-gray-600">
                          ${sample.price} | {sample.category} | {sample.brand} | 
                          {sample.featured ? ' Featured' : ''} | Stock: {sample.stock || 0}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
