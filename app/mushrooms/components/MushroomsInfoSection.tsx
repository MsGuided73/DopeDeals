'use client';

export default function MushroomsInfoSection() {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Premium Mushroom Products
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover our carefully curated selection of high-quality mushroom products.
            From traditional medicinal varieties to modern extracts, we offer only the finest products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-dope-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🔬</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Lab Tested</h3>
            <p className="text-gray-600 dark:text-gray-400">
              All products are third-party lab tested for quality and purity
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-dope-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Discreet Shipping</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Plain packaging with fast, reliable delivery options
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-dope-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">⭐</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Premium Quality</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Only the highest quality mushroom products from trusted sources
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
