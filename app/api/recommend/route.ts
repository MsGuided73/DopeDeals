import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type Body = { hit:string; place:string; heat:string };

const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY && (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)
  ? createClient(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(()=>null)) as Body | null;
  if (!body) return NextResponse.json({ error: 'invalid body' }, { status: 400 });

  const spectrum = body.hit === 'Smooth' ? 'Flavor' : body.hit === 'Massive' ? 'Clouds' : 'Balance';

  // Query rigs + accessories from Supabase (fallback to mock if no client)
  let rigs:any[] = [];
  let accessories:any[] = [];
  if (supabase) {
    const base = supabase.from('products');
    const rigsRes = await base.select('*').eq('category','dab-rig').or(`best_for.eq.${spectrum}`);
    const accRes = await base.select('*').eq('category','accessory');
    rigs = rigsRes.data ?? [];
    accessories = accRes.data ?? [];
  } else {
    rigs = [
      { id:'r1', title:'Flavor Rig', price:129.99 },
      { id:'r2', title:'Balanced Rig', price:159.99 },
      { id:'r3', title:'Clouds Rig', price:199.99 },
    ];
    accessories = [
      { id:'a1', title:'Quartz Banger', price:24.99 },
      { id:'a2', title:'Carb Cap', price:19.99 },
      { id:'a3', title:'Terp Pearls', price:9.99 },
      { id:'a4', title:'Torch', price:39.99 },
      { id:'a5', title:'Reclaimer', price:29.99 },
      { id:'a6', title:'E-nail', price:89.99 },
    ];
  }

  const bundles = [
    { name:'Starter', rigs: rigs.slice(0,1), accessories: accessories.slice(0,3) },
    { name:'Plus', rigs: rigs.slice(0,2), accessories: accessories.slice(0,5) },
    { name:'Pro', rigs: rigs.slice(0,3), accessories: accessories.slice(0,8) },
  ];

  return NextResponse.json({ spectrum, criteria: body, bundles });
}

