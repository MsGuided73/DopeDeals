import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  const password = process.env.KAJAPAY_PASSWORD || '';
  const sourceKey = process.env.KAJAPAY_SOURCE_KEY || '';
  const authHeader = 'Basic ' + Buffer.from(`${sourceKey}:${password}`).toString('base64');

  const requestBody = JSON.stringify({
    amount: "99.99",
    ccnumber: "4761530001111118",
    ccexp: "1030",
    cvv: "123"
  });

  const headers = {
    'Authorization': authHeader,
    'Content-Type': 'application/json'
  };

  const endpoints = [
    'https://api.sandbox.kajapaygateway.com/api/v2',
    'https://api.sandbox.kajapaygateway.com/api/v2/charge',
    'https://api.sandbox.kajapaygateway.com/api/v2/transactions',
    'https://api.sandbox.kajapaygateway.com/api/v2/transaction',
    'https://api.sandbox.kajapaygateway.com/api/v2/payments',
    'https://api.sandbox.kajapaygateway.com/api/v2/payment',
    'https://api.sandbox.kajapaygateway.com/api/v2/charges'
  ];

  for(const url of endpoints) {
    try {
      const res = await fetch(url, { method: 'POST', headers, body: requestBody });
      console.log(`${url} -> ${res.status}`);
    } catch(e) {}
  }
}
run();
