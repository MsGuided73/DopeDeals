"use client";
import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { hasProductVariants } from './VariantSelector';

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

  // Variant support
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
  const [internalSelectedIndex, setInternalSelectedIndex] = useState(0);
  const [isImageError, setIsImageError] = useState(false);

  // Sync with external variant selection if provided
  const selectedImageIndex = selectedVariant !== undefined ? selectedVariant : internalSelectedIndex;

  const sanitizeImageUrl = (value?: string) => {
    if (!value) return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('/')) return trimmed;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `/${trimmed}`;
  };

  // Combine images and remove duplicates
  const mainImage = image_url || imageUrl || image;
  const rawImages = mainImage ? [mainImage, ...image_urls] : image_urls;
  const allImages = Array.from(
    new Set(rawImages.map(sanitizeImageUrl).filter(Boolean) as string[])
  );
  
  const hasImages = allImages.length > 0 && !isImageError;
  const currentImage = hasImages ? allImages[selectedImageIndex] : null;

  const handleImageError = () => {
    setIsImageError(true);
  };

  const goToPreviousImage = () => {
    const newIndex = selectedImageIndex === 0 ? allImages.length - 1 : selectedImageIndex - 1;
    if (onVariantChange) {
      onVariantChange(newIndex, allImages[newIndex]);
    } else {
      setInternalSelectedIndex(newIndex);
    }
  };

  const goToNextImage = () => {
    const newIndex = selectedImageIndex === allImages.length - 1 ? 0 : selectedImageIndex + 1;
    if (onVariantChange) {
      onVariantChange(newIndex, allImages[newIndex]);
    } else {
      setInternalSelectedIndex(newIndex);
    }
  };

  const goToImage = (index: number) => {
    if (onVariantChange) {
      onVariantChange(index, allImages[index]);
    } else {
      setInternalSelectedIndex(index);
    }
  };

  if (!hasImages) {
    return (
      <div className={`bg-gray-100 rounded-3xl overflow-hidden ${className}`}>
        <div className="aspect-square flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="text-6xl mb-2">🖼️</div>
            <div className="text-sm">No images available</div>
          </div>
        </div>
      </div>
    );
  }

  // Detail view - Full product gallery
  if (viewMode === 'detail') {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Main Image Display - Increased size and improved styling */}
        <div className="relative bg-white rounded-[2.5rem] overflow-hidden group border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-xl">
          <div className="aspect-square relative">
            {currentImage && (
              <Image
                src={currentImage}
                alt={`${productName} - View ${selectedImageIndex + 1}`}
                fill
                className="object-contain p-4 md:p-6 transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                priority
                unoptimized={currentImage.includes('sigdistro.com') || currentImage.includes('zohoapis.com')}
                onError={handleImageError}
              />
            )}

            {/* Navigation arrows - only show if multiple images */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={goToPreviousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white text-black shadow-lg rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={goToNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white text-black shadow-lg rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
                {selectedImageIndex + 1} / {allImages.length}
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Gallery - More professional look */}
        {allImages.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {allImages.map((imageUrl, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-24 h-24 rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                  index === selectedImageIndex
                    ? 'border-black ring-4 ring-black/5 scale-105 shadow-md'
                    : 'border-transparent bg-gray-50 hover:bg-gray-100 hover:scale-102'
                }`}
              >
                <Image
                  src={imageUrl}
                  alt={`${productName} - Thumbnail ${index + 1}`}
                  width={96}
                  height={96}
                  className="w-full h-full object-contain p-2"
                  unoptimized={imageUrl.includes('sigdistro.com') || imageUrl.includes('zohoapis.com')}
                  onError={handleImageError}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Modal view - Compact for modals
  if (viewMode === 'modal') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="relative bg-gray-50 rounded-2xl overflow-hidden">
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
                <button onClick={goToPreviousImage} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-sm"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={goToNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-sm"><ChevronRight className="w-4 h-4" /></button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Sidebar view - Compact for sidebars
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative bg-gray-50 rounded-xl overflow-hidden">
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
    </div>
  );
}
