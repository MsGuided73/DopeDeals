"use client";

/**
 * Premium Products Page - Modern E-Commerce Design
 * SEO optimized with comprehensive filtering and AI search optimization
 */

import { useState, useEffect } from 'react';
import { Filter, Search, Grid, List, Star, Heart, ShoppingCart, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import PremiumHeader from '@/components/layout/PremiumHeader';
import SEOHead from '@/components/SEO/SEOHead';
import AISearchOptimization from '@/components/SEO/AISearchOptimization';

const NewProductsPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    brand: '',
    priceRange: [0, 1000],
    materials: [] as string[],
    features: [] as string[],
    sortBy: 'newest'
  });

  // Data queries
  const { data: products = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/products', filters],
  });

  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ['/api/categories'],
  });

  const { data: brands = [] } = useQuery<any[]>({
    queryKey: ['/api/brands'],
  });

  const materials = ['Glass', 'Silicone', 'Metal', 'Ceramic', 'Wood', 'Acrylic'];
  const features = ['Percolator', 'Ice Catcher', 'Carb Cap', 'Diffused Downstem', 'Recycler', 'Splash Guard'];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      brand: '',
      priceRange: [0, 1000],
      materials: [],
      features: [],
      sortBy: 'newest'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Premium Smoking Accessories & Glass Bongs | VIP Smoke Products"
        description="Discover our complete collection of premium smoking accessories, glass bongs, vaporizers, and exclusive VIP products. Free shipping over $75. Age verification required."
        keywords="smoking accessories, glass bongs, vaporizers, pipes, premium glass, VIP exclusive"
        type="website"
      />

      <AISearchOptimization
        pageType="category"
        content={{
          primaryKeywords: ['smoking accessories', 'glass bongs', 'vaporizers', 'premium glass'],
          secondaryKeywords: ['pipes', 'dab rigs', 'water pipes', 'smoking gear'],
          entities: ['VIP Smoke', 'glass bongs', 'vaporizers', 'smoking accessories'],
          context: 'Complete catalog of premium smoking accessories including glass bongs, vaporizers, pipes, and exclusive VIP products with age verification and free shipping.',
          intent: 'transactional'
        }}
      />

      <PremiumHeader />

      {/* Breadcrumb */}
      <nav className="border-b bg-gray-50" aria-label="Breadcrumb">
        <div className="container mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link href="/" className="text-muted-foreground hover:text-primary">Home</Link></li>
            <li className="text-muted-foreground">/</li>
            <li className="font-medium">Products</li>
          </ol>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>

              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Search Products</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Brand */}
              <div className="space-y-2">
                <Label>Brand</Label>
                <Select value={filters.brand} onValueChange={(value) => handleFilterChange('brand', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Brands</SelectItem>
                    {brands.map((brand: any) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <Label>Price Range</Label>
                <div className="px-3">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => handleFilterChange('priceRange', value)}
                    max={1000}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Materials */}
              <div className="space-y-3">
                <Label>Materials</Label>
                <div className="space-y-2">
                  {materials.map((material) => (
                    <div key={material} className="flex items-center space-x-2">
                      <Checkbox
                        id={material}
                        checked={filters.materials.includes(material)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleFilterChange('materials', [...filters.materials, material]);
                          } else {
                            handleFilterChange('materials', filters.materials.filter(m => m !== material));
                          }
                        }}
                      />
                      <Label htmlFor={material} className="text-sm">{material}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <Label>Features</Label>
                <div className="space-y-2">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature}
                        checked={filters.features.includes(feature)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleFilterChange('features', [...filters.features, feature]);
                          } else {
                            handleFilterChange('features', filters.features.filter(f => f !== feature));
                          }
                        }}
                      />
                      <Label htmlFor={feature} className="text-sm">{feature}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Premium Smoking Accessories</h1>
                <p className="text-muted-foreground">
                  {products.length} products found
                </p>
              </div>

              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                {/* Mobile Filter Button */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>

                {/* Sort */}
                <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.search || filters.category || filters.brand || filters.materials.length > 0 || filters.features.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.search && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {filters.search}
                    <button onClick={() => handleFilterChange('search', '')}>×</button>
                  </Badge>
                )}
                {filters.materials.map((material) => (
                  <Badge key={material} variant="secondary" className="gap-1">
                    {material}
                    <button onClick={() => handleFilterChange('materials', filters.materials.filter(m => m !== material))}>×</button>
                  </Badge>
                ))}
                {filters.features.map((feature) => (
                  <Badge key={feature} variant="secondary" className="gap-1">
                    {feature}
                    <button onClick={() => handleFilterChange('features', filters.features.filter(f => f !== feature))}>×</button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Products Grid/List */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="product-grid">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product: any) => (
                  <ProductListItem key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {products.length > 0 && (
              <div className="flex justify-center mt-12">
                <div className="flex space-x-2">
                  <Button variant="outline" disabled>Previous</Button>
                  <Button variant="default">1</Button>
                  <Button variant="outline">2</Button>
                  <Button variant="outline">3</Button>
                  <Button variant="outline">Next</Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product }: { product: any }) => {
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

          {product.isNew && (
            <Badge className="badge-new absolute top-2 left-2">New</Badge>
          )}

          {product.isVipExclusive && (
            <Badge className="badge-gold absolute top-2 right-2">VIP</Badge>
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

// Product List Item Component
const ProductListItem = ({ product }: { product: any }) => {
  return (
    <Card className="card-hover">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-24 h-24 flex-shrink-0">
            <img
              src={product.imageUrl || '/api/placeholder/100/100'}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground ml-1">(24 reviews)</span>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center space-x-1 mb-2">
                  <span className="font-semibold text-xl">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button size="icon" variant="outline">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button className="btn-primary">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewProductsPage;