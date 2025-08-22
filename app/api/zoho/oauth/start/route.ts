import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const dc = 'us';
  const clientId = process.env.ZOHO_CLIENT_ID!;
  const redirectUri = process.env.ZOHO_REDIRECT_URI!;
  const scope = 'ZohoInventory.fullaccess.all';

  const url = new URL(`https://accounts.${dc}.zoho.com/oauth/v2/auth`);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', scope);
  url.searchParams.set('access_type', 'offline');
  url.searchParams.set('prompt', 'consent');

  return Response.redirect(url.toString(), 302);
}

