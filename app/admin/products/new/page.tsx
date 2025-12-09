'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabaseBrowser } from '../../../lib/supabase-browser';
import { ArrowLeft, Upload, X, Save, Loader2, Database, CloudUpload, CheckCircle, AlertCircle, Settings } from 'lucide-react';
import { AirtableClient, ProductImportMapper, ProductImportService, FieldMapping, AirtableRecord } from '../../../../lib/airtable-client';
import MediaUpload from '../../_components/MediaUpload';

interface Brand {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductVariation {
  id?: string;
  name: string;
  value: string;
  type: 'flavor' | 'color' | 'size' | 'strength' | 'other';
  price_modifier?: number;
  stock_quantity?: number;
  image_url?: string;
  sku?: string;
}

interface ProductFormData {
  // Basic Information
  name: string;
  sku: string;
  description: string;
  short_description: string;

  // Pricing
  our_price: number;
  sale_price?: number;
  vip_price?: number;
  compare_at_price?: number;

  // Inventory
  stock_quantity: number;
  is_active: boolean;
  featured: boolean;

  // Organization
  brand_id: string;
  category_id: string;
  tags: string[];

  // Media
  image_url: string;
  image_urls: string[];

  // Variations
  has_variations: boolean;
  variations: ProductVariation[];

  // Compliance
  nicotine_product: boolean;
  tobacco_product: boolean;
  age_restriction: number;
  requires_lab_test: boolean;
  restricted_states: string[];

