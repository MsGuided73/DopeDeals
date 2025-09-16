"use client";
import { useState, useEffect, useRef } from 'react';
import { supabaseBrowser } from '../app/lib/supabase-browser';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  ShoppingCart, 
  Heart,
  MessageCircle,
  Loader2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  recommendations?: any[];
  confidence?: number;
  sources?: string[];
  followUpQuestions?: string[];
  actionSuggestions?: string[];
}

interface AIProductChatProps {
  className?: string;
  initialOpen?: boolean;
  context?: {
    currentPage?: string;
    currentProduct?: string;
  };
}

export default function AIProductChat({ 
  className = "",
  initialOpen = false,
  context = {}
}: AIProductChatProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [greeting, setGreeting] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(Math.random().toString(36).substring(7));

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      setUser(user);
    };
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Load suggestions when component mounts
    loadSuggestions();
  }, [user]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadSuggestions = async () => {
    try {
      const response = await fetch('/api/ai/chat?action=suggestions');
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
        setGreeting(data.greeting || '');
      }
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabaseBrowser.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          message,
          sessionId: sessionId.current,
          context: {
            ...context,
            conversationHistory: messages.slice(-5) // Last 5 messages for context
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: data.response.message,
          timestamp: new Date(),
          recommendations: data.response.recommendations,
          confidence: data.response.confidence,
          sources: data.response.sources,
          followUpQuestions: data.response.followUpQuestions,
          actionSuggestions: data.response.actionSuggestions
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Failed to get AI response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  if (!isOpen) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <Card className="w-96 h-[600px] shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="w-5 h-5" />
              DopeDeals AI
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              ×
            </Button>
          </div>
          <p className="text-sm text-white/90">
            Your intelligent product assistant
          </p>
        </CardHeader>

        <CardContent className="flex flex-col h-[500px] p-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mx-auto">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {greeting || "Hi there! 👋"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Ask me anything about our products!
                  </p>
                </div>
                
                {suggestions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-medium">Try asking:</p>
                    {suggestions.slice(0, 3).map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs h-8 w-full text-left justify-start"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.type === 'ai' && (
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    
                    {message.confidence && (
                      <div className="mt-2 flex items-center gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {Math.round(message.confidence * 100)}% confident
                        </Badge>
                      </div>
                    )}
                  </div>

                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Recommendations */}
                {message.recommendations && message.recommendations.length > 0 && (
                  <div className="ml-11 space-y-2">
                    <p className="text-xs font-medium text-gray-600">Recommended products:</p>
                    {message.recommendations.slice(0, 2).map((rec: any) => (
                      <div key={rec.productId} className="bg-white border rounded-lg p-3 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{rec.product.name}</h4>
                            <p className="text-xs text-gray-600 mt-1">{rec.reason}</p>
                            <p className="text-sm font-bold text-green-600 mt-1">${rec.product.price}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Heart className="w-3 h-3" />
                            </Button>
                            <Button size="sm" className="h-8 w-8 p-0">
                              <ShoppingCart className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Follow-up Questions */}
                {message.followUpQuestions && message.followUpQuestions.length > 0 && (
                  <div className="ml-11 space-y-1">
                    <p className="text-xs font-medium text-gray-600">You might also ask:</p>
                    {message.followUpQuestions.slice(0, 2).map((question, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => sendMessage(question)}
                        className="text-xs h-6 text-blue-600 hover:text-blue-700 p-1"
                      >
                        "{question}"
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about products, get recommendations..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={() => sendMessage(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                size="sm"
                className="px-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
