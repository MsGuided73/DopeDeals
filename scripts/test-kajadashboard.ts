import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const ENDPOINT = 'https://kajadashboard.com/api/gateway/hosted-form';

const sourceKey = process.env.KAJAPAY_SOURCE_KEY;
const pin = process.env.KAJAPAY_SOURCE_KEY_PIN;
const authHeader = Buffer.from(`${sourceKey}:${pin}`).toString('base64');

async function testKajaDashboard() {
  console.log(`Testing endpoint: ${ENDPOINT}`);
  try {
    const response = await axios.post(ENDPOINT, {
      amount: 1.00,
      orderId: 'TEST-' + Date.now(),
      firstName: 'Test',
      lastName: 'User'
    }, {
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('\n✅ Success! Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));

  } catch (error: any) {
    if (error.response) {
      console.log('\n❌ API Responded with an Error Status');
      console.log('Status code:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('\n❌ Request Failed:', error.message);
    }
  }
}

testKajaDashboard();
