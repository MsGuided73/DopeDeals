import ProductDetail from './ProductDetail';
import ProductRecommendations from '../../../components/ProductRecommendations';
import { Hero } from '../../components/design/NikeIndustrial';

export function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params;
  // Mock metadata for now
  const mockProduct = { name: `Product ${id}` };
  return { title: `${mockProduct.name} | Dope Deals`, description: 'High-quality CBD/Hemp product compliant with regulations.' };
}

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  // Mock product data for now - no backend integration
  const mockProduct = {
    id,
    name: `Premium CBD Product ${id}`,
    description: 'High-quality CBD/Hemp product compliant with regulations. Detailed description and images to be added.',
    price: 49.99,
    imageUrl: null,
    inStock: true,
    material: 'Borosilicate Glass',
    sku: `SKU-${id}`,
  };

  if (!mockProduct) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 space-y-8">
      <Hero title={mockProduct.name} subtitle={mockProduct.description} />

      {/* Compliance Placeholder - Nicotine Toggle Note */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Compliance Note:</strong> Nicotine products not available on main site. CBD/Hemp only. Age verification and zipcode check applied.
            </p>
          </div>
        </div>
      </div>

      <ProductDetail product={mockProduct} />

      {/* Related Products */}
      <section className="mt-16">
        <ProductRecommendations currentProductId={id} />
      </section>
    </div>
  );
}
