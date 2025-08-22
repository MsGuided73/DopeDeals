export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `Product ${id} — New | Dope Deals` };
}
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="p-6 space-y-2">
      <h1 className="text-2xl font-semibold">Product {id}</h1>
      <p className="text-sm text-muted-foreground">This page is being migrated to the new Next.js UI.</p>
    </div>
  );
}

