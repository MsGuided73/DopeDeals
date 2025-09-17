'use client'

import { useState, useEffect } from 'react'
import { supabaseBrowser } from '../lib/supabase-browser'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  description: string | null
  price: string
  vip_price: string | null
  image_url: string | null
  sku: string | null
  stock_quantity: number | null
  is_active: boolean
}

export default function PreRollsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPreRolls() {
      try {
        const { data, error } = await supabaseBrowser
          .from('products')
          .select('id, name, description, price, vip_price, image_url, sku, stock_quantity, is_active')
          .or('name.ilike.%pre-roll%, name.ilike.%preroll%, description.ilike.%pre-roll%, description.ilike.%preroll%')
          .eq('is_active', true)
          .order('name')

        if (error) throw error
        setProducts(data || [])
      } catch (err) {
        console.error('Error fetching pre-rolls:', err)
        setError('Failed to load pre-roll products')
      } finally {
        setLoading(false)
      }
    }

    fetchPreRolls()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dope-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dope pre-rolls...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-4 py-2 rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-dope-orange-500 to-dope-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-chalets mb-4">PRE-ROLLS</h1>
          <p className="text-xl opacity-90">Ready to smoke, premium quality pre-rolls for every vibe</p>
          <div className="mt-6 flex items-center gap-4">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              {products.length} Products Available
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              Premium THCA & More
            </span>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="text-sm text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:text-dope-orange-500 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white">Pre-Rolls</span>
        </nav>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No pre-roll products available at the moment.</p>
            <Link 
              href="/products" 
              className="inline-block mt-4 bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-6 py-3 rounded transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 hover:scale-105">
                {/* Product Image */}
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center relative overflow-hidden">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-gray-400 dark:text-gray-500 text-center p-4">
                      <div className="w-16 h-16 mx-auto mb-2 bg-dope-orange-100 dark:bg-dope-orange-900 rounded-full flex items-center justify-center">
                        <span className="text-dope-orange-500 text-2xl">🌿</span>
                      </div>
                      <p className="text-sm">Pre-Roll</p>
                    </div>
                  )}
                  
                  {/* Stock Badge */}
                  {product.stock_quantity !== null && (
                    <div className="absolute top-3 right-3">
                      {product.stock_quantity > 0 ? (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          {product.stock_quantity} in stock
                        </span>
                      ) : (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          Out of stock
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white line-clamp-2">
                    {product.name}
                  </h3>
                  
                  {product.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  {product.sku && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                      SKU: {product.sku}
                    </p>
                  )}

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-dope-orange-500 font-bold text-xl">
                        ${parseFloat(product.price).toFixed(2)}
                      </span>
                      {product.vip_price && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          VIP: ${parseFloat(product.vip_price).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/product/${product.id}`}
                      className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-center py-2 px-4 rounded transition-colors text-sm"
                    >
                      View Details
                    </Link>
                    <button 
                      className="bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-4 py-2 rounded transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!product.stock_quantity || product.stock_quantity === 0}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
