import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { Category } from "@shared/schema";
import waterBongImage from "@assets/image_1752544102455.png";
import glassPipesImage from "@assets/image_1752544509252.png";

export default function FeaturedCategories() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-steel-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-yellow-400 text-center mb-12">Featured Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-steel-700 aspect-square rounded-xl mb-4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const categoryImages = {
    "Glass Pipes": glassPipesImage,
    "Water Pipes": "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "Vaporizers": waterBongImage,
    "Accessories": "https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  };

  return (
    <section className="py-16 bg-steel-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-serif font-bold text-yellow-400 text-center mb-12">Featured Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories?.map((category) => (
            <Link key={category.id} href={`/category/${category.id}`}>
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl bg-steel-700 aspect-square mb-4">
                  <img
                    src={categoryImages[category.name as keyof typeof categoryImages]}
                    alt={`${category.name} collection`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/40 transition-colors"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
                    <p className="text-steel-300 text-sm">{category.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
