import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  const password = process.env.KAJAPAY_PASSWORD || '';
  const slug = process.env.KAJAPAY_PAYMENT_PAGE_SLUG || '';
  const sourceKey = process.env.KAJAPAY_SOURCE_KEY || '';

  const authHeader = 'Basic ' + Buffer.from(`${sourceKey}:${password}`).toString('base64');
  console.log('Testing with API PIN:', password, 'SourceKey:', sourceKey.slice(0, 5));

  const endpoints = [
    {
      name: 'v2 charge',
      url: 'https://api.sandbox.kajapaygateway.com/api/v2/charge',
      method: 'POST',
      headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: "10.00" })
    },
    {
      name: 'v2 auth',
      url: 'https://api.sandbox.kajapaygateway.com/api/v2/auth',
      method: 'POST',
      headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: "10.00" })
    },
    {
      name: 'v2 generate-pay-link',
      url: `https://api.sandbox.kajapaygateway.com/api/v2/payment-pages/generate-pay-link/${slug}`,
      method: 'POST',
      headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: "10.00" })
    },
    {
      name: 'v1 transact (NMI Direct)',
      url: 'https://secure.kajapaygateway.com/api/transact.php',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `security_key=${sourceKey}&amount=10.00&type=sale`
    },
    {
      name: 'v1 transact sandbox (NMI Direct)',
      url: 'https://secure.sandbox.kajapaygateway.com/api/transact.php',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `security_key=${sourceKey}&amount=10.00&type=sale`
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
