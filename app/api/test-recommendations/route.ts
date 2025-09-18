import { NextRequest, NextResponse } from 'next/server';
import { RecommendationAgent } from '../../../lib/recommendation-agent';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing Recommendation Agent...');
    
    // Initialize recommendation agent
    const agent = new RecommendationAgent();
    
    // Test with a mock user (no authentication required)
    const recommendations = await agent.getPersonalizedRecommendations({
      userId: 'test-user-123',
      currentProductId: undefined,
      limit: 5
    });

    console.log(`✅ Generated ${recommendations.length} recommendations`);

    return NextResponse.json({
      success: true,
      message: 'Recommendation agent test completed',
      recommendations: recommendations.map(rec => ({
        productId: rec.productId,
        productName: rec.product?.name || 'Unknown Product',
        score: rec.score,
        reason: rec.reason,
        category: rec.category
      })),
      aiEnabled: (agent as any).isAIEnabled,
      totalRecommendations: recommendations.length
    });
  } catch (error) {
    console.error('❌ Recommendation test error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Recommendation test failed',
        error: String(error),
        aiEnabled: false
      }, 
      { status: 500 }
    );
  }
}
