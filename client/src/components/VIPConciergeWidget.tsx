import { useState } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  metadata?: {
    products?: any[];
    categories?: string[];
    sentiment?: string;
    intent?: string;
  };
}

interface Conversation {
  id: string;
  userId: string;
  status: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export function VIPConciergeWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Start conversation
  const startConversationMutation = useMutation({
    mutationFn: () => apiRequest('/api/concierge/conversation/start', 'POST', {
      userId: `guest_${Math.random().toString(36).substr(2, 15)}`,
      initialMessage: 'Hello! I need help with finding products.'
    }),
    onSuccess: (data: any) => {
      if (data.success) {
        setConversationId(data.data.conversation.id);
      }
    }
  });

  // Send message
  const sendMessageMutation = useMutation({
    mutationFn: (messageText: string) => {
      if (!conversationId) throw new Error('No conversation started');
      
      return apiRequest('/api/concierge/conversation/message', 'POST', {
        conversationId,
        message: messageText,
        sender: 'user'
      });
    },
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['/api/concierge/conversation', conversationId] });
    }
  });

  // Get conversation
  const { data: conversation, isLoading } = useQuery({
    queryKey: ['/api/concierge/conversation', conversationId],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return id ? apiRequest(`/api/concierge/conversation/${id}`) : Promise.resolve(null);
    },
    enabled: !!conversationId,
    refetchInterval: 2000 // Refresh every 2 seconds for real-time updates
  });

  const handleOpen = () => {
    setIsOpen(true);
    if (!conversationId) {
      startConversationMutation.mutate();
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sendMessageMutation.isPending) return;
    
    sendMessageMutation.mutate(message);
  };

  const messages = (conversation as any)?.data?.messages || [];

  return (
    <>
      {/* Sticky Widget Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={handleOpen}
            size="lg"
            className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
          
          {/* Notification Badge */}
          <div className="absolute -top-2 -right-2">
            <Badge variant="destructive" className="h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
              VIP
            </Badge>
          </div>
        </div>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px]">
          <Card className="h-full shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-white/20 text-white text-sm font-bold">
                      AI
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">VIP Concierge</CardTitle>
                    <p className="text-xs opacity-90">Your Premium Shopping Assistant</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0 flex flex-col h-[calc(100%-80px)]">
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                {isLoading && !messages.length ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                    <span className="ml-2 text-sm text-gray-600">Starting conversation...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.length === 0 && (
                      <div className="text-center py-8">
                        <MessageCircle className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                        <h3 className="font-semibold text-gray-900 mb-2">Welcome to VIP Concierge!</h3>
                        <p className="text-sm text-gray-600">
                          I'm your personal shopping assistant. Ask me about products, get recommendations, or let me help you find exactly what you're looking for!
                        </p>
                      </div>
                    )}
                    
                    {messages.map((msg: any) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 ${
                            msg.sender === 'user'
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          
                          {/* Show recommended products if available */}
                          {msg.metadata?.products && msg.metadata.products.length > 0 && (
                            <div className="mt-2 space-y-2">
                              <p className="text-xs opacity-75">Recommended products:</p>
                              {msg.metadata.products.slice(0, 3).map((product: any, index: number) => (
                                <div key={index} className="bg-white/10 rounded p-2">
                                  <p className="text-xs font-medium">{product.name}</p>
                                  <p className="text-xs opacity-75">${product.price}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <p className="text-xs opacity-60 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {sendMessageMutation.isPending && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg px-3 py-2">
                          <div className="flex items-center space-x-2">
                            <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                            <span className="text-sm text-gray-600">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about products, get recommendations..."
                    className="flex-1 text-sm"
                    disabled={sendMessageMutation.isPending || !conversationId}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!message.trim() || sendMessageMutation.isPending || !conversationId}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    Powered by AI • Real-time assistance
                  </p>
                  {(conversation as any)?.data && (
                    <Badge variant="outline" className="text-xs">
                      {(conversation as any).data.status}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}