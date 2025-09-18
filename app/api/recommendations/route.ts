import { NextRequest, NextResponse } from 'next/server';
import { RecommendationAgent } from '../../../lib/recommendation-agent';
import { getSessionUser } from '../../../lib/supabase-server-ssr';

export async function GET(request: NextRequest) {
  try {
    // Get current user
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required' }, 
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const currentProductId = searchParams.get('currentProduct');
    const limit = parseInt(searchParams.get('limit') || '8');

    // Initialize recommendation agent
    const agent = new RecommendationAgent();
    
    // Get personalized recommendations
    const recommendations = await agent.getPersonalizedRecommendations({
      userId: user.id,
      currentProductId: currentProductId || undefined,
      limit
    });

    return NextResponse.json({
      success: true,
      recommendations,
      user: {
        id: user.id,
        firstName: user.user_metadata?.firstName || user.email?.split('@')[0]
      }
    });
  } catch (error) {
    console.error('❌ Recommendation error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to get recommendations',
        error: String(error)
      }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Track user behavior for better recommendations
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required' }, 
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, action, metadata } = body;

    // Track the behavior
    const agent = new RecommendationAgent();
    await agent.initialize();
    
    await (agent as any).storage.trackUserBehavior({
      user_id: user.id,
      product_id: productId,
      action_type: action, // 'view', 'add_to_cart', 'purchase', 'wishlist'
      session_id: request.headers.get('x-session-id') || 'unknown',
      metadata: metadata || {}
    });

    return NextResponse.json({
      success: true,
      message: 'Behavior tracked successfully'
    });
  } catch (error) {
    console.error('❌ Behavior tracking error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to track behavior',
        error: String(error)
      }, 
      { status: 500 }
    );
  }
}
