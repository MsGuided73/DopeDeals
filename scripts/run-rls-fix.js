import { fixRLSPolicies } from '../server/utils/rls-fix-simple.js';

console.log('🔧 Running RLS policy fix...');

fixRLSPolicies()
  .then(result => {
    console.log('✅ RLS Fix completed successfully:', result);
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ RLS Fix failed:', error);
    process.exit(1);
  });