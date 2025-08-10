"use client";

/**
 * Premium Product Detail Page - Modern E-Commerce Design
 * SEO optimized with rich product information and AI search optimization
 */

import { useState, useEffect } from 'react';
import { Star, Heart, ShoppingCart, Share2, Shield, Truck, Crown, Plus, Minus, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import PremiumHeader from '@/components/layout/PremiumHeader';
import SEOHead from '@/components/SEO/SEOHead';
import AISearchOptimization from '@/components/SEO/AISearchOptimization';

interface ProductDetailPageProps {
  productId: string;
}

const NewProductDetailPage = ({ productId }: ProductDetailPageProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('');

  // Product data query
  const { data: product, isLoading } = useQuery<any>({
    queryKey: ['/api/products', productId],
  });

  // Related products query
  const { data: relatedProducts = [] } = useQuery<any[]>({
    queryKey: ['/api/products/related', productId],
  });

  // Reviews query
  const { data: reviews = [] } = useQuery<any[]>({
    queryKey: ['/api/products', productId, 'reviews'],
  });

  if (isLoading || !product) {
    return <ProductDetailSkeleton />;
  }

  const images = product.images || [product.imageUrl || '/api/placeholder/600/600'];
  const specifications = product.specifications || {};
  const features = product.features || [];

  const averageRating = 4.5; // Calculate from reviews
  const reviewCount = reviews.length || 24;

  const handleAddToCart = () => {
    // Add to cart logic
    console.log('Adding to cart:', { productId, quantity, variant: selectedVariant });
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${product.name} - Premium Smoking Accessories | VIP Smoke`}
        description={`${product.description} Premium quality with free shipping over $75. Age verification required (21+).`}
        keywords={`${product.name}, ${product.brand}, smoking accessories, premium glass, VIP exclusive`}
        type="product"
        product={{
          price: product.price,
          currency: 'USD',
          availability: product.inStock ? 'InStock' : 'OutOfStock',
          brand: product.brand,
          category: product.category?.name
        }}
        image={product.imageUrl}
      />

      <AISearchOptimization
        pageType="product"
        content={{
          primaryKeywords: [product.name, product.brand, product.category?.name].filter(Boolean),
          secondaryKeywords: ['smoking accessories', 'premium glass', 'VIP exclusive'],
          entities: ['VIP Smoke', product.brand, product.name],
          context: `${product.name} is a premium ${product.category?.name} by ${product.brand}. ${product.description}`,
          intent: 'transactional'
        }}
        product={{
          name: product.name,
          description: product.description,
          specifications,
          benefits: features,
          useCases: [`Perfect for ${product.category?.name}`, 'Premium smoking experience', 'VIP member benefits']
        }}
      />

      <PremiumHeader />

      {/* Breadcrumb */}
      <nav className="border-b bg-gray-50" aria-label="Breadcrumb">
        <div className="container mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link href="/" className="text-muted-foreground hover:text-primary">Home</Link></li>
            <li className="text-muted-foreground">/</li>
            <li><Link href="/products" className="text-muted-foreground hover:text-primary">Products</Link></li>
            <li className="text-muted-foreground">/</li>
            <li><Link href={`/category/${product.category?.slug}`} className="text-muted-foreground hover:text-primary">{product.category?.name}</Link></li>
            <li className="text-muted-foreground">/</li>
            <li className="font-medium truncate">{product.name}</li>
          </ol>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />

              {product.isNew && (
                <Badge className="badge-new absolute top-4 left-4">New Arrival</Badge>
              )}

              {product.isVipExclusive && (
                <Badge className="badge-gold absolute top-4 right-4">
                  <Crown className="w-4 h-4 mr-1" />
                  VIP Exclusive
                </Badge>
              )}

              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{product.category?.name}</Badge>
                {product.brand && <Badge variant="outline">{product.brand}</Badge>}
              </div>

              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {averageRating} out of 5 ({reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                )}
                {product.originalPrice && (
                  <Badge className="badge-sale">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </Badge>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`font-medium ${product.inStock ? 'text-green-700' : 'text-red-700'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
                {product.inStock && product.quantity && (
                  <span className="text-muted-foreground">
                    ({product.quantity} available)
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                <Label>Variant</Label>
                <div className="grid grid-cols-3 gap-2">
                  {product.variants.map((variant: any) => (
                    <Button
                      key={variant.id}
                      variant={selectedVariant === variant.id ? 'default' : 'outline'}
                      className="h-auto p-3"
                      onClick={() => setSelectedVariant(variant.id)}
                    >
                      <div className="text-center">
                        <div className="font-medium">{variant.name}</div>
                        <div className="text-sm text-muted-foreground">${variant.price}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-2">
              <Label>Quantity</Label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center border-0 focus-visible:ring-0"
                    min="1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  Total: ${(product.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1 btn-primary"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button size="lg" variant="outline">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {product.isVipExclusive && (
                <Card className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
                  <div className="flex items-center gap-3">
                    <Crown className="w-8 h-8 text-yellow-600" />
                    <div>
                      <h3 className="font-semibold text-yellow-800">VIP Exclusive Product</h3>
                      <p className="text-sm text-yellow-700">
                        VIP members save an additional 15% on this exclusive item
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-sm font-medium">Age Verified</div>
                <div className="text-xs text-muted-foreground">21+ Required</div>
              </div>
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-sm font-medium">Free Shipping</div>
                <div className="text-xs text-muted-foreground">Orders $75+</div>
              </div>
              <div className="text-center">
                <Zap className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-sm font-medium">Fast Processing</div>
                <div className="text-xs text-muted-foreground">Ships in 1-2 days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Product Details</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviewCount})</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Product Details</h3>
                  <div className="prose max-w-none">
                    <p className="mb-4">{product.longDescription || product.description}</p>

                    {features.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Key Features:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {features.map((feature: string, index: number) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Specifications</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b">
                        <span className="font-medium">{key}:</span>
                        <span className="text-muted-foreground">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
                  <div className="space-y-6">
                    {reviews.length > 0 ? (
                      reviews.map((review: any) => (
                        <div key={review.id} className="border-b pb-4">
                          <div className="flex items-center gap-4 mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-medium">{review.name}</span>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shipping" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Shipping & Returns</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Shipping Information</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Free shipping on orders over $75</li>
                        <li>• Standard shipping: 3-5 business days</li>
                        <li>• Express shipping: 1-2 business days</li>
                        <li>• Age verification required (21+)</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Return Policy</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• 30-day return window</li>
                        <li>• Items must be unused and in original packaging</li>
                        <li>• Return shipping costs apply</li>
                        <li>• Refunds processed within 5-7 business days</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct: any) => (
                <RelatedProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Loading skeleton component
const ProductDetailSkeleton = () => (
  <div className="min-h-screen bg-background">
    <PremiumHeader />
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-xl mb-4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-12 bg-gray-200 rounded w-1/3"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

// Related product card component
const RelatedProductCard = ({ product }: { product: any }) => (
  <Link href={`/products/${product.id}`}>
    <Card className="product-card">
      <CardContent className="p-0">
        <div className="aspect-square overflow-hidden rounded-t-xl">
          <img
            src={product.imageUrl || '/api/placeholder/300/300'}
            alt={product.name}
            className="product-image"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span className="font-semibold">${product.price}</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
);

export default NewProductDetailPage;