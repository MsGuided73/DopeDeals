export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `Product ${id} | Dope Deals` };
}

import { getStorage } from '@/lib/server-storage';
import ProductDetail from './ProductDetail';
import { Hero } from '@/components/design/NikeIndustrial';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const storage = await getStorage();
  const product = await storage.getProduct(id);

  return (
    <div className="px-6 py-8 space-y-8">
      <Hero title={product?.name || 'Product'} subtitle={product?.description} />
      <ProductDetail product={product} />
    </div>
  );
}

