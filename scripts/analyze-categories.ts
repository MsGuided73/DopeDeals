import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeProductCategories() {
  console.log('🔍 Analyzing existing product data for category patterns...\n');
  
  try {
    // Check what Zoho category names we have
    const { data: zohoCategories } = await supabase
      .from('products')
      .select('zoho_category_name')
      .not('zoho_category_name', 'is', null)
      .limit(100);
    
    const categoryNames = [...new Set(zohoCategories?.map(p => p.zoho_category_name))];
    console.log('📂 Zoho Category Names found:');
    categoryNames.forEach(name => console.log('  -', name));
    
    // Check product names for category hints
    const { data: products } = await supabase
      .from('products')
      .select('name, sku, brand_name')
      .eq('is_active', true)
      .limit(500);
    
    console.log('\n🔍 Product name analysis for category hints:');
    const categoryHints = new Set();
    const categoryMatches: Record<string, number> = {};
    
    products?.forEach(product => {
      const name = product.name?.toLowerCase() || '';
      const sku = product.sku?.toLowerCase() || '';
      
      // Look for category keywords
      const checks = [
        { keywords: ['bong', 'water pipe'], category: 'Bongs & Water Pipes' },
        { keywords: ['pipe'], exclude: ['water'], category: 'Hand Pipes' },
        { keywords: ['dab rig', 'dabrig'], category: 'Dab Rigs' },
        { keywords: ['vape', 'vaporizer'], category: 'Vaporizers' },
        { keywords: ['torch', 'lighter'], category: 'Torches & Lighters' },
        { keywords: ['grinder'], category: 'Grinders' },
        { keywords: ['rolling', 'paper'], category: 'Rolling Papers' },
        { keywords: ['thca flower'], category: 'THCA Flower' },
        { keywords: ['pre-roll', 'preroll'], category: 'Pre-Rolls' },
        { keywords: ['concentrate', 'wax', 'shatter', 'rosin'], category: 'Concentrates' },
        { keywords: ['hookah'], category: 'Hookahs' },
        { keywords: ['e-rig', 'erig', 'electric rig'], category: 'E-Rigs' },
        { keywords: ['tool', 'dabber'], category: 'Dab Tools' },
        { keywords: ['accessory'], category: 'Accessories' },
        { keywords: ['glass', 'bowl'], category: 'Glass Accessories' },
        { keywords: ['hemp', 'cbd'], category: 'Hemp & CBD' },
        { keywords: ['delta'], category: 'Delta Products' },
        { keywords: ['edible'], category: 'Edibles' }
      ];
      
      checks.forEach(check => {
        const hasKeyword = check.keywords.some(keyword => name.includes(keyword) || sku.includes(keyword));
        const hasExclude = check.exclude?.some(exclude => name.includes(exclude) || sku.includes(exclude));
        
        if (hasKeyword && !hasExclude) {
          categoryHints.add(check.category);
          categoryMatches[check.category] = (categoryMatches[check.category] || 0) + 1;
        }
      });
    });
    
    console.log('📋 Category hints from product names:');
    [...categoryHints].sort().forEach(hint => {
      console.log(`  - ${hint} (${categoryMatches[hint]} matches)`);
    });
    
    // Based on the landing page collections, suggest the core categories
    console.log('\n🎯 RECOMMENDED CORE CATEGORIES (based on landing page collections):');
    const coreCategories = [
      'THCA Flower',
      'Pre-Rolls', 
      'Concentrates',
      'Bongs & Water Pipes',
      'Dab Rigs',
      'E-Rigs',
      'Hand Pipes',
      'Vaporizers',
      'Hookahs',
      'Dab Tools',
      'Torches & Lighters',
      'Grinders',
      'Rolling Papers',
      'Glass Accessories',
      'Accessories',
      'Hemp & CBD',
      'Delta Products',
      'Edibles'
    ];
    
    coreCategories.forEach((category, index) => {
      const matches = categoryMatches[category] || 0;
      console.log(`${index + 1}. ${category} ${matches > 0 ? `(${matches} products)` : '(new category)'}`);
    });
    
    console.log('\n💡 NEXT STEPS:');
    console.log('1. Create these core categories in the database');
    console.log('2. Run Zoho category sync to get additional categories');
    console.log('3. Map products to appropriate categories');
    console.log('4. Update product category assignments');
    
  } catch (error) {
    console.error('❌ Error analyzing categories:', error);
  }
}

analyzeProductCategories();
