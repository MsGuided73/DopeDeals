import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Cart | Highway 420',
  description: 'Review your cart and checkout. Free shipping on orders over $75.',
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
