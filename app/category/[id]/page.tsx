import CategoryPage from "@/pages/category";
import type { Metadata } from "next";

type Params = { params: { id: string } };
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return { title: `Category ${params.id} | Dope Deals` };
}
export default function Page({ params }: Params) {
  return <CategoryPage params={params} />;
}

