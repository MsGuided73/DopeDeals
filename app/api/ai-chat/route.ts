import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface ProductRecommendation {
  id: string;
  name: string;
  sku: string;
  price: number;
  image_url?: string;
  short_description?: string;
  in_stock: boolean;
  estimated_delivery?: number;
  dimensions?: string;
  weight?: string;
  sales_velocity?: number;
  profit_margin?: number;
  why_recommended: string;
}

interface ChatMessage {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversation_history } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Analyze user intent and extract keywords
    const intent = analyzeUserIntent(message);
    const keywords = extractKeywords(message);

    // Get product recommendations based on intent and enhanced data
    const recommendations = await getProductRecommendations(intent, keywords, message);

    // Generate AI response
    const response = generateAIResponse(intent, keywords, recommendations, message);

    return NextResponse.json({
      response,
      recommendations: recommendations.slice(0, 3), // Limit to top 3 recommendations
      intent,
      keywords
    });

  } catch (error) {
    console.error('AI Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function analyzeUserIntent(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Budget-related intents
  if (lowerMessage.includes('under') || lowerMessage.includes('budget') || lowerMessage.includes('cheap') || lowerMessage.includes('affordable')) {
    return 'budget_conscious';
  }
  
  // Shipping-related intents
  if (lowerMessage.includes('fast') || lowerMessage.includes('quick') || lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
    return 'fast_shipping';
  }
  
  // Quality-related intents
  if (lowerMessage.includes('best') || lowerMessage.includes('premium') || lowerMessage.includes('quality') || lowerMessage.includes('top')) {
    return 'quality_focused';
  }
  
  // Size-related intents
  if (lowerMessage.includes('small') || lowerMessage.includes('portable') || lowerMessage.includes('travel')) {
    return 'size_conscious';
  }
  
  // Brand-specific intents
  if (lowerMessage.includes('brand') || lowerMessage.includes('puffco') || lowerMessage.includes('roor') || lowerMessage.includes('raw')) {
    return 'brand_specific';
  }
  
  // Beginner intents
  if (lowerMessage.includes('beginner') || lowerMessage.includes('first') || lowerMessage.includes('new') || lowerMessage.includes('start')) {
    return 'beginner_friendly';
  }
  
  return 'general_inquiry';
}

function extractKeywords(message: string): string[] {
  const lowerMessage = message.toLowerCase();
  const keywords: string[] = [];
  
  // Product categories
  const categories = ['bong', 'pipe', 'vape', 'grinder', 'paper', 'lighter', 'ash', 'chamber', 'atomizer'];
  categories.forEach(category => {
    if (lowerMessage.includes(category)) keywords.push(category);
  });
  
  // Brands
  const brands = ['puffco', 'roor', 'raw', 'storz', 'bickel'];
  brands.forEach(brand => {
    if (lowerMessage.includes(brand)) keywords.push(brand);
  });
  
  // Price indicators
  const priceMatches = lowerMessage.match(/\$(\d+)/g);
  if (priceMatches) {
    keywords.push(...priceMatches);
  }
  
  return keywords;
}

async function getProductRecommendations(
  intent: string, 
  keywords: string[], 
  originalMessage: string
): Promise<ProductRecommendation[]> {
  
  let query = supabase
    .from('products')
    .select(`
      id, name, sku, price, image_url, short_description, stock_quantity,
      length, width, height, weight, weight_unit,
      sales_velocity, profit_margin, lead_time_days,
      estimated_delivery, brand_name
    `)
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false)
    .gt('stock_quantity', 0);

  // Apply filters based on intent
  switch (intent) {
    case 'budget_conscious':
      query = query.lte('price', 100).order('price', { ascending: true });
      break;
    case 'fast_shipping':
      query = query.not('estimated_delivery', 'is', null).order('estimated_delivery', { ascending: true });
      break;
    case 'quality_focused':
      query = query.gte('price', 50).order('profit_margin', { ascending: false });
      break;
    case 'size_conscious':
      query = query.not('length', 'is', null).order('length', { ascending: true });
      break;
    default:
      query = query.order('sales_velocity', { ascending: false });
  }

  // Apply keyword filters
  if (keywords.length > 0) {
    const keywordFilter = keywords.map(keyword => `name.ilike.%${keyword}%`).join(',');
    query = query.or(keywordFilter);
  }

  const { data: products, error } = await query.limit(10);

  if (error) {
    console.error('Product query error:', error);
    return [];
  }

  if (!products) return [];

  // Convert to recommendations with reasoning
  return products.map(product => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    price: product.price,
    image_url: product.image_url,
    short_description: product.short_description,
    in_stock: (product.stock_quantity || 0) > 0,
    estimated_delivery: product.estimated_delivery || calculateEstimatedDelivery(product),
    dimensions: formatDimensions(product),
    weight: formatWeight(product),
    sales_velocity: product.sales_velocity,
    profit_margin: product.profit_margin,
    why_recommended: generateRecommendationReason(product, intent, keywords)
  }));
}

