
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function getID() {
  const { data } = await supabase
    .from('main_site_products')
    .select('id')
    .ilike('name', '%Zoomers%')
    .limit(1);
    
  if (data?.[0]) console.log('ZoomersID:', data[0].id);
}
getID();
