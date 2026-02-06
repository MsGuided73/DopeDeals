"use client";
import EnhancedPDP from '../../components/EnhancedPDP';
import ProductRecommendations from '../../../components/ProductRecommendations';
import AutosuggestRecommendations from '../../components/AutosuggestRecommendations';

interface ProductPageClientProps {
  productId: string;
}

export default function ProductPageClient({ productId }: ProductPageClientProps) {
  return (
    <div className="bg-white">
      {/* New Enhanced PDP with trust bar, COA, ingredients, shipping */}
      <EnhancedPDP productId={productId} />

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
            <ProductRecommendations currentProductId={productId} />
          </div>
        </section>
      </div>
    </div>
  );
}
