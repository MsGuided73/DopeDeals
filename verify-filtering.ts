import { getStorage } from './lib/storage.ts';

async function verifyActiveFiltering() {
  console.log('--- Verifying Active Product Filtering ---');
  try {
    const storage = await getStorage();
    
    console.log('Testing getProducts()...');
    const products = await storage.getProducts({});
    
    const inactiveProducts = products.filter(p => !p.is_active);
    
    if (inactiveProducts.length > 0) {
      console.error('FAILURE: Found inactive products in storage.getProducts():');
      inactiveProducts.forEach(p => console.error(` - ${p.name} (ID: ${p.id})`));
      process.exit(1);
    } else {
      console.log('SUCCESS: No inactive products found in getProducts().');
    }

    console.log('Testing getAllProducts()...');
    const allProducts = await storage.getAllProducts();
    const inactiveInAll = allProducts.filter(p => !p.is_active);

    if (inactiveInAll.length > 0) {
      console.error('FAILURE: Found inactive products in storage.getAllProducts():');
      inactiveInAll.forEach(p => console.error(` - ${p.name} (ID: ${p.id})`));
      process.exit(1);
    } else {
      console.log('SUCCESS: No inactive products found in getAllProducts().');
    }

    console.log('Filtering verification passed.');
  } catch (error) {
    console.error('Verification failed with error:', error);
    process.exit(1);
  }
}

verifyActiveFiltering();
