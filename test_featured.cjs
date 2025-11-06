const fetch = require('node-fetch');

async function testFeaturedAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/products/featured');
    const data = await response.json();

    console.log('Featured products API response:');
    console.log('Total products:', data.products?.length || 0);

    if (data.products && data.products.length > 0) {
      console.log('\nFirst 3 products:');
      data.products.slice(0, 3).forEach((product, index) => {
        console.log(`\nProduct ${index + 1}:`);
        console.log(`  ID: ${product.id}`);
        console.log(`  Name: ${product.name}`);
        console.log(`  Image URL: ${product.image_url || 'NO IMAGE'}`);
        console.log(`  Brand: ${product.brand_name || 'Unknown'}`);
        console.log(`  Featured: ${product.featured}`);
      });
    }
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testFeaturedAPI();
