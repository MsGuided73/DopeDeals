import SimpleProductPage from '../../../components/SimpleProductPage';
import FlowerProductPage from '../../../components/FlowerProductPage';
import ProductRecommendations from '../../../components/ProductRecommendations';
import AutosuggestRecommendations from '../../components/AutosuggestRecommendations';
import { getStorage } from '../../../lib/storage';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const storage = await getStorage();
    const product = await storage.getProduct(id);
    return {
      title: `${product?.name || 'Product'} | Highway 420`,
      description: product?.description || 'Premium smoke shop products.'
    };
  } catch (e) {
    return {
      title: `Product ${id} | Highway 420`,
      description: 'Premium smoke shop products.'
    };
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Fetch product info to determine layout style
  let product = null;
  try {
    const storage = await getStorage();
    product = await storage.getProduct(id);
  } catch (e) {
    console.error('Error fetching product for layout decision:', e);
  }

  // Logic to determine if we should use the Flower/Preroll layout (Hidden Hills style)
  // or the Edibles layout (Detailed Product Page style)
  const isFlowerOrPreroll = product?.name?.toLowerCase().includes('flower') || 
                           product?.name?.toLowerCase().includes('preroll') ||
                           product?.name?.toLowerCase().includes('pre-roll') ||
                           product?.name?.toLowerCase().includes('jar') ||
                           product?.category_id?.toLowerCase().includes('flower') ||
                           product?.category_id?.toLowerCase().includes('preroll');

  return (
    <div className="bg-white">
      {/* Conditionally render the appropriate layout based on product type */}
      {isFlowerOrPreroll ? (
        <FlowerProductPage productId={id} />
      ) : (
        <SimpleProductPage productId={id} />
      )}

      {/* Recommendations Sections */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-20">
        {/* AI-Powered Recommendations based on viewing history */}
        <section>
          <AutosuggestRecommendations />
        </section>

        {/* Related Products */}
        <section className="pb-32">
          <div className="border-t border-gray-100 pt-16">
            <h2 className="text-4xl font-black text-center mb-12 uppercase tracking-widest">You Might Also Like</h2>
            <ProductRecommendations currentProductId={id} />
          </div>
        </section>
      </div>
    </div>
  );
}
