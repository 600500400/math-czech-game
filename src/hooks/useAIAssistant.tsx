
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedMobileInteractions } from '@/hooks/useEnhancedMobileInteractions';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AssistantContext {
  currentSubject?: 'math' | 'spelling';
  recentErrors?: string[];
  userStats?: any;
}

export const useAIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { authState } = useAuth();
  const { triggerButtonFeedback, triggerCorrectFeedback } = useEnhancedMobileInteractions();

  const sendMessage = useCallback(async (
    message: string, 
    context?: AssistantContext
  ) => {
    if (!message.trim()) return;

    triggerButtonFeedback();
    setIsLoading(true);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          message,
          context: {
            userId: authState.user?.id,
            ...context
          }
        }
      });

      if (error) throw error;

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
        triggerCorrectFeedback();
      } else {
        throw new Error(data.error || 'Neznámá chyba');
      }
    } catch (error) {
      console.error('Error sending message to AI assistant:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Promiň, teď nemůžu odpovědět. Zkus to prosím později.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [authState.user?.id, triggerButtonFeedback, triggerCorrectFeedback]);

  const clearChat = useCallback(() => {
    setMessages([]);
    triggerButtonFeedback();
  }, [triggerButtonFeedback]);

  const getWelcomeMessage = useCallback((subject?: 'math' | 'spelling') => {
    const welcomeMessages = {
      math: 'Ahoj! Jsem tvůj asistent pro matematiku. Můžu ti pomoct s příklady, vysvětlit pravidla nebo dát tipy na zlepšení. Na co se chceš zeptat?',
      spelling: 'Ahoj! Jsem tvůj asistent pro pravopis. Pomůžu ti s obtížnými slovy, pravidly psaní nebo dám rady, jak si lépe zapamatovat pravopis. Co tě zajímá?',
      default: 'Ahoj! Jsem tvůj studijní asistent. Můžu ti pomoci s matematikou i pravopisem. Jak ti dnes můžu pomoct?'
    };

    return welcomeMessages[subject || 'default'];
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    getWelcomeMessage
  };
};
