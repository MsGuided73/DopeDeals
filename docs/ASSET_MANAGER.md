# DopeDeals Asset Manager

A comprehensive CPanel-like asset management system for efficiently storing, organizing, and accessing website images.

## 🎯 Features

- **Visual Asset Browser** - Grid and list views with thumbnails
- **Multi-Bucket Support** - Separate storage for products, website images, and ads
- **Bulk Operations** - Upload, delete, and manage multiple assets at once
- **Search & Filter** - Quickly find assets by name or type
- **Optimized Delivery** - Automatic image optimization and CDN caching
- **Responsive Images** - Automatic generation of multiple sizes
- **Usage Tracking** - See where assets are used across the site
- **Drag & Drop Upload** - Easy file uploads with progress tracking

## 📁 Storage Structure

### Buckets

1. **products** - Product images organized by SKU
   ```
   products/
   ├── SKU_12345/
   │   ├── main.jpg
   │   ├── detail-1.jpg
   │   └── detail-2.jpg
   ```

2. **website-images** - General website assets
   ```
   website-images/
   ├── hero/
   ├── collections/
   ├── brands/
   ├── logos/
   └── banners/
   ```

3. **ads** - Marketing and promotional images
   ```
   ads/
   ├── seasonal/
   ├── promotions/
   └── banners/
   ```

## 🚀 Quick Start

### Accessing the Asset Manager

1. Navigate to `/admin/assets` in your admin dashboard
2. Select a bucket (products, website-images, or ads)
3. Upload, organize, and manage your assets

### Uploading Assets

**Via Admin Interface:**
```
1. Click "Upload Assets" button
2. Drag & drop files or click to browse
3. Select files (supports multiple)
4. Wait for upload to complete
```

**Via API:**
```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('bucket', 'website-images');

const response = await fetch('/api/admin/assets/upload', {
  method: 'POST',
  body: formData,
});
```

## 💻 Usage in Code

### Using the Asset Manager Utility

```typescript
import { getAssetUrl, getAssetVariants } from '@/lib/asset-manager';

// Get a single asset URL
const imageUrl = getAssetUrl('website-images', 'hero/cityscape.jpg', {
  width: 1200,
  quality: 85,
});

// Get multiple size variants
const variants = getAssetVariants('products', 'SKU_123/main.jpg');
// Returns: { thumbnail, small, medium, large, original }
```

### Using Predefined Assets

```typescript
import { getWebsiteAsset, WEBSITE_ASSETS } from '@/lib/asset-manager';

// Access predefined assets
const heroImage = getWebsiteAsset('hero', 'cityscape', { width: 1920 });
const logo = getWebsiteAsset('logos', 'dopeCityMain');
```

### Using React Hooks

```typescript
import { useAsset, useAssetVariants } from '@/app/hooks/useAssets';

function MyComponent() {
  // Single asset
  const { url, exists, loading } = useAsset(
    'website-images',
    'hero/cityscape.jpg',
    { width: 1200, preload: true }
  );

  // Multiple variants
  const { variants } = useAssetVariants('products', 'SKU_123/main.jpg');

  return <img src={url} alt="Hero" />;
}
```

### Using Optimized Image Components

```typescript
import OptimizedImage, { 
  ProductImage, 
  WebsiteImage,
  ResponsiveImage 
} from '@/app/components/OptimizedImage';

// General optimized image
<OptimizedImage
  bucket="website-images"
  path="hero/cityscape.jpg"
  alt="City skyline"
  width={1200}
  height={600}
  quality={85}
  priority
/>

// Product image (auto-handles SKU paths)
<ProductImage
  sku="BONG-123"
  imageName="main.jpg"
  alt="Product"
  width={400}
  height={400}
/>

// Website asset
<WebsiteImage
  path="logos/dope-city-main.png"
  alt="DOPE CITY Logo"
  width={200}
  height={80}
/>

// Responsive image (auto-generates sizes)
<ResponsiveImage
  bucket="website-images"
  path="collections/bongs.jpg"
  alt="Bongs Collection"
  aspectRatio="16/9"
/>
```

## 🔧 API Endpoints

### List Assets
```
GET /api/admin/assets?bucket=website-images&folder=hero&limit=100
```

**Response:**
```json
{
  "assets": [
    {
      "id": "abc123",
      "name": "cityscape.jpg",
      "path": "hero/cityscape.jpg",
      "url": "https://...",
      "bucket": "website-images",
      "size": 245678,
      "type": "image/jpeg",
      "created_at": "2025-01-15T10:30:00Z"
    }
  ],
  "stats": {
    "totalCount": 42,
    "totalSize": 10485760
  }
}
```

