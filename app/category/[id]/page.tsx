// app/category/[id]/page.tsx
import ProductCard from '../../products/components/ProductCard';
import { Hero } from '../../components/design/NikeIndustrial';
import { supabaseServer } from '../../../lib/supabase-server';

// Render at request time to avoid prerender pitfalls
export const dynamic = 'force-dynamic';
// Optional: export const revalidate = 0;

export async function generateMetadata(
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { data: category } = await supabaseServer
    .from('categories')
    .select('name')
    .eq('slug', id)
    .single();

  return { title: `${category?.name || 'Category'} | Dope Deals` };
}

export default async function CategoryPage(
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = supabaseServer;

  // Fetch category info
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', id)
    .single();

  if (!category) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Category not found.</p>
      </div>
    );
  }

  // Fetch products for this category
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', category.id);

  return (
    <div className="px-6 py-8 space-y-8">
      <Hero title={category.name} subtitle={category.description} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products?.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}