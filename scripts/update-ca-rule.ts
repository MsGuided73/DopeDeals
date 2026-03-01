import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

async function update() {
  const { storage } = await import('../server/supabase-storage.js');
  try {
    const rules = await storage.getComplianceRulesByCategory('THCA');
    if (rules.length > 0) {
      const rule = rules[0];
      const currentStates = rule.restricted_states || [];
      const newStates = Array.from(new Set([...currentStates, 'CA']));
      
      const { error } = await (storage as any).supabaseAdmin
        .from('compliance_rules')
        .update({ restricted_states: newStates })
        .eq('id', rule.id);

      if (error) {
        console.error('❌ Failed to update DB:', error);
      } else {
        console.log(`✅ Successfully added CA to THCA restrictions in DB. Current states: ${newStates.join(', ')}`);
      }
    } else {
      console.log('⚠️ No THCA rule found to update.');
    }
  } catch (err) {
    console.error('❌ Error during update:', err);
  }
}

update();
