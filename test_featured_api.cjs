const fetch = require('node-fetch');

async function testFeaturedAPI() {
  try {
    console.log('Testing featured products API...');

    const response = await fetch('http://localhost:3000/api/products/featured');
    const data = await response.json();

    console.log('Response status:', response.status);
    console.log('Response data:');
    console.log(JSON.stringify(data, null, 2));

    if (data.products && data.products.length > 0) {
      console.log(`\nFound ${data.products.length} featured products:`);
      data.products.forEach(product => {
        console.log(`- ${product.name} (ID: ${product.id})`);
      });
    } else {
      console.log('\nNo products found in response');
    }

  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testFeaturedAPI();
