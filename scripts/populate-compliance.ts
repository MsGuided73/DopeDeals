import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

async function main() {
  console.log('🚀 Starting Compliance Database Population...');
  
  // Use dynamic imports to ensure env vars are loaded first
  const { complianceService } = await import('../server/compliance/service.js');
  const { bulkClassifyProducts } = await import('../server/services/aiClassifier.js');
  const { storage } = await import('../server/supabase-storage.js');

  try {
    // 1. Initialize logic-based rules
    console.log('📦 Initializing default compliance rules...');
    try {
      await complianceService.initializeDefaultRules();
      console.log('✅ Default rules initialized.');
    } catch (e) {
      console.error('❌ Failed to initialize default rules:', e);
      throw e;
    }

    // 2. Get total product count
    const allProducts = await storage.getProducts();
    
    // Parse limit from args if present: --limit=10
    const limitArg = process.argv.find(arg => arg.startsWith('--limit='));
    const limit = limitArg ? parseInt(limitArg.split('=')[1]) : 5000;
    
    console.log(`📊 Found ${allProducts.length} active products. Processing limit: ${limit}`);

    // 3. Run bulk classification
    console.log('🤖 Starting AI Bulk Classification...');
    try {
      const result = await bulkClassifyProducts(undefined, limit);
      console.log('✅ Bulk Classification Complete!');
      console.log(`   - Processed: ${result.processed}`);
      console.log(`   - Classified: ${result.classified}`);
      console.log(`   - Errors: ${result.errors}`);
    } catch (e) {
      console.error('❌ Bulk classification crashed:', e);
      throw e;
    }

  } catch (error) {
    console.error('❌ Error during compliance population:', error);
    process.exit(1);
  }
}

main().then(() => {
  console.log('🎉 Done!');
  process.exit(0);
});
