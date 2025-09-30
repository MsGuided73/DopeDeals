'use client';

import { useState, useEffect } from 'react';
import { supabaseBrowser } from '../../lib/supabase-browser';
import Image from 'next/image';
import Link from 'next/link';

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
  brand_id?: string;
  created_at: string;
};

type Brand = {
  id: string;
  name: string;
  slug: string;
};

type ViewMode = 'all' | 'by-brand' | 'by-category' | 'duplicates' | 'no-images';

const CATEGORIES = [
  'Bongs', 'Pipes', 'Dab Rigs', 'E-Rigs', 'Bubblers',
  'Pre-Rolls', 'THCA Flower', 'Vapes', 'Accessories',
  'Hookahs', 'Torches', 'Papers', 'Grinders'
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [imageFolder, setImageFolder] = useState<string>('products/bongs/RooR');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      // Load brands
      const { data: brandsData, error: brandsError } = await supabaseBrowser
        .from('brands')
        .select('*')
        .order('name');

      if (brandsError) throw brandsError;
      setBrands(brandsData || []);

      // Load products
      const { data: productsData, error: productsError } = await supabaseBrowser
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(500);

      if (productsError) throw productsError;
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadAvailableImages(folder: string = 'products/bongs/RooR') {
    try {
      const { data, error } = await supabaseBrowser
        .storage
        .from('website-images')
        .list(folder, {
          limit: 200,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (error) throw error;

      const imageUrls = (data || [])
        .filter(file => file.name.match(/\.(jpg|jpeg|png|webp|gif)$/i))
        .map(file =>
          `https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/${folder}/${file.name}`
        );

      setAvailableImages(imageUrls);
    } catch (error) {
      console.error('Error loading images:', error);
    }
  }

  // Categorize product based on name/description
  function categorizeProduct(product: Product): string {
    const searchText = `${product.name} ${product.description || ''}`.toLowerCase();

    if (searchText.includes('bong') || searchText.includes('beaker') || searchText.includes('water pipe')) return 'Bongs';
    if (searchText.includes('pipe') && !searchText.includes('water')) return 'Pipes';
    if (searchText.includes('dab rig') || searchText.includes('oil rig')) return 'Dab Rigs';
    if (searchText.includes('e-rig') || searchText.includes('puffco') || searchText.includes('peak')) return 'E-Rigs';
    if (searchText.includes('bubbler')) return 'Bubblers';
    if (searchText.includes('pre-roll') || searchText.includes('preroll')) return 'Pre-Rolls';
    if (searchText.includes('flower') || searchText.includes('thca')) return 'THCA Flower';
    if (searchText.includes('vape') || searchText.includes('disposable') || searchText.includes('cartridge')) return 'Vapes';
    if (searchText.includes('hookah') || searchText.includes('shisha')) return 'Hookahs';
    if (searchText.includes('torch') || searchText.includes('lighter')) return 'Torches';
    if (searchText.includes('paper') || searchText.includes('rolling')) return 'Papers';
    if (searchText.includes('grinder')) return 'Grinders';

    return 'Accessories';
  }

  async function updateProductImage(productId: string, imageUrl: string) {
    try {
      const { error } = await supabaseBrowser
        .from('products')
        .update({ image_url: imageUrl })
        .eq('id', productId);

      if (error) throw error;

      await loadData();
      setShowImagePicker(false);
      setSelectedProduct(null);
      alert('Image updated successfully!');
    } catch (error) {
      console.error('Error updating image:', error);
      alert('Failed to update image');
    }
  }

  async function deleteProduct(productId: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabaseBrowser
        .from('products')
        .update({ is_active: false })
        .eq('id', productId);

      if (error) throw error;

      await loadData();
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  }

  // Filter products based on view mode and filters
  const getFilteredProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.brand_name?.toLowerCase().includes(query)
      );
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(p => p.brand_name === selectedBrand);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => categorizeProduct(p) === selectedCategory);
    }

    // View mode filters
    switch (viewMode) {
      case 'no-images':
        filtered = filtered.filter(p => !p.image_url);
        break;
      case 'duplicates':
        // Group by image URL and show only duplicates
        const imageGroups: { [key: string]: Product[] } = {};
        filtered.forEach(product => {
          const imageKey = product.image_url || 'NO_IMAGE';
          if (!imageGroups[imageKey]) {
            imageGroups[imageKey] = [];
          }
          imageGroups[imageKey].push(product);
        });
        const duplicateProducts = Object.values(imageGroups)
          .filter(group => group.length > 1)
          .flat();
        filtered = duplicateProducts;
        break;
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  // Group products by brand for by-brand view
  const productsByBrand = brands.map(brand => ({
    brand,
    products: filteredProducts.filter(p => p.brand_name === brand.name)
  })).filter(group => group.products.length > 0);

  // Group products by category for by-category view
  const productsByCategory = CATEGORIES.map(category => ({
    category,
    products: filteredProducts.filter(p => categorizeProduct(p) === category)
  })).filter(group => group.products.length > 0);

  // Detect duplicate images
  const imageGroups: { [key: string]: Product[] } = {};
  products.forEach(product => {
    const imageKey = product.image_url || 'NO_IMAGE';
    if (!imageGroups[imageKey]) {
      imageGroups[imageKey] = [];
    }
    imageGroups[imageKey].push(product);
  });
  const duplicateCount = Object.values(imageGroups).filter(group => group.length > 1).length;
  const noImageCount = products.filter(p => !p.image_url).length;

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
          <p className="text-gray-600 mt-1">
            {products.length} total products • {filteredProducts.length} shown
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-dope-orange hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          + Add New Product
        </Link>
      </div>

      {/* Filters and View Controls */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search products by name, SKU, or brand..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
        />

        {/* View Mode Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setViewMode('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'all'
                ? 'bg-dope-orange text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => setViewMode('by-brand')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'by-brand'
                ? 'bg-dope-orange text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            By Brand
          </button>
          <button
            onClick={() => setViewMode('by-category')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'by-category'
                ? 'bg-dope-orange text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            By Category
          </button>
          <button
            onClick={() => setViewMode('duplicates')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'duplicates'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Duplicate Images ({duplicateCount})
          </button>
          <button
            onClick={() => setViewMode('no-images')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'no-images'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            No Images
          </button>
        </div>

        {/* Brand & Category Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block font-medium text-gray-700 mb-2">Filter by Brand:</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
            >
              <option value="all">All Brands ({products.length})</option>
              {brands.map(brand => {
                const count = products.filter(p => p.brand_name === brand.name).length;
                return (
                  <option key={brand.id} value={brand.name}>
                    {brand.name} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block font-medium text-gray-700 mb-2">Filter by Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(category => {
                const count = products.filter(p => categorizeProduct(p) === category).length;
                return (
                  <option key={category} value={category}>
                    {category} ({count})
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Duplicate Images Warning */}
      {duplicateCount > 0 && viewMode !== 'duplicates' && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-red-700 font-semibold">⚠️ {duplicateCount} Duplicate Image Groups Found</span>
              <p className="text-red-600 text-sm mt-1">
                Multiple products are using the same images. Click "Duplicate Images" to fix them.
              </p>
            </div>
            <button
              onClick={() => setViewMode('duplicates')}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              View Duplicates
            </button>
          </div>
        </div>
      )}

      {/* Content - By Brand View */}
      {viewMode === 'by-brand' && (
        <div className="space-y-6">
          {productsByBrand.map(({ brand, products: brandProducts }) => (
            <div key={brand.id} className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🏷️ {brand.name} ({brandProducts.length} products)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {brandProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectImage={() => {
                      setSelectedProduct(product);
                      loadAvailableImages();
                      setShowImagePicker(true);
                    }}
                    onDelete={() => deleteProduct(product.id)}
                    isDuplicate={imageGroups[product.image_url || 'NO_IMAGE']?.length > 1}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content - By Category View */}
      {viewMode === 'by-category' && (
        <div className="space-y-6">
          {productsByCategory.map(({ category, products: categoryProducts }) => (
            <div key={category} className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📂 {category} ({categoryProducts.length} products)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categoryProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectImage={() => {
                      setSelectedProduct(product);
                      loadAvailableImages();
                      setShowImagePicker(true);
                    }}
                    onDelete={() => deleteProduct(product.id)}
                    isDuplicate={imageGroups[product.image_url || 'NO_IMAGE']?.length > 1}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content - All Products / Duplicates / No Images View */}
      {(viewMode === 'all' || viewMode === 'duplicates' || viewMode === 'no-images') && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectImage={() => {
                  setSelectedProduct(product);
                  loadAvailableImages();
                  setShowImagePicker(true);
                }}
                onDelete={() => deleteProduct(product.id)}
                isDuplicate={imageGroups[product.image_url || 'NO_IMAGE']?.length > 1}
              />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl">No products found</p>
            </div>
          )}
        </div>
      )}

      {/* Image Picker Modal */}
      {showImagePicker && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Select Image for {selectedProduct.name.substring(0, 50)}</h2>
              <button
                onClick={() => {
                  setShowImagePicker(false);
                  setSelectedProduct(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <label className="block font-medium text-gray-700 mb-2">Image Folder:</label>
              <select
                value={imageFolder}
                onChange={(e) => {
                  setImageFolder(e.target.value);
                  loadAvailableImages(e.target.value);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="products/bongs/RooR">RooR Bongs</option>
                <option value="products">All Products</option>
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableImages.map((imageUrl, index) => (
                <div
                  key={index}
                  onClick={() => updateProductImage(selectedProduct.id, imageUrl)}
                  className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-4 hover:ring-dope-orange transition-all"
                >
                  <Image
                    src={imageUrl}
                    alt={`Option ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {availableImages.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>No images found in this folder</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Product Card Component
function ProductCard({
  product,
  onSelectImage,
  onDelete,
  isDuplicate
}: {
  product: Product;
  onSelectImage: () => void;
  onDelete: () => void;
  isDuplicate: boolean;
}) {
  return (
    <div className={`bg-white border-2 rounded-lg overflow-hidden hover:shadow-xl transition-all ${
      isDuplicate ? 'border-red-500' : 'border-gray-200'
    }`}>
      {/* Image */}
      <div className="relative aspect-square bg-gray-100">
        {product.image_url ? (
          <>
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
            />
            {isDuplicate && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                DUPLICATE
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <span className="text-4xl">📷</span>
          </div>
        )}
        <button
          onClick={onSelectImage}
          className="absolute bottom-2 right-2 bg-dope-orange hover:bg-orange-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
        >
          Change Image
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2">SKU: {product.sku}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-dope-orange">${product.price}</span>
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Delete
          </button>
        </div>
        {product.brand_name && (
          <div className="mt-2 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {product.brand_name}
          </div>
        )}
      </div>
    </div>
  );
}
