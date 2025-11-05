'use client';

import PipesProductCard from '../../pipes/components/PipesProductCard';
import type { ThcaProduct } from '../ThcaPageContent';

interface ThcaSectionProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  products: ThcaProduct[];
}

export default function ThcaSection({ id, title, description, icon, products }: ThcaSectionProps) {
  // Transform THCA products to match PipesProductCard interface
  const transformedProducts = products.map(product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    image_url: product.image_url,
    brand: product.brand,
    category: product.category,
    short_description: product.subcategory,
    stock_quantity: product.stock_quantity,
    compare_at_price: product.sale_price || undefined,
    featured: product.featured,
    inStock: (product.stock_quantity || 0) > 0,
    sku: product.id, // Use ID as SKU fallback
  }));

  if (products.length === 0) {
    return (
      <section id={`section-${id}`} className="py-16">
        <div className="text-center">
          <div className="text-6xl mb-4">{icon}</div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            {description}
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
            <div className="text-4xl mb-4">🚧</div>
            <p className="text-gray-500 dark:text-gray-400">
              No products available in this category yet.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={`section-${id}`} className="py-16">
      <div className="mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="text-4xl mr-4">{icon}</div>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {description}
            </p>
          </div>
        </div>
        <div className="text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
            {products.length} product{products.length !== 1 ? 's' : ''} available
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {transformedProducts.map((product) => (
          <PipesProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

      {/* Load more button if needed (for future pagination) */}
      {products.length >= 24 && (
        <div className="text-center mt-12">
          <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200">
            Load More {title.toLowerCase()}
          </button>
        </div>
      )}
    </section>
  );
}
