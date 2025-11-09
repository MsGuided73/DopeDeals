"use client";

import { useState, useEffect } from 'react';
import {
  Folder,
  FolderOpen,
  Tag,
  Plus,
  Edit,
  Trash2,
  Search,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  Settings,
  BarChart3,
  Users,
  Package
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
  product_count: number;
  created_at: string;
  updated_at: string;
  children?: Category[];
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  website?: string;
  is_active: boolean;
  product_count: number;
  created_at: string;
  updated_at: string;
}

interface CategoryStats {
  totalCategories: number;
  activeCategories: number;
  totalBrands: number;
  activeBrands: number;
  totalProducts: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [stats, setStats] = useState<CategoryStats>({
    totalCategories: 0,
    activeCategories: 0,
    totalBrands: 0,
    activeBrands: 0,
    totalProducts: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'categories' | 'brands'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      // Load categories
      const categoriesRes = await fetch('/api/admin/categories');
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.categories || []);
      } else {
        // Mock categories data
        setCategories([
          {
            id: '1',
            name: 'Bongs',
            slug: 'bongs',
            description: 'Water pipes and smoking devices',
            is_active: true,
            sort_order: 1,
            product_count: 45,
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-11-08T14:20:00Z',
            children: [
              {
                id: '1-1',
                name: 'Glass Bongs',
                slug: 'glass-bongs',
                description: 'Artisanal glass water pipes',
                parent_id: '1',
                is_active: true,
                sort_order: 1,
                product_count: 32,
                created_at: '2024-02-15T10:30:00Z',
                updated_at: '2024-11-08T14:20:00Z'
              },
              {
                id: '1-2',
                name: 'Silicone Bongs',
                slug: 'silicone-bongs',
                description: 'Durable silicone smoking devices',
                parent_id: '1',
                is_active: true,
                sort_order: 2,
                product_count: 13,
                created_at: '2024-02-15T10:30:00Z',
                updated_at: '2024-11-08T14:20:00Z'
              }
            ]
          },
          {
            id: '2',
            name: 'Pre-Rolls',
            slug: 'pre-rolls',
            description: 'Pre-rolled cannabis cigarettes',
            is_active: true,
            sort_order: 2,
            product_count: 67,
            created_at: '2024-01-20T10:30:00Z',
            updated_at: '2024-11-08T14:20:00Z'
          },
          {
            id: '3',
            name: 'THCA Flower',
            slug: 'thca-flower',
            description: 'High-quality THCA cannabis flower',
            is_active: true,
            sort_order: 3,
            product_count: 89,
            created_at: '2024-01-25T10:30:00Z',
            updated_at: '2024-11-08T14:20:00Z'
          }
        ]);
      }

      // Load brands
      const brandsRes = await fetch('/api/admin/brands');
      if (brandsRes.ok) {
        const brandsData = await brandsRes.json();
        setBrands(brandsData.brands || []);
      } else {
        // Mock brands data
        setBrands([
          {
            id: '1',
            name: 'RooR',
            slug: 'roor',
            description: 'Premium glass smoking accessories',
            logo_url: '/brands/roor-logo.png',
            website: 'https://roor.com',
            is_active: true,
            product_count: 23,
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-11-08T14:20:00Z'
          },
          {
            id: '2',
            name: 'Gorilla Glue',
            slug: 'gorilla-glue',
            description: 'Legendary cannabis strain products',
            logo_url: '/brands/gg-logo.png',
            website: 'https://gorillaglue.com',
            is_active: true,
            product_count: 45,
            created_at: '2024-01-20T10:30:00Z',
            updated_at: '2024-11-08T14:20:00Z'
          },
          {
            id: '3',
            name: 'Blue Dream',
            slug: 'blue-dream',
            description: 'Premium cannabis products',
            logo_url: '/brands/bd-logo.png',
            website: 'https://bluedream.com',
            is_active: true,
            product_count: 38,
            created_at: '2024-01-25T10:30:00Z',
            updated_at: '2024-11-08T14:20:00Z'
          }
        ]);
      }

      // Load stats
      const statsRes = await fetch('/api/admin/categories/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      } else {
        setStats({
          totalCategories: 12,
          activeCategories: 10,
          totalBrands: 25,
          activeBrands: 22,
          totalProducts: 342
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateCategoryStatus(categoryId: string, isActive: boolean) {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: isActive })
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error('Error updating category status:', error);
    }
  }

