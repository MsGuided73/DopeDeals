"use client";
import React from 'react';
import Image from 'next/image';
import { Panel, MetalDivider } from '../../components/design/NikeIndustrial';
import ProductDescription from '../../components/ProductDescription';

export default function ProductDetail({ product }: { product: any }) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Panel className="p-4 md:p-6">
        <div className="aspect-square w-full bg-white border border-neutral-200 rounded-lg overflow-hidden p-8">
          {product?.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} width={800} height={800} className="object-contain w-full h-full" />
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
        
        {product?.short_description && (
          <p className="text-xl text-neutral-600 font-medium">{product.short_description}</p>
        )}
        
        {product?.description_markdown ? (
          <ProductDescription markdownText={product.description_markdown} />
        ) : (
          <p className="text-neutral-600">{product?.description}</p>
        )}

        {product?.highlights && Array.isArray(product.highlights) && product.highlights.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Highlights</h3>
            <ul className="list-disc list-inside space-y-1 text-neutral-700">
              {product.highlights.map((highlight: string, idx: number) => (
                <li key={idx}>{highlight}</li>
              ))}
            </ul>
          </div>
        )}

        {product?.flavors && Array.isArray(product.flavors) && product.flavors.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Flavors</h3>
            <div className="flex flex-wrap gap-2">
              {product.flavors.map((flavor: string, idx: number) => (
                <span key={idx} className="bg-neutral-100 px-3 py-1 rounded-full text-sm font-medium border border-neutral-200">
                  {flavor}
                </span>
              ))}
            </div>
          </div>
        )}

        {product?.ingredients && (
          <div className="mt-4 text-sm text-neutral-600">
            <span className="font-semibold text-neutral-900">Ingredients: </span>
            {product.ingredients}
          </div>
        )}
        
        {product?.allergy_warning && (
          <div className="mt-4 p-4 bg-red-50 text-red-900 border border-red-200 rounded-md text-sm font-semibold">
            ⚠️ Allergy Warning: {product.allergy_warning}
          </div>
        )}
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

