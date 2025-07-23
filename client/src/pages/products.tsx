import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter, Grid, List, SlidersHorizontal, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import ProductCard from "@/components/ProductCard";
import SEOHead from "@/components/SEOHead";
import Breadcrumb from "@/components/Breadcrumb";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  createBreadcrumbSchema, 
  createOrganizationSchema,
  createOfferCatalogSchema 
} from "@/utils/structuredData";
import type { Product, Category, Brand } from "@shared/schema";

export default function ProductsPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch all products
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"]
  });

  // Fetch categories and brands for filters
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"]
  });

  const { data: brands } = useQuery<Brand[]>({
    queryKey: ["/api/brands"]
  });

  // Handle loading state
  if (productsLoading) {
    return (
      <div className="bg-steel-900 text-white min-h-screen">
        <Header onCartToggle={() => setCartOpen(!cartOpen)} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-steel-700 rounded w-64 mb-8"></div>
            <div className="h-8 bg-steel-700 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-steel-700 rounded w-3/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="bg-steel-800 rounded-xl p-4">
                  <div className="aspect-square bg-steel-700 rounded-lg mb-4"></div>
                  <div className="h-4 bg-steel-700 rounded mb-2"></div>
                  <div className="h-3 bg-steel-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Filter and sort products
  const filteredProducts = products?.filter(product => {
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = parseFloat(product.price) >= priceRange[0] && parseFloat(product.price) <= priceRange[1];
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
    const matchesBrand = !selectedBrand || product.brandId === selectedBrand;
    const matchesMaterial = !selectedMaterial || product.material === selectedMaterial;
    
    return matchesSearch && matchesPrice && matchesCategory && matchesBrand && matchesMaterial;
  }) || [];

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-high':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'newest':
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      case 'featured':
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  // Get unique materials from products
  const uniqueMaterials = Array.from(new Set(products?.map(p => p.material).filter(Boolean) || []));

  // Create breadcrumb items
  const breadcrumbItems = [
    { name: "Products", current: true }
  ];

  // Create structured data
  const structuredData = [
    createOrganizationSchema(),
    createBreadcrumbSchema([{ name: "Products", url: "https://vipsmoke.com/products" }]),
    ...(sortedProducts.length > 0 ? [createOfferCatalogSchema(sortedProducts.slice(0, 20))] : [])
  ];

  // SEO data
  const seoTitle = "Premium Smoking Accessories & Paraphernalia | VIP Smoke";
  const seoDescription = "Shop our complete collection of premium smoking accessories, glass pipes, water pipes, vaporizers, and paraphernalia. High-quality products with fast shipping. Age verification required - 21+ only.";
  const seoKeywords = "smoking accessories, glass pipes, water pipes, vaporizers, paraphernalia, premium smoking, bongs, dab rigs, grinders, CBD accessories, luxury smoking, VIP smoke, 21+";

  return (
    <div className="bg-steel-900 text-white min-h-screen">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonical="https://vipsmoke.com/products"
        structuredData={structuredData}
      />
      
      <Header onCartToggle={() => setCartOpen(!cartOpen)} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} className="mb-8" />
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Premium Smoking Accessories</h1>
          <p className="text-xl text-steel-300 mb-6">
            Discover our complete collection of premium smoking accessories, carefully curated for the discerning connoisseur.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400 w-5 h-5" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-steel-800 border-steel-600 text-white placeholder-steel-400"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              <p className="text-steel-400">
                {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} found
              </p>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-steel-600 text-steel-300 hover:bg-steel-700"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="p-2"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="p-2"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-8 bg-steel-800 border-steel-700">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-steel-700 border-steel-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-steel-700 border-steel-600">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories?.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Brand Filter */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Brand</label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger className="bg-steel-700 border-steel-600">
                      <SelectValue placeholder="All Brands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Brands</SelectItem>
                      {brands?.map(brand => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Material Filter */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Material</label>
                  <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                    <SelectTrigger className="bg-steel-700 border-steel-600">
                      <SelectValue placeholder="All Materials" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Materials</SelectItem>
                      {uniqueMaterials.map(material => (
                        <SelectItem key={material} value={material}>
                          {material}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={1000}
                    step={10}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-6 pt-6 border-t border-steel-700">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedBrand('');
                    setSelectedMaterial('');
                    setPriceRange([0, 1000]);
                    setSearchQuery('');
                    setSortBy('featured');
                  }}
                  className="border-steel-600 text-steel-300 hover:bg-steel-700"
                >
                  Clear All Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Filter className="w-16 h-16 text-steel-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
            <p className="text-steel-300 mb-6">
              Try adjusting your filters or search terms.
            </p>
            <Button
              onClick={() => {
                setSelectedCategory('');
                setSelectedBrand('');
                setSelectedMaterial('');
                setPriceRange([0, 1000]);
                setSearchQuery('');
                setSortBy('featured');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}