import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  const password = process.env.KAJAPAY_PASSWORD || '';
  const sourceKey = process.env.KAJAPAY_SOURCE_KEY || '';
  
  const url = `https://api.sandbox.kajapaygateway.com/api/v2/payment-pages/generate-pay-link/TestXYZ123`;
  const authHeader = 'Basic ' + Buffer.from(`${sourceKey}:${password}`).toString('base64');

  const requestBody = JSON.stringify({ amount: "99.99" });

  const headers = {
    'Authorization': authHeader,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'Highway420-Checkout/1.0'
  };

  try {
    const res = await fetch(url, { method: 'POST', headers, body: requestBody });
    console.log(`HTTP Status:`, res.status);
    console.log(await res.text());
  } catch(e) { console.error(e); }
  
  process.exit(0);
}
run();
