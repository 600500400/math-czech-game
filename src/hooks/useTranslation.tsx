import { useState, useCallback } from "react";

import { logger } from "@/utils/logger";
interface TranslationResult {
  translatedText: string;
  confidence: number;
  source: string;
}

interface UseTranslationReturn {
  translate: (text: string) => Promise<string | null>;
  isTranslating: boolean;
  error: string | null;
  clearError: () => void;
}

export const useTranslation = (): UseTranslationReturn => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = useCallback(async (text: string): Promise<string | null> => {
    if (!text.trim()) return null;

    setIsTranslating(true);
    setError(null);

    try {
      // Use our Supabase Edge Function as proxy to avoid CORS issues
      const { supabase } = await import('@/integrations/supabase/client');

      logger.log('Calling translate-text edge function...');
      const { data, error } = await supabase.functions.invoke('translate-text', {
        body: { text, sourceLang: 'en', targetLang: 'cs' }
      });

      if (error) {
        throw new Error(`Translation error: ${error.message}`);
      }

      if (data?.translatedText) {
        logger.log(`Translation successful via ${data.source}: "${data.translatedText}"`);
        return data.translatedText;
      } else {
        throw new Error('No translation available');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Translation failed';
      setError(errorMessage);
      console.warn('Translation failed:', errorMessage);
      return null;
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    translate,
    isTranslating,
    error,
    clearError
  };
};