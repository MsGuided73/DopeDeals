import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function run() {
  const sourceKey = process.env.KAJAPAY_SOURCE_KEY || '';

  const ep = {
    name: 'v1 transact sandbox (NMI Direct via kaja-gateway.com)',
    url: 'https://secure.sandbox.kaja-gateway.com/api/transact.php',
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    // Use test card 4761530001111118, exp 1030, amount 99.99
    body: `security_key=${sourceKey}&type=sale&amount=99.99&ccnumber=4761530001111118&ccexp=1030`
  };

  console.log(`\nTesting: ${ep.name} -> ${ep.url}`);
  try {
    const res = await fetch(ep.url, {
      method: ep.method,
      headers: ep.headers,
      body: ep.body
    });
    console.log(`HTTP Status: ${res.status}`);
    const text = await res.text();
    console.log(`Response: ${text.substring(0, 500)}`);
  } catch (e: any) {
    console.log('Error:', e.message);
  }
}

run();
