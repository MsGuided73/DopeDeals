import { redirect } from 'next/navigation';

export default function CheckoutIndexPage() {
  // Directly enforce the sequential multi-page checkout flow
  redirect('/checkout/shipping');
}
