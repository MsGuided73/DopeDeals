"use client";
import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ product }: { product: any }) {
  const hasImage = product.image_url && product.image_url.trim() !== '';

  return (
    <Link href={`/product/${product.id}`} className="group block border border-neutral-200 rounded-xl overflow-hidden bg-white hover:shadow-xl transition-shadow">
      <div className="aspect-square bg-neutral-100 relative overflow-hidden">
        {hasImage ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            <div className="text-center">
              <div className="text-4xl mb-2">📦</div>
              <div className="text-sm">No Image</div>
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="font-bold group-hover:underline uppercase tracking-wide">{product.name}</div>
        <div className="text-neutral-600 text-sm">${Number(product.price).toFixed(2)}</div>
      </div>
    </Link>
  );
}

