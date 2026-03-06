import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function run() {
  const password = process.env.KAJAPAY_PASSWORD || '';
  const slug = process.env.KAJAPAY_PAYMENT_PAGE_SLUG || '';
  const sourceKey = process.env.KAJAPAY_SOURCE_KEY || '';

  const authHeader = 'Basic ' + Buffer.from(`${sourceKey}:${password}`).toString('base64');

  // Let's test the new domain we saw in the screenshot: kaja-gateway.com
  const endpoints = [
    {
      name: 'v2 generate-pay-link (kaja-gateway.com)',
      url: `https://api.sandbox.kaja-gateway.com/api/v2/payment-pages/generate-pay-link/${slug}`,
      method: 'POST',
      headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: "10.00" })
    },
    {
      name: 'v2 charge (kaja-gateway.com)',
      url: 'https://api.sandbox.kaja-gateway.com/api/v2/charge',
      method: 'POST',
      headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: "10.00" })
    }
  ];

  for (const ep of endpoints) {
    console.log(`\nTesting: ${ep.name} -> ${ep.url}`);
    try {
      const res = await fetch(ep.url, {
        method: ep.method,
        headers: ep.headers,
        body: ep.body
      });
      console.log(`HTTP Status: ${res.status}`);
      const text = await res.text();
      console.log(`Response: ${text.substring(0, 150)}`);
    } catch (e: any) {
      console.log('Error:', e.message);
    }
  }
}

run();
