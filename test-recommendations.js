// Simple test script for the recommendation agent
const { RecommendationAgent } = require('./lib/recommendation-agent');

async function testRecommendations() {
  console.log('🧪 Testing Recommendation Agent...');
  
  try {
    const agent = new RecommendationAgent();
    
    // Test with a mock user
    const recommendations = await agent.getPersonalizedRecommendations({
      userId: 'test-user-123',
      currentProductId: null,
      limit: 5
    });
    
    console.log('✅ Recommendations received:', recommendations.length);
    
    if (recommendations.length > 0) {
      console.log('📋 Sample recommendations:');
      recommendations.slice(0, 3).forEach((rec, i) => {
        console.log(`  ${i + 1}. ${rec.product?.name || 'Unknown Product'} (Score: ${rec.score})`);
        console.log(`     Reason: ${rec.reason}`);
        console.log(`     Category: ${rec.category}`);
      });
    } else {
      console.log('⚠️ No recommendations returned');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testRecommendations();
