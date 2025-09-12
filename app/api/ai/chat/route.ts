import { NextRequest, NextResponse } from 'next/server';
import { AIProductIntelligence } from '@/lib/ai-product-intelligence';
import { getSessionUser } from '@/lib/supabase-server-ssr';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId, context = {} } = body;

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get current user (optional)
    const user = await getSessionUser();
    
    // Initialize AI system
    const ai = new AIProductIntelligence();
    
    // Build query context
    const queryContext = {
      userId: user?.id,
      sessionId: sessionId || 'anonymous',
      currentPage: context.currentPage,
      userPreferences: context.userPreferences,
      conversationHistory: context.conversationHistory || []
    };

    // Get AI response
    const response = await ai.query(message, queryContext);

    // Track the interaction for analytics
    if (user) {
      try {
        await (ai as any).storage.trackUserBehavior({
          user_id: user.id,
          action_type: 'ai_chat',
          session_id: sessionId || 'anonymous',
          metadata: {
            question: message,
            confidence: response.confidence,
            sources: response.sources,
            timestamp: new Date().toISOString()
          }
        });
      } catch (error) {
        console.error('Error tracking AI interaction:', error);
      }
    }

    return NextResponse.json({
      success: true,
      response: {
        message: response.answer,
        recommendations: response.recommendations,
        confidence: response.confidence,
        sources: response.sources,
        followUpQuestions: response.followUpQuestions,
        actionSuggestions: response.actionSuggestions,
        timestamp: new Date().toISOString()
      },
      user: user ? {
        id: user.id,
        firstName: user.user_metadata?.firstName || user.email?.split('@')[0]
      } : null
    });

  } catch (error) {
    console.error('❌ AI Chat error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process your question. Please try again.',
        details: String(error)
      }, 
      { status: 500 }
    );
  }
}

// GET endpoint for chat history or system status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'status') {
      // Return AI system status
      return NextResponse.json({
        status: 'healthy',
        features: [
          'Product Knowledge Base',
          'Semantic Search',
          'Personalized Recommendations',
          'Compliance Awareness',
          'Real-time Inventory'
        ],
        lastUpdated: new Date().toISOString()
      });
    }

    if (action === 'suggestions') {
      // Return conversation starters
      const user = await getSessionUser();
      const suggestions = user ? [
        "What's new in your CBD collection?",
        "Show me products similar to my last purchase",
        "What's the best vape for beginners?",
        "Do you have any premium glass pieces?",
        "What products are trending this week?"
      ] : [
        "What types of products do you carry?",
        "What's the difference between CBD and Delta-8?",
        "Show me your most popular items",
        "What do you recommend for beginners?",
        "Do you have any current promotions?"
      ];

      return NextResponse.json({
        suggestions,
        greeting: user 
          ? `Hey ${user.user_metadata?.firstName || 'there'}! What can I help you find today? 🌟`
          : "Welcome to DopeDeals! I'm your AI product expert. What can I help you discover? 🚀"
      });
    }

    return NextResponse.json(
      { error: 'Invalid action parameter' },
      { status: 400 }
    );

  } catch (error) {
    console.error('❌ AI Chat GET error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
