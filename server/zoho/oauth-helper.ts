// OAuth Helper for generating Zoho refresh tokens
import { Request, Response } from 'express';

// Helper to generate authorization URL for admin
export function getAuthorizationUrl(req: Request, res: Response) {
  const clientId = process.env.ZOHO_CLIENT_ID;
  
  if (!clientId) {
    return res.status(400).json({
      error: 'ZOHO_CLIENT_ID not found in environment variables',
      message: 'Please add ZOHO_CLIENT_ID to the secrets section first'
    });
  }

  // Required scopes for VIP Smoke integration
  const scopes = [
    'ZohoInventory.FullAccess.all',
    'ZohoInventory.items.ALL',
    'ZohoInventory.salesorders.ALL', 
    'ZohoInventory.contacts.ALL',
    'ZohoInventory.settings.ALL',
    'ZohoInventory.inventoryadjustments.ALL'
  ].join(',');

  const authUrl = `https://accounts.zoho.com/oauth/v2/auth?` +
    `scope=${encodeURIComponent(scopes)}&` +
    `client_id=${clientId}&` +
    `response_type=code&` +
    `access_type=offline&` +
    `prompt=consent`;

  res.json({
    message: 'Use this URL to generate your authorization code',
    authorizationUrl: authUrl,
    instructions: [
      '1. Open this URL in your browser',
      '2. Log in to your BMB Wholesale Inc. Zoho account',
      '3. Grant permissions for VIP Smoke integration',
      '4. Copy the authorization code from the response',
      '5. Use the code with /api/zoho/exchange-token endpoint'
    ],
    scopes: scopes.split(',')
  });
}

// Exchange authorization code for refresh token
export async function exchangeToken(req: Request, res: Response) {
  const { code } = req.body;
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(400).json({
      error: 'Missing Zoho credentials',
      message: 'ZOHO_CLIENT_ID and ZOHO_CLIENT_SECRET are required'
    });
  }

  if (!code) {
    return res.status(400).json({
      error: 'Authorization code required',
      message: 'Please provide the authorization code from Zoho'
    });
  }

  try {
    const tokenUrl = 'https://accounts.zoho.com/oauth/v2/token';
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      code: code
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({
        error: 'Token exchange failed',
        details: data
      });
    }

    res.json({
      message: 'Token exchange successful!',
      refreshToken: data.refresh_token,
      accessToken: data.access_token,
      expiresIn: data.expires_in,
      instructions: [
        'Copy the refresh_token value',
        'Add it as ZOHO_REFRESH_TOKEN in the Replit secrets section',
        'The integration will be fully enabled once added'
      ]
    });

  } catch (error) {
    console.error('[Zoho OAuth] Token exchange error:', error);
    res.status(500).json({
      error: 'Token exchange failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}