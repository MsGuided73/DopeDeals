import Link from 'next/link';
import ProductCard from '../../products/components/ProductCard';
import { Hero } from '../../components/design/NikeIndustrial';
import { supabaseServer } from '../../lib/supabase-server';
import { findBrandByIdentifier, getBrandProducts } from '../../lib/brand-utils';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brand = await findBrandByIdentifier(id);
  return { title: `${brand?.name || 'Brand'} | Dope Deals` };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Use flexible brand matching utility
  const brand = await findBrandByIdentifier(id);

  if (!brand) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Brand not found for "{id}". Please check the URL or browse all brands.</p>
        <Link href="/brands" className="text-dope-orange hover:underline mt-2 inline-block">
          View All Brands →
        </Link>
      </div>
    );
  }

  // Get products for this brand with safety filters
  const products = await getBrandProducts(brand.id);

  return (
    <div className="px-6 py-8 space-y-8">
      <Hero title={brand.name} subtitle={brand.description || `Explore ${brand.name} products`} />
      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No products found for {brand.name}</p>
          <Link href="/products" className="text-dope-orange hover:underline">
            Browse All Products →
          </Link>
        </div>
      )}
    </div>
  );
}
