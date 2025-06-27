import { useQuery } from "@tanstack/react-query";
import type { Category } from "@shared/schema";

export default function FeaturedCategories() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-steel-800">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-serif font-bold text-yellow-400 text-center mb-12">Featured Categories</h3>
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
    "Glass Pipes": "https://pixabay.com/get/g0c8d30604c27667e03fc9ab28d250adb1d740d69769a235f1de3850cae10936da5135771869d62aec70c5ea83106c85b8c9f93e9a6638649b384d56fffe90309_1280.jpg",
    "Water Pipes": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    "Vaporizers": "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    "Accessories": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
  };

  return (
    <section className="py-16 bg-steel-800">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-serif font-bold text-yellow-400 text-center mb-12">Featured Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories?.map((category) => (
            <div key={category.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-xl bg-steel-700 aspect-square mb-4">
                <img
                  src={categoryImages[category.name as keyof typeof categoryImages]}
                  alt={`${category.name} collection`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/40 transition-colors"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="text-xl font-semibold text-white mb-2">{category.name}</h4>
                  <p className="text-steel-300 text-sm">{category.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
