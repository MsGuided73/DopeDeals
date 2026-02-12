import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateTokens() {
  const orgId = process.env.ZOHO_ORGANIZATION_ID;

  // New tokens from OAuth exchange
  const accessToken = '';
  const refreshToken = '';
  const expiresIn = 3600; // 1 hour
  const expiresAt = new Date(Date.now() + (expiresIn * 1000)).toISOString();
  const dc = 'us';

  console.log('Updating Zoho tokens in database...');

  const { error } = await supabase
    .from('zoho_tokens')
    .upsert({
      org_id: orgId,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt,
      dc: dc
    })
    .eq('org_id', orgId);

  if (error) {
    console.error('Error updating tokens:', error);
    process.exit(1);
  }

  console.log('✅ Zoho tokens updated successfully!');
  console.log(`Access token expires at: ${expiresAt}`);
}

updateTokens().catch(console.error);
