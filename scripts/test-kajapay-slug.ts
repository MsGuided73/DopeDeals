import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function run() {
  const password = process.env.KAJAPAY_PASSWORD || '';
  const sourceKey = process.env.KAJAPAY_SOURCE_KEY || '';
  const slug = process.env.KAJAPAY_PAYMENT_PAGE_SLUG || ''; // This is 'TestXYZ123'
  
  const url = `https://api.sandbox.kajapaygateway.com/api/v2/payment-pages/generate-pay-link/${slug}`;
  
  // Basic Auth containing our NEW source key (API) and PIN
  const authHeader = 'Basic ' + Buffer.from(`${sourceKey}:${password}`).toString('base64');

  const requestBody = JSON.stringify({
    amount: "99.99",
    currency: "USD"
  });

  const headers = {
    'Authorization': authHeader,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'Highway420-Checkout/1.0'
  };

  console.log(`\n=== KAJA PAYMENTS API v2 TEST ===`);
  console.log(`Endpoint: POST ${url}`);
  console.log(`Authenticating with Source Key: ${sourceKey.slice(0, 5)}...`);
  console.log(`Payload: ${requestBody}`);

  try {
    const res = await fetch(url, { method: 'POST', headers, body: requestBody });
    console.log(`HTTP Status: ${res.status} ${res.statusText}`);
    const text = await res.text();
    console.log(`Response Body: ${text}`);
  } catch(e: any) {
    console.error('Error:', e.message);
  }
}
run();
