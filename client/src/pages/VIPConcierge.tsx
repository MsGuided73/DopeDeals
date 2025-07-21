import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Send, 
  MessageCircle, 
  User, 
  Bot, 
  Star, 
  ShoppingCart,
  Heart,
  ExternalLink,
  Lightbulb
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  messageType: 'text' | 'product_recommendation' | 'comparison' | 'support';
  createdAt: Date;
  metadata?: any;
}

interface ProductRecommendation {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    brand: string;
    imageUrl?: string;
    inStock: boolean;
    vipExclusive: boolean;
  };
  type: 'primary' | 'alternative' | 'complementary';
  confidence: number;
  reason: string;
  features: string[];
}

interface ConciergeResponse {
  message: string;
  messageType: 'text' | 'product_recommendation' | 'comparison' | 'support';
  recommendations?: ProductRecommendation[];
  suggestedQueries?: string[];
  escalate?: boolean;
  metadata?: any;
}

export default function VIPConcierge() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);
  const [suggestedQueries, setSuggestedQueries] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startConversation = async () => {
    try {
      setIsLoading(true);
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const response = await fetch('/api/concierge/conversation/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          customerInfo: {
            membershipTier: 'VIP Premium', // This would come from user context
            preferences: {
              categories: ['Glass Pipes', 'Dab Rigs'],
              priceRange: { min: 50, max: 500 }
            }
          }
        })
      });

      if (!response.ok) throw new Error('Failed to start conversation');

      const data = await response.json();
      setConversationId(data.data.conversationId);
      
      const welcomeMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: data.data.message,
        messageType: 'text',
        createdAt: new Date()
      };
      
      setMessages([welcomeMessage]);
      setSuggestedQueries([
        'Show me VIP exclusive products',
        'What\'s trending this month?',
        'Recommend glass pipes for beginners',
        'Compare dab rigs vs glass pipes'
      ]);
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to start conversation with VIP Concierge",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    if (!conversationId || !message.trim()) return;

    try {
      setIsTyping(true);
      
      // Add user message immediately
      const userMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'user',
        content: message,
        messageType: 'text',
        createdAt: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');

      // Send to AI
      const response = await fetch('/api/concierge/conversation/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          message,
          context: {
            currentPage: '/concierge',
            viewedProducts: [],
            cartItems: [],
            searchHistory: []
          }
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data: { success: boolean; data: ConciergeResponse } = await response.json();
      
      // Add assistant response
      const assistantMessage: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        role: 'assistant',
        content: data.data.message,
        messageType: data.data.messageType,
        createdAt: new Date(),
        metadata: data.data.metadata
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Update recommendations and suggestions
      if (data.data.recommendations) {
        setRecommendations(data.data.recommendations);
      }
      if (data.data.suggestedQueries) {
        setSuggestedQueries(data.data.suggestedQueries);
      }
      
    } catch (error) {
      toast({
        title: "Message Error",
        description: "Failed to send message to VIP Concierge",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedQuery = (query: string) => {
    setInputMessage(query);
    sendMessage(query);
  };

  const trackRecommendationClick = async (recommendationId: string) => {
    if (!conversationId) return;
    
    try {
      await fetch('/api/concierge/recommendation/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recommendationId,
          conversationId
        })
      });
    } catch (error) {
      console.error('Failed to track recommendation click:', error);
    }
  };

  useEffect(() => {
    startConversation();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[700px] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-purple-600" />
                VIP Concierge
                <Badge variant="secondary" className="ml-auto">AI Powered</Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                        
                        {message.messageType === 'product_recommendation' && (
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              Product Recommendations
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      {message.role === 'user' && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>
              
              {/* Suggested Queries */}
              {suggestedQueries.length > 0 && (
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Suggested Questions
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQueries.map((query, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestedQuery(query)}
                        className="text-xs"
                      >
                        {query}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me about products, recommendations, or anything else..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(inputMessage);
                      }
                    }}
                    disabled={isLoading || isTyping}
                  />
                  <Button
                    onClick={() => sendMessage(inputMessage)}
                    disabled={!inputMessage.trim() || isLoading || isTyping}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recommendations Sidebar */}
        <div className="space-y-6">
          {/* Product Recommendations */}
          {recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => trackRecommendationClick(`rec_${index}`)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">{rec.product.name}</h4>
                      {rec.product.vipExclusive && (
                        <Badge variant="secondary" className="text-xs">VIP</Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-2">
                      {rec.product.description}
                    </p>
                    
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-purple-600">
                        ${rec.product.price}
                      </span>
                      <Badge 
                        variant={rec.product.inStock ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {rec.product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-2">
                      {rec.reason}
                    </p>
                    
                    {rec.features.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {rec.features.slice(0, 3).map((feature, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Add to Cart
                      </Button>
                      <Button size="sm" variant="outline">
                        <Heart className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          
          {/* Chat Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Concierge Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Bot className="h-4 w-4 text-purple-600" />
                  AI-Powered Recommendations
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-yellow-500" />
                  VIP Member Perks
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MessageCircle className="h-4 w-4 text-blue-600" />
                  Real-time Product Search
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  Expert Product Knowledge
                </div>
              </div>
              
              <Separator />
              
              <div className="text-xs text-gray-500">
                Your VIP Concierge has access to our complete product catalog 
                and can provide personalized recommendations based on your 
                preferences and purchase history.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}