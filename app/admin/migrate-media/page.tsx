'use client';

import { useState } from 'react';

interface MigrationStats {
  processed: number;
  imagesDownloaded: number;
  imagesUploaded: number;
  descriptionsUpdated: number;
  errors: string[];
  skipped: number;
}

interface MigrationResult {
  success: boolean;
  stats: MigrationStats;
  message: string;
}

export default function MigrateMediaPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<MigrationResult | null>(null);
  const [batchSize, setBatchSize] = useState(10);
  const [startFromId, setStartFromId] = useState('');

  const runMigration = async () => {
    setIsRunning(true);
    setResults(null);

    try {
      const response = await fetch('/api/admin/migrate-zoho-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          limit: batchSize,
          startFromId: startFromId || undefined
        })
      });

      const result: MigrationResult = await response.json();
      setResults(result);

    } catch (error) {
      setResults({
        success: false,
        stats: {
          processed: 0,
          imagesDownloaded: 0,
          imagesUploaded: 0,
          descriptionsUpdated: 0,
          errors: [`Network error: ${error}`],
          skipped: 0
        },
        message: `Failed to run migration: ${error}`
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Zoho Media Migration
          </h1>
          <p className="text-gray-600">
            Migrate product images and descriptions from Zoho Inventory to Supabase storage and database.
          </p>
        </div>

        {/* Migration Controls */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Migration Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="batchSize" className="block text-sm font-medium text-gray-700 mb-2">
                Batch Size
              </label>
              <input
                type="number"
                id="batchSize"
                value={batchSize}
                onChange={(e) => setBatchSize(parseInt(e.target.value) || 10)}
                min="1"
                max="50"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isRunning}
              />
              <p className="text-xs text-gray-500 mt-1">Number of products to process (1-50)</p>
            </div>

            <div>
              <label htmlFor="startFromId" className="block text-sm font-medium text-gray-700 mb-2">
                Start From Product ID (Optional)
              </label>
              <input
                type="text"
                id="startFromId"
                value={startFromId}
                onChange={(e) => setStartFromId(e.target.value)}
                placeholder="Leave empty to start from beginning"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isRunning}
              />
              <p className="text-xs text-gray-500 mt-1">For pagination/resuming migration</p>
            </div>
          </div>

          <button
            onClick={runMigration}
            disabled={isRunning}
            className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
              isRunning
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            }`}
          >
            {isRunning ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Running Migration...
              </div>
            ) : (
              'Start Migration'
            )}
          </button>
        </div>

        {/* Migration Process Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">What This Migration Does:</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Fetches products from Zoho Inventory that have Zoho IDs</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Downloads product images from Zoho and uploads them to Supabase storage</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Creates product_media records for proper image management</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Updates products table with primary image URL and descriptions</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Handles multiple images per product (hero + gallery)</span>
            </li>
          </ul>
        </div>

        {/* Results */}
        {results && (
          <div className={`shadow rounded-lg p-6 ${
            results.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              results.success ? 'text-green-900' : 'text-red-900'
            }`}>
              Migration Results
            </h3>

            <div className="mb-4">
              <p className={`font-medium ${
                results.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {results.message}
              </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{results.stats.processed}</div>
                <div className="text-sm text-gray-600">Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{results.stats.imagesDownloaded}</div>
                <div className="text-sm text-gray-600">Downloaded</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{results.stats.imagesUploaded}</div>
                <div className="text-sm text-gray-600">Uploaded</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{results.stats.descriptionsUpdated}</div>
                <div className="text-sm text-gray-600">Descriptions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{results.stats.skipped}</div>
                <div className="text-sm text-gray-600">Skipped</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{results.stats.errors.length}</div>
                <div className="text-sm text-gray-600">Errors</div>
              </div>
            </div>

            {/* Errors */}
            {results.stats.errors.length > 0 && (
              <div className="bg-red-100 border border-red-300 rounded-md p-4">
                <h4 className="font-semibold text-red-900 mb-2">Errors:</h4>
                <ul className="space-y-1">
                  {results.stats.errors.map((error, index) => (
                    <li key={index} className="text-sm text-red-800">
                      {index + 1}. {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">Important Notes:</h3>
          <ul className="space-y-2 text-yellow-800">
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">⚠️</span>
              <span>Run this migration in small batches to avoid API rate limits</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">⚠️</span>
              <span>Ensure Zoho access token is valid before starting</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">⚠️</span>
              <span>Images will be stored in the 'products' Supabase storage bucket</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">⚠️</span>
              <span>Use the "Start From Product ID" field to resume interrupted migrations</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
