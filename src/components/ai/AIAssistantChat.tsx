
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Trash2 } from 'lucide-react';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { cn } from '@/lib/utils';

interface AIAssistantChatProps {
  subject?: 'math' | 'spelling';
  context?: {
    recentErrors?: string[];
    userStats?: any;
  };
  className?: string;
}

export const AIAssistantChat: React.FC<AIAssistantChatProps> = ({
  subject,
  context,
  className
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const { messages, isLoading, sendMessage, clearChat, getWelcomeMessage } = useAIAssistant();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Show welcome message on first load
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = {
        id: 'welcome',
        role: 'assistant' as const,
        content: getWelcomeMessage(subject),
        timestamp: new Date()
      };
      // This would need to be handled by the hook, but for now we'll let users start the conversation
    }
  }, [subject, getWelcomeMessage, messages.length]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage.trim();
    setInputMessage('');
    
    await sendMessage(message, {
      currentSubject: subject,
      ...context
    });

    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className={cn("flex flex-col h-96 max-w-2xl mx-auto", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              <Bot size={16} />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm">AI Asistent</h3>
            {subject && (
              <p className="text-xs text-muted-foreground">
                {subject === 'math' ? 'Matematika' : 'Pravopis'}
              </p>
            )}
          </div>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="h-8 w-8 p-0"
          >
            <Trash2 size={14} />
          </Button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-8">
              <Bot size={32} className="mx-auto mb-2 opacity-50" />
              <p>{getWelcomeMessage(subject)}</p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-2",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-6 w-6 mt-1">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    <Bot size={12} />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-muted'
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString('cs-CZ', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>

              {message.role === 'user' && (
                <Avatar className="h-6 w-6 mt-1">
                  <AvatarFallback className="bg-green-100 text-green-600">
                    <User size={12} />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-2 justify-start">
              <Avatar className="h-6 w-6 mt-1">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  <Bot size={12} />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Napiš svou otázku..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            size="sm"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );
};
