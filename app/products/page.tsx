export const metadata = { title: "Products | Dope City" };
import { getStorage } from '@/lib/server-storage';
import DCProductCard from '@/components/dope-city/ProductCard';
import type { Product as DCProduct } from '@/components/dope-city/types';

export default async function Page() {
  const storage = await getStorage();
  const raw = await storage.getProducts();

  // Adapt backend product shape to Dope City card type
  const products: DCProduct[] = (raw || []).map((p: any) => ({
    id: p.id,
    title: p.name ?? p.title ?? 'Product',
    price: Number(p.price ?? 0),
    image_url: p.imageUrl || (Array.isArray(p.image_urls) ? p.image_urls[0] : p.image_url) || '/placeholder.png',
    best_for: p.best_for as any,
    memberPrice: p.vip_price ? Number(p.vip_price) : null,
  }));

  return (
    <>
      {/* Dark header band */}
      <section className="bg-brand-dark text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">All Products</h1>
          <p className="mt-2 text-white/80">Curated glass and accessories. Filtered to show only in‑stock, non‑nicotine items.</p>
        </div>
      </section>

      {/* Light grid */}
      <section className="bg-[#F5F5F4]">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <DCProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

