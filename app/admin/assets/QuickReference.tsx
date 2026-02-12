"use client";

import { useState } from 'react';

export default function QuickReference() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-dope-orange hover:bg-orange-600 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 z-50"
      >
        <span>📖</span> Quick Reference
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Asset Manager Quick Reference</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Getting Asset URLs */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">🔗 Getting Asset URLs</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Basic Usage:</p>
                <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`import { getAssetUrl } from '@/lib/asset-manager';

const url = getAssetUrl('website-images', 'hero/cityscape.jpg', {
  width: 1200,
  quality: 85
});`}
                </pre>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">With React Hook:</p>
                <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`import { useAsset } from '@/app/hooks/useAssets';

const { url, loading } = useAsset('website-images', 'hero/cityscape.jpg', {
  width: 1200,
  preload: true
});`}
                </pre>
              </div>
            </div>
          </section>

          {/* Using Components */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">🖼️ Using Image Components</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Optimized Image:</p>
                <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`import OptimizedImage from '@/components/OptimizedImage';

<OptimizedImage
  bucket="website-images"
  path="hero/cityscape.jpg"
  alt="City skyline"
  width={1200}
  height={600}
  priority
/>`}
                </pre>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Product Image:</p>
                <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`import { ProductImage } from '@/app/components/OptimizedImage';

<ProductImage
  sku="BONG-123"
  imageName="main.jpg"
  alt="Product"
  width={400}
  height={400}
/>`}
                </pre>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Responsive Image:</p>
                <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`import { ResponsiveImage } from '@/app/components/OptimizedImage';

<ResponsiveImage
  bucket="website-images"
  path="collections/bongs.jpg"
  alt="Bongs Collection"
  aspectRatio="16/9"
/>`}
                </pre>
              </div>
            </div>
          </section>

          {/* Predefined Assets */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">⭐ Predefined Assets</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`import { getWebsiteAsset, WEBSITE_ASSETS } from '@/lib/asset-manager';

// Available categories:
// - hero: cityscape, vipRewards
// - logos: dopeCityMain, dopeCityWhite
// - collections: bongs, dabRigs, pipes, preRolls, accessories
// - brands: roor, puffco, cookies

const heroImage = getWebsiteAsset('hero', 'cityscape', { width: 1920 });
const logo = getWebsiteAsset('logos', 'dopeCityMain');`}
              </pre>
            </div>
          </section>

          {/* Upload Assets */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">📤 Uploading Assets</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Via Hook:</p>
                <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`import { useAssetUpload } from '@/app/hooks/useAssets';

const { upload, uploading, progress } = useAssetUpload('website-images');

await upload(file, 'hero'); // Upload to hero folder`}
                </pre>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Via API:</p>
                <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`const formData = new FormData();
formData.append('file', file);
formData.append('bucket', 'website-images');
formData.append('folder', 'hero');

const response = await fetch('/api/admin/assets/upload', {
  method: 'POST',
  body: formData
});`}
                </pre>
              </div>
            </div>
          </section>

          {/* Storage Structure */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">📁 Storage Structure</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">products</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Product images by SKU</li>
                    <li>• Multiple images per product</li>
                    <li>• Organized in folders</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">website-images</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Hero images</li>
                    <li>• Logos & branding</li>
                    <li>• Collection images</li>
                    <li>• General assets</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">ads</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Marketing materials</li>
                    <li>• Promotional banners</li>
                    <li>• Seasonal campaigns</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">✅ Best Practices</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Always specify width/height for optimized loading</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Use priority prop for above-the-fold images</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Organize assets in logical folders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Use descriptive filenames (e.g., hero-cityscape.jpg)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Compress images before uploading (max 10MB)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span>Don't load full-size images for thumbnails</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span>Don't use external URLs when assets are in storage</span>
                </li>
              </ul>
            </div>
          </section>

          {/* API Endpoints */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">🔌 API Endpoints</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">List Assets:</p>
                <code className="text-xs bg-gray-900 text-green-400 px-2 py-1 rounded">
                  GET /api/admin/assets?bucket=website-images&limit=100
                </code>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Upload Asset:</p>
                <code className="text-xs bg-gray-900 text-green-400 px-2 py-1 rounded">
                  POST /api/admin/assets/upload
                </code>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Delete Assets:</p>
                <code className="text-xs bg-gray-900 text-green-400 px-2 py-1 rounded">
                  POST /api/admin/assets/delete
                </code>
              </div>
            </div>
          </section>

          {/* Keyboard Shortcuts */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">⌨️ Keyboard Shortcuts</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Upload</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">Ctrl + U</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Search</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">Ctrl + F</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Select All</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">Ctrl + A</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Delete</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">Del</kbd>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-between items-center">
          <a
            href="/docs/ASSET_MANAGER.md"
            target="_blank"
            className="text-dope-orange hover:text-orange-600 font-semibold"
          >
            📚 View Full Documentation
          </a>
          <button
            onClick={() => setIsOpen(false)}
            className="bg-dope-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

