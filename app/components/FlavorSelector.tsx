"use client";
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FlavorSelectorProps {
  imageUrls: string[];
  selectedVariant: number;
  onVariantChange: (index: number, url: string) => void;
  className?: string;
}

export default function FlavorSelector({
  imageUrls,
  selectedVariant,
  onVariantChange,
  className = ""
}: FlavorSelectorProps) {
  // Extract flavor name from filename as a fallback
  const getFlavorName = (url: string, index: number) => {
    try {
      const filename = url.split('/').pop() || "";
      const nameWithoutExt = filename.split('.')[0];
      // Clean up common patterns (e.g., product-name-flavor -> flavor)
      // This is a heuristic; real structured data would be better
      const parts = nameWithoutExt.split('-');
      if (parts.length > 1) {
        return parts[parts.length - 1].charAt(0).toUpperCase() + parts[parts.length - 1].slice(1);
      }
      return nameWithoutExt.charAt(0).toUpperCase() + nameWithoutExt.slice(1) || `Option ${index + 1}`;
    } catch (e) {
      return `Option ${index + 1}`;
    }
  };

  if (!imageUrls || imageUrls.length <= 1) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-black uppercase tracking-widest text-gray-500">
        Select Flavor / Option:
      </label>
      <div className="relative">
        <select
          value={selectedVariant}
          onChange={(e) => onVariantChange(Number(e.target.value), imageUrls[Number(e.target.value)])}
          className="w-full bg-white border-2 border-gray-200 rounded-xl px-5 py-4 font-bold text-lg appearance-none focus:border-black focus:outline-none transition-colors cursor-pointer"
        >
          {imageUrls.map((url, index) => (
            <option key={index} value={index}>
              {getFlavorName(url, index)}
            </option>
          ))}
        </select>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <ChevronDown size={20} />
        </div>
      </div>
    </div>
  );
}
