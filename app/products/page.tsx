export const metadata = {
  title: "Products | Dope Deals",
};
import { getStorage } from '@/lib/server-storage';
import Filters from './components/Filters';
import ProductCard from './components/ProductCard';
import { Hero } from '@/components/design/NikeIndustrial';

export default async function Page() {
  const storage = await getStorage();
  const products = await storage.getProducts();
  return (
    <div className="px-6 py-8 space-y-8">
      <Hero title="Dope Deals" subtitle="Industrial minimalism. Bold energy. Premium glass and accessories." />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold uppercase tracking-wide">All Products</h1>
        <Filters />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p: any) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

