'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabaseBrowser } from '../../../lib/supabase-browser';
import { ArrowLeft, Upload, X, Save, Loader2, Database, CloudUpload, CheckCircle, AlertCircle, Settings } from 'lucide-react';
import { AirtableClient, ProductImportMapper, ProductImportService, FieldMapping, AirtableRecord } from '../../../../lib/airtable-client';
import MediaUpload from '../../_components/MediaUpload';

import ProductForm, { ProductFormData } from '../../_components/ProductForm';

export default function AddProductPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'manual' | 'airtable'>('manual');
  const [saving, setSaving] = useState(false);

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
        <ProductForm 
          onSubmit={handleProductSubmit}
          onCancel={() => router.push('/admin/products')}
          isSubmitting={saving}
        />
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
