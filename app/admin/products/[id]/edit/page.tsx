'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabaseBrowser } from '../../../../lib/supabase-browser';
import ProductForm, { ProductFormData } from '../../../_components/ProductForm';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<ProductFormData | null>(null);
  const [initialRules, setInitialRules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  async function loadProduct() {
    try {
      setLoading(true);
      
      // 1. Fetch product basic info
      const { data: productData, error: productError } = await supabaseBrowser
        .from('main_site_products')
        .select('*')
        .eq('id', productId)
        .single();
        
      if (productError) throw productError;
      
      if (productData) {
        // Cast to our form data format, keeping nulls to empty string default logic as needed
        const mappedProduct: ProductFormData = {
          name: productData.name || '',
          sku: productData.sku || '',
          description: productData.description || '',
          short_description: productData.short_description || '',
          our_price: productData.our_price || 0,
          sale_price: productData.sale_price || undefined,
          vip_price: productData.vip_price || undefined,
          compare_at_price: productData.compare_at_price || undefined,
          stock_quantity: productData.stock_quantity || 0,
          is_active: productData.is_active ?? true,
          featured: productData.featured ?? false,
          variants_enabled: productData.variants_enabled ?? false,
          brand_id: productData.brand_id || '',
          category_id: productData.category_id || '',
          tags: productData.tags || [],
          image_url: productData.image_url || '',
          image_urls: productData.image_urls || [],
          has_variations: productData.has_variations ?? false,
          variations: productData.variations || [],
          nicotine_product: productData.nicotine_product ?? false,
          tobacco_product: productData.tobacco_product ?? false,
          age_restriction: productData.age_restriction || 18,
          requires_lab_test: productData.requires_lab_test ?? false,
          restricted_states: productData.restricted_states || [],
          weight_g: productData.weight_g || undefined,
          dimensions: productData.dimensions || undefined,
          materials: productData.materials || undefined,
        };
        setProduct(mappedProduct);
      }
      
      // 2. Fetch existing compliance mappings
      const { data: mappingsData, error: mappingsError } = await supabaseBrowser
        .from('product_compliance')
        .select('compliance_id')
        .eq('product_id', productId);
        
      if (mappingsError) throw mappingsError;
      
      if (mappingsData) {
        setInitialRules(mappingsData.map(m => m.compliance_id));
      }
      
    } catch (error) {
      console.error('Error loading product:', error);
      alert('Failed to load product details.');
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  }

  const handleProductSubmit = async (formData: ProductFormData, selectedRules: string[]) => {
    setSaving(true);
    try {
      const dbProductData = {
        ...formData,
        updated_at: new Date().toISOString(),
      };

      // 1. Update product
      const { error: productError } = await supabaseBrowser
        .from('main_site_products')
        .update(dbProductData)
        .eq('id', productId);

      if (productError) throw productError;

      // 2. Sync compliance rules mapping
      // Get current mapped rules from DB to diff
      const { data: currentMappings, error: currentMappingsError } = await supabaseBrowser
        .from('product_compliance')
        .select('compliance_id')
        .eq('product_id', productId);
        
      if (currentMappingsError) throw currentMappingsError;
      
      const currentRuleIds = new Set(currentMappings?.map(m => m.compliance_id) || []);
      const newRuleIds = new Set(selectedRules);
      
      // Rules to add
      const rulesToAdd = selectedRules.filter(id => !currentRuleIds.has(id));
      if (rulesToAdd.length > 0) {
        const mappingsToInsert = rulesToAdd.map(ruleId => ({
          product_id: productId,
          compliance_id: ruleId,
        }));
        
        const { error: insertError } = await supabaseBrowser
          .from('product_compliance')
          .insert(mappingsToInsert);
          
        if (insertError) {
          console.error('Failed to insert new compliance mappings:', insertError);
        }
      }
      
      // Rules to remove
      const rulesToRemove = Array.from(currentRuleIds).filter(id => !newRuleIds.has(id));
      if (rulesToRemove.length > 0) {
        const { error: deleteError } = await supabaseBrowser
          .from('product_compliance')
          .delete()
          .eq('product_id', productId)
          .in('compliance_id', rulesToRemove);
          
        if (deleteError) {
          console.error('Failed to delete old compliance mappings:', deleteError);
        }
      }

      alert('Product updated successfully!');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error updating product:', error);
      alert(`Failed to update product: ${error.message}`);
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

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">Product not found.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-heading">Edit Product</h1>
      </div>
      
      <ProductForm 
        onSubmit={handleProductSubmit}
        onCancel={() => router.push('/admin/products')}
        isSubmitting={saving}
        initialData={product}
        initialSelectedRules={initialRules}
      />
    </div>
  );
}
