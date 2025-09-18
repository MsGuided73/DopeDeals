import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    const orgId = process.env.ZOHO_ORGANIZATION_ID!;
    
    // Get current token from database
    const { data: tokenRow, error } = await supabase
      .from('zoho_tokens')
      .select('*')
      .eq('org_id', orgId)
      .single();

    if (error || !tokenRow) {
      return NextResponse.json({
        success: false,
        error: 'No Zoho token found in database',
        message: 'Please run Zoho OAuth setup first'
      }, { status: 404 });
    }

    // Check current token status
    const now = new Date();
    const expiresAt = new Date(tokenRow.expires_at);
    const isExpired = expiresAt <= now;
    
    if (!isExpired && tokenRow.access_token) {
      return NextResponse.json({
        success: true,
        message: 'Token is still valid',
        token_info: {
          org_id: tokenRow.org_id,
          dc: tokenRow.dc,
          expires_at: tokenRow.expires_at,
          expires_in_minutes: Math.round((expiresAt.getTime() - now.getTime()) / (1000 * 60)),
          status: 'VALID'
        }
      });
    }

    // Token is expired, refresh it
    console.log('[Token Refresh] Refreshing expired Zoho token...');
    
    const clientId = process.env.ZOHO_CLIENT_ID;
    const clientSecret = process.env.ZOHO_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json({
        success: false,
        error: 'Missing Zoho client credentials',
        message: 'ZOHO_CLIENT_ID and ZOHO_CLIENT_SECRET must be set in environment variables'
      }, { status: 500 });
    }

    const tokenUrl = `https://accounts.zoho.com/oauth/v2/token`;
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: tokenRow.refresh_token,
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({
        success: false,
        error: 'Failed to refresh Zoho access token',
        details: `${response.status} ${errorText}`,
        message: 'The refresh token may be invalid or expired. You may need to re-authorize.'
      }, { status: 400 });
    }

    const data = await response.json();
    
    if (data.error) {
      return NextResponse.json({
        success: false,
        error: 'Zoho token refresh error',
        details: data.error_description || data.error,
        message: 'The refresh token may be invalid. You may need to re-authorize.'
      }, { status: 400 });
    }

    const newAccessToken = data.access_token;
    const expiresIn = data.expires_in || 3600; // Default 1 hour
    const newExpiresAt = new Date(Date.now() + (expiresIn * 1000)).toISOString();

    // Update the token in database
    const { error: updateError } = await supabase
      .from('zoho_tokens')
      .update({
        access_token: newAccessToken,
        expires_at: newExpiresAt
      })
      .eq('org_id', orgId);

    if (updateError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update token in database',
        details: updateError.message,
        message: 'Token was refreshed but could not be saved'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Zoho access token refreshed successfully!',
      token_info: {
        org_id: orgId,
        dc: tokenRow.dc,
        expires_at: newExpiresAt,
        expires_in_minutes: Math.round(expiresIn / 60),
        status: 'REFRESHED'
      }
    });

  } catch (error) {
    console.error('[Token Refresh] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Token refresh failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      message: 'An unexpected error occurred during token refresh'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orgId = process.env.ZOHO_ORGANIZATION_ID!;
    
    // Get current token status
    const { data: tokenRow, error } = await supabase
      .from('zoho_tokens')
      .select('org_id, dc, expires_at')
      .eq('org_id', orgId)
      .single();

    if (error || !tokenRow) {
      return NextResponse.json({
        success: false,
        error: 'No Zoho token found',
        message: 'Please run Zoho OAuth setup first'
      }, { status: 404 });
    }

    const now = new Date();
    const expiresAt = new Date(tokenRow.expires_at);
    const isExpired = expiresAt <= now;
    const minutesUntilExpiry = Math.round((expiresAt.getTime() - now.getTime()) / (1000 * 60));

    return NextResponse.json({
      success: true,
      token_info: {
        org_id: tokenRow.org_id,
        dc: tokenRow.dc,
        expires_at: tokenRow.expires_at,
        expires_in_minutes: minutesUntilExpiry,
        status: isExpired ? 'EXPIRED' : 'VALID',
        needs_refresh: isExpired
      },
      actions: {
        refresh_url: '/api/admin/refresh-zoho-token',
        method: 'POST'
      }
    });

  } catch (error) {
    console.error('[Token Status] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to check token status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
