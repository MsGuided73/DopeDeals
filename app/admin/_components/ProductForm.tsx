'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { Save, Loader2 } from 'lucide-react';
import MediaUpload from './MediaUpload';

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

interface ComplianceRule {
  id: string;
  category: string;
  description: string;
  age_requirement: number;
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

export interface ProductFormData {
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

  // Compliance Flags (Legacy/Simple)
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

const defaultFormData: ProductFormData = {
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
  age_restriction: 21,
  requires_lab_test: false,
  restricted_states: [],
};

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  initialSelectedRules?: string[]; // Array of compliance_rule IDs
  onSubmit: (formData: ProductFormData, selectedRules: string[]) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function ProductForm({
  initialData,
  initialSelectedRules = [],
  onSubmit,
  onCancel,
  isSubmitting
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    ...defaultFormData,
    ...initialData
  });
  const [selectedRules, setSelectedRules] = useState<string[]>(initialSelectedRules);
  
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableRules, setAvailableRules] = useState<ComplianceRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadFormData();
  }, []);

  async function loadFormData() {
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

      // Load compliance rules
      const { data: rulesData, error: rulesError } = await supabaseBrowser
        .from('compliance_rules')
        .select('id, category, description, age_requirement')
        .order('category');
      if (rulesError) throw rulesError;
      setAvailableRules(rulesData || []);

    } catch (error) {
      console.error('Error loading form options:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const toggleRuleSelection = (ruleId: string) => {
    setSelectedRules(prev => 
      prev.includes(ruleId) 
        ? prev.filter(id => id !== ruleId)
        : [...prev, ruleId]
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (formData.our_price <= 0) newErrors.our_price = 'Price must be greater than 0';
    if (!formData.brand_id) newErrors.brand_id = 'Brand selection is required';
    if (!formData.category_id) newErrors.category_id = 'Category selection is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    await onSubmit(formData, selectedRules);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-dope-orange" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter product name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => handleInputChange('sku', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent ${errors.sku ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter unique SKU"
            />
            {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
            <textarea
              value={formData.short_description}
              onChange={(e) => handleInputChange('short_description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
              placeholder="Brief product description for cards and listings"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Regular Price *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.our_price}
              onChange={(e) => handleInputChange('our_price', parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent ${errors.our_price ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="0.00"
            />
            {errors.our_price && <p className="mt-1 text-sm text-red-600">{errors.our_price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sale Price</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">VIP Price</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Compare At Price</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
            <select
              value={formData.brand_id}
              onChange={(e) => handleInputChange('brand_id', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent ${errors.brand_id ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select a brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
            {errors.brand_id && <p className="mt-1 text-sm text-red-600">{errors.brand_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select
              value={formData.category_id}
              onChange={(e) => handleInputChange('category_id', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent ${errors.category_id ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <input
              type="text"
              value={formData.tags?.join(', ') || ''}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
            <input
              type="number"
              min="0"
              value={formData.stock_quantity}
              onChange={(e) => handleInputChange('stock_quantity', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => handleInputChange('is_active', e.target.checked)}
              className="rounded border-gray-300 text-dope-orange focus:ring-dope-orange"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active Product</label>
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => handleInputChange('featured', e.target.checked)}
              className="rounded border-gray-300 text-dope-orange focus:ring-dope-orange"
            />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">Featured Product</label>
          </div>
        </div>
      </div>

      {/* Compliance ENGINE */}
      <div className="bg-white rounded-lg shadow border-2 border-dope-orange/20 overflow-hidden">
        <div className="bg-orange-50/50 p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Advanced Compliance Rules</h2>
          <p className="text-sm text-gray-600 mt-1">Select all regulatory rules that apply to this product. These rules govern checkout geofencing and age requirements.</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableRules.map(rule => (
              <label 
                key={rule.id}
                className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${
                  selectedRules.includes(rule.id) 
                    ? 'border-dope-orange bg-orange-50/30 shadow-sm' 
                    : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center h-5 mt-1">
                  <input
                    type="checkbox"
                    checked={selectedRules.includes(rule.id)}
                    onChange={() => toggleRuleSelection(rule.id)}
                    className="h-5 w-5 rounded border-gray-300 text-dope-orange focus:ring-dope-orange"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <span className="block text-sm font-medium text-gray-900">
                    {rule.category}
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {rule.age_requirement}+
                    </span>
                  </span>
                  <span className="block text-sm text-gray-500 mt-1">
                    {rule.description || `Applies ${rule.category} restrictions`}
                  </span>
                </div>
              </label>
            ))}
            
            {availableRules.length === 0 && (
              <div className="col-span-full text-center py-4 text-gray-500">
                No compliance rules configured in the database.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legacy/Simple Compliance (Kept for compatibility) */}
      <div className="bg-white rounded-lg shadow p-6 opacity-75">
        <h2 className="text-xl font-semibold mb-4 text-gray-500">Legacy Settings (Optional)</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="nicotine_product"
                checked={formData.nicotine_product}
                onChange={(e) => handleInputChange('nicotine_product', e.target.checked)}
                className="rounded border-gray-300 text-gray-500 focus:ring-gray-500"
              />
              <label htmlFor="nicotine_product" className="text-sm font-medium text-gray-500">Nicotine Product</label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="tobacco_product"
                checked={formData.tobacco_product}
                onChange={(e) => handleInputChange('tobacco_product', e.target.checked)}
                className="rounded border-gray-300 text-gray-500 focus:ring-gray-500"
              />
              <label htmlFor="tobacco_product" className="text-sm font-medium text-gray-500">Tobacco Product</label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="requires_lab_test"
                checked={formData.requires_lab_test}
                onChange={(e) => handleInputChange('requires_lab_test', e.target.checked)}
                className="rounded border-gray-300 text-gray-500 focus:ring-gray-500"
              />
              <label htmlFor="requires_lab_test" className="text-sm font-medium text-gray-500">Requires Lab Test</label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Manual Restricted States Override (Comma-separated)</label>
            <input
              type="text"
              value={formData.restricted_states?.join(', ') || ''}
              onChange={(e) => handleRestrictedStatesChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              placeholder="CA, NY, TX"
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
              {formData.variations.map((variation, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Variation Name *</label>
                      <input
                        type="text"
                        value={variation.name}
                        onChange={(e) => {
                          const newVariations = [...formData.variations];
                          newVariations[index].name = e.target.value;
                          handleInputChange('variations', newVariations);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                      <input
                        type="text"
                        value={variation.value}
                        onChange={(e) => {
                          const newVariations = [...formData.variations];
                          newVariations[index].value = e.target.value;
                          handleInputChange('variations', newVariations);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                      <select
                        value={variation.type}
                        onChange={(e) => {
                          const newVariations = [...formData.variations];
                          newVariations[index].type = e.target.value as any;
                          handleInputChange('variations', newVariations);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                      >
                        <option value="flavor">Flavor</option>
                        <option value="color">Color</option>
                        <option value="size">Size</option>
                        <option value="strength">Strength</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price Modifier</label>
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
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
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
                      />
                    </div>
                    <div className="flex items-end lg:col-span-3">
                      <button
                        type="button"
                        onClick={() => {
                          const newVariations = formData.variations.filter((_, i) => i !== index);
                          handleInputChange('variations', newVariations);
                        }}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
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
                    price_modifier: 0
                  }];
                  handleInputChange('variations', newVariations);
                }}
                className="px-4 py-2 bg-dope-orange hover:bg-orange-600 text-white rounded-lg font-medium"
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
            handleInputChange('image_url', urls[0] || '');
            handleInputChange('image_urls', urls.slice(1));
          }}
          existingUrls={[formData.image_url, ...(formData.image_urls || [])].filter(Boolean)}
          maxFiles={15}
          bucket="website-images"
          folder="products"
          label="Product Images"
          description="Upload product images. First image will be the primary image, additional images will be in the gallery."
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4 pb-12">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-dope-orange hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Product
            </>
          )}
        </button>
      </div>
    </form>
  );
}
