"use client";
import EnhancedPDP from '../../components/EnhancedPDP';
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
      </div>
    </div>
  );
}
