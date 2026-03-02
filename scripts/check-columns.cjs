
const { createClient } = require('@supabase/supabase-js');

async function checkColumns() {
  const supabaseUrl = 'https://qirbapivptotybspnbet.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcmJhcGl2cHRvdHlic3BuYmV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTA1MzM2NywiZXhwIjoyMDY2NjI5MzY3fQ.Se6u_YXkMBOJeHYq3n37aqVspl5A-hVgF12SWCZhpr8';
  const supabase = createClient(supabaseUrl, supabaseKey);

  const tables = ['users', 'profiles', 'age_verifications', 'compliance_rules'];
  
  for (const table of tables) {
    console.log(`\n--- Columns in "${table}" ---`);
    // Sample a row to see keys (ignoring content for privacy)
    const { data, error } = await supabase.from(table).select('*').limit(1);
    
    if (error) {
      console.log(`Error checking "${table}":`, error.message);
      // Try to get columns via RPC if select * fails
      continue;
    }
    
    if (data && data.length > 0) {
      console.log('Columns:', Object.keys(data[0]).join(', '));
    } else {
      console.log('No data found, trying head select for empty table columns...');
       const { error: emptyError, data: emptyData } = await supabase.from(table).select('*').limit(0);
       // This doesn't help much with JS client, usually we'd use raw SQL but we don't have that easily.
       // We'll trust the logic that if it exists but is empty, we might need to probe via common columns.
       const probeColumns = ['id', 'email', 'role', 'age_verified', 'age_verification_status', 'is_admin'];
       const found = [];
       for (const col of probeColumns) {
         const { error: colError } = await supabase.from(table).select(col).limit(1);
         if (!colError) found.push(col);
       }
       console.log('Probed columns found:', found.join(', '));
    }
  }
}

checkColumns();
