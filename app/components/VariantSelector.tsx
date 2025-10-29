"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface VariantOption {
  index: number;
  imageUrl: string;
  colorHex?: string;
  name?: string;
}

// Extract color from image filename or URL
function extractColorFromFilename(filename: string): { hex: string; name: string } | null {
  const lowerFilename = filename.toLowerCase();

  // Common color mappings
  const colorMap: { [key: string]: { hex: string; name: string } } = {
    'blue': { hex: '#3B82F6', name: 'Blue' },
    'green': { hex: '#10B981', name: 'Green' },
    'red': { hex: '#EF4444', name: 'Red' },
    'purple': { hex: '#8B5CF6', name: 'Purple' },
    'pink': { hex: '#F472B6', name: 'Pink' },
    'orange': { hex: '#F59E0B', name: 'Orange' },
    'yellow': { hex: '#EAB308', name: 'Yellow' },
    'black': { hex: '#000000', name: 'Black' },
    'white': { hex: '#FFFFFF', name: 'White' },
    'gray': { hex: '#6B7280', name: 'Gray' },
    'silver': { hex: '#9CA3AF', name: 'Silver' },
    'gold': { hex: '#D4AF37', name: 'Gold' },
    'clear': { hex: '#F3F4F6', name: 'Clear' },
    'smoke': { hex: '#9CA3AF', name: 'Smoke' }
  };

  for (const [colorKey, colorInfo] of Object.entries(colorMap)) {
    if (lowerFilename.includes(colorKey)) {
      return colorInfo;
    }
  }

  return null;
}

// Analyze image to extract dominant color (simplified version)
async function analyzeImageColor(imageUrl: string): Promise<string | null> {
  try {
    // In a real implementation, you could use an image analysis library
    // For now, we'll extract from filename or return null
    const colorInfo = extractColorFromFilename(imageUrl);
    return colorInfo ? colorInfo.hex : null;
  } catch (error) {
    console.error('Failed to analyze image color:', error);
    return null;
  }
}

interface VariantSelectorProps {
  imageUrls: string[];
  className?: string;
  onVariantChange?: (variantIndex: number, imageUrl: string) => void;
  selectedVariant?: number;
  compact?: boolean;
}

