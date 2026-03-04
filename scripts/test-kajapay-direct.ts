import { kajaPayClient } from '../lib/services/kajapay/client';

async function testKajaPay() {
  console.log('Testing KajaPay Hosted Checkout endpoint...');
  try {
    const hostedFormResponse = await kajaPayClient.createHostedForm({
      amount: 100.50,
      orderNumber: `TEST-${Date.now()}`,
      orderDescription: `Test Order`,
      firstName: 'John',
      lastName: 'Doe',
      address1: '123 Test St',
      city: 'Testville',
      state: 'CA',
      zip: '90210',
      country: 'US',
      email: 'test@example.com',
      redirectUrl: `http://localhost:3000/checkout/confirmation?orderId=test`,
      cancelUrl: `http://localhost:3000/checkout/review`,
      callbackUrl: `http://localhost:3000/api/webhooks/kajapay`
    });
    console.log('Response:', JSON.stringify(hostedFormResponse, null, 2));
  } catch (err: any) {
    console.error('Fetch Error:', err.message);
  }
}

testKajaPay();
