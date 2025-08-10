"use client";

/**
 * Premium VIP Smoke Homepage - Modern E-Commerce Design
 * SEO optimized with structured data and AI search optimization
 */

import { useState, useEffect } from 'react';
import { Star, ShoppingCart, Heart, ArrowRight, Shield, Truck, Crown, Gift, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import PremiumHeader from '@/components/layout/PremiumHeader';

// SEO Hook for dynamic meta tags
const useSEO = (title: string, description: string) => {
  useEffect(() => {
    document.title = title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', description);

    // Add structured data for search engines
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "VIP Smoke",
      "description": description,
      "url": "https://vipsmoke.com",
      "logo": "https://vipsmoke.com/logo.png",
      "sameAs": [
        "https://facebook.com/vipsmoke",
        "https://instagram.com/vipsmoke",
        "https://twitter.com/vipsmoke"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "1-800-VIP-SMOKE",
        "contactType": "customer service"
      }
    };

    let script = document.querySelector('#structured-data') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = 'structured-data';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
  }, [title, description]);
};

const NewHomePage = () => {
  useSEO(
    'VIP Smoke - Premium Smoking Accessories & Glass | Free Shipping Over $75',
    'Discover premium smoking accessories, glass bongs, vaporizers, and exclusive VIP products. Free shipping on orders over $75. Age verification required (21+).'
  );

  const [currentSlide, setCurrentSlide] = useState(0);

  // Data queries
  const { data: featuredProducts = [] } = useQuery<any[]>({
    queryKey: ['/api/products', { featured: true, limit: 8 }],
  });

  const { data: newProducts = [] } = useQuery<any[]>({
    queryKey: ['/api/products', { sort: 'newest', limit: 6 }],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
  });

  // Hero slides data
  const heroSlides = [
    {
      title: 'VIP Smoke Premium Collection',
      subtitle: 'Discover the finest smoking accessories',
      description: 'Premium glass, vaporizers, and exclusive VIP products with free shipping over $75',
      image: '/api/placeholder/1200/600',
      cta: 'Shop Premium Collection',
      link: '/vip-products'
    },
    {
      title: 'New Arrivals Weekly',
      subtitle: 'Fresh products every week',
      description: 'Stay ahead with the latest smoking accessories and trending products',
      image: '/api/placeholder/1200/600',
      cta: 'Explore New Products',
      link: '/products?new=true'
    },
    {
      title: 'VIP Membership Benefits',
      subtitle: 'Save 15% on every order',
      description: 'Join VIP and unlock exclusive deals, early access, and premium rewards',
      image: '/api/placeholder/1200/600',
      cta: 'Become VIP Member',
      link: '/vip-membership'
    }
  ];

  // Auto-advance hero slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const trustFeatures = [
    {
      icon: Shield,
      title: 'Age Verified',
      description: '21+ verification required for all purchases'
    },
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Orders over $75 ship free nationwide'
    },
    {
      icon: Crown,
      title: 'VIP Rewards',
      description: 'Exclusive deals and early access for members'
    },
    {
      icon: Gift,
      title: 'Quality Guarantee',
      description: 'Premium products with satisfaction guarantee'
    }
  ];

  const topCategories = [
    {
      name: 'Glass Bongs',
      image: '/api/placeholder/300/300',
      productCount: '500+',
      href: '/category/glass-bongs'
    },
    {
      name: 'Vaporizers',
      image: '/api/placeholder/300/300',
      productCount: '200+',
      href: '/category/vaporizers'
    },
    {
      name: 'Pipes',
      image: '/api/placeholder/300/300',
      productCount: '300+',
      href: '/category/pipes'
    },
    {
      name: 'Accessories',
      image: '/api/placeholder/300/300',
      productCount: '1000+',
      href: '/category/accessories'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PremiumHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="relative h-[600px] flex items-center">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="container mx-auto px-4 h-full flex items-center">
                <div className="grid lg:grid-cols-2 gap-8 items-center w-full">
                  <div className="space-y-6 fade-in">
                    <Badge className="badge-gold">
                      <Crown className="w-4 h-4 mr-1" />
                      VIP Exclusive
                    </Badge>
                    <h1 className="heading-premium text-gray-900">
                      {slide.title}
                    </h1>
                    <h2 className="heading-section text-gray-700">
                      {slide.subtitle}
                    </h2>
                    <p className="text-premium max-w-lg">
                      {slide.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href={slide.link}>
                        <Button size="lg" className="btn-primary">
                          {slide.cta}
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </Link>
                      <Link href="/products">
                        <Button variant="outline" size="lg" className="btn-outline">
                          Browse All Products
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-auto rounded-xl shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Slider Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustFeatures.map((feature, index) => (
              <div key={index} className="text-center slide-up">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="heading-section mb-4">Shop by Category</h2>
            <p className="text-premium max-w-2xl mx-auto">
              Explore our curated collections of premium smoking accessories
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topCategories.map((category, index) => (
              <Link key={index} href={category.href}>
                <Card className="card-hover group">
                  <CardContent className="p-0">
                    <div className="aspect-square overflow-hidden rounded-t-xl">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="product-image"
                      />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                      <p className="text-muted-foreground">{category.productCount} products</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="heading-section mb-4">Featured Products</h2>
              <p className="text-premium">Hand-picked premium accessories</p>
            </div>
            <Link href="/products?featured=true">
              <Button variant="outline" className="btn-outline">
                View All Featured
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="product-grid">
            {featuredProducts.slice(0, 8).map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="heading-section mb-4">New Arrivals</h2>
              <p className="text-premium">Latest additions to our collection</p>
            </div>
            <Link href="/products?new=true">
              <Button variant="outline" className="btn-outline">
                View All New
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newProducts.slice(0, 6).map((product: any) => (
              <ProductCard key={product.id} product={product} showNewBadge />
            ))}
          </div>
        </div>
      </section>

      {/* VIP Membership CTA */}
      <section className="py-16 bg-gradient-premium text-white">
        <div className="container mx-auto px-4 text-center">
          <Crown className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
          <h2 className="heading-section text-white mb-4">Join VIP Smoke Elite</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Get exclusive access to limited products, 15% off all orders, and early access to sales
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/vip-membership">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                <Crown className="mr-2 w-5 h-5" />
                Become VIP Member
              </Button>
            </Link>
            <Link href="/vip-benefits">
              <Button size="lg" variant="ghost" className="text-white border-white hover:bg-white/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof & Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50,000+</div>
              <p className="text-muted-foreground">Happy Customers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
              <p className="text-muted-foreground">Products Available</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">99.5%</div>
              <p className="text-muted-foreground">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-xl p-8 text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">Stay Updated</h3>
            <p className="text-muted-foreground mb-6">
              Get exclusive deals, new product alerts, and VIP member benefits
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="input-premium flex-1"
              />
              <Button className="btn-primary">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, showNewBadge = false }: { product: any; showNewBadge?: boolean }) => {
  return (
    <Card className="product-card">
      <CardContent className="p-0">
        <div className="relative">
          <div className="aspect-square overflow-hidden rounded-t-xl">
            <img
              src={product.imageUrl || '/api/placeholder/300/300'}
              alt={product.name}
              className="product-image"
            />
          </div>
          {showNewBadge && (
            <Badge className="badge-new absolute top-2 left-2">New</Badge>
          )}
          {product.isVipExclusive && (
            <Badge className="badge-gold absolute top-2 right-2">
              <Crown className="w-3 h-3 mr-1" />
              VIP
            </Badge>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
          <div className="flex items-center mb-2">
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
            <span className="text-xs text-muted-foreground ml-1">(24)</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-lg">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <Button size="sm" className="btn-primary">
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewHomePage;