import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: '.env.local' });

async function run() {
  const password = process.env.KAJAPAY_PASSWORD || '';
  const slug = process.env.KAJAPAY_PAYMENT_PAGE_SLUG || '';
  const sourceKey = process.env.KAJAPAY_SOURCE_KEY || '';

  const url = `https://api.sandbox.kajapaygateway.com/api/v2/charge`;
  const authHeader = 'Basic ' + Buffer.from(`${sourceKey}:${password}`).toString('base64');

  console.log(`\nTesting direct /charge with Basic Auth...`);
  
  const requestBody = JSON.stringify({
    amount: "10.00",
    ccnumber: "411111111111111", // Testing card
    ccexp: "1230",
    cvv: "123"
  });

  const headers: any = {
    'Authorization': authHeader,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'Highway420-Checkout/1.0'
  };
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: requestBody
    });
    console.log(`HTTP Status: ${res.status} ${res.statusText}`);
    const text = await res.text();
    console.log('Response body:', text.substring(0, 200));
  } catch (e: any) {
    console.error('Fetch error:', e.message);
  }
}

run();
