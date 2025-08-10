import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Category, Product } from "@shared/schema";

export default function ModernCategories() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const categoryData = [
    {
      id: "glass-pipes",
      name: "Glass Pipes",
      description: "Handcrafted artisan glass pieces",
      emoji: "🔥",
      gradient: "from-orange-400 to-red-500",
      bgGradient: "from-orange-500/20 to-red-500/20",
      count: products?.filter(p => p.categoryId === categories?.find(c => c.slug === "glass-pipes")?.id).length || 0
    },
    {
      id: "glass-bongs",
      name: "Water Pipes",
      description: "Premium glass water pipes",
      emoji: "💎",
      gradient: "from-blue-400 to-cyan-500",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      count: products?.filter(p => p.categoryId === categories?.find(c => c.slug === "glass-bongs")?.id).length || 0
    },
    {
      id: "dab-rigs",
      name: "Dab Rigs",
      description: "Concentrate devices & rigs",
      emoji: "⚡",
      gradient: "from-purple-400 to-indigo-500",
      bgGradient: "from-purple-500/20 to-indigo-500/20",
      count: products?.filter(p => p.categoryId === categories?.find(c => c.slug === "dab-rigs")?.id).length || 0
    },
    {
      id: "accessories",
      name: "Accessories",
      description: "Complete your collection",
      emoji: "✨",
      gradient: "from-yellow-400 to-orange-500",
      bgGradient: "from-yellow-500/20 to-orange-500/20",
      count: products?.filter(p => p.categoryId === categories?.find(c => c.slug === "accessories")?.id).length || 0
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 px-6 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Premium Collections</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Explore Our
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent"> Categories</span>
          </h2>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Discover our curated selection of premium smoking accessories, each piece carefully selected for quality and craftsmanship.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categoryData.map((category) => (
            <div
              key={category.id}
              className="group relative"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Link href={`/products?category=${category.id}`}>
                <div className={`
                  relative overflow-hidden rounded-3xl p-8 h-80 cursor-pointer
                  transition-all duration-500 transform
                  ${hoveredCategory === category.id ? 'scale-105 -translate-y-2' : 'scale-100'}
                  bg-gradient-to-br ${category.bgGradient}
                  border border-white/10
                  shadow-2xl
                  hover:shadow-3xl
                `}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMS41Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      {/* Emoji Icon */}
                      <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        {category.emoji}
                      </div>
                      
                      {/* Category Info */}
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300">
                        {category.name}
                      </h3>
                      
                      <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        {category.description}
                      </p>
                      
                      {/* Product Count */}
                      <div className="flex items-center space-x-2 text-yellow-400 text-sm font-semibold">
                        <TrendingUp className="w-4 h-4" />
                        <span>{category.count} Products</span>
                      </div>
                    </div>
                    
                    {/* CTA Button */}
                    <div className={`
                      flex items-center justify-between p-4 rounded-2xl
                      bg-white/10 backdrop-blur-sm border border-white/20
                      group-hover:bg-white/20 transition-all duration-300
                      ${hoveredCategory === category.id ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-90'}
                    `}>
                      <span className="text-white font-medium">Explore</span>
                      <ArrowRight className={`
                        w-5 h-5 text-white transition-transform duration-300
                        ${hoveredCategory === category.id ? 'translate-x-1' : ''}
                      `} />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link href="/products">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-semibold px-12 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 group"
            >
              View All Products
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}