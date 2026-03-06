import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config({ path: '.env' });

const SOURCE_KEY = process.env.KAJAPAY_SOURCE_KEY || 'LARVVwqWOgpnaKdPyzrRqV4XIq8wZwZT';
const PIN = process.env.KAJAPAY_SOURCE_KEY_PIN || 'H42026';
const SLUG = process.env.KAJAPAY_PAYMENT_PAGE_SLUG || 'TestXYZ123';
const TOKEN_KEY = process.env.KAJAPAY_TOKENIZATION_KEY;

console.log('--- KajaPay API Handshake Test ---');
console.log(`Source Key: ${SOURCE_KEY}`);
console.log(`PIN (Username Password): ${PIN}`);
console.log(`Payment Page Slug: ${SLUG}`);
console.log(`Tokenization Key: ${TOKEN_KEY || 'MISSING'}`);

// The endpoint provided by Sam's context or inferred from V2 docs
const ENDPOINT = `https://api.sandbox.kajapaygateway.com/api/v2/payment-pages/generate-pay-link/${SLUG}`;

async function testAuth() {
  console.log(`Source Key: ${SOURCE_KEY.substring(0, 5)}...`);
  console.log(`PIN: ${PIN}`);
  console.log(`Slug: ${SLUG}`);

  const authHeader = Buffer.from(`${SOURCE_KEY}:${PIN}`).toString('base64');

  try {
    console.log('\nTesting Basic Auth (SourceKey:PIN)...');
    const response = await axios.post(ENDPOINT, {
      amount: '99.99',
      orderid: 'TS-' + Date.now(),
      first_name: 'Test',
      last_name: 'User'
    }, {
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Success!');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));

  } catch (error: any) {
    console.log('\nFailed.');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Message:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    
    // Fallback: Test without PIN (SourceKey as Username, empty Password)
    try {
      console.log('\nTesting Basic Auth (SourceKey:) [Empty Password]...');
      const authHeaderEmpty = Buffer.from(`${SOURCE_KEY}:`).toString('base64');
      const response = await axios.post(ENDPOINT, {
        amount: '1.00',
        orderid: 'TS-EMPTY-' + Date.now()
      }, {
        headers: {
          'Authorization': `Basic ${authHeaderEmpty}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Success (Empty Password)!');
      console.log('Data:', response.data);
    } catch (e: any) {
      console.log('Failed (Empty Password).');
    }
  }
}

testAuth();
