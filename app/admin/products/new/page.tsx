'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { supabaseBrowser } from '../../../lib/supabase-browser';

import ProductForm, { ProductFormData } from '../../_components/ProductForm';

export default function AddProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleProductSubmit = async (productData: ProductFormData, selectedRules: string[]) => {
    setSaving(true);
    try {
      const dbProductData = {
        ...productData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // 1. Insert product
      const { data: insertedProduct, error: productError } = await supabaseBrowser
        .from('main_site_products')
        .insert(dbProductData)
        .select()
        .single();

      if (productError) throw productError;

      // 2. Insert compliance rules mapping
      if (selectedRules.length > 0 && insertedProduct) {
        const complianceMappings = selectedRules.map(ruleId => ({
          product_id: insertedProduct.id,
          compliance_id: ruleId,
        }));

        const { error: mappingError } = await supabaseBrowser
          .from('product_compliance')
          .insert(complianceMappings);

        if (mappingError) {
          console.error("Failed to insert compliance mappings:", mappingError);
          // Non-fatal error for the product itself, but should be noted
          alert('Product created, but some compliance rules failed to apply.');
        }
      }

      alert('Product created successfully!');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error creating product:', error);
      alert(`Failed to create product: ${error.message}`);
    } finally {
      setSaving(false);
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

      {/* Manual product entry. The Airtable import tab was retired when the
          Airtable inventory sync was removed. */}
      <ProductForm
        onSubmit={handleProductSubmit}
        onCancel={() => router.push('/admin/products')}
        isSubmitting={saving}
      />
    </div>
  );
}
