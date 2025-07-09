import { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Link } from "wouter";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log("Adding to cart:", product);
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <article className="bg-steel-800 rounded-xl overflow-hidden border border-steel-700 group hover:border-yellow-400 transition-colors">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.imageUrl || "https://via.placeholder.com/400"}
          alt={`${product.name} - Premium smoking accessory`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4">
          {product.vipExclusive && (
            <span className="bg-yellow-500 text-steel-900 px-2 py-1 rounded text-xs font-semibold">
              VIP Exclusive
            </span>
          )}
          {product.featured && !product.vipExclusive && (
            <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
              Best Seller
            </span>
          )}
        </div>
        
        {/* Wishlist Button */}
        <div className="absolute top-4 right-4">
          <Button
            size="icon"
            variant="ghost"
            className={`w-8 h-8 bg-steel-800/80 rounded-full hover:bg-steel-700 ${
              isWishlisted ? 'text-red-500' : 'text-steel-300 hover:text-yellow-400'
            }`}
            onClick={handleToggleWishlist}
          >
            <Heart className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} />
          </Button>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h4 className="font-semibold text-white mb-2 hover:text-yellow-400 transition-colors cursor-pointer">
            {product.name}
          </h4>
        </Link>
        <p className="text-steel-300 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-yellow-400">
            {formatPrice(product.price)}
          </span>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white font-medium"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </article>
  );
}
