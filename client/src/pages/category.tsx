import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
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

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch category data
  const { data: category, isLoading: categoryLoading, error: categoryError } = useQuery<Category>({
    queryKey: ["/api/categories", id],
    enabled: !!id
  });

  // Fetch products for this category
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { 
      categoryId: id,
      brandId: selectedBrand || undefined,
      material: selectedMaterial || undefined,
      priceMin: priceRange[0],
      priceMax: priceRange[1]
    }],
    enabled: !!id
  });

  // Fetch all brands for filter
  const { data: brands } = useQuery<Brand[]>({
    queryKey: ["/api/brands"]
  });

  // Handle loading state
  if (categoryLoading || productsLoading) {
    return (
      <div className="bg-steel-900 text-white min-h-screen">
        <Header onCartToggle={() => setCartOpen(!cartOpen)} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-steel-700 rounded w-64 mb-8"></div>
            <div className="h-8 bg-steel-700 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-steel-700 rounded w-3/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
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

  // Handle 404 or error state
  if (categoryError || !category) {
    return (
      <div className="bg-steel-900 text-white min-h-screen">
        <Header onCartToggle={() => setCartOpen(!cartOpen)} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
          <p className="text-steel-300 mb-8">The category you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/")}>Return to Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Filter and sort products
  const filteredProducts = products?.filter(product => {
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesBrand = !selectedBrand || product.brandId === selectedBrand;
    const matchesMaterial = !selectedMaterial || product.material === selectedMaterial;
    return matchesPrice && matchesBrand && matchesMaterial;
  }) || [];

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'featured':
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  // Get unique materials from products
  const uniqueMaterials = [...new Set(products?.map(p => p.material).filter(Boolean))];

  // Create breadcrumb items
  const breadcrumbItems = [
    { name: "Categories", href: "/categories" },
    { name: category.name, current: true }
  ];

  // Create structured data
  const structuredData = [
    createOrganizationSchema(),
    createBreadcrumbSchema(breadcrumbItems.map(item => ({
      name: item.name,
      url: item.href ? `https://vipsmoke.com${item.href}` : undefined
    }))),
    ...(sortedProducts.length > 0 ? [createOfferCatalogSchema(sortedProducts.slice(0, 20))] : [])
  ];

  // SEO data
  const seoTitle = `${category.name} - Premium Smoking Accessories | VIP Smoke`;
  const seoDescription = category.description || `Shop our premium ${category.name.toLowerCase()} collection. High-quality smoking accessories with fast shipping. Age verification required - 21+ only.`;
  const seoKeywords = [
    category.name.toLowerCase(),
    "smoking accessories",
    "paraphernalia",
    "premium smoking",
    "vip smoke",
    "21+",
    ...uniqueMaterials.map(m => m.toLowerCase())
  ].join(", ");

  return (
    <div className="bg-steel-900 text-white min-h-screen">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonical={`https://vipsmoke.com/category/${category.id}`}
        structuredData={structuredData}
      />
      
      <Header onCartToggle={() => setCartOpen(!cartOpen)} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} className="mb-8" />
        
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">{category.name}</h1>
          <p className="text-xl text-steel-300 mb-6">
            {category.description || `Discover our premium ${category.name.toLowerCase()} collection, carefully curated for the discerning connoisseur.`}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-steel-400">
              {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} found
            </p>
            <div className="flex items-center space-x-4">
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-steel-700 border-steel-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
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
              Try adjusting your filters or browse our other categories.
            </p>
            <Button onClick={() => navigate("/")}>Browse All Products</Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}