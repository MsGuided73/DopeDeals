import { Metadata } from 'next';
import RoorBrandPageContent from './RoorBrandPageContent';

// Force dynamic rendering with 90-minute cache revalidation
export const dynamic = 'force-dynamic';
export const revalidate = 5400; // 90 minutes in seconds

export const metadata: Metadata = {
  title: 'ROOR - Premium German Glass | Highway 420',
  description: 'Discover ROOR\'s legendary German glass collection. Premium beakers, straight tubes, ash catchers, and accessories crafted from the finest Schott glass.',
  keywords: 'ROOR, German glass, beaker, straight tube, ash catcher, premium glass, Schott glass',
};

export default function RoorPage() {
  return <RoorBrandPageContent />;
}
