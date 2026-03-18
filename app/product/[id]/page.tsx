import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getStorage } from '../../../lib/storage';

// Dynamic import for client components
const EnhancedPDP = dynamic(() => import('../../components/EnhancedPDP'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  )
});

const ProductRecommendations = dynamic(() => import('../../../components/ProductRecommendations'));

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
  
  return (
    <div className="bg-white">
      {/* Enhanced PDP with trust bar, COA, ingredients, shipping */}
      <EnhancedPDP productId={id} />

      {/* Recommendations Sections */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-20">
        {/* AI-Powered Recommendations */}
        <section>
          <AutosuggestRecommendations />
        </section>

        {/* Related Products */}
        <section className="pb-32">
          <div className="border-t border-gray-100 pt-16">
            <h2 className="text-3xl font-bold text-center mb-12">You Might Also Like</h2>
            <ProductRecommendations currentProductId={id} />
          </div>
        </section>
      </div>
    </div>
  );
}
