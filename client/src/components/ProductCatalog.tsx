import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import type { Product, Category, Brand } from "@shared/schema";

export default function ProductCatalog() {
  const [filters, setFilters] = useState({
    priceRange: [] as string[],
    materials: [] as string[],
    brands: [] as string[],
  });
  const [sortBy, setSortBy] = useState("featured");

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: brands } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  });

  const handleFilterChange = (type: keyof typeof filters, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [type]: checked
        ? [...prev[type], value]
        : prev[type].filter(item => item !== value)
    }));
  };

  if (productsLoading) {
    return (
      <section className="py-16 bg-steel-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-steel-800 rounded-xl overflow-hidden">
                  <div className="aspect-square bg-steel-700"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-steel-700 rounded"></div>
                    <div className="h-3 bg-steel-700 rounded w-3/4"></div>
                    <div className="h-4 bg-steel-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-steel-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-steel-800 rounded-xl p-6 border border-steel-700">
              <h4 className="text-lg font-semibold text-yellow-400 mb-4">Filters</h4>
              
              {/* Price Range */}
              <div className="mb-6">
                <h5 className="font-medium text-white mb-3">Price Range</h5>
                <div className="space-y-2">
                  {["Under $25", "$25 - $50", "$50 - $100", "$100+"].map((range) => (
                    <div key={range} className="flex items-center space-x-2">
                      <Checkbox
                        id={range}
                        checked={filters.priceRange.includes(range)}
                        onCheckedChange={(checked) => 
                          handleFilterChange("priceRange", range, checked as boolean)
                        }
                      />
                      <label htmlFor={range} className="text-steel-300 text-sm">
                        {range}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Material */}
              <div className="mb-6">
                <h5 className="font-medium text-white mb-3">Material</h5>
                <div className="space-y-2">
                  {["Borosilicate Glass", "Ceramic", "Metal", "Wood"].map((material) => (
                    <div key={material} className="flex items-center space-x-2">
                      <Checkbox
                        id={material}
                        checked={filters.materials.includes(material)}
                        onCheckedChange={(checked) => 
                          handleFilterChange("materials", material, checked as boolean)
                        }
                      />
                      <label htmlFor={material} className="text-steel-300 text-sm">
                        {material}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div className="mb-6">
                <h5 className="font-medium text-white mb-3">Brand</h5>
                <div className="space-y-2">
                  {brands?.map((brand) => (
                    <div key={brand.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={brand.id}
                        checked={filters.brands.includes(brand.name)}
                        onCheckedChange={(checked) => 
                          handleFilterChange("brands", brand.name, checked as boolean)
                        }
                      />
                      <label htmlFor={brand.id} className="text-steel-300 text-sm">
                        {brand.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-serif font-bold text-yellow-400">Premium Products</h3>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-steel-800 text-white border-steel-700">
                  <SelectValue placeholder="Sort by: Featured" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Sort by: Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" className="bg-steel-800 hover:bg-steel-700 text-white border-steel-700 hover:border-yellow-400 px-8 py-3">
                Load More Products
              </Button>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
