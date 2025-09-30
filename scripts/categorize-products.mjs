// Categorize all products in the database
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qirbapivptotybspnbet.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcmJhcGl2cHRvdHlic3BuYmV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTA1MzM2NywiZXhwIjoyMDY2NjI5MzY3fQ.Se6u_YXkMBOJeHYq3n37aqVspl5A-hVgF12SWCZhpr8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Product categories
const PRODUCT_CATEGORIES = [
  {
    id: 'nicotine',
    name: 'Nicotine Products',
    keywords: ['nicotine', 'cigarette', 'cig', 'tobacco', 'vape juice', 'e-liquid'],
    exclusions: [],
    priority: 100
  },
  {
    id: 'papers',
    name: 'Rolling Papers',
    keywords: ['paper', 'rolling paper', 'cigarette paper', 'zig zag', 'raw paper', 'ocb'],
    exclusions: ['bong', 'pipe', 'rig'],
    priority: 90
  },
  {
    id: 'bongs',
    name: 'Bongs & Water Pipes',
    keywords: ['bong', 'water pipe', 'beaker', 'straight tube', 'percolator bong'],
    exclusions: ['dab rig', 'oil rig', 'bubbler', 'hand pipe'],
    priority: 80
  },
  {
    id: 'dab-rigs',
    name: 'Dab Rigs',
    keywords: ['dab rig', 'oil rig', 'concentrate rig', 'quartz banger'],
    exclusions: ['e-rig', 'puffco'],
    priority: 79
  },
  {
    id: 'e-rigs',
    name: 'E-Rigs',
    keywords: ['e-rig', 'electronic rig', 'puffco', 'peak', 'carta'],
    exclusions: [],
    priority: 78
  },
  {
    id: 'pipes',
    name: 'Hand Pipes',
    keywords: ['pipe', 'hand pipe', 'spoon pipe', 'sherlock', 'chillum'],
    exclusions: ['water pipe', 'bong', 'bubbler'],
    priority: 76
  },
  {
    id: 'pre-rolls',
    name: 'Pre-Rolls',
    keywords: ['pre-roll', 'preroll', 'pre roll', 'joint', 'thca pre-roll'],
    exclusions: ['cone', 'paper'],
    priority: 69
  }
];

function categorizeProduct(product) {
  const searchText = `${product.name} ${product.description || ''}`.toLowerCase();
  
  const sortedCategories = [...PRODUCT_CATEGORIES].sort((a, b) => b.priority - a.priority);
  
  for (const category of sortedCategories) {
    const hasKeyword = category.keywords.some(keyword => 
      searchText.includes(keyword.toLowerCase())
    );
    
    if (!hasKeyword) continue;
    
    const hasExclusion = category.exclusions.some(exclusion => 
      searchText.includes(exclusion.toLowerCase())
    );
    
    if (hasExclusion) continue;
    
    return category.id;
  }
  
  return 'accessories';
}

async function categorizeAllProducts() {
  console.log('🔍 Fetching all products...\n');

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, description, nicotine_product, tobacco_product')
    .eq('is_active', true);

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Found ${products.length} products\n`);

  const categorized = {};
  const nicotineProducts = [];

  products.forEach(product => {
    const category = categorizeProduct(product);
    
    if (!categorized[category]) {
      categorized[category] = [];
    }
    categorized[category].push(product);

    // Check for nicotine products
    if (category === 'nicotine' || category === 'papers') {
      const searchText = `${product.name} ${product.description || ''}`.toLowerCase();
      if (searchText.includes('nicotine') || searchText.includes('cigarette') || searchText.includes('tobacco')) {
        nicotineProducts.push(product);
      }
    }
  });

  console.log('📊 Categorization Results:\n');
  Object.entries(categorized)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([category, items]) => {
      const categoryName = PRODUCT_CATEGORIES.find(c => c.id === category)?.name || category;
      console.log(`${categoryName}: ${items.length} products`);
      
      // Show first 3 examples
      items.slice(0, 3).forEach(item => {
        console.log(`   - ${item.name}`);
      });
      console.log('');
    });

  if (nicotineProducts.length > 0) {
    console.log(`\n⚠️ Found ${nicotineProducts.length} nicotine/tobacco products that should be flagged:\n`);
    nicotineProducts.forEach(p => {
      console.log(`   - ${p.name} (ID: ${p.id})`);
    });
    
    console.log('\n💡 To flag these products, run:');
    console.log('   UPDATE products SET nicotine_product = true WHERE id IN (...)');
  }
}

categorizeAllProducts().catch(console.error);

