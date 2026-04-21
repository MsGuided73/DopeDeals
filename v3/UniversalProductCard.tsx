"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { addToCart } from '../lib/cart-utils';
import {
  cleanProductDescription,
  extractProductDescription,
  isImageAppropriateForProduct,
  getProductPlaceholder,
  generateProductDescription
} from '../lib/product-utils';
import toast from 'react-hot-toast';
import { VariantIndicator, hasProductVariants } from './VariantSelector';
import { useCompliance } from '../contexts/ComplianceContext';

interface UniversalProductCardProps {
  product: {
    id: string;
    name: string;
    price: string | number;
    image_url?: string;
    imageUrl?: string;
    image?: string;
    image_urls?: string[]; // Added for variant support
    featured?: boolean;
    stock_quantity?: number;
    brand_name?: string;
    short_description?: string;
    description?: string;
    rating?: number;
    review_count?: number;
    category?: string;
    tags?: string[];
    compare_at_price?: number;
    discount_percentage?: number;
  };
  
  // Layout Options
  viewMode?: 'grid' | 'list' | 'compact' | 'featured' | 'sidebar' | 'homepage-featured';
  size?: 'small' | 'medium' | 'large';
  
  // Feature Toggles
  showAddToCart?: boolean;
  showFavorite?: boolean;
  showQuickView?: boolean;
  showRating?: boolean;
  showBrand?: boolean;
  showDescription?: boolean;
  showStock?: boolean;
  showDiscount?: boolean;
  
  // Context-specific options
  context?: 'search' | 'category' | 'brand' | 'homepage' | 'related' | 'cart';
  priority?: 'high' | 'normal' | 'low'; // For image loading priority
  
  // Custom styling
  className?: string;
  imageClassName?: string;
  
  // Event handlers
  onAddToCart?: (productId: string) => void;
  onFavorite?: (productId: string, isFavorite: boolean) => void;
  onQuickView?: (productId: string) => void;
}

