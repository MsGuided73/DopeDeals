import { DiditAdapter } from '../lib/services/age-verification/didit-adapter';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local specifically for the Link Handshake test
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runLinkHandshake() {
  console.log('--- Phase 2: Link (Didit Age Verification) ---');
  
  const apiKey = process.env.DIDIT_API_KEY;
  if (!apiKey) {
    console.error('❌ ERROR: DIDIT_API_KEY is missing from .env.local');
    process.exit(1);
  } else {
    console.log(`✅ API Key detected: ${apiKey.substring(0, 8)}...`);
  }

  const adapter = new DiditAdapter();

  try {
    console.log('\nTesting session creation (Simulating user "test_user_123" clicking Verify Age)...');
    
    // We expect this to fail with a 401 if the key is bad, or print a URL if good!
    const sessionUrl = await adapter.createSession('test_user_123');
    
    console.log('✅ Success! Didit generated a session URL:');
    console.log(sessionUrl);
    console.log('\nHandshake Complete. We are cleared to move to Phase 3 (Architecting the Webhook/Frontend).');
    
  } catch (error) {
    console.error('\n❌ Link Handshake Failed.', error);
    process.exit(1);
  }
}

runLinkHandshake();
