"use client";
import Link from 'next/link';
import Image from 'next/image';
import { addToCart } from '../lib/cart-utils';
import { Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description?: string | null;
  our_price: number;
  image_url?: string | null;
  image_urls?: string[] | null;
  brand_name?: string | null;
  DD10?: boolean;
  DD15?: boolean;
}

export default function MinimalProductCard({ product }: { product: Product }) {
  const getDiscountPercent = (p: Product) => p.DD15 ? 15 : p.DD10 ? 10 : 0;
  
  const disc = getDiscountPercent(product);
  const basePrice = parseFloat((product.our_price ?? 0).toString());
  const salePrice = disc > 0 ? basePrice * (1 - disc / 100) : basePrice;
  const imageUrl = product.image_url || (product.image_urls?.[0]) || null;
  
  // Render dummy 5 stars to match screenshot aesthetic
  const ratingCount = Math.floor(Math.random() * 50) + 5;

  return (
    <div className="flex flex-col h-full bg-white group cursor-pointer">
      <Link href={`/product/${product.id}`} className="block flex-1 flex flex-col no-underline text-inherit">
        {/* Image Container - Square, seamless */}
        <div className="relative w-full aspect-square bg-[#f8f8f8] mb-4 overflow-hidden rounded-sm transition-opacity group-hover:opacity-90">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-contain p-2 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
              <span className="text-xs font-medium uppercase tracking-widest">No Image</span>
            </div>
          )}
        </div>

        {/* Info Container */}
        <div className="flex flex-col flex-1 px-1">
          {/* Title - thin, uppercase, leading-snug */}
          <h3 
            className="text-[12px] font-medium leading-relaxed tracking-wide text-gray-800 uppercase line-clamp-2 mb-2"
            style={{ fontFamily: "'Fira Sans', sans-serif" }}
          >
            {product.name}
          </h3>

          {/* Dummy Ratings */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-[#d2691e]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <span className="text-[10px] text-gray-500">({ratingCount})</span>
          </div>

          <div className="flex-1" /> {/* Push prices and button to bottom */}

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mb-3">
            {disc > 0 && (
              <span className="text-[12px] text-gray-400 line-through font-medium" style={{ fontFamily: "'Fira Sans', sans-serif" }}>
                ${basePrice.toFixed(2)}
              </span>
            )}
            <span className="text-[14px] font-bold text-[#145C3C]" style={{ fontFamily: "'Fira Sans', sans-serif" }}>
              ${salePrice.toFixed(2)}
            </span>
          </div>
        </div>
      </Link>

      {/* Button Container - Outlined, Minimal */}
      <div className="px-1 mt-auto">
        <button
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await addToCart(product.id, 1);
          }}
          className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 border border-[#145C3C] text-[#145C3C] rounded-sm transition-all hover:bg-[#145C3C] hover:text-white"
          style={{ fontFamily: "'Fira Sans', sans-serif" }}
        >
          Select Options
        </button>
      </div>
    </div>
  );
}