  // Additional
  weight_g?: number;
  dimensions?: string;
  materials?: string;
}

const initialFormData: ProductFormData = {
  name: '',
  sku: '',
  description: '',
  short_description: '',
  our_price: 0,
  stock_quantity: 0,
  is_active: true,
  featured: false,
  brand_id: '',
  category_id: '',
  tags: [],
  image_url: '',
  image_urls: [],
  has_variations: false,
  variations: [],
  nicotine_product: false,
  tobacco_product: false,
  age_restriction: 18,
  requires_lab_test: false,
  restricted_states: [],
};

export default function AddProductPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'manual' | 'airtable'>('manual');
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Airtable import state
  const [airtableApiKey, setAirtableApiKey] = useState('');
  const [airtableBases, setAirtableBases] = useState<any[]>([]);
  const [selectedBaseId, setSelectedBaseId] = useState('');
  const [airtableTables, setAirtableTables] = useState<any[]>([]);
  const [selectedTableId, setSelectedTableId] = useState('');
  const [fieldMapping, setFieldMapping] = useState<FieldMapping>({});
  const [sampleRecords, setSampleRecords] = useState<AirtableRecord[]>([]);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ processed: 0, total: 0 });
  const [importResults, setImportResults] = useState<any>(null);

  useEffect(() => {
    loadBrandsAndCategories();
  }, []);

  async function loadBrandsAndCategories() {
    setLoading(true);
    try {
      // Load brands
      const { data: brandsData, error: brandsError } = await supabaseBrowser
        .from('brands_new')
        .select('id, name, slug')
        .eq('is_active', true)
        .order('name');

      if (brandsError) throw brandsError;
      setBrands(brandsData || []);

      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabaseBrowser
        .from('categories_new')
        .select('id, name, slug')
        .eq('is_active', true)
        .order('name');

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error loading brands and categories:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleRestrictedStatesChange = (statesString: string) => {
    const states = statesString.split(',').map(state => state.trim()).filter(state => state.length > 0);
    setFormData(prev => ({ ...prev, restricted_states: states }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (formData.our_price <= 0) newErrors.our_price = 'Price must be greater than 0';
    if (!formData.brand_id) newErrors.brand_id = 'Brand selection is required';
    if (!formData.category_id) newErrors.category_id = 'Category selection is required';

    // Check for duplicate SKU
    // This would be implemented with a database check

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);
    try {
      const productData = {
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseBrowser
        .from('main_site_products')
        .insert(productData)
        .select()
        .single();

      if (error) throw error;

      alert('Product created successfully!');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error creating product:', error);
      alert(`Failed to create product: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dope-orange"></div>
      </div>
    );
  }

  // Airtable functions
  const handleAirtableApiKeyChange = async (apiKey: string) => {
    setAirtableApiKey(apiKey);
    if (apiKey.trim()) {
      try {
        const client = new AirtableClient(apiKey);
        const bases = await client.getBases();
        setAirtableBases(bases);
        setSelectedBaseId('');
        setAirtableTables([]);
        setSelectedTableId('');
      } catch (error) {
        console.error('Error fetching Airtable bases:', error);
        alert('Invalid API key or unable to connect to Airtable');
        setAirtableBases([]);
      }
    }
  };

  const handleBaseSelect = async (baseId: string) => {
    setSelectedBaseId(baseId);
    if (baseId && airtableApiKey) {
      try {
        const client = new AirtableClient(airtableApiKey);
        const tables = await client.getTables(baseId);
        setAirtableTables(tables);
        setSelectedTableId('');
      } catch (error) {
        console.error('Error fetching tables:', error);
        alert('Unable to fetch tables from selected base');
      }
    }
  };

  const handleTableSelect = async (tableId: string) => {
    setSelectedTableId(tableId);
    if (tableId && selectedBaseId && airtableApiKey) {
      try {
        const client = new AirtableClient(airtableApiKey);
        const samples = await client.getSampleRecords(selectedBaseId, tableId, 3);
        setSampleRecords(samples);

        // Auto-suggest field mappings
        const table = airtableTables.find(t => t.id === tableId);
        if (table) {
          const airtableFieldNames = table.fields.map((f: { name: string }) => f.name);
          const suggestedMapping = ProductImportMapper.suggestMappings(airtableFieldNames);
          setFieldMapping(suggestedMapping);
        }
      } catch (error) {
        console.error('Error fetching sample records:', error);
        alert('Unable to fetch sample records from selected table');
      }
    }
  };

  const handleImport = async () => {
    if (!selectedBaseId || !selectedTableId || !airtableApiKey) {
      alert('Please select a base and table first');
      return;
    }

    setImporting(true);
    setImportProgress({ processed: 0, total: 0 });
    setImportResults(null);

    try {
      const importService = new ProductImportService(airtableApiKey, fieldMapping);
      const results = await importService.importFromAirtable(
        selectedBaseId,
        selectedTableId,
        {
          onProgress: (processed, total) => {
            setImportProgress({ processed, total });
          },
          batchSize: 5, // Smaller batches for better progress tracking
        }
      );

      setImportResults(results);

      if (results.success) {
        alert(`Import completed! ${results.imported} products imported successfully.`);
        if (results.failed > 0) {
          alert(`${results.failed} products failed to import. Check the results below for details.`);
        }
        router.push('/admin/products');
      } else {
        alert(`Import failed: ${results.errors.join(', ')}`);
      }
    } catch (error: any) {
      console.error('Import error:', error);
      alert(`Import failed: ${error.message}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('manual')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'manual'
                  ? 'border-dope-orange text-dope-orange'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Database className="inline h-4 w-4 mr-2" />
              Manual Entry
            </button>
            <button
              onClick={() => setActiveTab('airtable')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'airtable'
                  ? 'border-dope-orange text-dope-orange'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CloudUpload className="inline h-4 w-4 mr-2" />
              Import from Airtable
            </button>
          </nav>
        </div>
      </div>

      {/* Manual Entry Tab */}
      {activeTab === 'manual' && (
        <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter product name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU *
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent ${
                  errors.sku ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter unique SKU"
              />
              {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description
              </label>
              <textarea
                value={formData.short_description}
                onChange={(e) => handleInputChange('short_description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                placeholder="Brief product description for cards and listings"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                placeholder="Detailed product description"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Regular Price *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.our_price}
                onChange={(e) => handleInputChange('our_price', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent ${
                  errors.our_price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.our_price && <p className="mt-1 text-sm text-red-600">{errors.our_price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sale Price
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.sale_price || ''}
                onChange={(e) => handleInputChange('sale_price', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                placeholder="Leave empty for no sale"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                VIP Price
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.vip_price || ''}
                onChange={(e) => handleInputChange('vip_price', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                placeholder="Member discount price"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compare At Price
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.compare_at_price || ''}
                onChange={(e) => handleInputChange('compare_at_price', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                placeholder="Original price for comparison"
              />
            </div>
          </div>
        </div>

        {/* Organization */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Organization</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand *
              </label>
              <select
                value={formData.brand_id}
                onChange={(e) => handleInputChange('brand_id', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent ${
                  errors.brand_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              {errors.brand_id && <p className="mt-1 text-sm text-red-600">{errors.brand_id}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => handleInputChange('category_id', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent ${
                  errors.category_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => handleTagsChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                placeholder="Enter tags separated by commas"
              />
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Inventory & Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={(e) => handleInputChange('stock_quantity', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
                className="rounded border-gray-300 text-dope-orange focus:ring-dope-orange"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Active Product
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="rounded border-gray-300 text-dope-orange focus:ring-dope-orange"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                Featured Product
              </label>
            </div>
          </div>
        </div>

        {/* Compliance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Compliance & Restrictions</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="nicotine_product"
                  checked={formData.nicotine_product}
                  onChange={(e) => handleInputChange('nicotine_product', e.target.checked)}
                  className="rounded border-gray-300 text-dope-orange focus:ring-dope-orange"
                />
                <label htmlFor="nicotine_product" className="text-sm font-medium text-gray-700">
                  Nicotine Product
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="tobacco_product"
                  checked={formData.tobacco_product}
                  onChange={(e) => handleInputChange('tobacco_product', e.target.checked)}
                  className="rounded border-gray-300 text-dope-orange focus:ring-dope-orange"
                />
                <label htmlFor="tobacco_product" className="text-sm font-medium text-gray-700">
                  Tobacco Product
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="requires_lab_test"
                  checked={formData.requires_lab_test}
                  onChange={(e) => handleInputChange('requires_lab_test', e.target.checked)}
                  className="rounded border-gray-300 text-dope-orange focus:ring-dope-orange"
                />
                <label htmlFor="requires_lab_test" className="text-sm font-medium text-gray-700">
                  Requires Lab Test
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age Restriction
              </label>
              <select
                value={formData.age_restriction}
                onChange={(e) => handleInputChange('age_restriction', parseInt(e.target.value))}
                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
              >
                <option value={18}>18+</option>
                <option value={21}>21+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restricted States
              </label>
              <input
                type="text"
                value={formData.restricted_states.join(', ')}
                onChange={(e) => handleRestrictedStatesChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                placeholder="CA, NY, TX (comma-separated)"
              />
            </div>
          </div>
        </div>

        {/* Variations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Product Variations</h2>

          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="has_variations"
                checked={formData.has_variations}
                onChange={(e) => handleInputChange('has_variations', e.target.checked)}
                className="rounded border-gray-300 text-dope-orange focus:ring-dope-orange"
              />
              <label htmlFor="has_variations" className="text-sm font-medium text-gray-700">
                This product has variations (flavors, colors, sizes, etc.)
              </label>
            </div>

            {formData.has_variations && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Add variations below. Each variation can have its own price, stock, and image.
                  Variations will be displayed as dropdown menus (flavors) or color swatches on the product page.
                </p>

                {formData.variations.map((variation, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Variation Name *
                        </label>
                        <input
                          type="text"
                          value={variation.name}
                          onChange={(e) => {
                            const newVariations = [...formData.variations];
                            newVariations[index].name = e.target.value;
                            handleInputChange('variations', newVariations);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                          placeholder="e.g., Strawberry, Blue, Large"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Value *
                        </label>
                        <input
                          type="text"
                          value={variation.value}
                          onChange={(e) => {
                            const newVariations = [...formData.variations];
                            newVariations[index].value = e.target.value;
                            handleInputChange('variations', newVariations);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                          placeholder="e.g., #FF6B6B, XL, Mild"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type *
                        </label>
                        <select
                          value={variation.type}
                          onChange={(e) => {
                            const newVariations = [...formData.variations];
                            newVariations[index].type = e.target.value as any;
                            handleInputChange('variations', newVariations);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                        >
                          <option value="flavor">Flavor (dropdown)</option>
                          <option value="color">Color (swatches)</option>
                          <option value="size">Size (dropdown)</option>
                          <option value="strength">Strength (dropdown)</option>
                          <option value="other">Other (dropdown)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price Modifier
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={variation.price_modifier || ''}
                          onChange={(e) => {
                            const newVariations = [...formData.variations];
                            newVariations[index].price_modifier = parseFloat(e.target.value) || 0;
                            handleInputChange('variations', newVariations);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                          placeholder="0.00 (+/- from base price)"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Stock Quantity
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={variation.stock_quantity || ''}
                          onChange={(e) => {
                            const newVariations = [...formData.variations];
                            newVariations[index].stock_quantity = parseInt(e.target.value) || 0;
                            handleInputChange('variations', newVariations);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                          placeholder="Leave empty to use base stock"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Variation Image URL
                        </label>
                        <input
                          type="url"
                          value={variation.image_url || ''}
                          onChange={(e) => {
                            const newVariations = [...formData.variations];
                            newVariations[index].image_url = e.target.value;
                            handleInputChange('variations', newVariations);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                          placeholder="Image for this variation"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Variation SKU
                        </label>
                        <input
                          type="text"
                          value={variation.sku || ''}
                          onChange={(e) => {
                            const newVariations = [...formData.variations];
                            newVariations[index].sku = e.target.value;
                            handleInputChange('variations', newVariations);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                          placeholder="Unique SKU for this variation"
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => {
                            const newVariations = formData.variations.filter((_, i) => i !== index);
                            handleInputChange('variations', newVariations);
                          }}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const newVariations = [...formData.variations, {
                      name: '',
                      value: '',
                      type: 'flavor' as const,
                      price_modifier: 0,
                      stock_quantity: undefined,
                      image_url: undefined,
                      sku: undefined
                    }];
                    handleInputChange('variations', newVariations);
                  }}
                  className="px-4 py-2 bg-dope-orange hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                >
                  + Add Variation
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Media */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Media</h2>
          <MediaUpload
            onMediaUploaded={(urls: string[]) => {
              // First URL is primary image, rest are gallery
              handleInputChange('image_url', urls[0] || '');
              handleInputChange('image_urls', urls.slice(1));
            }}
            existingUrls={[formData.image_url, ...formData.image_urls].filter(Boolean)}
            maxFiles={15}
            bucket="website-images"
            folder="products"
            label="Product Images"
            description="Upload product images. First image will be the primary image, additional images will be in the gallery."
          />
        </div>

        {/* Additional Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Additional Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (grams)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.weight_g || ''}
                onChange={(e) => handleInputChange('weight_g', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                placeholder="Product weight"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dimensions
              </label>
              <input
                type="text"
                value={formData.dimensions || ''}
                onChange={(e) => handleInputChange('dimensions', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                placeholder="L x W x H (inches)"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Materials
              </label>
              <input
                type="text"
                value={formData.materials || ''}
                onChange={(e) => handleInputChange('materials', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                placeholder="Glass, Metal, Plastic, etc."
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/products"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-dope-orange hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Product...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create Product
              </>
            )}
          </button>
        </div>
      </form>
      )}

      {/* Airtable Import Tab */}
      {activeTab === 'airtable' && (
        <div className="space-y-8">
          {/* API Key Setup */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Airtable Configuration
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Airtable API Key
                </label>
                <input
                  type="password"
                  value={airtableApiKey}
                  onChange={(e) => handleAirtableApiKeyChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                  placeholder="Enter your Airtable API key"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get your API key from{' '}
                  <a
                    href="https://airtable.com/developers/web/api/introduction"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dope-orange hover:underline"
                  >
                    Airtable Account Settings
                  </a>
                </p>
              </div>

              {airtableBases.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Base
                  </label>
                  <select
                    value={selectedBaseId}
                    onChange={(e) => handleBaseSelect(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                  >
                    <option value="">Choose a base...</option>
                    {airtableBases.map((base) => (
                      <option key={base.id} value={base.id}>
                        {base.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {airtableTables.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Table
                  </label>
                  <select
                    value={selectedTableId}
                    onChange={(e) => handleTableSelect(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                  >
                    <option value="">Choose a table...</option>
                    {airtableTables.map((table) => (
                      <option key={table.id} value={table.id}>
                        {table.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Field Mapping */}
          {sampleRecords.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Field Mapping</h2>

              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Map your Airtable columns to product fields. We've suggested mappings based on common field names.
                </p>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Airtable Field
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Maps to Product Field
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.keys(fieldMapping).map((airtableField) => (
                        <tr key={airtableField}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {airtableField}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={fieldMapping[airtableField]}
                              onChange={(e) => setFieldMapping(prev => ({
                                ...prev,
                                [airtableField]: e.target.value
                              }))}
                              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                            >
                              <option value="">Don't import</option>
                              <option value="name">Product Name</option>
                              <option value="sku">SKU</option>
                              <option value="description">Description</option>
                              <option value="short_description">Short Description</option>
                              <option value="our_price">Regular Price</option>
                              <option value="sale_price">Sale Price</option>
                              <option value="vip_price">VIP Price</option>
                              <option value="compare_at_price">Compare At Price</option>
                              <option value="stock_quantity">Stock Quantity</option>
                              <option value="is_active">Active Status</option>
                              <option value="brand_name">Brand Name</option>
                              <option value="category_name">Category Name</option>
                              <option value="image_url">Primary Image URL</option>
                              <option value="image_urls">Additional Images</option>
                              <option value="nicotine_product">Nicotine Product</option>
                              <option value="weight_g">Weight (g)</option>
                              <option value="dimensions">Dimensions</option>
                              <option value="materials">Materials</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Sample Data Preview */}
          {sampleRecords.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Data Preview</h2>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(sampleRecords[0]?.fields || {}).map((fieldName) => (
                        <th key={fieldName} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {fieldName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sampleRecords.slice(0, 3).map((record, index) => (
                      <tr key={record.id}>
                        {Object.values(record.fields).map((value: any, fieldIndex) => (
                          <td key={fieldIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {typeof value === 'string' && value.length > 50
                              ? `${value.substring(0, 50)}...`
                              : String(value || '')
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Import Progress */}
          {importing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <h3 className="text-lg font-medium text-blue-900">Importing Products...</h3>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{importProgress.processed} / {importProgress.total || '?'} products</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: importProgress.total
                        ? `${(importProgress.processed / importProgress.total) * 100}%`
                        : '0%'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Import Results */}
          {importResults && (
            <div className={`border rounded-lg p-6 ${
              importResults.success
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                {importResults.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <h3 className={`text-lg font-medium ${
                  importResults.success ? 'text-green-900' : 'text-red-900'
                }`}>
                  Import {importResults.success ? 'Completed' : 'Failed'}
                </h3>
              </div>

              <div className="space-y-2 text-sm">
                <p><strong>Imported:</strong> {importResults.imported} products</p>
                <p><strong>Failed:</strong> {importResults.failed} products</p>

                {importResults.errors.length > 0 && (
                  <div>
                    <strong>Errors:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {importResults.errors.map((error: string, index: number) => (
                        <li key={index} className="text-red-700">{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Import Button */}
          <div className="flex justify-end gap-4">
            <Link
              href="/admin/products"
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={handleImport}
              disabled={importing || !selectedBaseId || !selectedTableId || !airtableApiKey}
              className="px-6 py-3 bg-dope-orange hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {importing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <CloudUpload className="h-4 w-4" />
                  Import Products
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
