import ProductCard from '@/app/products/components/ProductCard';
import { Hero } from '@/components/design/NikeIndustrial';
import { supabaseServer } from '@/lib/supabase-server';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: brand } = await supabaseServer
    .from('brands')
    .select('name')
    .eq('slug', id)
    .single();
  return { title: `${brand?.name || 'Brand'} | Dope Deals` };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = supabaseServer;
  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', id)
    .single();
  if (!brand) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Brand not found.</p>
      </div>
    );
  }
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('brand_id', brand.id);
  return (
    <div className="px-6 py-8 space-y-8">
      <Hero title={brand.name} subtitle={brand.description} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products?.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
