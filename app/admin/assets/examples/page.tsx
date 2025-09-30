"use client";

import OptimizedImage, {
  ProductImage,
  WebsiteImage,
  ResponsiveImage,
  BackgroundImage,
} from '@/components/OptimizedImage';
import { useAsset, useAssetVariants } from '@/hooks/useAssets';

// Inline getAssetUrl for examples
const getAssetUrl = (bucket: string, path: string, options?: any) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return '';
  let url = `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
  if (options && (options.width || options.height || options.quality)) {
    const params = new URLSearchParams();
    if (options.width) params.append('width', options.width.toString());
    if (options.height) params.append('height', options.height.toString());
    if (options.quality) params.append('quality', options.quality.toString());
    url += `?${params.toString()}`;
  }
  return url;
};

export default function AssetExamplesPage() {
  // Example using hook
  const { url: heroUrl, loading } = useAsset(
    'website-images',
    'rewards/WhatsApp%20Image%202025-09-25%20at%2011.27.52_e3fa4258.jpg',
    { width: 800 }
  );

  // Example using variants
  const { variants } = useAssetVariants(
    'website-images',
    'rewards/WhatsApp%20Image%202025-09-25%20at%2011.27.52_e3fa4258.jpg'
  );

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Asset Manager Examples</h1>
        <p className="text-gray-600">
          Live examples of how to use the asset manager in your code
        </p>
      </div>

      {/* Example 1: OptimizedImage Component */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          1. OptimizedImage Component
        </h2>
        <p className="text-gray-600 mb-4">
          Basic usage with automatic optimization and loading states
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Result:</h3>
            <OptimizedImage
              bucket="website-images"
              path="rewards/WhatsApp%20Image%202025-09-25%20at%2011.27.52_e3fa4258.jpg"
              alt="VIP Rewards"
              width={400}
              height={300}
              className="rounded-lg"
            />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Code:</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`<OptimizedImage
  bucket="website-images"
  path="rewards/vip-rewards.jpg"
  alt="VIP Rewards"
  width={400}
  height={300}
  className="rounded-lg"
/>`}
            </pre>
          </div>
        </div>
      </section>

      {/* Example 2: WebsiteImage Component */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          2. WebsiteImage Component
        </h2>
        <p className="text-gray-600 mb-4">
          Simplified component for website assets (automatically uses website-images bucket)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Result:</h3>
            <WebsiteImage
              path="rewards/WhatsApp%20Image%202025-09-25%20at%2011.27.52_e3fa4258.jpg"
              alt="VIP Rewards"
              width={400}
              height={300}
              className="rounded-lg"
            />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Code:</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`<WebsiteImage
  path="rewards/vip-rewards.jpg"
  alt="VIP Rewards"
  width={400}
  height={300}
  className="rounded-lg"
/>`}
            </pre>
          </div>
        </div>
      </section>

      {/* Example 3: ResponsiveImage Component */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          3. ResponsiveImage Component
        </h2>
        <p className="text-gray-600 mb-4">
          Automatically responsive with aspect ratio control
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Result:</h3>
            <ResponsiveImage
              bucket="website-images"
              path="rewards/WhatsApp%20Image%202025-09-25%20at%2011.27.52_e3fa4258.jpg"
              alt="VIP Rewards"
              aspectRatio="16/9"
              className="rounded-lg"
            />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Code:</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`<ResponsiveImage
  bucket="website-images"
  path="rewards/vip-rewards.jpg"
  alt="VIP Rewards"
  aspectRatio="16/9"
  className="rounded-lg"
/>`}
            </pre>
          </div>
        </div>
      </section>

      {/* Example 4: BackgroundImage Component */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          4. BackgroundImage Component
        </h2>
        <p className="text-gray-600 mb-4">
          For hero sections and backgrounds with overlay support
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Result:</h3>
            <BackgroundImage
              bucket="website-images"
              path="rewards/WhatsApp%20Image%202025-09-25%20at%2011.27.52_e3fa4258.jpg"
              alt="VIP Rewards Background"
              overlay={true}
              overlayOpacity={0.5}
              className="rounded-lg h-64"
            >
              <div className="flex items-center justify-center h-full">
                <h3 className="text-white text-3xl font-bold">VIP REWARDS</h3>
              </div>
            </BackgroundImage>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Code:</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`<BackgroundImage
  bucket="website-images"
  path="rewards/vip-rewards.jpg"
  overlay={true}
  overlayOpacity={0.5}
  className="rounded-lg h-64"
>
  <div className="flex items-center justify-center h-full">
    <h3 className="text-white text-3xl font-bold">
      VIP REWARDS
    </h3>
  </div>
</BackgroundImage>`}
            </pre>
          </div>
        </div>
      </section>

      {/* Example 5: Using Hooks */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Using React Hooks</h2>
        <p className="text-gray-600 mb-4">
          Access asset URLs programmatically with hooks
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Result:</h3>
            <div className="bg-gray-50 p-4 rounded">
              {loading ? (
                <p className="text-gray-600">Loading...</p>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-2">Asset URL:</p>
                  <code className="text-xs bg-gray-900 text-green-400 p-2 rounded block break-all">
                    {heroUrl}
                  </code>
                  {variants && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Available Variants:</p>
                      <ul className="text-xs space-y-1">
                        <li>Thumbnail: {variants.thumbnail.substring(0, 50)}...</li>
                        <li>Small: {variants.small.substring(0, 50)}...</li>
                        <li>Medium: {variants.medium.substring(0, 50)}...</li>
                        <li>Large: {variants.large.substring(0, 50)}...</li>
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Code:</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`import { useAsset, useAssetVariants } from '@/app/hooks/useAssets';

const { url, loading } = useAsset(
  'website-images',
  'rewards/vip-rewards.jpg',
  { width: 800 }
);

const { variants } = useAssetVariants(
  'website-images',
  'rewards/vip-rewards.jpg'
);`}
            </pre>
          </div>
        </div>
      </section>

      {/* Example 6: Utility Functions */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          6. Using Utility Functions
        </h2>
        <p className="text-gray-600 mb-4">Direct URL generation without components</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Result:</h3>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600 mb-2">Generated URL:</p>
              <code className="text-xs bg-gray-900 text-green-400 p-2 rounded block break-all">
                {getAssetUrl('website-images', 'rewards/WhatsApp%20Image%202025-09-25%20at%2011.27.52_e3fa4258.jpg', {
                  width: 600,
                  quality: 85,
                })}
              </code>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Code:</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`import { getAssetUrl } from '@/lib/asset-manager';

const imageUrl = getAssetUrl(
  'website-images',
  'rewards/vip-rewards.jpg',
  {
    width: 600,
    quality: 85
  }
);`}
            </pre>
          </div>
        </div>
      </section>

      {/* Back to Asset Manager */}
      <div className="flex justify-center">
        <a
          href="/admin/assets"
          className="bg-dope-orange hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
        >
          ← Back to Asset Manager
        </a>
      </div>
    </div>
  );
}

