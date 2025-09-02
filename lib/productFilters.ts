export type VibeInputs = {
  what: 'Flower' | 'Resin' | 'Rosin' | 'Hash';
  where: 'Home' | 'On-the-Go' | 'Party';
  flavorClouds: number; // 0..100
  heat?: 'Torch' | 'E-Nail' | 'Battery';
  budget: 'Budget' | 'Mid' | 'Premium' | 'All';
};

export type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  vipPrice?: number;
  tags: string[]; // category + attributes
};

const MOCK: Product[] = [
  { id: 'rig-1', name: 'Quartz Mini Rig', image: '/dope-city/collections/dope-deals-card.jpg', price: 89, vipPrice: 79, tags: ['Dab Rigs','Home','Flavor','Small','Perc'] },
  { id: 'bong-1', name: 'Beaker Bong XL', image: '/dope-city/collections/dope-deals-card.jpg', price: 119, vipPrice: 99, tags: ['Water Bongs','Home','Clouds','Large','Durable'] },
  { id: 'pipe-1', name: 'Classic Spoon', image: '/dope-city/collections/dope-deals-card.jpg', price: 19, tags: ['Pipes','On-the-Go','Flavor','Small','Durable'] },
  { id: 'vape-1', name: '510 Battery Kit', image: '/dope-city/collections/dope-deals-card.jpg', price: 39, tags: ['Vapes/Disposables','On-the-Go','Portable'] },
  { id: 'kratom-1', name: 'Kratom Reserve 250g', image: '/dope-city/collections/dope-deals-card.jpg', price: 34, tags: ['Kratom / 7-OH'] },
  { id: 'acc-1', name: 'Quartz Banger Pro', image: '/dope-city/collections/dope-deals-card.jpg', price: 29, tags: ['Accessories','Resin','Rosin','Torch'] },
  { id: 'rig-2', name: 'E-Rig Traveler', image: '/dope-city/collections/dope-deals-card.jpg', price: 249, vipPrice: 219, tags: ['Dab Rigs','On-the-Go','Battery','Portable','Clouds'] },
];

function allowedCategories(what: VibeInputs['what']): string[] {
  if (what === 'Flower') return ['Papers','Pipes','Bubblers','Water Bongs'];
  if (what === 'Resin' || what === 'Rosin') return ['Dab Rigs','Nectar Collectors','E-Rigs'];
  if (what === 'Hash') return ['Pipes','Papers','Water Bongs'];
  return [];
}

function inBudget(p: Product, budget: VibeInputs['budget']): boolean {
  if (budget === 'All') return true;
  if (budget === 'Budget') return p.price <= 80;
  if (budget === 'Mid') return p.price > 80 && p.price <= 200;
  return p.price > 200;
}

export function recommend(inputs: VibeInputs, products: Product[] = MOCK) {
  const cats = allowedCategories(inputs.what);
  const cloudBias = inputs.flavorClouds / 100; // 0..1 clouds

  const scored = products
    .filter((p) => cats.some((c) => p.tags.includes(c)))
    .filter((p) => inBudget(p, inputs.budget))
    .map((p) => {
      let score = 0;
      // where filter
      if (inputs.where === 'Home' && (p.tags.includes('Large') || p.tags.includes('Home'))) score += 1.5;
      if (inputs.where === 'On-the-Go' && p.tags.includes('Portable')) score += 1.5;
      if (inputs.where === 'Party' && p.tags.includes('Durable')) score += 1.5;
      // flavor vs clouds
      if (cloudBias > 0.6 && (p.tags.includes('Large') || p.tags.includes('Clouds'))) score += 1;
      if (cloudBias < 0.4 && (p.tags.includes('Small') || p.tags.includes('Flavor'))) score += 1;
      // heat
      if (inputs.heat && p.tags.includes(inputs.heat)) score += 0.5;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(({ p }) => ({
      ...p,
      why: `Dialed for ${inputs.where.toLowerCase()} with ${cloudBias > 0.5 ? 'big airflow' : 'clean flavor'} — great match for ${inputs.what}.`,
    }));

  return scored;
}

