import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Star, Heart, ShoppingCart, Share2, Shield, Truck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import Breadcrumb from "@/components/Breadcrumb";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  createProductSchema, 
  createBreadcrumbSchema, 
  createOrganizationSchema 
} from "@/utils/structuredData";
import type { Product, Brand, Category } from "@shared/schema";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Fetch product data
  const { data: product, isLoading: productLoading, error: productError } = useQuery<Product>({
    queryKey: ["/api/products", id],
    enabled: !!id
  });

  // Fetch brand data
  const { data: brand } = useQuery<Brand>({
    queryKey: ["/api/brands", product?.brandId],
    enabled: !!product?.brandId
  });

  // Fetch category data
  const { data: category } = useQuery<Category>({
    queryKey: ["/api/categories", product?.categoryId],
    enabled: !!product?.categoryId
  });

  // Handle 404 or loading states
  if (productLoading) {
    return (
      <div className="bg-steel-900 text-white min-h-screen">
        <Header onCartToggle={() => setCartOpen(!cartOpen)} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-steel-700 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-steel-700 rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-steel-700 rounded w-3/4"></div>
                <div className="h-6 bg-steel-700 rounded w-1/2"></div>
                <div className="h-16 bg-steel-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="bg-steel-900 text-white min-h-screen">
        <Header onCartToggle={() => setCartOpen(!cartOpen)} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-steel-300 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/")}>Return to Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Mock product images for demonstration
  const productImages = [
    product.imageUrl || "https://via.placeholder.com/600x600",
    "https://via.placeholder.com/600x600?text=Angle+2",
    "https://via.placeholder.com/600x600?text=Angle+3",
    "https://via.placeholder.com/600x600?text=Detail"
  ];

  // Create breadcrumb items
  const breadcrumbItems = [
    { name: "Products", href: "/products" },
    ...(category ? [{ name: category.name, href: `/category/${category.id}` }] : []),
    { name: product.name, current: true }
  ];

  // Create structured data
  const structuredData = [
    createOrganizationSchema(),
    createProductSchema(product, brand),
    createBreadcrumbSchema(breadcrumbItems.map(item => ({
      name: item.name,
      url: item.href ? `https://vipsmoke.com${item.href}` : undefined
    })))
  ];

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart",
      description: `${quantity} x ${product.name} added to your cart.`,
    });
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      description: `${product.name} ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description || `Check out this ${product.name} at VIP Smoke`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Product link copied to clipboard.",
      });
    }
  };

  // Generate SEO title and description
  const seoTitle = `${product.name} - ${brand?.name || "VIP Smoke"} | Premium Smoking Accessories`;
  const seoDescription = product.description || `Shop ${product.name} from ${brand?.name || "VIP Smoke"}. Premium smoking accessories with fast shipping. Age verification required - 21+ only.`;
  const seoKeywords = [
    product.name.toLowerCase(),
    brand?.name.toLowerCase(),
    category?.name.toLowerCase(),
    product.material?.toLowerCase(),
    "smoking accessories",
    "paraphernalia",
    "premium smoking",
    "vip smoke",
    "21+"
  ].filter(Boolean).join(", ");

  return (
    <div className="bg-steel-900 text-white min-h-screen">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        ogImage={product.imageUrl}
        canonical={`https://vipsmoke.com/product/${product.id}`}
        structuredData={structuredData}
      />
      
      <Header onCartToggle={() => setCartOpen(!cartOpen)} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} className="mb-8" />
        
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-xl bg-steel-800">
              <img
                src={productImages[selectedImage]}
                alt={`${product.name} - Main product image`}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-yellow-400' : 'border-steel-700 hover:border-steel-500'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} - View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Title and Brand */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
              {brand && (
                <p className="text-lg text-yellow-400 font-medium">by {brand.name}</p>
              )}
            </div>

            {/* Price and Availability */}
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-yellow-400">
                {formatPrice(product.price)}
              </div>
              <div className="flex items-center space-x-2">
                {product.inStock ? (
                  <Badge variant="secondary" className="bg-green-600 text-white">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
                {product.vipExclusive && (
                  <Badge className="bg-yellow-500 text-steel-900">
                    VIP Exclusive
                  </Badge>
                )}
                {product.featured && (
                  <Badge className="bg-red-600 text-white">
                    Best Seller
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Description */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Product Description</h2>
              <p className="text-steel-300 leading-relaxed">
                {product.description || "Experience premium quality with this exceptional smoking accessory. Crafted with attention to detail and designed for the discerning connoisseur."}
              </p>
            </div>

            {/* Material and Category */}
            <div className="grid grid-cols-2 gap-4">
              {product.material && (
                <div>
                  <h3 className="font-semibold text-white mb-1">Material</h3>
                  <p className="text-steel-300">{product.material}</p>
                </div>
              )}
              {category && (
                <div>
                  <h3 className="font-semibold text-white mb-1">Category</h3>
                  <p className="text-steel-300">{category.name}</p>
                </div>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label htmlFor="quantity" className="font-medium">Quantity:</label>
                <div className="flex items-center border border-steel-600 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-steel-700 transition-colors"
                  >
                    -
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 px-3 py-2 bg-transparent text-center border-none focus:outline-none"
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-steel-700 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleToggleWishlist}
                  variant="outline"
                  className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-steel-900"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="border-steel-600 text-steel-300 hover:bg-steel-700"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-steel-700">
              <div className="text-center">
                <Shield className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-sm text-steel-300">Secure Payment</p>
              </div>
              <div className="text-center">
                <Truck className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-sm text-steel-300">Fast Shipping</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-sm text-steel-300">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-steel-800">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-8">
              <div className="bg-steel-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Product Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-white mb-2">Specifications</h4>
                      <ul className="text-steel-300 space-y-1">
                        <li>• Premium quality construction</li>
                        <li>• Durable materials</li>
                        <li>• Professional craftsmanship</li>
                        <li>• Age verification required (21+)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-2">Care Instructions</h4>
                      <ul className="text-steel-300 space-y-1">
                        <li>• Clean regularly for optimal performance</li>
                        <li>• Use appropriate cleaning solutions</li>
                        <li>• Store in a safe, dry place</li>
                        <li>• Handle with care</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-8">
              <div className="bg-steel-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-white mb-2">Shipping Options</h4>
                    <ul className="text-steel-300 space-y-1">
                      <li>• Standard Shipping: 5-7 business days</li>
                      <li>• Express Shipping: 2-3 business days</li>
                      <li>• Overnight Shipping: Next business day</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">Important Notes</h4>
                    <ul className="text-steel-300 space-y-1">
                      <li>• Age verification required upon delivery</li>
                      <li>• Some restrictions may apply by location</li>
                      <li>• Discrete packaging available</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-8">
              <div className="bg-steel-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
                <div className="text-center py-8">
                  <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                  <p className="text-steel-300 mb-4">No reviews yet. Be the first to review this product!</p>
                  <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-steel-900">
                    Write a Review
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}