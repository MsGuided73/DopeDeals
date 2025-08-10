import CategoryPage from "@/pages/category";
export async function generateMetadata({ params }: any) {
  return { title: `Category ${params.id} | Dope Deals` };
}
export default function Page({ params }: { params: { id: string } }) {
  return <CategoryPage params={params} />;
}

