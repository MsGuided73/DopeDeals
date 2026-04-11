// Mocking the getProducts logic to verify the filter was added correctly
import { readFileSync } from 'fs';

function verifyCodeChange() {
  const content = readFileSync('c:/dev/Highway420-1/lib/storage.ts', 'utf8');
  
  const hasFilter = content.includes(".eq('is_active', true)");
  const getProductsSection = content.indexOf('getProducts(');
  const filterAfterGetProducts = content.slice(getProductsSection, getProductsSection + 1000).includes(".eq('is_active', true)");

  if (hasFilter && filterAfterGetProducts) {
    console.log('Verification Success: .eq("is_active", true) filter is present in the getProducts method.');
  } else {
    console.error('Verification Failure: .eq("is_active", true) filter is missing or misplaced.');
    process.exit(1);
  }
}

verifyCodeChange();
