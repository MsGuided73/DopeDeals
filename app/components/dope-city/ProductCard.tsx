import Image from 'next/image';
import type { Product } from '@/components/dope-city/types';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group rounded-2xl border overflow-hidden bg-white">
      <div className="relative h-48">
        <Image src={product.image_url} alt={product.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
      </div>
      <div className="p-4">
        <div className="font-semibold">{product.title}</div>
        <div className="text-sm text-black/70">${product.price.toFixed(2)}</div>
        {product.memberPrice ? (
          <div className="text-sm text-brand-accent">Member: ${product.memberPrice.toFixed(2)}</div>
        ) : null}
        <button className="btn-primary mt-3">Add</button>
      </div>
    </div>
  );
}

