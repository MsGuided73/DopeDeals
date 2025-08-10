import ProductPage from "@/pages/product";
export async function generateMetadata({ params }: { params: { id: string } }) {
  return { title: `Product ${params.id} | Dope Deals` };
}

export default function Page({ params }: { params: { id: string } }) {
  return <ProductPage params={params} />;
}

