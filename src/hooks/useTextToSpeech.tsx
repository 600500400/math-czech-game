
import { useState, useCallback } from "react";

export const useTextToSpeech = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const speak = useCallback((text: string, lang: string = 'en-US') => {
    console.log("🗣️ TTS: Attempting to speak:", text, "in language:", lang);
    
    if (!('speechSynthesis' in window)) {
      const errorMsg = "Speech synthesis not supported";
      console.error("🗣️ TTS Error:", errorMsg);
      setError(errorMsg);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => {
        console.log("🗣️ TTS: Speech started");
      };
      
      utterance.onend = () => {
        console.log("🗣️ TTS: Speech ended");
        setIsLoading(false);
      };
      
      utterance.onerror = (event) => {
        const errorMsg = `Speech error: ${event.error}`;
        console.error("🗣️ TTS Error:", errorMsg);
        setError(errorMsg);
        setIsLoading(false);
      };
      
      speechSynthesis.speak(utterance);
      console.log("🗣️ TTS: Speech synthesis started");
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown speech error";
      console.error("🗣️ TTS Error:", errorMsg);
      setError(errorMsg);
      setIsLoading(false);
    }
  }, []);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsLoading(false);
  }, []);

  return {
    speak,
    stop,
    isLoading,
    error,
    isSupported: 'speechSynthesis' in window
  };
};
