import { redirect } from 'next/navigation';

export default function SalePage() {
  // Redirect to products page with sale filter
  redirect('/products?onSale=true');
}

// Force dynamic rendering to avoid caching issues
export const dynamic = 'force-dynamic';