### Upload Asset
```
POST /api/admin/assets/upload
Content-Type: multipart/form-data

file: [binary]
bucket: website-images
folder: hero (optional)
```

**Response:**
```json
{
  "success": true,
  "path": "hero/1234567890-cityscape.jpg",
  "urls": {
    "original": "https://...",
    "thumb": "https://...?width=200",
    "medium": "https://...?width=800"
  }
}
```

### Delete Assets
```
POST /api/admin/assets/delete
Content-Type: application/json

{
  "assetIds": ["path/to/file1.jpg", "path/to/file2.jpg"],
  "bucket": "website-images"
}
```

## 🎨 Image Optimization

### Automatic Transformations

The asset manager automatically optimizes images:

- **Resizing** - Generate multiple sizes for responsive images
- **Format Conversion** - Convert to WebP/AVIF for better compression
- **Quality Adjustment** - Balance quality vs file size
- **CDN Caching** - 1-year cache headers for optimal performance

### Transformation Options

```typescript
getAssetUrl('website-images', 'hero.jpg', {
  width: 1200,        // Resize width
  height: 600,        // Resize height
  quality: 85,        // JPEG quality (1-100)
  format: 'webp',     // Output format (webp, avif, original)
});
```

### Responsive Images

```typescript
// Generate srcset for responsive images
const srcSet = generateSrcSet('website-images', 'hero.jpg', [400, 800, 1200, 1600]);

<img
  src={getAssetUrl('website-images', 'hero.jpg')}
  srcSet={srcSet}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt="Hero"
/>
```

## 📊 Performance Best Practices

### 1. Use Appropriate Sizes
```typescript
// ❌ Don't load full-size images for thumbnails
<img src={getAssetUrl('products', 'image.jpg')} width="100" />

// ✅ Request optimized size
<img src={getAssetUrl('products', 'image.jpg', { width: 200 })} width="100" />
```

### 2. Preload Critical Images
```typescript
import { preloadAssets } from '@/lib/asset-manager';

// Preload hero images
preloadAssets([
  { bucket: 'website-images', path: 'hero/cityscape.jpg' },
  { bucket: 'website-images', path: 'logos/dope-city-main.png' },
]);
```

### 3. Use Priority for Above-the-Fold Images
```typescript
<OptimizedImage
  bucket="website-images"
  path="hero/cityscape.jpg"
  alt="Hero"
  priority  // Loads immediately, not lazy
/>
```

### 4. Lazy Load Below-the-Fold Images
```typescript
// Next.js Image component lazy loads by default
<OptimizedImage
  bucket="products"
  path="product.jpg"
  alt="Product"
  // No priority = lazy loaded
/>
```

## 🔒 Security

- **Admin-Only Access** - Asset management requires admin authentication
- **File Type Validation** - Only image files allowed
- **Size Limits** - 10MB max file size
- **Sanitized Filenames** - Automatic sanitization of uploaded filenames
- **Bucket Isolation** - Separate storage buckets for different content types

## 🛠️ Maintenance

### Cleaning Up Unused Assets

```typescript
// Check if asset is still in use
const isUsed = await checkAssetUsage('website-images', 'old-banner.jpg');

if (!isUsed) {
  await deleteAsset('website-images', 'old-banner.jpg');
}
```

### Migrating External Images

```typescript
import { migrateExternalImage } from '@/lib/asset-manager';

// Migrate from external URL to Supabase storage
const newUrl = await migrateExternalImage(
  'https://external.com/image.jpg',
  'products',
  'SKU_123/main.jpg'
);
```

## 📈 Monitoring

### Storage Usage

View storage statistics in the Asset Manager dashboard:
- Total assets per bucket
- Total storage used
- Average file size
- Most accessed assets

### Performance Metrics

Monitor asset delivery performance:
- CDN cache hit rate
- Average load time
- Bandwidth usage
- Popular assets

## 🆘 Troubleshooting

### Images Not Loading

1. Check bucket permissions in Supabase
2. Verify file path is correct
3. Check browser console for errors
4. Ensure NEXT_PUBLIC_SUPABASE_URL is set

### Upload Failures

1. Check file size (max 10MB)
2. Verify file type is image/*
3. Check admin authentication
4. Review Supabase storage quota

### Slow Loading

1. Use optimized sizes (don't load full-size)
2. Enable CDN caching
3. Use WebP/AVIF formats
4. Preload critical images

## 📚 Additional Resources

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Web Performance Best Practices](https://web.dev/fast/)

