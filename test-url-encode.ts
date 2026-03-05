import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const testHeaders = async () => {
    try {
        const key = process.env.KAJAPAY_SOURCE_KEY;
        const password = process.env.KAJAPAY_PASSWORD; // The one with !!!!
        
        if (!key || !password) {
            console.error('Missing env vars');
            return;
        }

        const url1 = 'https://api.sandbox.kajapaygateway.com/api/v2/charge';

        // RAW, unencoded password. If this returns 422, KajaPay accepts the raw basic auth for /charge.
        // If it returns 403, the WAF is blocking it everywhere.
        const rawAuth = 'Basic ' + Buffer.from(key + ':' + password).toString('base64');
        
        console.log('\n--- Test 1: Testing /charge with RAW Password (no URL string encoding) ---');
        try {
            const res1 = await axios.post(url1, { amount: 1.00 }, { headers: { Authorization: rawAuth } });
            console.log('Success:', res1.status, res1.data);
        } catch (e: any) {
            console.log('Failed /charge:', e.response?.status, e.response?.data || e.message);
        }

    } catch (e) { console.error('Error setup', e); }
};
testHeaders();
