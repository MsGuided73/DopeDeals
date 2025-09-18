"use client";
import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { addToCart } from '../lib/cart-utils';

interface QuickAddToCartButtonProps {
  productId: string;
  productName?: string;
  inStock?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  quantity?: number;
}

export default function QuickAddToCartButton({
  productId,
  productName = 'item',
  inStock = true,
  className = '',
  size = 'md',
  variant = 'primary',
  quantity = 1
}: QuickAddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if button is inside a link
    e.stopPropagation(); // Prevent event bubbling
    
    if (!inStock || isAdding) return;
    
    setIsAdding(true);
    await addToCart(productId, quantity);
    setIsAdding(false);
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-black text-white hover:bg-gray-800 disabled:bg-gray-300',
    secondary: 'bg-dope-orange-500 text-white hover:bg-dope-orange-600 disabled:bg-gray-300',
    outline: 'border-2 border-black text-black hover:bg-black hover:text-white disabled:border-gray-300 disabled:text-gray-300'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  if (!inStock) {
    return (
      <button
        disabled
        className={`
          ${sizeClasses[size]} 
          rounded-lg font-semibold transition-colors cursor-not-allowed
          flex items-center justify-center gap-1
          bg-gray-300 text-gray-500
          ${className}
        `}
      >
        Out of Stock
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={!inStock || isAdding}
      className={`
        ${sizeClasses[size]} 
        ${variantClasses[variant]}
        rounded-lg font-semibold transition-colors
        flex items-center justify-center gap-1
        disabled:cursor-not-allowed
        ${className}
      `}
      title={`Add ${productName} to cart`}
    >
      {isAdding ? (
        <>
          <div className={`${iconSizes[size]} border-2 border-white border-t-transparent rounded-full animate-spin`} />
          {size !== 'sm' && 'Adding...'}
        </>
      ) : (
        <>
          <ShoppingCart className={iconSizes[size]} />
          {size === 'sm' ? '' : size === 'md' ? 'Add' : 'Add to Cart'}
        </>
      )}
    </button>
  );
}
