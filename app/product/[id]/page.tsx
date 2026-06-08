import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getStorage } from '../../../lib/storage';

// PDP — 5-minute ISR. When a Zoho stock webhook lands, call
// revalidatePath(`/product/${id}`) to bust the cache for that SKU on demand.
export const revalidate = 300;

// Dynamic import for client components
const EnhancedPDP = dynamic(() => import('../../components/EnhancedPDP'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  )
});

const AutosuggestRecommendations = dynamic(() => import('../../components/AutosuggestRecommendations'));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  if (id === 'test-rich-text') {
    return {
      title: `Micro Dot Mushroom Chocolate Bar | Highway 420`,
      description: 'Experience a profound shift in perception with our Micro Dot Mushroom Chocolate Bar.'
    };
  }

  try {
    const storage = await getStorage();
    const product = await storage.getProduct(id);
    
    // Use display_name if available, fall back to name
    const displayName = (product as any)?.display_name || (product as any)?.name || 'Product';
    const description = (product as any)?.short_description || (product as any)?.description || 'Premium smoke shop products at Highway 420.';
    
    return {
      title: `${displayName} | Highway 420`,
      description: typeof description === 'string' ? description.slice(0, 160) : 'Premium smoke shop products.',
      openGraph: {
        title: `${displayName} | Highway 420`,
        description: typeof description === 'string' ? description.slice(0, 160) : 'Premium smoke shop products.',
        images: (product as any)?.image_url ? [{ url: (product as any).image_url }] : [],
      }
    };
  } catch (e) {
    return {
      title: `Product | Highway 420`,
      description: 'Premium smoke shop products at Highway 420.'
    };
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Build JSON-LD structured data for Google rich snippets
  let jsonLd: Record<string, unknown> | null = null;
  try {
    const storage = await getStorage();
    const product = await storage.getProduct(id) as any;
    if (product) {
      const name = product.display_name || product.name || 'Product';
      const description = product.short_description || product.description || '';
      const price = Number(product.our_price || product.sale_price || 0);
      const inStock = (product.stock_quantity || 0) > 0;

      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name,
        description: typeof description === 'string' ? description.slice(0, 500) : '',
        image: product.image_url || undefined,
        sku: product.sku || product.id,
        brand: product.brand_id ? { '@type': 'Brand', name: product.brand_id } : undefined,
        offers: {
          '@type': 'Offer',
          url: `https://highway420store.com/product/${id}`,
          priceCurrency: 'USD',
          price: price.toFixed(2),
          availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          seller: { '@type': 'Organization', name: 'Highway 420' },
        },
      };
    }
  } catch {}

  return (
    <div className="bg-white">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {/* Enhanced PDP with trust bar, COA, ingredients, shipping */}
      <EnhancedPDP productId={id} />

      {/* Recommendations Sections */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-20">
        {/* AI-Powered Recommendations */}
        <section>
          <AutosuggestRecommendations />
        </section>
      </div>
    </div>
  );
}
