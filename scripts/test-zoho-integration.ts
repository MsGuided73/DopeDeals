import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function testZohoIntegration() {
  console.log('🔍 Testing Zoho Integration Status...\n');
  
  // Check environment variables
  console.log('📋 Environment Variables Check:');
  const requiredVars = [
    'ZOHO_CLIENT_ID',
    'ZOHO_CLIENT_SECRET', 
    'ZOHO_REFRESH_TOKEN',
    'ZOHO_ORGANIZATION_ID',
    'ZOHO_BASE_URL'
  ];
  
  let missingVars = 0;
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: Set (${value.substring(0, 10)}...)`);
    } else {
      console.log(`❌ ${varName}: Missing`);
      missingVars++;
    }
  });
  
  if (missingVars > 0) {
    console.log(`\n❌ ${missingVars} required environment variables are missing!`);
    return;
  }
  
  console.log('\n🔄 Testing Zoho API Access...');
  
  try {
    // Test token refresh
    const tokenResponse = await fetch('https://accounts.zoho.com/oauth/v2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
        client_id: process.env.ZOHO_CLIENT_ID!,
        client_secret: process.env.ZOHO_CLIENT_SECRET!,
        grant_type: 'refresh_token'
      })
    });
    
    if (!tokenResponse.ok) {
      console.log(`❌ Token refresh failed: ${tokenResponse.status}`);
      const errorText = await tokenResponse.text();
      console.log('Error details:', errorText);
      return;
    }
    
    const tokenData = await tokenResponse.json();
    console.log('✅ Token refresh successful');
    console.log(`🔑 Access token obtained (expires in ${tokenData.expires_in}s)`);
    
    // Test API connectivity with the new token
    const apiResponse = await fetch(
      `https://www.zohoapis.com/inventory/v1/items?organization_id=${process.env.ZOHO_ORGANIZATION_ID}&per_page=1`,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${tokenData.access_token}`
        }
      }
    );
    
    if (!apiResponse.ok) {
      console.log(`❌ API test failed: ${apiResponse.status}`);
      const errorText = await apiResponse.text();
      console.log('Error details:', errorText);
      return;
    }
    
    const apiData = await apiResponse.json();
    console.log('✅ Zoho Inventory API accessible');
    console.log(`📦 Total items in Zoho: ${apiData.page_context?.total || 'Unknown'}`);
    
    // Test categories endpoint
    const categoriesResponse = await fetch(
      `https://www.zohoapis.com/inventory/v1/categories?organization_id=${process.env.ZOHO_ORGANIZATION_ID}&per_page=1`,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${tokenData.access_token}`
        }
      }
    );
    
    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      console.log('✅ Categories endpoint accessible');
      console.log(`📂 Total categories in Zoho: ${categoriesData.page_context?.total || 'Unknown'}`);
    } else {
      console.log(`⚠️  Categories endpoint issue: ${categoriesResponse.status}`);
    }
    
    console.log('\n🎯 ZOHO INTEGRATION STATUS: HEALTHY ✅');
    console.log('\n📋 Next Steps:');
    console.log('1. Run category sync to populate local categories table');
    console.log('2. Run inventory sync to populate stock levels');
    console.log('3. Run enhanced product sync to update Zoho IDs');
    console.log('4. Run image sync to populate product images');
    
  } catch (error) {
    console.error('❌ Zoho integration test failed:', error);
  }
}

testZohoIntegration();
