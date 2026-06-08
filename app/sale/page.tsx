import { redirect } from 'next/navigation';

export default function SalePage() {
  // Redirect to products page with sale filter
  redirect('/products?onSale=true');
}

// Pure redirect — sale prices update frequently; 60s cache is fine.
export const revalidate = 60;
