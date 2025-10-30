"use client";
import { useState } from 'react';
import AgeVerification from '../components/AgeVerification';
import { Heart, ShoppingCart, Trash2, Share2, Grid, List } from 'lucide-react';
import Image from 'next/image';

export default function WishlistPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: '1',
      name: 'Premium Glass Beaker Bong',
      price: 89.99,
      originalPrice: 109.99,
      image: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/products/bongs/RooR/Roor-Classic-18-Beaker-50x5mm-Flame-Polish.webp',
      inStock: true,
      brand: 'ROOR',
      addedDate: '2024-01-15'
    },
    {
      id: '3',
      name: 'Cookies Pre-Roll Pack',
      price: 45.00,
      image: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/brands/Cookies/cookies-thc-a-slim-pre-rolls-3-5g-5ct.webp',
      inStock: true,
      brand: 'Cookies',
      addedDate: '2024-01-08'
    }
  ]);

  const removeFromWishlist = (id: string) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
  };

  const addToCart = (id: string) => {
    // Add to cart logic here
    console.log('Adding to cart:', id);
  };

  return (
    <>
      <AgeVerification />
      <GlobalMasthead />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section - Clean White */}
        <div className="bg-white py-8 border-b border-gray-200">
          <div className="w-full max-w-none mx-0 px-6 text-center">
            <h1 className="dope-city-title text-4xl md:text-5xl mb-4 text-gray-900">
              MY WISHLIST
            </h1>
            <div className="w-24 h-1 bg-dope-orange-500 mx-auto mb-4"></div>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
              Save your favorite products and never miss out on the items you love
            </p>
          </div>
        </div>

        <div className="w-full max-w-none mx-0 px-6 py-12">
          
          {/* Wishlist Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {wishlistItems.length} Items in Your Wishlist
              </h2>
              <p className="text-gray-600">
                Keep track of products you want to purchase later
              </p>
            </div>
            
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              {/* View Mode Toggle */}
              <div className="flex bg-white rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-dope-orange-500 text-white'
                      : 'text-gray-600 hover:text-dope-orange-500'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-dope-orange-500 text-white'
                      : 'text-gray-600 hover:text-dope-orange-500'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Share Wishlist */}
              <button className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          {/* Wishlist Items */}
          {wishlistItems.length === 0 ? (
            /* Empty Wishlist */
            <div className="text-center py-16">
              <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Your Wishlist is Empty
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start adding products to your wishlist by clicking the heart icon on any product page.
              </p>
              <button className="bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Continue Shopping
              </button>
            </div>
          ) : (
            /* Wishlist Grid/List */
            <div className={`${
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
                : 'space-y-4'
            }`}>
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  {/* Product Image */}
                  <div className={`relative ${
                    viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'aspect-square'
                  } bg-gray-100`}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    
                    {/* Remove from Wishlist */}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full transition-colors group"
                    >
                      <Heart className="w-4 h-4 text-red-500 fill-current group-hover:scale-110 transition-transform" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">{item.brand}</p>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {item.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-dope-orange-600">
                          ${item.price}
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${item.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        Added {new Date(item.addedDate).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(item.id)}
                        disabled={!item.inStock}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                          item.inStock
                            ? 'bg-dope-orange-500 hover:bg-dope-orange-600 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                      
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Wishlist Actions */}
          {wishlistItems.length > 0 && (
            <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Ready to Purchase?
                  </h3>
                  <p className="text-gray-600">
                    Add all in-stock items to your cart with one click
                  </p>
                </div>

                <div className="flex gap-4">
                  <button className="bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                    Add All to Cart
                  </button>
                  <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold transition-colors">
                    Clear Wishlist
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
