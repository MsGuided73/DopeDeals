import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: '.env.local' });

async function run() {
  const sourceKey = process.env.KAJAPAY_SOURCE_KEY || '';
  const password = process.env.KAJAPAY_PASSWORD || '';
  const slug = process.env.KAJAPAY_PAYMENT_PAGE_SLUG || '';

  const username = process.env.KAJAPAY_USERNAME || '';

  console.log(`User: ${username} Pass Length: ${password.length} SourceKey: ${sourceKey.slice(0, 5)}...`);

  const url = `https://api.sandbox.kajapaygateway.com/api/v2/payment-pages/generate-pay-link/${slug}`;
  
  // Try mapping Username : Password to Basic Auth
  const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

  const requestBody = JSON.stringify({
    source_key: sourceKey,
    one_time_use: true,
    general_fields: { amount: "10.00" }
  });

  const headers = {
    'Authorization': authHeader,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'Highway420-Checkout/1.0'
  };

  console.log('--- REQUEST DETAILS ---');
  console.log(`URL: POST ${url}`);
  console.log(`Headers:`, JSON.stringify(headers, null, 2));
  console.log(`Body:`, requestBody);
  console.log(`Auth Decoded: ${Buffer.from(authHeader.replace('Basic ', ''), 'base64').toString('ascii')}`);
  console.log('-----------------------\n');

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: requestBody
    });
    
    const status = res.status;
    const text = await res.text();
    let jsonParsed = null;
    try {
      jsonParsed = JSON.parse(text);
    } catch(e) {}

    const output = { 
      status, 
      statusText: res.statusText,
      responseBody: jsonParsed || text, 
      responseHeaders: Object.fromEntries(Array.from(res.headers.entries())) 
    };
    
    fs.writeFileSync('kaja_res_detailed.json', JSON.stringify(output, null, 2));
    
    console.log('--- RESPONSE DETAILS ---');
    console.log(`HTTP Status: ${status} ${res.statusText}`);
    console.log(`Body:\n${JSON.stringify(output.responseBody, null, 2)}`);
    console.log(`\nDetailed logs saved to kaja_res_detailed.json`);
  } catch (e: any) {
    console.error('Fetch error:', e.message);
  }
}

run();
