import { kajaPayClient } from '../lib/services/kajapay/client';

async function testKajaPay() {
  console.log('Testing KajaPay Health Endpoint...');
  try {
    const response = await kajaPayClient.healthCheck();
    console.log('Health Response:', JSON.stringify(response, null, 2));
  } catch (err: any) {
    console.error('Fetch Error:', err.message);
  }
}

testKajaPay();
