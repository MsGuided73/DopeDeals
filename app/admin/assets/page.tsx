"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import QuickReference from './QuickReference';

type Asset = {
  id: string;
  name: string;
  path: string;
  url: string;
  bucket: string;
  size: number;
  type: string;
  created_at: string;
  metadata?: {
    width?: number;
    height?: number;
  };
};

type Bucket = 'products' | 'website-images' | 'ads';

export default function AssetManagerPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBucket, setSelectedBucket] = useState<Bucket>('website-images');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [stats, setStats] = useState({ totalSize: 0, totalCount: 0 });

  useEffect(() => {
    loadAssets();
  }, [selectedBucket]);

  async function loadAssets() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/assets?bucket=${selectedBucket}`);
      const data = await res.json();
      setAssets(data.assets || []);
      setStats(data.stats || { totalSize: 0, totalCount: 0 });
    } catch (error) {
      console.error('Failed to load assets:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(files: FileList) {
    setUploading(true);
    setUploadProgress(0);
    
    const totalFiles = files.length;
    let completed = 0;

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', selectedBucket);

      try {
        await fetch('/api/admin/assets/upload', {
          method: 'POST',
          body: formData,
        });
        completed++;
        setUploadProgress((completed / totalFiles) * 100);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }

    setUploading(false);
    setUploadProgress(0);
    setShowUploadModal(false);
    loadAssets();
  }

  async function handleDelete(assetIds: string[]) {
    if (!confirm(`Delete ${assetIds.length} asset(s)?`)) return;

    try {
      await fetch('/api/admin/assets/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetIds, bucket: selectedBucket }),
      });
      setSelectedAssets(new Set());
      loadAssets();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }

  function copyToClipboard(url: string) {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  }

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Asset Manager</h1>
          <p className="text-gray-600 mt-1">Manage all website images and media files</p>
        </div>
        <div className="flex gap-3">
          <a
            href="/admin/assets/examples"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg"
          >
            <span>📚</span> View Examples
          </a>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-dope-orange hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg"
          >
            <span>📤</span> Upload Assets
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Assets</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCount}</p>
            </div>
            <span className="text-3xl">📁</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Storage</p>
              <p className="text-2xl font-bold text-gray-900">{formatSize(stats.totalSize)}</p>
            </div>
            <span className="text-3xl">💾</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Selected</p>
              <p className="text-2xl font-bold text-gray-900">{selectedAssets.size}</p>
            </div>
            <span className="text-3xl">✅</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Bucket</p>
              <p className="text-lg font-bold text-gray-900">{selectedBucket}</p>
            </div>
            <span className="text-3xl">🗂️</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Bucket Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Bucket:</label>
            <select
              value={selectedBucket}
              onChange={(e) => setSelectedBucket(e.target.value as Bucket)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-dope-orange focus:border-transparent"
            >
              <option value="products">Products</option>
              <option value="website-images">Website Images</option>
              <option value="ads">Ads</option>
            </select>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-dope-orange focus:border-transparent"
            />
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-dope-orange text-white' : 'bg-gray-200'}`}
            >
              🔲
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-dope-orange text-white' : 'bg-gray-200'}`}
            >
              📋
            </button>
          </div>

          {/* Bulk Actions */}
          {selectedAssets.size > 0 && (
            <button
              onClick={() => handleDelete(Array.from(selectedAssets))}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              🗑️ Delete Selected ({selectedAssets.size})
            </button>
          )}
        </div>
      </div>

      {/* Assets Display */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin text-6xl mb-4">⏳</div>
            <p className="text-gray-600">Loading assets...</p>
          </div>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <span className="text-6xl mb-4 block">📭</span>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No assets found</h3>
          <p className="text-gray-600">Upload some assets to get started</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredAssets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              selected={selectedAssets.has(asset.id)}
              onSelect={(id) => {
                const newSelected = new Set(selectedAssets);
                if (newSelected.has(id)) {
                  newSelected.delete(id);
                } else {
                  newSelected.add(id);
                }
                setSelectedAssets(newSelected);
              }}
              onCopy={() => copyToClipboard(asset.url)}
              onDelete={() => handleDelete([asset.id])}
            />
          ))}
        </div>
      ) : (
        <AssetList
          assets={filteredAssets}
          selectedAssets={selectedAssets}
          onSelect={setSelectedAssets}
          onCopy={copyToClipboard}
          onDelete={handleDelete}
          formatSize={formatSize}
        />
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
          uploading={uploading}
          progress={uploadProgress}
        />
      )}

      {/* Quick Reference */}
      <QuickReference />
    </div>
  );
}

// Asset Card Component (Grid View)
function AssetCard({ asset, selected, onSelect, onCopy, onDelete }: any) {
  return (
    <div className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow relative group ${selected ? 'ring-2 ring-dope-orange' : ''}`}>
      <div className="absolute top-2 left-2 z-10">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(asset.id)}
          className="w-5 h-5 rounded border-gray-300"
        />
      </div>
      <div className="aspect-square relative bg-gray-100 rounded-t-lg overflow-hidden">
        <Image
          src={asset.url}
          alt={asset.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
        />
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-gray-900 truncate" title={asset.name}>
          {asset.name}
        </p>
        <p className="text-xs text-gray-500">{(asset.size / 1024).toFixed(1)} KB</p>
      </div>
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button onClick={onCopy} className="bg-white text-gray-900 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100">
          📋 Copy URL
        </button>
        <button onClick={onDelete} className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-700">
          🗑️
        </button>
      </div>
    </div>
  );
}

// Asset List Component (List View) - Placeholder
function AssetList({ assets, selectedAssets, onSelect, onCopy, onDelete, formatSize }: any) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left"><input type="checkbox" className="w-5 h-5" /></th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Preview</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Size</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Created</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {assets.map((asset: Asset) => (
            <tr key={asset.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <input type="checkbox" checked={selectedAssets.has(asset.id)} className="w-5 h-5" />
              </td>
              <td className="px-4 py-3">
                <div className="w-12 h-12 relative bg-gray-100 rounded">
                  <Image src={asset.url} alt={asset.name} fill className="object-cover rounded" sizes="48px" />
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">{asset.name}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{formatSize(asset.size)}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{new Date(asset.created_at).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <button onClick={() => onCopy(asset.url)} className="text-blue-600 hover:text-blue-800 mr-3">📋</button>
                <button onClick={() => onDelete([asset.id])} className="text-red-600 hover:text-red-800">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Upload Modal Component - Placeholder
function UploadModal({ onClose, onUpload, uploading, progress }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <h2 className="text-2xl font-bold mb-4">Upload Assets</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <span className="text-6xl mb-4 block">📤</span>
          <p className="text-lg mb-4">Drag & drop files here or click to browse</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && onUpload(e.target.files)}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="bg-dope-orange text-white px-6 py-3 rounded-lg cursor-pointer inline-block hover:bg-orange-600">
            Choose Files
          </label>
        </div>
        {uploading && (
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
              <div className="bg-dope-orange h-full transition-all" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-center mt-2 text-sm text-gray-600">{Math.round(progress)}% uploaded</p>
          </div>
        )}
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
        </div>
      </div>
    </div>
  );
}

