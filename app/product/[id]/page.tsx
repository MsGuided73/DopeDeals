import ProductPage from "@/pages/product";
import type { Metadata } from "next";

type Params = { params: { id: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return { title: `Product ${params.id} | Dope Deals` };
}

export default function Page({ params }: Params) {
  return <ProductPage params={params} />;
}

