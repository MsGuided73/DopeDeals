"use client";
import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { addToCart } from '../lib/cart-utils';

interface AddToCartButtonProps {
  productId: string;
  productName?: string;
  inStock?: boolean;
  stockQuantity?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
}

export default function AddToCartButton({
  productId,
  productName = 'item',
  inStock = true,
  stockQuantity = 10,
  className = '',
  size = 'md',
  variant = 'primary'
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!inStock || isAdding) return;
    
    setIsAdding(true);
    const success = await addToCart(productId, quantity);
    
    if (success) {
      // Reset quantity after successful add
      setQuantity(1);
    }
    
    setIsAdding(false);
  };

  const incrementQuantity = () => {
    if (quantity < Math.min(10, stockQuantity)) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-black text-white hover:bg-gray-800 disabled:bg-gray-300',
    secondary: 'bg-dope-orange-500 text-white hover:bg-dope-orange-600 disabled:bg-gray-300',
    outline: 'border-2 border-black text-black hover:bg-black hover:text-white disabled:border-gray-300 disabled:text-gray-300'
  };

  const quantityButtonClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  if (!inStock) {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <button
          disabled
          className={`
            ${sizeClasses[size]} 
            ${variantClasses.primary}
            rounded-lg font-semibold transition-colors cursor-not-allowed
            flex items-center justify-center gap-2
          `}
        >
          Out of Stock
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Quantity Selector */}
      <div className="flex items-center gap-3">
        <label htmlFor="quantity" className="font-medium text-gray-900 text-sm">
          Quantity:
        </label>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className={`
              ${quantityButtonClasses[size]}
              border border-gray-300 rounded-md 
              flex items-center justify-center
              hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            `}
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <span className={`
            ${quantityButtonClasses[size]}
            border-t border-b border-gray-300 
            flex items-center justify-center
            font-medium text-gray-900
          `}>
            {quantity}
          </span>
          
          <button
            type="button"
            onClick={incrementQuantity}
            disabled={quantity >= Math.min(10, stockQuantity)}
            className={`
              ${quantityButtonClasses[size]}
              border border-gray-300 rounded-md 
              flex items-center justify-center
              hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            `}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <span className="text-sm text-gray-500">
          ({stockQuantity} available)
        </span>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={!inStock || isAdding}
        className={`
          ${sizeClasses[size]} 
          ${variantClasses[variant]}
          rounded-lg font-semibold transition-colors
          flex items-center justify-center gap-2
          disabled:cursor-not-allowed
        `}
      >
        {isAdding ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
}
