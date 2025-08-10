import NewProductDetailPage from "@/pages/NewProductDetailPage";
export async function generateMetadata({ params }: { params: { id: string } }) {
  return { title: `Product ${params.id} — New | Dope Deals` };
}
export default function Page({ params }: Params) {
  return <NewProductDetailPage productId={params.id} />;
}

