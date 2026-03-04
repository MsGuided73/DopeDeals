import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

async function testKajaPayV2() {
  const sourceKey = process.env.KAJAPAY_SOURCE_KEY;
  const slug = process.env.KAJAPAY_PAYMENT_PAGE_SLUG;
  const domains = [
    'https://api.sandbox.kajapaygateway.com/api/v2/',
    'https://api.sandbox.kaja-gateway.com/api/v2/'
  ];

  for (const baseUrl of domains) {
    console.log(`\n--- Testing Domain: ${baseUrl} ---`);
    try {
      const payload = {
        one_time_use: true,
        general_fields: {
          amount: "10.00"
        }
      };

      console.log(`Sending minimum payload to ${baseUrl}...`);
      const response = await axios.post(
        `${baseUrl}payment-pages/generate-pay-link/${slug}`,
        payload,
        {
          auth: {
            username: sourceKey,
            password: ''
          },
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Highway420-Checkout/1.0'
          }
        }
      );

      console.log('Success!');
      console.log('Pay Link:', response.data.pay_link);
      return; // Stop if success
    } catch (error: any) {
      console.error('Failed on domain:', baseUrl);
      if (error.response) {
        console.error('Status:', error.response.status);
        if (typeof error.response.data === 'string' && error.response.data.includes('<html>')) {
          console.error('Received HTML (likely 404/500 page)');
        } else {
          console.error('Data:', JSON.stringify(error.response.data, null, 2));
        }
      } else {
        console.error('Message:', error.message);
      }
    }
  }
}

testKajaPayV2();
