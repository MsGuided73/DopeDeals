import Hero from '@/components/dope-city/Hero';
import CollectionsMosaic from '@/components/dope-city/CollectionsMosaic';
import WhyDopeCity from '@/components/dope-city/WhyDopeCity';
import ExperienceSpectrum from '@/components/dope-city/ExperienceSpectrum';
import ClubSection from '@/components/dope-city/ClubSection';
import type { CollectionTile } from '@/components/dope-city/types';

export const metadata = { title: 'DOPE CITY' };

export default function Page() {
  const tiles: CollectionTile[] = [
    { title: 'Dab Rigs', href: '/collections/dab-rigs', img: '/dope-city/collections/dope-deals-card.jpg', blurb: 'Precision rigs & tools for big draws.', tag: 'Clouds', size: 'feature' },
    { title: 'Water Bongs', href: '/collections/water-bongs', img: '/dope-city/hero/dope-city-hero.jpg', blurb: 'Smooth pulls. Hand-picked glass.', tag: 'Balance', size: 'wide' },
    { title: 'Pipes', href: '/collections/pipes', img: '/dope-city/collections/dope-deals-card.jpg', tag: 'Flavor', size: 'small' },
    { title: 'Vapes & Disposables', href: '/collections/vapes', img: '/dope-city/collections/dope-deals-card.jpg', tag: 'Balance', size: 'small' },
    { title: 'Kratom / 7-OH', href: '/collections/kratom', img: '/dope-city/collections/dope-deals-card.jpg', tag: 'Balance', size: 'small' },
    { title: 'Accessories', href: '/collections/accessories', img: '/dope-city/collections/dope-deals-card.jpg', tag: 'Flavor', size: 'small' },
  ];

  return (
    <>
      <Hero
        bgUrl="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/hero-image_DC1.png"
        bgPosition="center top 35%"
        title="Gear for the culture, built by the culture."
        subtitle="No hype, no clutter—just clean design and quality that hits right."
        ctas={[{ label:'Shop New Arrivals', href:'/products', variant:'primary' }, { label:'Explore Collections', href:'#collections', variant:'ghost' }, { label:'Join the Club', href:'#club', variant:'outline' }]} />
      <CollectionsMosaic tiles={tiles} />
      <WhyDopeCity />
      <ExperienceSpectrum />
      <ClubSection id="club" />
    </>
  );
}

