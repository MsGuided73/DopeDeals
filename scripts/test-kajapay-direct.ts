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
      redirectUrl: `http://localhost:3000/checkout/success?orderId=test`,
      cancelUrl: `http://localhost:3000/checkout/error?orderId=test`,
      callbackUrl: `http://localhost:3000/api/kajapay/webhook`
    });
    console.log('Response:', JSON.stringify(hostedFormResponse, null, 2));
  } catch (err: any) {
    console.error('Fetch Error:', err.message);
  }
}

testKajaPay();
