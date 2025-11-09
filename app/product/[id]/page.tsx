import SimpleProductPage from '../../../components/SimpleProductPage';
import ProductRecommendations from '../../../components/ProductRecommendations';
import AutosuggestRecommendations from '../../components/AutosuggestRecommendations';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // TODO: Fetch actual product data for metadata
  return {
    title: `Product ${id} | Highway 420`,
    description: 'Premium smoke shop products - glass pieces, accessories, and CBD/hemp products.'
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      {/* Simple Product Page with Global Masthead */}
      <SimpleProductPage productId={id} />

      {/* AI-Powered Recommendations based on viewing history */}
      <AutosuggestRecommendations />

      {/* Related Products */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
          <ProductRecommendations currentProductId={id} />
        </div>
      </section>
    </div>
  );
}
