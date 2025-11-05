'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { addToCart } from '../lib/cart-utils'
import { useFavorites } from '../hooks/useFavorites'
import { toast } from 'react-hot-toast'

interface Product {
  id: string
  name: string
  description: string | null
  short_description: string | null
  our_price: number
  sale_price?: number | null
  fire_price?: number | null
  image_url: string | null
  image_urls?: string[] | null
  sku: string | null
  stock_quantity: number
  is_active: boolean
  featured: boolean
  brand_id: string | null
  brand_name: string | null
  category_id: string | null
  created_at: string
  updated_at: string
  slug?: string | null
}

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { favorites, toggleFavorite } = useFavorites()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/products/featured')
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
        const data = await res.json()
        setProducts(data.products ?? [])
      } catch (err: any) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-neutral-500">Loading featured products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-red-500">Error loading products: {error}</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-neutral-500">No featured products found.</p>
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-neutral-900">
          Featured Products
        </h2>
        <Link
          href="/shop"
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          View all
        </Link>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug ?? product.id}`}
            className="group block rounded-xl border border-neutral-200/60 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="aspect-square w-full overflow-hidden rounded-t-xl bg-neutral-50">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-neutral-400">
                  No image
                </div>
              )}
            </div>

            <div className="p-3">
              <h3 className="line-clamp-2 text-sm font-medium text-neutral-900">
                {product.name}
              </h3>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-base font-semibold text-neutral-900">
                  ${Number(product.sale_price ?? product.our_price).toFixed(2)}
                </span>
                {product.sale_price && (
                  <span className="text-sm text-neutral-400 line-through">
                    ${Number(product.our_price).toFixed(2)}
                  </span>
                )}
              </div>

              <div className="mt-3 flex justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    addToCart(product)
                    toast.success('Added to cart')
                  }}
                  className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
                >
                  Add to cart
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    toggleFavorite(product.id)
                    toast.success(
                      favorites.includes(product.id)
                        ? 'Removed from favorites'
                        : 'Added to favorites'
                    )
                  }}
                  className={`rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium ${
                    favorites.includes(product.id)
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-white text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  {favorites.includes(product.id) ? '♥' : '♡'}
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
