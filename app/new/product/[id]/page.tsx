import NewProductDetailPage from "@/pages/NewProductDetailPage";
export async function generateMetadata({ params }: any) {
  return { title: `Product ${params.id} — New | Dope Deals` };
}
export default function Page({ params }: { params: { id: string } }) {
  return <NewProductDetailPage productId={params.id} />;
}

