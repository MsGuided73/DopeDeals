import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const sourceKey = process.env.KAJAPAY_SOURCE_KEY;
const pin = process.env.KAJAPAY_SOURCE_KEY_PIN;

if (!sourceKey || !pin) {
  console.error("Missing KAJAPAY_SOURCE_KEY or KAJAPAY_SOURCE_KEY_PIN in .env");
  process.exit(1);
}

const ENDPOINT = 'https://api.sandbox.kajapaygateway.com/api/v2/charge';

// Base64 encode the basic auth header
const authHeader = Buffer.from(`${sourceKey}:${pin}`).toString('base64');

async function testChargeEndpoint() {
  console.log('--- KajaPay Direct Charge Test ---');
  console.log(`Endpoint: ${ENDPOINT}`);
  console.log(`SourceKey length: ${sourceKey?.length}`);
  console.log(`PIN length: ${pin?.length}`);
  
  console.log('\nAttempting a fake $1.00 charge...');

  try {
    const response = await axios.post(ENDPOINT, {
      amount: 1.00,
      sourceKey: sourceKey,
      orderNumber: 'TEST-CHARGE-' + Date.now(),
      orderDescription: 'Test Order bypass hosted form',
      firstName: 'Test',
      lastName: 'User',
      address1: '123 Fake St',
      city: 'Testville',
      state: 'CA',
      zip: '90210',
      country: 'US',
      email: 'test@highway420store.com',
      // Dummy VISA card
      cardNumber: '4111111111111111',
      expiryMonth: '12',
      expiryYear: '2028',
      cvv: '123'
    }, {
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    console.log('\n✅ Success! The API accepted the charge payload.');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));

  } catch (error: any) {
    if (error.response) {
      console.log('\n❌ API Responded with an Error Status');
      console.log('Status code:', error.response.status);
      
      const isHtml = typeof error.response.data === 'string' && error.response.data.includes('<html');
      
      if (isHtml) {
        console.log('It returned an HTML page (likely Nginx firewall block). Saving to kajapay_charge_err.html...');
        fs.writeFileSync('kajapay_charge_err.html', error.response.data);
      } else {
        console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
      }
    } else {
      console.log('\n❌ Request Failed');
      console.log('Message:', error.message);
    }
  }
}

testChargeEndpoint();
