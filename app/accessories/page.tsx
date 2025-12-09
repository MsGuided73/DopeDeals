import { redirect } from 'next/navigation';

export default function AccessoriesPage() {
  // Redirect to products page with accessories search
  redirect('/products?q=accessories');
}

// Force dynamic rendering to avoid caching issues
export const dynamic = 'force-dynamic';
