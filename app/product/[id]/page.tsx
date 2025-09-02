export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `Product ${id} | Dope Deals` };
}

import { getStorage } from '@/lib/server-storage';
import Image from 'next/image';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const storage = await getStorage();
  const p: any = await storage.getProduct(id);

  const title = p?.name ?? p?.title ?? 'Product';
  const price = Number(p?.price ?? 0);
  const img = p?.imageUrl || (Array.isArray(p?.image_urls) ? p.image_urls[0] : p?.image_url) || '/placeholder.png';

  return (
    <>
      {/* Dark band header */}
      <section className="bg-brand-dark text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">{title}</h1>
          {p?.description && <p className="mt-2 text-white/80">{p.description}</p>}
        </div>
      </section>

      {/* Light detail section */}
      <section className="bg-[#F5F5F4]">
        <div className="mx-auto max-w-7xl px-6 py-10 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl overflow-hidden bg-white shadow-lift">
            <div className="relative aspect-square">
              <Image src={img} alt={title} fill className="object-cover" />
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-lift">
            <div className="text-2xl font-bold">${price.toFixed(2)}</div>
            <div className="text-sm text-black/60 mt-1">{p?.inStock === false ? 'Out of stock' : 'In stock'}</div>
            <button className="btn-primary mt-4" disabled={p?.inStock === false}>Add to cart</button>

            {p?.material && (
              <div className="mt-6">
                <div className="font-semibold">Specifications</div>
                <ul className="text-sm text-black/70 list-disc list-inside">
                  <li>Material: {p.material}</li>
                  {p?.sku && <li>SKU: {p.sku}</li>}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

