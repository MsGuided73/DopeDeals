"use client";
import React, { useState, useEffect } from 'react';
import { ArrowRight, Database, Package, AlertTriangle, CheckCircle } from 'lucide-react';

interface MigrationStatus {
  status: string;
  mainTable: {
    nicotineTobaccoProducts: number;
    sampleProducts: any[];
  };
  vipSmokeTable: {
    totalProducts: number;
    sampleProducts: any[];
  };
  recommendation: string;
}

interface MigrationResult {
  success: boolean;
  message: string;
  results: {
    migrated: number;
    skipped: number;
    deleted: number;
    errors?: string[];
  };
  summary: {
    totalProcessed: number;
    successRate: string;
  };
}

export default function VipSmokeMigrationPage() {
  const [status, setStatus] = useState<MigrationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMigrationStatus();
  }, []);

  const fetchMigrationStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/migrate-vip-smoke');
      const data = await response.json();
      
      if (response.ok) {
        setStatus(data);
      } else {
        setError(data.error || 'Failed to fetch migration status');
      }
    } catch (err) {
      setError('Network error while fetching status');
    } finally {
      setLoading(false);
    }
  };

  const runMigration = async (deleteFromMain = false) => {
    try {
      setLoading(true);
      setError(null);
      setMigrationResult(null);

      const url = deleteFromMain 
        ? '/api/admin/migrate-vip-smoke?delete=true'
        : '/api/admin/migrate-vip-smoke';

      const response = await fetch(url, { method: 'POST' });
      const data = await response.json();
      
      if (response.ok) {
        setMigrationResult(data);
        // Refresh status after migration
        await fetchMigrationStatus();
      } else {
        setError(data.error || 'Migration failed');
      }
    } catch (err) {
      setError('Network error during migration');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !status) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dope-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading migration status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">VIP Smoke Migration</h1>
          <p className="text-gray-600">
            Migrate nicotine and tobacco products to the dedicated VIP Smoke table for better compliance separation.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Migration Result */}
        {migrationResult && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
              <h3 className="text-lg font-semibold text-green-900">Migration Completed!</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="text-2xl font-bold text-green-600">{migrationResult.results.migrated}</div>
                <div className="text-sm text-gray-600">Products Migrated</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="text-2xl font-bold text-yellow-600">{migrationResult.results.skipped}</div>
                <div className="text-sm text-gray-600">Products Skipped</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="text-2xl font-bold text-blue-600">{migrationResult.results.deleted}</div>
                <div className="text-sm text-gray-600">Products Deleted</div>
              </div>
            </div>

            <div className="text-sm text-gray-700">
              <strong>Success Rate:</strong> {migrationResult.summary.successRate} 
              ({migrationResult.results.migrated} of {migrationResult.summary.totalProcessed} products)
            </div>

            {migrationResult.results.errors && migrationResult.results.errors.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-red-700 mb-2">Errors:</h4>
                <ul className="text-sm text-red-600 space-y-1">
                  {migrationResult.results.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Current Status */}
        {status && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Main Products Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Database className="w-6 h-6 text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Main Products Table</h3>
              </div>
              
              <div className="mb-4">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {status.mainTable.nicotineTobaccoProducts}
                </div>
                <div className="text-sm text-gray-600">Nicotine/Tobacco Products</div>
              </div>

              {status.mainTable.sampleProducts.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Sample Products:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {status.mainTable.sampleProducts.map((product, index) => (
                      <li key={index} className="flex items-center">
                        <Package className="w-3 h-3 mr-2" />
                        {product.name} ({product.sku})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* VIP Smoke Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Database className="w-6 h-6 text-purple-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">VIP Smoke Table</h3>
              </div>
              
              <div className="mb-4">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {status.vipSmokeTable.totalProducts}
                </div>
                <div className="text-sm text-gray-600">VIP Smoke Products</div>
              </div>

              {status.vipSmokeTable.sampleProducts.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Sample Products:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {status.vipSmokeTable.sampleProducts.map((product, index) => (
                      <li key={index} className="flex items-center">
                        <Package className="w-3 h-3 mr-2" />
                        {product.name} ({product.sku})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recommendation */}
        {status && (
          <div className={`rounded-lg p-4 mb-6 ${
            status.mainTable.nicotineTobaccoProducts > 0 
              ? 'bg-yellow-50 border border-yellow-200' 
              : 'bg-green-50 border border-green-200'
          }`}>
            <div className="flex items-center">
              {status.mainTable.nicotineTobaccoProducts > 0 ? (
                <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              )}
              <p className={
                status.mainTable.nicotineTobaccoProducts > 0 
                  ? 'text-yellow-700' 
                  : 'text-green-700'
              }>
                {status.recommendation}
              </p>
            </div>
          </div>
        )}

        {/* Migration Actions */}
        {status && status.mainTable.nicotineTobaccoProducts > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Migration Actions</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Copy to VIP Smoke Table</h4>
                  <p className="text-sm text-gray-600">
                    Copy nicotine/tobacco products to VIP Smoke table (keeps originals in main table)
                  </p>
                </div>
                <button
                  onClick={() => runMigration(false)}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <ArrowRight className="w-4 h-4 mr-2" />
                  )}
                  Copy Products
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <h4 className="font-medium text-gray-900">Migrate & Delete from Main</h4>
                  <p className="text-sm text-gray-600">
                    Move products to VIP Smoke table and remove from main table (recommended for clean separation)
                  </p>
                </div>
                <button
                  onClick={() => runMigration(true)}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <ArrowRight className="w-4 h-4 mr-2" />
                  )}
                  Migrate & Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Refresh Button */}
        <div className="text-center">
          <button
            onClick={fetchMigrationStatus}
            disabled={loading}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Refreshing...' : 'Refresh Status'}
          </button>
        </div>
      </div>
    </div>
  );
}
