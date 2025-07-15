import { Button } from "@/components/ui/button";
import heroImage from "@assets/image_1752541939615.png";

export default function HeroSection() {
  return (
    <section className="relative dark-gradient py-20">
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: `url(${heroImage})`
        }}
      />
      
      <div className="relative container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-serif font-bold text-yellow-400 mb-6">
            Premium Smoking Experience
          </h1>
          <p className="text-xl text-steel-300 mb-8">
            Discover our curated collection of luxury smoking accessories, handcrafted for the discerning connoisseur.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold">
              Shop Collection
            </Button>
            <Button 
              variant="outline" 
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-steel-900 px-8 py-4 text-lg font-semibold"
            >
              Join VIP Club
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
