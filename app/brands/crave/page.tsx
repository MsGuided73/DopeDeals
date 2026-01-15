import { Metadata } from 'next';
import CraveBrandPageContent from './CraveBrandPageContent';

// Force dynamic rendering with 90-minute cache revalidation
export const dynamic = 'force-dynamic';
export const revalidate = 5400; // 90 minutes in seconds

export const metadata: Metadata = {
  title: 'Crave Brand - Premium Vaping Products | Highway 420',
  description: 'Discover Crave\'s premium collection of disposable vapes, batteries, accessories, and cannabis products. Quality and innovation in every product.',
  keywords: 'Crave, vaping, disposables, batteries, accessories, cannabis, premium quality',
};

export default function CravePage() {
  return <CraveBrandPageContent />;
}
