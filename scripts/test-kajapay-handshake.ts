import * as dotenv from 'dotenv';
import axios from 'axios';
import * as fs from 'fs';

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
      amount: 99.99,
      orderId: 'TS-' + Date.now(),
      firstName: 'Test',
      lastName: 'User',
      address1: '123 Test St',
      city: 'Testville',
      state: 'CA',
      zip: '90210',
      country: 'US',
      email: 'test@example.com',
      phone: '5551234567',
      return_url: 'https://highway420store.com/success',
      cancel_url: 'https://highway420store.com/cancel'
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
      fs.writeFileSync('kajapay_err1.log', typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data, null, 2));
      console.log('Message written to kajapay_err1.log');
    }
    
  }
}

testAuth();
