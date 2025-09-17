'use client';

export default function PipesHero() {
  return (
    <div className="bg-gradient-to-r from-dope-orange-500 to-dope-orange-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Premium Glass Pipes & Hand Pipes
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-orange-100">
            Discover our curated collection of high-quality glass pipes, spoon pipes, chillums, and more
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              ✨ Premium Borosilicate Glass
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              🚚 Free Shipping Over $50
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              🔒 Discreet Packaging
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              ⭐ Top Rated Products
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