  async function updateBrandStatus(brandId: string, isActive: boolean) {
    try {
      const response = await fetch(`/api/admin/brands/${brandId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: isActive })
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error('Error updating brand status:', error);
    }
  }

  async function deleteCategory(categoryId: string) {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  }

  async function deleteBrand(brandId: string) {
    if (!confirm('Are you sure you want to delete this brand? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/admin/brands/${brandId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  }

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories & Brands</h1>
          <p className="text-gray-600 mt-1">Manage product categories and brand information</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
          <button
            onClick={() => setShowBrandModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Brand
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
            </div>
            <Folder className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Categories</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeCategories}</p>
            </div>
            <FolderOpen className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Brands</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBrands}</p>
            </div>
            <Tag className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Brands</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeBrands}</p>
            </div>
            <Tag className="w-8 h-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
            <Package className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'categories'
                  ? 'border-dope-orange text-dope-orange'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Categories ({categories.length})
            </button>
            <button
              onClick={() => setActiveTab('brands')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'brands'
                  ? 'border-dope-orange text-dope-orange'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Brands ({brands.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
              />
            </div>
          </div>

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              {filteredCategories.map((category) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  level={0}
                  isExpanded={expandedCategories.has(category.id)}
                  onToggle={() => toggleCategoryExpansion(category.id)}
                  onEdit={() => {
                    setSelectedCategory(category);
                    setShowCategoryModal(true);
                  }}
                  onDelete={() => deleteCategory(category.id)}
                  onStatusChange={(isActive) => updateCategoryStatus(category.id, isActive)}
                />
              ))}
              {filteredCategories.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Folder className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg">No categories found</p>
                  <p className="text-sm">Try adjusting your search or add a new category</p>
                </div>
              )}
            </div>
          )}

          {/* Brands Tab */}
          {activeTab === 'brands' && (
            <div className="space-y-4">
              {filteredBrands.map((brand) => (
                <BrandItem
                  key={brand.id}
                  brand={brand}
                  onEdit={() => {
                    setSelectedBrand(brand);
                    setShowBrandModal(true);
                  }}
                  onDelete={() => deleteBrand(brand.id)}
                  onStatusChange={(isActive) => updateBrandStatus(brand.id, isActive)}
                />
              ))}
              {filteredBrands.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Tag className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg">No brands found</p>
                  <p className="text-sm">Try adjusting your search or add a new brand</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <CategoryModal
          category={selectedCategory}
          categories={categories}
          onClose={() => {
            setShowCategoryModal(false);
            setSelectedCategory(null);
          }}
          onSave={async () => {
            await loadData();
            setShowCategoryModal(false);
            setSelectedCategory(null);
          }}
        />
      )}

      {/* Brand Modal */}
      {showBrandModal && (
        <BrandModal
          brand={selectedBrand}
          onClose={() => {
            setShowBrandModal(false);
            setSelectedBrand(null);
          }}
          onSave={async () => {
            await loadData();
            setShowBrandModal(false);
            setSelectedBrand(null);
          }}
        />
      )}
    </div>
  );
}

// Category Item Component
function CategoryItem({
  category,
  level,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onStatusChange
}: {
  category: Category;
  level: number;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (isActive: boolean) => void;
}) {
  const hasChildren = category.children && category.children.length > 0;
  const indentClass = level > 0 ? `ml-${level * 6}` : '';

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${indentClass}`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {hasChildren ? (
              <button onClick={onToggle} className="text-gray-400 hover:text-gray-600">
                {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
            ) : (
              <div className="w-5" />
            )}
            <Folder className={`w-6 h-6 ${category.is_active ? 'text-blue-600' : 'text-gray-400'}`} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-500">/{category.slug}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{category.product_count} products</p>
              <p className="text-xs text-gray-500">Sort: {category.sort_order}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onStatusChange(!category.is_active)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  category.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {category.is_active ? 'Active' : 'Inactive'}
              </button>

              <button onClick={onEdit} className="p-2 text-gray-400 hover:text-blue-600">
                <Edit className="w-4 h-4" />
              </button>

              <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {category.description && (
          <p className="mt-2 text-sm text-gray-600">{category.description}</p>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="border-t border-gray-100">
          {category.children!.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              level={level + 1}
              isExpanded={false}
              onToggle={() => {}}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Brand Item Component
function BrandItem({
  brand,
  onEdit,
  onDelete,
  onStatusChange
}: {
  brand: Brand;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (isActive: boolean) => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            {brand.logo_url ? (
              <img src={brand.logo_url} alt={brand.name} className="w-8 h-8 object-contain" />
            ) : (
              <Tag className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{brand.name}</h3>
            <p className="text-sm text-gray-500">/{brand.slug}</p>
            {brand.website && (
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {brand.website}
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{brand.product_count} products</p>
            <p className="text-xs text-gray-500">
              {new Date(brand.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onStatusChange(!brand.is_active)}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                brand.is_active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {brand.is_active ? 'Active' : 'Inactive'}
            </button>

            <button onClick={onEdit} className="p-2 text-gray-400 hover:text-blue-600">
              <Edit className="w-4 h-4" />
            </button>

            <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-600">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {brand.description && (
        <p className="mt-3 text-sm text-gray-600">{brand.description}</p>
      )}
    </div>
  );
}

// Category Modal Component
function CategoryModal({
  category,
  categories,
  onClose,
  onSave
}: {
  category: Category | null;
  categories: Category[];
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    parent_id: category?.parent_id || '',
    sort_order: category?.sort_order || 0,
    is_active: category?.is_active ?? true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = category ? `/api/admin/categories/${category.id}` : '/api/admin/categories';
      const method = category ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSave();
      }
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const parentCategories = categories.filter(c => !c.parent_id && c.id !== category?.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {category ? 'Edit Category' : 'Add Category'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
            <select
              value={formData.parent_id}
              onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
            >
              <option value="">No Parent (Top Level)</option>
              {parentCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
              min="0"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="h-4 w-4 text-dope-orange focus:ring-dope-orange border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">Active</label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-dope-orange hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium">
              {category ? 'Update' : 'Create'} Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Brand Modal Component
function BrandModal({
  brand,
  onClose,
  onSave
}: {
  brand: Brand | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    name: brand?.name || '',
    slug: brand?.slug || '',
    description: brand?.description || '',
    logo_url: brand?.logo_url || '',
    website: brand?.website || '',
    is_active: brand?.is_active ?? true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = brand ? `/api/admin/brands/${brand.id}` : '/api/admin/brands';
      const method = brand ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSave();
      }
    } catch (error) {
      console.error('Error saving brand:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {brand ? 'Edit Brand' : 'Add Brand'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
            <input
              type="url"
              value={formData.logo_url}
              onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="brand_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="h-4 w-4 text-dope-orange focus:ring-dope-orange border-gray-300 rounded"
            />
            <label htmlFor="brand_active" className="ml-2 text-sm text-gray-700">Active</label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-dope-orange hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium">
              {brand ? 'Update' : 'Create'} Brand
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