export default function VariantSelector({
  imageUrls,
  className = '',
  onVariantChange,
  selectedVariant = 0,
  compact = false
}: VariantSelectorProps) {
  const [variants, setVariants] = useState<VariantOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Process image URLs to extract variant information
  useEffect(() => {
    const processVariants = async () => {
      setLoading(true);

      const variantPromises = imageUrls.map(async (url, index) => {
        const colorHex = await analyzeImageColor(url);
        const filenameMatch = url.match(/\/([^\/]+)$/);
        const filename = filenameMatch ? filenameMatch[1] : `Variant ${index + 1}`;

        const colorInfo = extractColorFromFilename(filename);

        return {
          index,
          imageUrl: url,
          colorHex: colorHex || colorInfo?.hex || '#6B7280',
          name: colorInfo?.name ?? `Variant ${index + 1}`
        };
      });

      const processedVariants = await Promise.all(variantPromises);
      setVariants(processedVariants);
      setLoading(false);
    };

    if (imageUrls.length > 1) {
      processVariants();
    } else {
      setLoading(false);
    }
  }, [imageUrls]);

  const handleVariantClick = (variant: VariantOption) => {
    if (onVariantChange) {
      onVariantChange(variant.index, variant.imageUrl);
    }
  };

  // Don't render if no variants or only one variant
  if (!variants.length || variants.length <= 1) {
    return null;
  }

  if (loading) {
    return (
      <div className={`flex gap-2 ${className}`}>
        {imageUrls.slice(0, 6).map((_, index) => (
          <div
            key={index}
            className="w-6 h-6 rounded-full bg-gray-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (compact) {
    // Compact horizontal variant selector
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {variants.map((variant) => (
          <button
            key={variant.index}
            onClick={() => handleVariantClick(variant)}
            className={`relative w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
              selectedVariant === variant.index
                ? 'border-dope-orange-500 ring-2 ring-dope-orange-200'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            title={variant.name}
          >
            <div
              className="w-full h-full rounded-full"
              style={{ backgroundColor: variant.colorHex }}
            />
            {selectedVariant === variant.index && (
              <div className="absolute inset-0 rounded-full border-2 border-white" />
            )}
          </button>
        ))}
      </div>
    );
  }

  // Full variant selector with images
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Color circles row */}
      <div className="flex justify-center gap-3">
        {variants.map((variant) => (
          <button
            key={variant.index}
            onClick={() => handleVariantClick(variant)}
            className={`relative w-12 h-12 rounded-full border-3 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-dope-orange-500 focus:ring-offset-2 ${
              selectedVariant === variant.index
                ? 'border-dope-orange-500 ring-2 ring-dope-orange-200 shadow-lg'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            title={variant.name}
          >
            {/* Color swatch */}
            <div
              className="w-full h-full rounded-full"
              style={{ backgroundColor: variant.colorHex }}
            />

            {/* Selection indicator */}
            {selectedVariant === variant.index && (
              <div className="absolute inset-0 rounded-full border-2 border-white shadow-inner" />
            )}

            {/* Active indicator ring */}
            {selectedVariant === variant.index && (
              <div className="absolute -inset-1 rounded-full border-2 border-dope-orange-500 animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Variant names */}
      <div className="flex justify-center gap-3">
        {variants.map((variant) => (
          <div
            key={`name-${variant.index}`}
            className={`text-xs font-medium px-2 py-1 rounded ${
              selectedVariant === variant.index
                ? 'text-dope-orange-600 bg-dope-orange-50'
                : 'text-gray-600'
            }`}
          >
            {variant.name}
          </div>
        ))}
      </div>

      {/* Selected variant preview */}
      {selectedVariant !== undefined && variants[selectedVariant] && (
        <div className="text-center">
          <div className="inline-block p-3 bg-white rounded-lg shadow-md border">
            <Image
              src={variants[selectedVariant].imageUrl}
              alt={variants[selectedVariant].name}
              width={60}
              height={60}
              className="object-contain mx-auto"
            />
            <div className="text-xs text-gray-600 mt-2">
              {variants[selectedVariant].name} variant selected
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Select a variant to see different colors and options
        </p>
      </div>
    </div>
  );
}

// Utility function to detect if product has variants
export function hasProductVariants(image_urls: string[] = []): boolean {
  return image_urls.length > 1;
}

// Utility function to get variant count
export function getVariantCount(image_urls: string[] = []): number {
  return image_urls.length;
}

// Quick variant preview (mini selector for cards)
export function VariantIndicator({
  imageUrls,
  className = '',
  onClick
}: {
  imageUrls: string[];
  className?: string;
  onClick?: (index: number) => void;
}) {
  if (!hasProductVariants(imageUrls)) return null;

  // Don't make the whole component clickable, but make individual dots clickable
  return (
    <div
      className={`flex gap-1 ${className}`}
      title={`${imageUrls.length} variants available`}
    >
      {imageUrls.slice(0, 4).map((url, index) => (
        <button
          key={index}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick?.(index);
          }}
          className="w-3 h-3 rounded-full border border-white shadow-sm hover:scale-110 transition-transform"
          style={{
            backgroundColor: extractColorFromFilename(url.split('/').pop() || '')?.hex || '#9CA3AF'
          }}
        />
      ))}
      {imageUrls.length > 4 && (
        <div className="w-3 h-3 rounded-full bg-gray-400 border border-white shadow-sm flex items-center justify-center">
          <span className="text-xs text-white font-bold">+</span>
        </div>
      )}
    </div>
  );
}
