'use client';

import { useState, useEffect } from 'react';
import { supabaseBrowser } from '../../lib/supabase-browser';
import Image from 'next/image';

type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  vip_price?: number;
  image_url?: string;
  description?: string;
  short_description?: string;
  stock_quantity: number;
  is_active: boolean;
  brand_name?: string;
  created_at: string;
};

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [availableImages, setAvailableImages] = useState<string[]>([]);

  useEffect(() => {
    loadProducts();
    loadAvailableImages();
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const { data, error } = await supabaseBrowser
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadAvailableImages() {
    try {
      const { data, error } = await supabaseBrowser
        .storage
        .from('website-images')
        .list('products/bongs/RooR', {
          limit: 100,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (error) throw error;
      
      const imageUrls = (data || []).map(file => 
        `https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/products/bongs/RooR/${file.name}`
      );
      
      setAvailableImages(imageUrls);
    } catch (error) {
      console.error('Error loading images:', error);
    }
  }

  async function updateProduct(productId: string, updates: Partial<Product>) {
    try {
      const { error } = await supabaseBrowser
        .from('products')
        .update(updates)
        .eq('id', productId);

      if (error) throw error;
      
      await loadProducts();
      setShowEditModal(false);
      setSelectedProduct(null);
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  }

  async function deleteProduct(productId: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabaseBrowser
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      
      await loadProducts();
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group products by image to show duplicates
  const imageGroups: { [key: string]: Product[] } = {};
  filteredProducts.forEach(product => {
    const imageKey = product.image_url || 'NO_IMAGE';
    if (!imageGroups[imageKey]) {
      imageGroups[imageKey] = [];
    }
    imageGroups[imageKey].push(product);
  });

  const duplicateImages = Object.entries(imageGroups).filter(([_, prods]) => prods.length > 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dope-orange"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-1">{products.length} total products</p>
        </div>
        <button
          onClick={() => window.location.href = '/admin/products/new'}
          className="bg-dope-orange hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          + Add New Product
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <input
          type="text"
          placeholder="Search products by name, SKU, or brand..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
        />
      </div>

      {/* Duplicate Images Warning */}
      {duplicateImages.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <span className="text-red-700 font-semibold">⚠️ {duplicateImages.length} Duplicate Image Groups Found</span>
          </div>
          <p className="text-red-600 text-sm mt-1">
            Multiple products are using the same images. Click on products below to assign unique images.
          </p>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => {
              const isDuplicate = imageGroups[product.image_url || 'NO_IMAGE']?.length > 1;
              
              return (
                <tr key={product.id} className={isDuplicate ? 'bg-red-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.image_url ? (
                      <div className="relative w-16 h-16">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover rounded"
                        />
                        {isDuplicate && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            !
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{product.name.substring(0, 50)}</div>
                    <div className="text-sm text-gray-500">{product.brand_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock_quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowEditModal(true);
                      }}
                      className="text-dope-orange hover:text-orange-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Modal - Will be implemented in next file */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
            <p className="text-gray-600 mb-4">Product ID: {selectedProduct.id}</p>
            
            <button
              onClick={() => setShowEditModal(false)}
              className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

