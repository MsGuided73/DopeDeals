"use client";
import Link from 'next/link';

export default function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/product/${product.id}`} className="group block border border-neutral-200 rounded-xl overflow-hidden bg-white hover:shadow-xl transition-shadow">
      <div className="aspect-square bg-neutral-100" />
      <div className="p-4">
        <div className="font-bold group-hover:underline uppercase tracking-wide">{product.name}</div>
        <div className="text-neutral-600 text-sm">${Number(product.price).toFixed(2)}</div>
      </div>
    </Link>
  );
}

