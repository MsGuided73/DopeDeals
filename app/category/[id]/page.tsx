export async function generateMetadata({ params }: any) {
  return { title: `Category ${params.id} | Dope Deals` };
}
export default function Page({ params }: any) {
  return (
    <div className="p-6 space-y-2">
      <h1 className="text-2xl font-semibold">Category {params.id}</h1>
      <p className="text-sm text-muted-foreground">This page is being migrated to the new Next.js UI.</p>
    </div>
  );
}

