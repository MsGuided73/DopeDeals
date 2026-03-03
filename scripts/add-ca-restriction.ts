import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data, error } = await supabase
    .from('compliance_rules')
    .select('*')
    .eq('category', 'THCA');

  if (error) {
    console.error('Error fetching rules:', error);
    return;
  }

  console.log('THCA Compliance Rules:', data);

  for (const rule of data) {
    let states = rule.restricted_states || [];
    if (!states.includes('CA')) {
      states.push('CA');
      const { error: updateErr } = await supabase
        .from('compliance_rules')
        .update({ restricted_states: states })
        .eq('id', rule.id);
      if (updateErr) {
        console.error('Update error on ID', rule.id, updateErr);
      } else {
        console.log(`Updated rule ${rule.id} to include CA`);
      }
    } else {
      console.log(`Rule ${rule.id} already includes CA`);
    }
  }
}

main().catch(console.error);