function calculateEstimatedDelivery(product: any): number {
  // Base delivery time
  let days = 3;
  
  // Add lead time if product needs restocking
  if (product.stock_quantity <= 5 && product.lead_time_days) {
    days += product.lead_time_days;
  }
  
  // Factor in product size (larger items take longer)
  if (product.length && product.width && product.height) {
    const volume = product.length * product.width * product.height;
    if (volume > 1000) days += 1; // Large items
  }
  
  return Math.min(days, 14); // Cap at 2 weeks
}

function formatDimensions(product: any): string | undefined {
  if (product.length && product.width && product.height) {
    return `${product.length}"×${product.width}"×${product.height}"`;
  }
  return undefined;
}

function formatWeight(product: any): string | undefined {
  if (product.weight) {
    return `${product.weight} ${product.weight_unit || 'lbs'}`;
  }
  return undefined;
}

function generateRecommendationReason(product: any, intent: string, keywords: string[]): string {
  const reasons: string[] = [];
  
  switch (intent) {
    case 'budget_conscious':
      reasons.push(`Great value at $${product.price}`);
      break;
    case 'fast_shipping':
      reasons.push(`Ships in ${product.estimated_delivery || 3} days`);
      break;
    case 'quality_focused':
      if (product.profit_margin > 30) reasons.push('Premium quality product');
      break;
    case 'size_conscious':
      if (product.length && product.length < 12) reasons.push('Compact and portable');
      break;
  }
  
  // Add sales velocity reasoning
  if (product.sales_velocity > 10) {
    reasons.push('Popular choice - high sales velocity');
  }
  
  // Add keyword matching
  keywords.forEach(keyword => {
    if (product.name.toLowerCase().includes(keyword.toLowerCase())) {
      reasons.push(`Matches your search for "${keyword}"`);
    }
  });
  
  // Add brand reasoning
  if (product.brand_name) {
    reasons.push(`From trusted brand ${product.brand_name}`);
  }
  
  return reasons.length > 0 ? reasons[0] : 'Recommended based on your preferences';
}

function generateAIResponse(
  intent: string, 
  keywords: string[], 
  recommendations: ProductRecommendation[], 
  originalMessage: string
): string {
  
  const responses = {
    budget_conscious: [
      "I found some great budget-friendly options for you! These products offer excellent value without compromising on quality.",
      "Here are some affordable choices that won't break the bank but still deliver great performance.",
    ],
    fast_shipping: [
      "I've found products that can ship quickly to get to you fast! Here are the best options for speedy delivery.",
      "These items are in stock and ready to ship - perfect for when you need something soon.",
    ],
    quality_focused: [
      "I've selected some premium products that represent the best quality in our collection.",
      "These are top-tier products that serious enthusiasts love - built to last and perform exceptionally.",
    ],
    size_conscious: [
      "Here are some compact and portable options that are perfect for travel or smaller spaces.",
      "These products are designed with portability in mind while maintaining great functionality.",
    ],
    brand_specific: [
      "I found some excellent products from the brands you're interested in.",
      "Here are some top picks from trusted brands in our collection.",
    ],
    beginner_friendly: [
      "Perfect! I've selected some beginner-friendly options that are easy to use and great for getting started.",
      "These products are ideal for newcomers - simple to use with great performance.",
    ],
    general_inquiry: [
      "Based on your request, I've found some great products that should meet your needs.",
      "Here are some recommendations I think you'll love based on what you're looking for.",
    ]
  };
  
  const responseOptions = responses[intent as keyof typeof responses] || responses.general_inquiry;
  const baseResponse = responseOptions[Math.floor(Math.random() * responseOptions.length)];
  
  let additionalInfo = '';
  
  if (recommendations.length > 0) {
    const avgPrice = recommendations.reduce((sum, p) => sum + p.price, 0) / recommendations.length;
    const avgDelivery = recommendations.reduce((sum, p) => sum + (p.estimated_delivery || 3), 0) / recommendations.length;
    
    additionalInfo = ` The average price is around $${avgPrice.toFixed(0)}, and most items can be delivered within ${Math.ceil(avgDelivery)} days.`;
    
    // Add specific insights based on enhanced data
    const fastShipping = recommendations.filter(p => (p.estimated_delivery || 3) <= 3);
    if (fastShipping.length > 0) {
      additionalInfo += ` ${fastShipping.length} of these items can ship within 3 days.`;
    }
  }
  
  return baseResponse + additionalInfo + " Feel free to ask me more specific questions about any of these products!";
}
