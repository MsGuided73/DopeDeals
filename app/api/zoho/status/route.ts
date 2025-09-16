import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const checks = {
    environment: false,
    supabase_connection: false,
    zoho_tokens: false,
    zoho_credentials: false
  };
  const errors: string[] = [];
  const details: any = {};

  try {
    // Check environment variables
    const requiredEnvs = [
      'ZOHO_CLIENT_ID',
      'ZOHO_CLIENT_SECRET', 
      'ZOHO_ORGANIZATION_ID',
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY'
    ];

    const missingEnvs = requiredEnvs.filter(env => !process.env[env]);
    if (missingEnvs.length === 0) {
      checks.environment = true;
      details.environment = 'All required environment variables present';
    } else {
      errors.push(`Missing environment variables: ${missingEnvs.join(', ')}`);
      details.environment = { missing: missingEnvs };
    }

    // Check Supabase connection
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase.from('products').select('id').limit(1);
      
      if (!error) {
        checks.supabase_connection = true;
        details.supabase = { status: 'connected', products_accessible: true };
      } else {
        errors.push(`Supabase connection failed: ${error.message}`);
        details.supabase = { status: 'failed', error: error.message };
      }
    } else {
      errors.push('Supabase credentials missing');
    }

    // Check Zoho tokens in database
    if (checks.supabase_connection) {
      const supabase = createClient(supabaseUrl!, supabaseKey!);
      const orgId = process.env.ZOHO_ORGANIZATION_ID;
      
      const { data: tokenRow, error } = await supabase
        .from('zoho_tokens')
        .select('*')
        .eq('org_id', orgId)
        .single();

      if (!error && tokenRow) {
        checks.zoho_tokens = true;
        details.zoho_tokens = {
          status: 'found',
          org_id: tokenRow.org_id,
          has_refresh_token: !!tokenRow.refresh_token,
          expires_at: tokenRow.expires_at
        };
      } else {
        errors.push(`Zoho tokens not found: ${error?.message || 'No token stored'}`);
        details.zoho_tokens = { status: 'missing', error: error?.message };
      }
    }

    // Check Zoho credentials format
    const clientId = process.env.ZOHO_CLIENT_ID;
    const clientSecret = process.env.ZOHO_CLIENT_SECRET;
    const orgId = process.env.ZOHO_ORGANIZATION_ID;

    if (clientId && clientSecret && orgId) {
      checks.zoho_credentials = true;
      details.zoho_credentials = {
        client_id_format: clientId.startsWith('1000.') ? 'valid' : 'invalid',
        client_secret_length: clientSecret.length,
        organization_id: orgId
      };
    } else {
      errors.push('Zoho credentials incomplete');
    }

  } catch (error) {
    errors.push(`Status check failed: ${error}`);
  }

  const overallStatus = Object.values(checks).every(check => check);

  return NextResponse.json({
    status: overallStatus ? 'healthy' : 'unhealthy',
    checks,
    details,
    errors,
    timestamp: new Date().toISOString(),
    next_steps: overallStatus ? 
      ['Zoho integration appears ready', 'Test authenticated endpoints'] :
      ['Fix missing credentials', 'Ensure Supabase connection', 'Set up Zoho tokens']
  });
}
