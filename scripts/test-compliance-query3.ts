import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkCompliance() {
  console.log('--- Checking table row counts ---');
  
  const { count: zipCount } = await supabase.from('us_zipcodes').select('*', { count: 'exact', head: true });
  console.log('Total us_zipcodes rows:', zipCount);

  const { count: pcCount } = await supabase.from('product_compliance').select('*', { count: 'exact', head: true });
  console.log('Total product_compliance rows:', pcCount);
  
  const { data: rules } = await supabase.from('compliance_rules').select('*');
  console.log('Rules:', JSON.stringify(rules, null, 2));
}

checkCompliance().catch(console.error);
