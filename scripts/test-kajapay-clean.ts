import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: '.env.local' });

async function run() {
  const password = process.env.KAJAPAY_PASSWORD || '';
  const slug = process.env.KAJAPAY_PAYMENT_PAGE_SLUG || '';
  const sourceKey = process.env.KAJAPAY_SOURCE_KEY || '';

  console.log(`SourceKey: ${sourceKey.slice(0, 5)}... Pass Length: ${password.length}`);

  const url = `https://api.sandbox.kajapaygateway.com/api/v2/payment-pages/generate-pay-link/${slug}`;
  const url_nmi = `https://secure.nmi.com/api/transact.php`;
  
  const headersToTest = [
    { name: 'Basic (SourceKey:Password)', auth: 'Basic ' + Buffer.from(`${sourceKey}:${password}`).toString('base64') },
    { name: 'Basic (SourceKey empty)', auth: 'Basic ' + Buffer.from(`${sourceKey}:`).toString('base64') },
    { name: 'Bearer SourceKey', auth: `Bearer ${sourceKey}` },
    { name: 'Raw SourceKey', auth: sourceKey },
    { name: 'API-Key', customHeader: { 'Api-Key': sourceKey } },
    { name: 'X-API-Key', customHeader: { 'X-Api-Key': sourceKey } },
    { name: 'X-Security-Key', customHeader: { 'X-Security-Key': sourceKey } },
    { name: 'Security-Key', customHeader: { 'Security-Key': sourceKey } },
    { name: 'NMI Format (No Auth Header)', customHeader: {} }
  ];

  for (const test of headersToTest) {
    console.log(`\nTesting format: ${test.name}`);
    
    const requestBody = JSON.stringify({
      security_key: sourceKey,
      source_key: sourceKey,
      one_time_use: true,
      general_fields: { amount: "10.00" }
    });

    const headers: any = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Highway420-Checkout/1.0'
    };
    
    if (test.auth) headers['Authorization'] = test.auth;
    if (test.customHeader) Object.assign(headers, test.customHeader);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: requestBody
      });
      console.log(`HTTP Status: ${res.status} ${res.statusText}`);
      const text = await res.text();
      
      if (res.status === 200 || res.status === 201) {
        console.log('SUCCESS! Found correct format:', test.name);
        console.log(text.substring(0, 200));
        break; 
      } else {
         console.log('Failed:', text.substring(0, 50));
      }
    } catch (e: any) {
      console.error('Fetch error:', e.message);
    }
  }
}

run();
