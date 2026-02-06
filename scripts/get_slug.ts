
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function getSlug() {
  const { data } = await supabase
    .from('main_site_products')
    .select('slug, id')
    .ilike('name', '%Zoomers%')
    .limit(1);
    
  console.log('Zoomers Slug:', data?.[0]?.slug);
}
getSlug();
