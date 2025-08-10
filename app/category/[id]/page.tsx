import CategoryPage from "@/pages/category";
export async function generateMetadata({ params }: { params: { id: string } }) {
  return { title: `Category ${params.id} | Dope Deals` };
}
export default function Page({ params }: { params: { id: string } }) {
  return <CategoryPage params={params} />;
}

