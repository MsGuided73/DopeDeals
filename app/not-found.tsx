import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[60vh] grid place-items-center bg-background text-foreground px-6 py-24">
      <div className="text-center">
        <p className="text-sm font-semibold text-muted-foreground">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sorry, we couldn’t find the page you’re looking for.</p>
        <div className="mt-6">
          <Link href="/" className="inline-flex items-center rounded-lg bg-accent px-4 py-2 font-semibold text-black hover:opacity-95">
            Go back home
          </Link>
        </div>
      </div>
    </main>
  );
}