export default function UniversalProductCard({
  product,
  viewMode = 'grid',
  size = 'medium',
  showAddToCart = true,
  showFavorite = true,
  showQuickView = false,
  showRating = true,
  showBrand = true,
  showDescription = true,
  showStock = true,
  showDiscount = true,
  context = 'category',
  priority = 'normal',
  className = '',
  imageClassName = '',
  onAddToCart,
  onFavorite,
  onQuickView
}: UniversalProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { restrictedProductIds } = useCompliance();
  const isRestricted = restrictedProductIds.includes(product.id);

  // Handle multiple images for variant switching
  const imageUrls = product.image_urls || [];
  const primaryImageUrl = product.image_url || product.imageUrl || product.image;

  // Use selected variant image or fallback to primary image
  const selectedImageUrl = imageUrls[selectedImageIndex] || primaryImageUrl;

  // Check if the image is appropriate for this product type
  const isImageAppropriate = isImageAppropriateForProduct(selectedImageUrl, product.name);
  const imageUrl = isImageAppropriate && !imageError ? selectedImageUrl : null;
  const hasImage = imageUrl && imageUrl.trim() !== '';

  // Clean up product descriptions
  const cleanShortDescription = product.short_description
    ? extractProductDescription(product.short_description) || cleanProductDescription(product.short_description)
    : generateProductDescription(product);

  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const compareAtPrice = product.compare_at_price;
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discountPercentage = hasDiscount 
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : product.discount_percentage;

  const isInStock = (product.stock_quantity || 0) > 0;
  const placeholder = getProductPlaceholder(product.name);

  // Size configurations
  const sizeConfig = {
    small: {
      container: 'w-full max-w-xs',
      image: 'h-32',
      title: 'text-sm',
      price: 'text-lg',
      button: 'px-2 py-1 text-xs'
    },
    medium: {
      container: 'w-full max-w-sm',
      image: 'h-48',
      title: 'text-base',
      price: 'text-xl',
      button: 'px-3 py-2 text-sm'
    },
    large: {
      container: 'w-full max-w-md',
      image: 'h-64',
      title: 'text-lg',
      price: 'text-2xl',
      button: 'px-4 py-2 text-base'
    }
  };

  const config = sizeConfig[size];

  // Event handlers
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isInStock || isAddingToCart) return;

    setIsAddingToCart(true);
    
    try {
      if (onAddToCart) {
        onAddToCart(product.id);
      } else {
        await addToCart(product.id, 1);
      }
    } catch (error) {
      console.error('Add to cart failed:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    
    if (onFavorite) {
      onFavorite(product.id, newFavoriteState);
    }
    
    toast.success(newFavoriteState ? 'Added to favorites' : 'Removed from favorites', {
      icon: newFavoriteState ? '❤️' : '💔',
      duration: 2000,
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onQuickView) {
      onQuickView(product.id);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Compact view for search results or small spaces
  if (viewMode === 'compact') {
    return (
      <Link 
        href={isRestricted ? '#' : `/product/${product.id}`} 
        className={`group flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg transition-all duration-200 ${
          isRestricted ? 'opacity-60 grayscale cursor-not-allowed' : 'hover:shadow-md'
        } ${className}`}
      >
        <div className="relative w-16 h-16 flex-shrink-0 bg-white rounded-md overflow-hidden">
          {hasImage ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-contain p-1"
              sizes="64px"
              priority={priority === 'high'}
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-lg">{placeholder.icon}</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm line-clamp-1 group-hover:text-dope-orange-600 transition-colors">
            {product.name}
          </h3>
          {showBrand && product.brand_name && (
            <p className="text-xs text-gray-500">{product.brand_name}</p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <span className="font-bold text-dope-orange-600">${price.toFixed(2)}</span>
            {hasDiscount && compareAtPrice && (
              <span className="text-xs text-gray-400 line-through">${compareAtPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Sidebar view - Image on left, content on right (your requested layout)
  if (viewMode === 'sidebar') {
    return (
      <Link
        href={isRestricted ? '#' : `/product/${product.id}`}
        className={`group flex bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 relative ${
          isRestricted ? 'opacity-60 grayscale cursor-not-allowed' : 'hover:shadow-lg'
        } ${config.container} ${className}`}
      >
        {/* Large Product Image - Left Side */}
        <div className="relative w-48 h-48 flex-shrink-0 bg-white overflow-hidden">
          {hasImage ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className={`object-contain p-3 group-hover:scale-105 transition-transform duration-300 ${imageClassName}`}
              sizes="192px"
              priority={priority === 'high'}
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">{placeholder.icon}</div>
                <div className="text-sm">{placeholder.text}</div>
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.featured && (
              <div className="bg-dope-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                Featured
              </div>
            )}
            {showDiscount && discountPercentage && (
              <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                -{discountPercentage}%
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {showFavorite && (
              <button
                onClick={handleToggleFavorite}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </button>
            )}
            {showQuickView && (
              <button
                onClick={handleQuickView}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Product Info - Right Side */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          {/* Top section - Title and brand */}
          <div className="mb-3">
            <h3 className={`font-semibold ${config.title} mb-1 line-clamp-2 group-hover:text-dope-orange-600 transition-colors`}>
              {product.name}
            </h3>

            {showBrand && product.brand_name && (
              <p className="text-sm text-gray-500 mb-2">{product.brand_name}</p>
            )}

            {showRating && product.rating && (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating!)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                {product.review_count && (
                  <span className="text-sm text-gray-500">({product.review_count})</span>
                )}
              </div>
            )}
          </div>

          {/* Middle section - Description */}
          {showDescription && cleanShortDescription && (
            <div className="flex-1 mb-3">
              <p className="text-gray-600 text-sm line-clamp-3">
                {cleanShortDescription}
              </p>
            </div>
          )}

          {/* Bottom section - Price and actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`font-bold text-dope-orange-600 ${config.price}`}>
                ${price.toFixed(2)}
              </span>
              {hasDiscount && compareAtPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {showStock && product.stock_quantity !== undefined && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isInStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isInStock ? 'In Stock' : 'Out of Stock'}
                </span>
              )}

              {showAddToCart && (
                <button
                  onClick={handleAddToCart}
                  disabled={!isInStock || isAddingToCart || isRestricted}
                  className={`bg-dope-orange-500 hover:bg-dope-orange-600 text-white ${config.button} rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {isAddingToCart ? 'Adding...' : 'Add'}
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // List view for category pages
  if (viewMode === 'list') {
    return (
      <Link 
        href={isRestricted ? '#' : `/product/${product.id}`} 
        className={`group block bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 relative ${
          isRestricted ? 'opacity-60 grayscale cursor-not-allowed' : 'hover:shadow-lg'
        } ${className}`}
      >
        <div className="flex">
          {/* Product Image */}
          <div className="relative w-48 h-48 flex-shrink-0 bg-white">
            {hasImage ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className={`object-contain p-4 group-hover:scale-105 transition-transform duration-300 ${imageClassName}`}
                sizes="192px"
                priority={priority === 'high'}
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">{placeholder.icon}</div>
                  <div className="text-sm">{placeholder.text}</div>
                </div>
              </div>
            )}
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.featured && (
                <div className="bg-dope-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  Featured
                </div>
              )}
              {showDiscount && discountPercentage && (
                <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  -{discountPercentage}%
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {showFavorite && (
                <button
                  onClick={handleToggleFavorite}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </button>
              )}
              {showQuickView && (
                <button
                  onClick={handleQuickView}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-2">
              <h3 className={`font-semibold ${config.title} line-clamp-2 group-hover:text-dope-orange-600 transition-colors`}>
                {product.name}
              </h3>
            </div>

            {showBrand && product.brand_name && (
              <p className="text-sm text-gray-500 mb-2">{product.brand_name}</p>
            )}

            {showRating && product.rating && (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating!) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                {product.review_count && (
                  <span className="text-sm text-gray-500">({product.review_count})</span>
                )}
              </div>
            )}

            {showDescription && cleanShortDescription && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {cleanShortDescription}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`font-bold text-dope-orange-600 ${config.price}`}>
                  ${price.toFixed(2)}
                </span>
                {hasDiscount && compareAtPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ${compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {showStock && product.stock_quantity !== undefined && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isInStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isInStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                )}

                {showAddToCart && (
                  <button
                    onClick={handleAddToCart}
                    disabled={!isInStock || isAddingToCart || isRestricted}
                    className={`bg-dope-orange-500 hover:bg-dope-orange-600 text-white ${config.button} rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Homepage featured view - Image on left, content on right with full height image
  if (viewMode === 'homepage-featured') {
    return (
      <div className={`group flex bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 relative ${
        isRestricted ? 'opacity-60 grayscale cursor-not-allowed' : 'hover:shadow-lg'
      } ${config.container} ${className}`}>
        {/* Large Product Image - Left Side - Full Height */}
        <div className="relative w-64 h-80 flex-shrink-0 bg-white overflow-hidden">
          {hasImage ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className={`object-contain p-4 group-hover:scale-105 transition-transform duration-300 ${imageClassName}`}
              sizes="256px"
              priority={priority === 'high'}
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-5xl mb-2">{placeholder.icon}</div>
                <div className="text-sm">{placeholder.text}</div>
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.featured && (
              <div className="bg-dope-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                Featured
              </div>
            )}
            {showDiscount && discountPercentage && (
              <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                -{discountPercentage}%
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {showFavorite && (
              <button
                onClick={handleToggleFavorite}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-gray-50 transition-colors"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </button>
            )}
            {showQuickView && (
              <button
                onClick={handleQuickView}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Product Info - Right Side */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          {/* Top section - Title and brand */}
          <div className="mb-3">
            <h3 className={`font-semibold ${config.title} mb-1 line-clamp-2 group-hover:text-dope-orange-600 transition-colors`}>
              {product.name}
            </h3>

            {showBrand && product.brand_name && (
              <p className="text-sm text-gray-500 mb-2">{product.brand_name}</p>
            )}

            {showRating && product.rating && (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating!)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                {product.review_count && (
                  <span className="text-sm text-gray-500">({product.review_count})</span>
                )}
              </div>
            )}
          </div>

          {/* Middle section - Description */}
          {showDescription && cleanShortDescription && (
            <div className="flex-1 mb-3">
              <p className="text-gray-600 text-sm line-clamp-3">
                {cleanShortDescription}
              </p>
            </div>
          )}

          {/* Bottom section - Price and actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`font-bold text-dope-orange-600 ${config.price}`}>
                ${price.toFixed(2)}
              </span>
              {hasDiscount && compareAtPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {showStock && product.stock_quantity !== undefined && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isInStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isInStock ? 'In Stock' : 'Out of Stock'}
                </span>
              )}

              {showAddToCart && (
                <button
                  onClick={handleAddToCart}
                  disabled={!isInStock || isAddingToCart || isRestricted}
                  className="glassmorphic-medium hover:bg-dope-orange-500 hover:text-white text-dope-orange-600 border border-dope-orange-400 px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-dope-orange-500/30 flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default grid view
  return (
    <div className={`group block bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 relative ${
      isRestricted ? 'opacity-60 grayscale cursor-not-allowed' : 'hover:shadow-lg'
    } ${config.container} ${className}`}>
      
      {/* Universal Restriction Overlay for all view modes */}
      {isRestricted && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-8 pointer-events-none">
          <div className="bg-black/90 backdrop-blur-md border border-red-500/50 rounded-2xl p-5 flex flex-col items-center text-center shadow-2xl transform rotate-[-3deg]">
            <div className="text-3xl mb-2 text-red-500">🚫</div>
            <span className="text-white font-black uppercase tracking-tighter text-xl leading-none">Local Restriction</span>
            <span className="text-red-400 text-xs font-bold uppercase tracking-widest mt-1">Limited Availability</span>
          </div>
        </div>
      )}
      {/* Product Image */}
      <div className={`relative ${config.image} bg-white overflow-hidden`}>
        {hasImage ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className={`object-contain p-4 group-hover:scale-105 transition-transform duration-300 ${imageClassName}`}
            sizes={size === 'small' ? '200px' : size === 'large' ? '400px' : '300px'}
            priority={priority === 'high'}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">{placeholder.icon}</div>
              <div className="text-sm">{placeholder.text}</div>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.featured && (
            <div className="bg-dope-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Featured
            </div>
          )}
          {showDiscount && discountPercentage && (
            <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              -{discountPercentage}%
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {showFavorite && (
            <button
              onClick={handleToggleFavorite}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-gray-50 transition-colors"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>
          )}
          {showQuickView && (
            <button
              onClick={handleQuickView}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col h-full">
        {/* Content Section - Flexible height */}
        <div className="flex-grow">
          <div className="flex items-start justify-between mb-2">
            <h3 className={`font-semibold ${config.title} line-clamp-2 text-gray-900 group-hover:text-dope-orange-600 transition-colors`}>
              {product.name}
            </h3>
            {/* Variant Indicator */}
            {hasProductVariants(product.image_urls || []) && (
              <div className="ml-2">
                <VariantIndicator
                  imageUrls={product.image_urls || []}
                  onClick={(index) => setSelectedImageIndex(index)}
                  className="-translate-y-1"
                />
              </div>
            )}
          </div>

          {showBrand && product.brand_name && (
            <p className="text-sm text-gray-500 mb-2">{product.brand_name}</p>
          )}

          {showRating && product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating!)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              {product.review_count && (
                <span className="text-sm text-gray-500">({product.review_count})</span>
              )}
            </div>
          )}

          {showDescription && cleanShortDescription && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {cleanShortDescription}
            </p>
          )}

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className={`font-bold text-dope-orange-600 ${config.price}`}>
                ${price.toFixed(2)}
              </span>
              {hasDiscount && compareAtPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            {showStock && product.stock_quantity !== undefined && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                isInStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isInStock ? 'In Stock' : 'Out of Stock'}
              </span>
            )}
          </div>
        </div>

        {/* CTA Button - Anchored to bottom */}
        {showAddToCart && (
          <div className="mt-auto">
            <button
              onClick={handleAddToCart}
              disabled={!isInStock || isAddingToCart || isRestricted}
              className={`w-full bg-dope-orange-500 hover:bg-dope-orange-600 text-white ${config.button} rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              <ShoppingCart className="w-4 h-4" />
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
