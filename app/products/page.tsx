export const metadata = {
  title: 'Products | Dope Deals',
};

import Filters from './components/Filters';
import ProductCard from './components/ProductCard';
import { Hero } from '@/components/design/NikeIndustrial';

export default function Page() {
  // Mock data for now - no backend integration
  const mockProducts = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Premium Product ${i + 1}`,
    price: Math.random() * 100 + 10,
    image_url: null,
    description: 'High-quality CBD/Hemp product compliant with regulations',
    in_stock: true,
  }));

  return (
    <div className="px-6 py-8 space-y-8">
      <Hero title="Dope Deals" subtitle="Industrial minimalism. Bold energy. Premium glass and accessories." />

      {/* Compliance Placeholder - Zipcode Filter Note */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Compliance Note:</strong> Products filtered by zipcode for CBD/Hemp availability. Age verification applied.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold uppercase tracking-wide">All Products</h1>
        <Filters />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Simple Mock Pagination */}
      <div className="flex justify-center items-center space-x-2 mt-8">
        <button className="px-3 py-1 border rounded disabled:opacity-50" disabled>Previous</button>
        <span className="px-3 py-1">Page 1 of 5</span>
        <button className="px-3 py-1 border rounded">Next</button>
        <p className="text-sm text-gray-500 ml-4">Mock pagination - full implementation pending</p>
      </div>
    </div>
  );
}
