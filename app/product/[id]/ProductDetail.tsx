"use client";
import React from 'react';
import Image from 'next/image';
import { Panel, MetalDivider } from '@/components/design/NikeIndustrial';

export default function ProductDetail({ product }: { product: any }) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Panel className="p-4 md:p-6">
        <div className="aspect-square w-full bg-neutral-100 rounded-lg overflow-hidden">
          {product?.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} width={800} height={800} className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full grid place-items-center text-neutral-500">No image</div>
          )}
        </div>
        <div className="mt-3 flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 w-16 rounded-md bg-neutral-100" />
          ))}
        </div>
      </Panel>

      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight">{product?.name}</h1>
        <p className="text-neutral-600">{product?.description}</p>
        <MetalDivider />
        <div className="text-2xl font-bold">${Number(product?.price ?? 0).toFixed(2)}</div>
        <div className="text-sm text-neutral-500">{product?.inStock ? 'In stock' : 'Out of stock'}</div>
        <button className="px-6 py-3 bg-black text-white rounded-lg font-semibold uppercase disabled:opacity-40" disabled={!product?.inStock}>
          Add to cart
        </button>
        <MetalDivider />
        <div>
          <h3 className="font-semibold mb-2">Specifications</h3>
          <ul className="text-sm text-neutral-700 grid gap-1">
            {product?.material && <li>Material: {product.material}</li>}
            {product?.sku && <li>SKU: {product.sku}</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

