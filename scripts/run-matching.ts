#!/usr/bin/env node

import { runProductMatching } from './product-matching-system';
import { runImageSync } from './sync-product-images';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'analyze';
  
  console.log('🔧 PRODUCT MATCHING SYSTEM');
  console.log('=' .repeat(50));
  
  try {
    switch (command) {
      case 'analyze':
      case 'test':
        console.log('📊 Running matching analysis...');
        await runProductMatching();
        break;
        
      case 'sync-dry':
        console.log('🔍 Running image sync (DRY RUN)...');
        await runImageSync({ dryRun: true });
        break;
        
      case 'sync-live':
        console.log('🚀 Running image sync (LIVE)...');
        await runImageSync({ dryRun: false });
        break;
        
      case 'help':
      default:
        console.log('Available commands:');
        console.log('  analyze    - Analyze product matching (default)');
        console.log('  sync-dry   - Test image sync without making changes');
        console.log('  sync-live  - Apply image sync changes');
        console.log('  help       - Show this help');
        break;
    }
    
    console.log('\n✅ Complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
