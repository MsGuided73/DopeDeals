import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function runCategoriesSync() {
  console.log('🔄 Running Categories Sync...\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/zoho/sync-categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fullSync: true
      })
    });
    
    if (!response.ok) {
      console.log(`❌ Categories sync failed: ${response.status}`);
      const errorText = await response.text();
      console.log('Error details:', errorText);
      return;
    }
    
    const result = await response.json();
    console.log('✅ Categories sync completed successfully!');
    console.log('📊 Results:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Categories sync error:', error);
  }
}

runCategoriesSync();
