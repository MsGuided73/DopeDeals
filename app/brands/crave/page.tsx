import { Metadata } from 'next';
import CraveBrandPageContent from './CraveBrandPageContent';

export const metadata: Metadata = {
  title: 'Crave Brand - Premium Vaping Products | DOPE CITY',
  description: 'Discover Crave\'s premium collection of disposable vapes, batteries, accessories, and cannabis products. Quality and innovation in every product.',
  keywords: 'Crave, vaping, disposables, batteries, accessories, cannabis, premium quality',
};

export default function CravePage() {
  return <CraveBrandPageContent />;
}
