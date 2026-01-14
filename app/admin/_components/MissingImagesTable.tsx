"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ImageIcon, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string;
  category_id: string;
  brand_name: string;
  created_at: string;
}

export default function MissingImagesTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMissingImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/products/missing-images');
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      setError('Could not load products missing images');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissingImages();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 text-red-600 mb-4">
          <AlertCircle className="w-5 h-5" />
          <p className="font-medium">{error}</p>
        </div>
        <button 
          onClick={fetchMissingImages}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900">Products Missing Images</h3>
          <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {products.length} found
          </span>
        </div>
        <button 
          onClick={fetchMissingImages}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          title="Refresh List"
        >
          <RefreshCw className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      
      <div className="overflow-x-auto max-h-[400px]">
        {products.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-8 h-8 text-green-500" />
            </div>
            <p className="font-medium text-gray-900">All products have images!</p>
            <p className="text-sm">Great job keeping the catalog up to date.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-sm text-gray-900">
            <thead className="sticky top-0 bg-white shadow-sm z-10">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-700 border-b border-gray-200">Product Name</th>
                <th className="px-6 py-3 font-semibold text-gray-700 border-b border-gray-200">SKU</th>
                <th className="px-6 py-3 font-semibold text-gray-700 border-b border-gray-200">Brand</th>
                <th className="px-6 py-3 font-semibold text-gray-700 border-b border-gray-200 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-orange-50 transition-colors group">
                  <td className="px-6 py-4 font-medium max-w-xs truncate">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                    {product.sku || '---'}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {product.brand_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/admin/products/${product.id}`}
                      className="inline-flex items-center gap-1.5 text-orange-600 hover:text-orange-800 font-medium group-hover:underline"
                    >
                      Fix Image
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {products.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 italic">
          Tip: Add high-quality 1:1 aspect ratio images for the best store display.
        </div>
      )}
    </div>
  );
}
