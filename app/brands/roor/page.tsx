import { Metadata } from 'next';
import RoorBrandPageContent from './RoorBrandPageContent';

export const metadata: Metadata = {
  title: 'ROOR - Premium German Glass | DOPE CITY',
  description: 'Discover ROOR\'s legendary German glass collection. Premium beakers, straight tubes, ash catchers, and accessories crafted from the finest Schott glass.',
  keywords: 'ROOR, German glass, beaker, straight tube, ash catcher, premium glass, Schott glass',
};

export default function RoorPage() {
  return <RoorBrandPageContent />;
}
