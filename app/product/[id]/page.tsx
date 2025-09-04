import ProductDetail from './ProductDetail';
import { Hero } from '@/components/design/NikeIndustrial';
import { supabaseServer } from '@/lib/supabase-server';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: product } = await supabaseServer
    .from('products')
    .select('name')
    .eq('id', id)
    .single();
  return { title: `${product?.name || 'Product'} | Dope Deals` };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: product } = await supabaseServer
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  if (!product) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Product not found.</p>
      </div>
    );
  }
  const productData = {
    ...product,
    imageUrl: (product as any).image_url,
    inStock: (product as any).in_stock,
  };
  return (
    <div className="px-6 py-8 space-y-8">
      <Hero title={productData.name} subtitle={productData.description} />
      <ProductDetail product={productData} />
    </div>
  );
}
