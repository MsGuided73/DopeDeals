import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkCompliance() {
  console.log('--- Testing Compliance Query ---');
  
  console.log('\\n1. Checking us_zipcodes for CA zip (e.g., 90210)');
  const { data: zipRow, error: zipError } = await supabase
    .from('us_zipcodes')
    .select('state')
    .eq('zip', '90210')
    .limit(1);
    
  if (zipError) {
    console.error('Error fetching zip:', zipError.message);
  } else {
    console.log('Zip result:', zipRow);
  }

  console.log('\\n2. Checking compliance_rules for THCA restrictions');
  const { data: rules, error: rulesError } = await supabase
    .from('compliance_rules')
    .select('*')
    .eq('category', 'THCA');

  if (rulesError) {
    console.error('Error fetching rules:', rulesError.message);
  } else {
    console.log('Rules found:', rules?.length);
    console.dir(rules, { depth: null });
  }
}

checkCompliance().catch(console.error);
