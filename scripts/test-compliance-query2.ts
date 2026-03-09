import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkCompliance() {
  console.log('--- Database Integrity Check ---');
  
  // See what tables we actually have populated
  console.log('\\n1. Fetching ALL us_zipcodes (limit 5)');
  const { data: zips } = await supabase.from('us_zipcodes').select('*').limit(5);
  console.log(zips);

  console.log('\\n2. Fetching ALL compliance_rules');
  const { data: rules } = await supabase.from('compliance_rules').select('*');
  console.dir(rules, { depth: null });

  console.log('\\n3. Fetching main_site_products JSON compliance_info (limit 3)');
  const { data: products } = await supabase.from('main_site_products').select('id, name, compliance_info').limit(3);
  console.dir(products, { depth: null });
}

checkCompliance().catch(console.error);
