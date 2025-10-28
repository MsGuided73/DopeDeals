"use client";
import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import VariantSelector, { hasProductVariants } from './VariantSelector';

interface ProductGalleryProps {
  // Main product image
  image_url?: string;
  imageUrl?: string;
  image?: string;

  // Gallery images showing color variations
  image_urls?: string[];

  // Product info
  productName: string;
  productId: string;

  // Layout options
  viewMode?: 'detail' | 'modal' | 'sidebar';
  className?: string;

  // Variant support - NEW
  onVariantChange?: (variantIndex: number, imageUrl: string) => void;
  selectedVariant?: number;
}

export default function ProductGallery({
  image_url,
  imageUrl,
  image,
  image_urls = [],
  productName,
  productId,
  viewMode = 'detail',
  className = '',
  onVariantChange,
  selectedVariant
}: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageError, setIsImageError] = useState(false);

  // Combine main image with gallery images
  const mainImage = image_url || imageUrl || image;
  const allImages = mainImage ? [mainImage, ...image_urls] : image_urls;
  const hasImages = allImages.length > 0 && !isImageError;

  const currentImage = hasImages ? allImages[selectedImageIndex] : null;

  const handleImageError = () => {
    setIsImageError(true);
  };

  const goToPreviousImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const goToNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  const goToImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  if (!hasImages) {
    return (
      <div className={`bg-gray-100 rounded-lg overflow-hidden ${className}`}>
        <div className="aspect-square flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="text-6xl mb-2">🖼️</div>
            <div className="text-sm">No images available</div>
          </div>
        </div>
      </div>
    );
  }

  // Handle variant changes
  const handleVariantChange = (variantIndex: number, imageUrl: string) => {
    setSelectedImageIndex(variantIndex);
    // Call external callback if provided
    if (onVariantChange) {
      onVariantChange(variantIndex, imageUrl);
    }
  };

  // Detail view - Full product gallery
  if (viewMode === 'detail') {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Variant Selector */}
        {hasProductVariants(allImages) && (
          <div className="flex justify-center">
            <VariantSelector
              imageUrls={allImages}
              onVariantChange={handleVariantChange}
              selectedVariant={selectedImageIndex}
              compact={false}
              className="max-w-md"
            />
          </div>
        )}

        {/* Main Image Display */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden group">
          <div className="aspect-square relative">
            {currentImage && (
              <Image
                src={currentImage}
                alt={`${productName} - View ${selectedImageIndex + 1}`}
                fill
                className="object-contain p-8"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                priority
                onError={handleImageError}
              />
            )}

            {/* Navigation arrows - only show if multiple images */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={goToPreviousImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={goToNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Image counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                {selectedImageIndex + 1} / {allImages.length}
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Gallery */}
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allImages.map((imageUrl, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-colors ${
                  index === selectedImageIndex
                    ? 'border-dope-orange-500 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Image
                  src={imageUrl}
                  alt={`${productName} - Thumbnail ${index + 1}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </button>
            ))}
          </div>
        )}

        {/* Image Metadata */}
        <div className="text-xs text-gray-500 text-center">
          Click images to see color variations and product details
        </div>
      </div>
    );
  }

  // Modal view - Compact for modals
  if (viewMode === 'modal') {
    return (
      <div className={`space-y-3 ${className}`}>
        {/* Main Image */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
          <div className="aspect-square relative">
            {currentImage && (
              <Image
                src={currentImage}
                alt={`${productName} - View ${selectedImageIndex + 1}`}
                fill
                className="object-contain p-6"
                sizes="400px"
                onError={handleImageError}
              />
            )}

            {allImages.length > 1 && (
              <>
                <button
                  onClick={goToPreviousImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={goToNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Thumbnail Strip */}
        {allImages.length > 1 && (
          <div className="flex justify-center gap-2 overflow-x-auto">
            {allImages.map((imageUrl, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-12 h-12 rounded border ${
                  index === selectedImageIndex
                    ? 'border-dope-orange-500 ring-2 ring-dope-orange-200'
                    : 'border-gray-200 hover:border-gray-300'
                } overflow-hidden`}
              >
                <Image
                  src={imageUrl}
                  alt={`${productName} - Thumbnail ${index + 1}`}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Sidebar view - Compact for sidebars
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main Image */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden">
        <div className="aspect-square relative">
          {currentImage && (
            <Image
              src={currentImage}
              alt={`${productName} - View ${selectedImageIndex + 1}`}
              fill
              className="object-contain p-4"
              sizes="300px"
              onError={handleImageError}
            />
          )}
        </div>
      </div>

      {/* Simple thumbnails */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {allImages.slice(0, 4).map((imageUrl, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`aspect-square rounded border overflow-hidden transition-colors ${
                index === selectedImageIndex
                  ? 'border-dope-orange-500'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Image
                src={imageUrl}
                alt={`${productName} - Thumbnail ${index + 1}`}
                width={60}
                height={60}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Usage example in a product component:
/*

// In product API response:
{
  id: "product-1",
  name: "Premium Bong",
  image_url: "https://cdn.example.com/bong-main.jpg",  // Primary image
  image_urls: [
    "https://cdn.example.com/bong-blue.jpg",    // Color variation 1
    "https://cdn.example.com/bong-green.jpg",   // Color variation 2
    "https://cdn.example.com/bong-purple.jpg",  // Color variation 3
    "https://cdn.example.com/bong-detail.jpg"   // Detail view
  ]
}

// In component:
<ProductGallery
  image_url={product.image_url}      // Primary photo
  image_urls={product.image_urls}    // Gallery photos (color variations)
  productName={product.name}
  productId={product.id}
  viewMode="detail"
/>

*/
