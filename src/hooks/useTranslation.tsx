import { useState, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";

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
      // MyMemory API - free translation service
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|cs`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        return data.responseData.translatedText;
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