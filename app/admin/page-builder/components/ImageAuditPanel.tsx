'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-browser';

interface ImageAuditPanelProps {
  onImageSelect?: (imageUrl: string, productInfo: any) => void;
}

interface ProductWithImage {
  id: string;
  name: string;
  sku: string;
  image_url: string;
  image_urls: string[];
  brand_id: string;
  category_id: string;
}

interface ImageStats {
  totalProducts: number;
  productsWithImages: number;
  uniqueImages: number;
  duplicateImages: { [key: string]: number };
}

export default function ImageAuditPanel({ onImageSelect }: ImageAuditPanelProps) {
  const [products, setProducts] = useState<ProductWithImage[]>([]);
  const [stats, setStats] = useState<ImageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'with-images' | 'duplicates' | 'missing'>('overview');

  useEffect(() => {
    loadImageAudit();
  }, []);

  const loadImageAudit = async () => {
    try {
      setLoading(true);

      // Get all products with their image data
      const { data: allProducts, error } = await supabase
        .from('products')
        .select('id, name, sku, image_url, image_urls, brand_id, category_id')
        .eq('is_active', true);

      if (error) throw error;

      const productsWithImages = allProducts?.filter(p => 
        p.image_url || (p.image_urls && p.image_urls.length > 0)
      ) || [];

      // Calculate image statistics
      const imageUrlCounts: { [key: string]: number } = {};
      const uniqueImages = new Set<string>();

      productsWithImages.forEach(product => {
        if (product.image_url) {
          imageUrlCounts[product.image_url] = (imageUrlCounts[product.image_url] || 0) + 1;
          uniqueImages.add(product.image_url);
        }
        if (product.image_urls) {
          product.image_urls.forEach((url: string) => {
            imageUrlCounts[url] = (imageUrlCounts[url] || 0) + 1;
            uniqueImages.add(url);
          });
        }
      });

      const duplicateImages = Object.fromEntries(
        Object.entries(imageUrlCounts).filter(([_, count]) => count > 1)
      );

      setProducts(productsWithImages);
      setStats({
        totalProducts: allProducts?.length || 0,
        productsWithImages: productsWithImages.length,
        uniqueImages: uniqueImages.size,
        duplicateImages
      });

    } catch (error) {
      console.error('Error loading image audit:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats?.totalProducts || 0}</div>
          <div className="text-sm text-blue-800">Total Products</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats?.productsWithImages || 0}</div>
          <div className="text-sm text-green-800">With Images</div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{stats?.uniqueImages || 0}</div>
          <div className="text-sm text-yellow-800">Unique Images</div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {Object.keys(stats?.duplicateImages || {}).length}
          </div>
          <div className="text-sm text-red-800">Duplicate Images</div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Image Coverage</h4>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full" 
            style={{ 
              width: `${((stats?.productsWithImages || 0) / (stats?.totalProducts || 1)) * 100}%` 
            }}
          ></div>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {Math.round(((stats?.productsWithImages || 0) / (stats?.totalProducts || 1)) * 100)}% of products have images
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="text-amber-500 text-xl">⚠️</div>
          <div>
            <h4 className="font-medium text-amber-800">Image Quality Issues Detected</h4>
            <ul className="text-sm text-amber-700 mt-2 space-y-1">
              <li>• Only {stats?.productsWithImages || 0} out of {stats?.totalProducts || 0} products have images</li>
              <li>• {Object.keys(stats?.duplicateImages || {}).length} images are used for multiple products</li>
              <li>• Consider using placeholder images or generic category images for missing products</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProductsWithImages = () => (
    <div className="space-y-3">
      {products.map(product => (
        <div key={product.id} className="border border-gray-200 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <img 
              src={product.image_url || product.image_urls?.[0] || '/placeholder.jpg'} 
              alt={product.name}
              className="w-16 h-16 object-cover rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.jpg';
              }}
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{product.name}</h4>
              <p className="text-sm text-gray-600">SKU: {product.sku}</p>
              {product.image_urls && product.image_urls.length > 1 && (
                <p className="text-xs text-blue-600">{product.image_urls.length} images</p>
              )}
            </div>
            {onImageSelect && (
              <button
                onClick={() => onImageSelect(product.image_url || product.image_urls?.[0], product)}
                className="text-sm bg-dope-orange-500 text-white px-3 py-1 rounded hover:bg-dope-orange-600"
              >
                Use Image
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderDuplicateImages = () => (
    <div className="space-y-4">
      {Object.entries(stats?.duplicateImages || {}).map(([imageUrl, count]) => (
        <div key={imageUrl} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-4">
            <img 
              src={imageUrl} 
              alt="Duplicate image"
              className="w-20 h-20 object-cover rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.jpg';
              }}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                  Used by {count} products
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">Products using this image:</p>
                <div className="space-y-1">
                  {products
                    .filter(p => p.image_url === imageUrl || p.image_urls?.includes(imageUrl))
                    .slice(0, 3)
                    .map(product => (
                      <div key={product.id} className="text-xs">
                        • {product.name} ({product.sku})
                      </div>
                    ))}
                  {products.filter(p => p.image_url === imageUrl || p.image_urls?.includes(imageUrl)).length > 3 && (
                    <div className="text-xs text-gray-500">
                      ... and {products.filter(p => p.image_url === imageUrl || p.image_urls?.includes(imageUrl)).length - 3} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMissingImages = () => (
    <div className="text-center py-8 text-gray-500">
      <div className="text-4xl mb-4">📷</div>
      <h3 className="text-lg font-medium mb-2">Missing Images Analysis</h3>
      <p className="text-sm mb-4">
        {(stats?.totalProducts || 0) - (stats?.productsWithImages || 0)} products don't have images
      </p>
      <div className="bg-blue-50 p-4 rounded-lg text-left max-w-md mx-auto">
        <h4 className="font-medium text-blue-900 mb-2">Recommendations:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use category-based placeholder images</li>
          <li>• Create generic product type images</li>
          <li>• Implement image upload workflow</li>
          <li>• Consider AI-generated product images</li>
        </ul>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dope-orange-500 mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">Analyzing product images...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="font-medium text-gray-900 mb-3">Product Image Audit</h3>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          {[
            { key: 'overview', label: 'Overview', icon: '📊' },
            { key: 'with-images', label: 'With Images', icon: '🖼️' },
            { key: 'duplicates', label: 'Duplicates', icon: '👥' },
            { key: 'missing', label: 'Missing', icon: '❌' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                selectedTab === tab.key
                  ? 'text-dope-orange-600 border-b-2 border-dope-orange-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-h-96 overflow-y-auto">
        {selectedTab === 'overview' && renderOverview()}
        {selectedTab === 'with-images' && renderProductsWithImages()}
        {selectedTab === 'duplicates' && renderDuplicateImages()}
        {selectedTab === 'missing' && renderMissingImages()}
      </div>

      {/* Actions */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={loadImageAudit}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors"
        >
          Refresh Analysis
        </button>
      </div>
    </div>
  );
}
