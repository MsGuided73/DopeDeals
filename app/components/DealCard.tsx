"use client";
import Link from 'next/link';
import Image from 'next/image';
import { addToCart } from '../lib/cart-utils';
import { useCompliance } from '../contexts/ComplianceContext';

interface Product {
  id: string;
  name: string;
  our_price: number;
  sale_price?: number | null;
  image_url: string | null;
  image_urls?: string[] | null;
  brand_name?: string | null;
  DD10?: boolean;
  DD15?: boolean;
}

export default function DealCard({ product }: { product: Product }) {
  const { restrictedProductIds } = useCompliance();
  const isRestricted = restrictedProductIds.includes(product.id);
  
  const getDiscountPercent = (p: Product) => p.DD15 ? 15 : p.DD10 ? 10 : 0;
  const disc = getDiscountPercent(product);
  const salePrice = disc > 0 ? product.our_price * (1 - disc / 100) : product.our_price;
  const imageUrl = product.image_url || (product.image_urls?.[0]) || null;
  const brand = product.brand_name && product.brand_name !== 'Unknown Brand' ? product.brand_name : null;

  return (
    <div className="group relative flex flex-col bg-white border-0 transition-transform hover:-translate-y-1 overflow-hidden pb-4">
      {/* Seamless Image Wrapper */}
      <Link href={isRestricted ? '#' : `/product/${product.id}`} className="relative block aspect-square w-full mb-3 no-underline bg-white">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-50 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        {/* Optional Discount Badge */}
        {disc > 0 && (
          <div className="absolute top-3 left-3 bg-[#1A472A] text-white text-xs font-bold px-2 py-1 uppercase tracking-widest shadow-sm">
            -{disc}% OFF
          </div>
        )}

        {/* Restriction overlay */}
        {isRestricted && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none bg-white/80">
            <div className="bg-white/95 border border-red-300 rounded px-3 py-2 text-center shadow-sm">
              <div className="text-xl mb-1">🚫</div>
              <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider">Local Restriction</span>
            </div>
          </div>
        )}
      </Link>

      {/* Info Content - clean white background, seamless */}
      <div className="flex flex-col flex-grow text-center px-3">
        {brand && (
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ fontFamily: "'Oswald', sans-serif" }}>
            {brand}
          </p>
        )}
        <Link href={isRestricted ? '#' : `/product/${product.id}`} className="no-underline">
          <h3 className="font-semibold text-gray-900 text-[15px] leading-snug mb-3 line-clamp-2 hover:text-[#2d8f47] transition-colors" style={{ fontFamily: "'Highway Gothic', 'Oswald', sans-serif" }}>
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto flex items-center justify-center gap-2 mb-4">
          <span className="font-bold text-[#1A472A] text-xl" style={{ fontFamily: "'BebasNeue', 'Bebas Neue', sans-serif", letterSpacing: '0.02em' }}>
            ${salePrice.toFixed(2)}
          </span>
          {product.our_price > salePrice && (
            <span className="text-gray-400 text-sm line-through font-medium">
              ${product.our_price.toFixed(2)}
            </span>
          )}
        </div>
        
        <button
            onClick={async (e) => { 
              e.preventDefault();
              e.stopPropagation(); 
              if (!isRestricted) await addToCart(product.id, 1); 
            }}
            disabled={isRestricted}
            className={`w-full font-bold text-[13px] uppercase tracking-widest py-3 px-4 transition-all duration-300 ${
              isRestricted 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-[#1A472A] shadow-md hover:shadow-lg'
            }`}
            style={{ fontFamily: "'Oswald', sans-serif" }}
        >
            {isRestricted ? 'Unavailable' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
