import NewProductDetailPage from "@/pages/NewProductDetailPage";
import type { Metadata } from "next";

type Params = { params: { id: string } };
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return { title: `Product ${params.id} — New | Dope Deals` };
}
export default function Page({ params }: Params) {
  return <NewProductDetailPage productId={params.id} />;
}

