import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const { data: products } = await supabase.from('main_site_products').select('id, name, category, subcategory, compliance_info').limit(10);
  console.log('Sample Products:', JSON.stringify(products, null, 2));
}

main().catch(console.error);
